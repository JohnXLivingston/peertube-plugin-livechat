-- SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local id = require "util.id";
local st = require "util.stanza";
local timer = require "util.timer";
local xmlns_occupant_id = "urn:xmpp:occupant-id:0";
local xmlns_replace = "urn:xmpp:message-correct:0";
local xmlns_poll_message = module:require("constants").xmlns_poll_message;
local poll_message_tag = module:require("constants").poll_message_tag;
local poll_question_tag = module:require("constants").poll_question_tag;
local poll_choice_tag = module:require("constants").poll_choice_tag;

local mod_muc = module:depends"muc";
local get_room_from_jid = mod_muc.get_room_from_jid;

local debounce_delay = 5; -- number of seconds during which we must group votes to avoid flood.
local scheduled_updates = {};

local string_poll_over = module:get_option_string("poll_string_over") or "This poll is now over.";
local string_poll_vote_instructions = module:get_option_string("poll_string_vote_instructions") or "Send a message with an exclamation mark followed by your choice number to vote. Example: !1";

-- Build the content for poll start and end messages (that will go to the message <body>)
local function build_poll_message_content(room, is_end_message)
  local current_poll = room._data.current_poll;
  if not current_poll then
    return nil;
  end

  local content = current_poll["muc#roompoll_question"] .. "\n";

  if is_end_message then
    content = content .. string_poll_over .. "\n";
  end

  local total = 0;
  for choice, nb in pairs(current_poll.votes_by_choices) do
    total = total + nb;
  end
  for _, choice_desc in ipairs(current_poll.choices_ordered) do
    local choice, label = choice_desc.number, choice_desc.label;
    content = content .. choice .. ': ' .. label;
    -- if vote over, and at least 1 vote, we add the results.
    if is_end_message and total > 0 then
      local nb = current_poll.votes_by_choices[choice] or 0;
      local percent = string.format("%.2f", nb * 100 / total);
      content = content .. " (" .. nb .. "/" .. total .. " = " .. percent .. "%)";
    end
    content = content .. "\n";
  end

  if not is_end_message then
    content = content .. string_poll_vote_instructions .. "\n";
  end

  return content;
end

-- construct the poll message stanza.
-- Note: content can be nil, for updates messages.
local function build_poll_message(room, content)
  local current_poll = room._data.current_poll;
  if not current_poll then
    return nil;
  end

  local from = current_poll.occupant_nick; -- this is in fact room.jid/nickname

  local msg = st.message({
    type = "groupchat",
    from = from,
    id = id.long()
  }, content);

  msg:tag("occupant-id", {
    xmlns = xmlns_occupant_id,
    id = current_poll.occupant_id
  }):up();

  if content == nil then
    -- No content, this is an update message.
    -- Adding some hints (XEP-0334):
    msg:tag("no-copy", { xmlns = "urn:xmpp:hints" }):up();
    msg:tag("no-store", { xmlns = "urn:xmpp:hints" }):up();
    msg:tag("no-permanent-store", { xmlns = "urn:xmpp:hints" }):up();
  end

  -- now we must add some custom XML data, so that compatible clients can display the poll as they want:
  -- <x-poll xmlns="http://jabber.org/protocol/muc#x-poll-message" id="I9UWyoxsz4BN" votes="1" end="1719842224" over="">
  --     <x-poll-question>Poll question</x-poll-question>
  --     <x-poll-choice choice="1" votes="0">Choice 1 label</x-poll-choice>
  --     <x-poll-choice choice="2" votes="1">Choice 2 label</x-poll-choice>
  --     <x-poll-choice choice="3" votes="0">Choice 3 label</x-poll-choice>
  --     <x-poll-choice choice="4" votes="0">Choice 4 label</x-poll-choice>
  -- </x-poll>
  local total = 0;
  for choice, nb in pairs(current_poll.votes_by_choices) do
    total = total + nb;
  end

  local message_attrs = {
    xmlns = xmlns_poll_message,
    id = current_poll.poll_id,
    votes = "" .. total
  };
  message_attrs["end"] = string.format("%i", current_poll.end_timestamp);
  if current_poll.already_ended then
    message_attrs["over"] = "";
  end
  msg:tag(poll_message_tag, message_attrs):text_tag(poll_question_tag, current_poll["muc#roompoll_question"], {});
  for _, choice_desc in ipairs(current_poll.choices_ordered) do
    local choice, label = choice_desc.number, choice_desc.label;
    local nb = current_poll.votes_by_choices[choice] or 0;
    total = total + nb;
    msg:text_tag(poll_choice_tag, label, {
      votes = "" .. nb,
      choice = choice
    });
  end
  msg:up();

  return msg;
