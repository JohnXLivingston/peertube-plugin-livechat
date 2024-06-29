-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local get_time = require "util.time".now;

local function end_current_poll (room)
  if not room._data.current_poll then
    return;
  end
  -- TODO: compute and send last result.
  room._data.current_poll = nil;
end

local function create_poll(room, fields)
  room._data.current_poll = fields;
  room._data.current_poll.end_timestamp = now() + (60 * fields["muc#roompoll_duration"]);
  room._data.current_poll.votes = {};
  -- TODO: create and send poll message.
end

return {
  end_current_poll = end_current_poll;
  create_poll = create_poll;
};
