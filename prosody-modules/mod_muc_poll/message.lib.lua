-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
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

-- construct the poll message stanza
local function build_poll_message(room, message_id, is_end_message)
  local current_poll = room._data.current_poll;
  if not current_poll then
    return nil;
  end
  local from = room.jid .. '/' .. current_poll.occupant_nick;

  local content = current_poll["muc#roompoll_question"] .. "\n";

  if is_end_message then
    content = content .. "This poll is now over.\n";
  end

  local total = 0;
  for choice, nb in pairs(current_poll.votes_by_choices) do
    total = total + nb;
  end
  for _, choice_desc in ipairs(current_poll.choices_ordered) do
    local choice, label = choice_desc.number, choice_desc.label;
    content = content .. choice .. ': ' .. label;
    if total > 0 then
      local nb = current_poll.votes_by_choices[choice] or 0;
      local percent = string.format("%.2f", nb * 100 / total);
      content = content .. " (" .. nb .. "/" .. total .. " = " .. percent .. "%)";
    end
    content = content .. "\n";
  end

  if not is_end_message then
    content = content .. "Send a message with an exclamation mark followed by your choice number to vote. Example: !1\n";
  end

  local msg = st.message({
    type = "groupchat",
    from = from,
    id = message_id
  }, content);

  msg:tag("occupant-id", {
    xmlns = xmlns_occupant_id,
    id = current_poll.occupant_id
  }):up();

  -- now we must add some custom XML data, so that compatible clients can display the poll as they want:
  -- <x-poll xmlns="http://jabber.org/protocol/muc#x-poll-message" id="I9UWyoxsz4BN" votes="1" over="">
  --     <x-poll-question>Poll question</x-poll-question>
  --     <x-poll-choice choice="1" votes="0">Choice 1 label</x-poll-choice>
  --     <x-poll-choice choice="2" votes="1">Choice 2 label</x-poll-choice>
  --     <x-poll-choice choice="3" votes="0">Choice 3 label</x-poll-choice>
  --     <x-poll-choice choice="4" votes="0">Choice 4 label</x-poll-choice>
  -- </x-poll>
  local message_attrs = {
    xmlns = xmlns_poll_message,
    id = current_poll.poll_id,
    votes = "" .. total
  };
  if current_poll.already_ended then
    message_attrs["over"] = "";
  end
  msg:tag(poll_message_tag, message_attrs):text_tag(poll_question_tag, current_poll["muc#roompoll_question"], {});
  for _, choice_desc in ipairs(current_poll.choices_ordered) do
    local choice, label = choice_desc.number, choice_desc.label;
    local nb = current_poll.votes_by_choices[choice] or 0;
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
  local message_id = id.medium();
  local msg = build_poll_message(room, message_id, false);
  room:broadcast_message(msg);
  return message_id;
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
  local message_id = id.medium(); -- generate a new id
  local msg = build_poll_message(room, message_id, false);

  -- the update message is a <replace> message (see XEP-0308).
  msg:tag('replace', {
    xmlns = xmlns_replace;
    id = room._data.current_poll.start_message_id;
  }):up();

  room:broadcast_message(msg);
  return message_id;
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
  local message_id = id.medium(); -- generate a new id
  local msg = build_poll_message(room, message_id, true);
  room:broadcast_message(msg);
  return message_id;
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

return {
  poll_start_message = poll_start_message;
  poll_end_message = poll_end_message;
  schedule_poll_update_message = schedule_poll_update_message;
  remove_specific_tags_from_groupchat = remove_specific_tags_from_groupchat;
};