end

-- sends a message when the poll starts.
local function poll_start_message(room)
  if not room._data.current_poll then
    return nil;
  end
  module:log("debug", "Sending the start message for room %s poll", room.jid);
  local content = build_poll_message_content(room, false);
  local msg = build_poll_message(room, content);
  room:broadcast_message(msg);
end

-- Send the poll update message
local function send_poll_update_message(room)
  if not room._data.current_poll then
    return nil;
  end
  if room._data.current_poll.already_ended then
    module:log("debug", "Cancelling the update message for room %s poll, because already_ended==true.", room.jid);
    return nil;
  end

  module:log("debug", "Sending an update message for room %s poll", room.jid);
  local msg = build_poll_message(room, nil);

  room:broadcast_message(msg);
end

-- Schedule an update of the start message.
-- We do not send this update each time someone vote,
-- to avoid flooding.
local function schedule_poll_update_message(room_jid)
  if scheduled_updates[room_jid] then
    -- already a running timer, we can ignore to debounce.
    return;
  end
  scheduled_updates[room_jid] = timer.add_task(debounce_delay, function()
    scheduled_updates[room_jid] = nil;
    -- We dont pass room, because here it could have been removed from memory.
    -- So we must relad the room from the JID in any case.
    local room = get_room_from_jid(room_jid);
    if not room then
      return;
    end
    send_poll_update_message(room);
  end);
end

-- Send a new message when the poll is over, with the result.
local function poll_end_message(room)
  if not room._data.current_poll then
    return nil;
  end
  module:log("debug", "Sending the end message for room %s poll", room.jid);
  if scheduled_updates[room.jid] then
    module:log("debug", "Cancelling an update message for the poll %s", room.jid);
    timer.stop(scheduled_updates[room.jid]);
    scheduled_updates[room.jid] = nil;
  end
  local content = build_poll_message_content(room, true);
  local msg = build_poll_message(room, content);
  room:broadcast_message(msg);
end

-- security check: we must remove all specific tags, to be sure nobody tries to spoof polls!
local function remove_specific_tags_from_groupchat(event)
  event.stanza:maptags(function (child)
    if child.name == poll_message_tag then
      return nil;
    end
    if child.name == poll_question_tag then
      return nil;
    end
    if child.name == poll_choice_tag then
      return nil;
    end
    return child;
  end);
end

-- when a new session is opened, we must send the current poll to the client
local function handle_new_occupant_session(event)
	local room = event.room;
  local occupant = event.occupant;
  local origin = event.origin;
  if not occupant then
    return;
  end
  if not room._data.current_poll then
    return;
  end
  if room._data.current_poll.already_ended then
    return;
  end

  -- Sending an update message to the new occupant.
  module:log("debug", "Sending a poll update message to new occupant %s", occupant.jid);
  local msg = build_poll_message(room, nil);
  msg.attr.to = occupant.jid;
  origin.send(msg);
end

return {
  poll_start_message = poll_start_message;
  poll_end_message = poll_end_message;
  schedule_poll_update_message = schedule_poll_update_message;
  remove_specific_tags_from_groupchat = remove_specific_tags_from_groupchat;
  handle_new_occupant_session = handle_new_occupant_session;
};
