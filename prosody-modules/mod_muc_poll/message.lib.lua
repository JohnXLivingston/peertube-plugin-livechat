-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local id = require "util.id";
local st = require "util.stanza";
local format = require"util.format".format;
local xmlns_occupant_id = "urn:xmpp:occupant-id:0";

local function build_poll_message(room, message_id)
  local current_poll = room._data.current_poll;
  if not current_poll then
    return nil;
  end
  local from = room.jid .. '/' .. current_poll.occupant_nick;

  local content = current_poll["muc#roompoll_question"] .. "\n";

  local total = 0;
  for choice, nb in pairs(current_poll.votes_by_choices) do
    total = total + nb;
  end
  for choice, label in pairs(current_poll.choices) do
    content = content .. choice .. ': ' .. label;
    if total > 0 then
      local nb = current_poll.votes_by_choices[choice] or 0;
      local percent = format("%d.%d%d", nb * 100 / total);
      content = content .. " (" .. nb .. "/" .. total .. " = " .. percent .. "%)";
    end
    content = content .. "\n";
  end
  content = content .. "Send a message with an exclamation mark followed by your choice number to vote. Example: !1\n";

  local msg = st.message({
    type = "groupchat",
    from = from,
    id = message_id
  }, content);

  msg:tag("occupant-id", {
    xmlns = xmlns_occupant_id,
    id = current_poll.occupant_id
  }):up();

  return msg;
end

local function poll_start_message(room)
  if not room._data.current_poll then
    return nil;
  end
  module:log("debug", "Sending the start message for room %s poll", room.jid);
  local message_id = id.medium();
  local msg = build_poll_message(room, message_id);
  room:broadcast_message(msg);
  return message_id;
end

local function schedule_poll_update_message(room)
  -- TODO

  -- if not room._data.current_poll then
  --   return nil;
  -- end
  -- module:log("debug", "Sending an update message for room %s poll", room.jid);
  -- local message_id = id.medium();
  -- local msg = build_poll_message(room, message_id);
  -- room:broadcast_message(msg);
  -- return message_id;
end

local function poll_end_message(room)
  -- TODO
end

return {
  poll_start_message = poll_start_message;
  poll_end_message = poll_end_message;
  schedule_poll_update_message = schedule_poll_update_message;
};
