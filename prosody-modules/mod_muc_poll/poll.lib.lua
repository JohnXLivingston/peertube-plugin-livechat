-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local st = require "util.stanza";
local get_time = require "util.time".now;
local timer = require "util.timer";
local mod_muc = module:depends"muc";
local get_room_from_jid = mod_muc.get_room_from_jid;
local poll_start_message = module:require("message").poll_start_message;
local poll_end_message = module:require("message").poll_end_message;
local schedule_poll_update_message = module:require("message").schedule_poll_update_message;

local scheduled_end = {};

local function schedule_poll_purge(room_jid)
  module:log("debug", "Scheduling a purge for poll %s", room_jid);
  timer.add_task(30, function ()
    module:log("info", "Must purge poll for room %s", room_jid);
    -- We dont pass room, because here it could have been removed from memory.
    -- So we must relad the room from the JID in any case.
    local room = get_room_from_jid(room_jid);
    if not room then
      module:log("debug", "Room %s not found, was maybe destroyed", room_jid);
      return;
    end
    -- we must check if the poll is ended (could be a new poll!)
    if not room._data.current_poll then
      module:log("debug", "Room %s has no current poll to purge", room_jid);
      return;
    end
    if not room._data.current_poll.already_ended then
      module:log("debug", "Room %s has has a poll that is not ended, must be a new one", room_jid);
      return;
    end
    module:log("info", "Purging poll for room %s", room_jid);
    room._data.current_poll = nil;
  end);
end

local function end_current_poll (room)
  if not room._data.current_poll then
    return;
  end

  if room._data.current_poll.already_ended then
    -- this can happen if the server was restarted before the purge
    schedule_poll_purge(room.jid);
    return;
  end

  module:log("debug", "Ending the current poll for room %s", room.jid);
  room._data.current_poll.already_ended = true;

  if scheduled_end[room.jid] then
    module:log("debug", "Stopping the end timer for the poll");
    timer.stop(scheduled_end[room_jid]);
    scheduled_end[room_jid] = nil;
  end
  poll_end_message(room);
  -- TODO: store the result somewhere, to keep track?

  -- We don't remove the poll immediatly. Indeed, if the vote is anonymous,
  -- we don't want to expose votes from late users.
  schedule_poll_purge(room.jid);
end

local function schedule_poll_end (room_jid, timestamp)
  local delay = timestamp - get_time();
  if delay <= 0 then
    delay = 1;
  end
  module:log("debug", "Must schedule a poll end in %i for room %s", delay, room_jid);

  if scheduled_end[room_jid] then
    module:log("debug", "There is already a timer for the %s poll end, rescheduling", room_jid);
    timer.reschedule(scheduled_end[room_jid], delay);
    return;
  end
  scheduled_end[room_jid] = timer.add_task(delay, function ()
    module:log("debug", "Its time to end the poll for room %s", room_jid);
    scheduled_end[room_jid] = nil;
    -- We dont pass room, because here it could have been removed from memory.
    -- So we must relad the room from the JID in any case.
    local room = get_room_from_jid(room_jid);
    if not room then
      module:log("debug", "Room %s not found, was probably destroyed", room_jid);
      return; -- room was probably destroyed
    end
    end_current_poll(room);
  end);
end

local function create_poll(room, fields)
  module:log("debug", "Creating a new poll for room %s", room.jid);
  room._data.current_poll = fields;
  room._data.current_poll.end_timestamp = get_time() + (60 * fields["muc#roompoll_duration"]);
  room._data.current_poll.votes_by_occupant = {};
  room._data.current_poll.votes_by_choices = {};
  room._data.current_poll.already_ended = false;
  for field, _ in pairs(fields) do
    local c = field:match("^muc#roompoll_choice(%d+)$");
    if c then
      if fields["muc#roompoll_choice" .. c]:find("%S") then
        room._data.current_poll.votes_by_choices[c] = 0;
      end
    end
  end
  poll_start_message(room);
  schedule_poll_end(room.jid, room._data.current_poll.end_timestamp);
end

local function handle_groupchat(event)
  local origin, stanza = event.origin, event.stanza;
  local room = event.room;
  if not room._data.current_poll then
    return;
  end

  -- There is a current poll. Is this a vote?
  local body = stanza:get_child_text("body")
  if not body or #body < 1 then
    return;
  end
  local choice = body:match("^%s*!(%d+)%s*$");
  if not choice then
    return;
  end

  -- Ok, seems it is a vote.

  if get_time() >= room._data.current_poll.end_timestamp then
    module:log("debug", "Got a vote for a finished poll, not counting it.");
    -- Note: we keep bouncing messages a few seconds/minutes after the poll end
    -- to be sure any user that send the vote too late won't expose his choice.
    origin.send(st.error_reply(
      stanza,
      -- error_type = 'cancel' (see descriptions in RFC 6120 https://xmpp.org/rfcs/rfc6120.html#stanzas-error-syntax)
      "cancel",
      -- error_condition = 'not-allowed' (see RFC 6120 Defined Error Conditions https://xmpp.org/rfcs/rfc6120.html#stanzas-error-conditions)
      "not-allowed",
      "This poll is over."
      ));
    return true; -- stop!
  end

  -- We must check that the choice is valid:
  if room._data.current_poll.votes_by_choices[choice] == nil then
    module:log("debug", "Invalid vote, bouncing it.");
    origin.send(st.error_reply(
      stanza,
      -- error_type = 'cancel' (see descriptions in RFC 6120 https://xmpp.org/rfcs/rfc6120.html#stanzas-error-syntax)
      "cancel",
      -- error_condition = 'not-allowed' (see RFC 6120 Defined Error Conditions https://xmpp.org/rfcs/rfc6120.html#stanzas-error-conditions)
      "bad-request",
      "This choice is not valid."
    ));
    return true; -- stop!
  end

  -- Ok, we can count the vote.
  local occupant = event.occupant;
  if not occupant then
    module:log("warn", "No occupant in the event, dont know how to count the vote");
    return
  end

  local occupant_bare_id = occupant.bare_jid;
  module:log("debug", "Counting a new vote for room %s: choice %i, voter %s", room.jid, choice, occupant_bare_id);
  -- counting the vote:
  if room._data.current_poll.votes_by_occupant[occupant_bare_id] ~= nil then
    module:log("debug", "Occupant %s has already voted for current room %s vote, reassigning his vote.", occupant_bare_id);
    room._data.current_poll.votes_by_choices[room._data.current_poll.votes_by_occupant[occupant_bare_id]] = room._data.current_poll.votes_by_choices[room._data.current_poll.votes_by_occupant[occupant_bare_id]] - 1;
  end
  room._data.current_poll.votes_by_choices[choice] = room._data.current_poll.votes_by_choices[choice] + 1;
  room._data.current_poll.votes_by_occupant[occupant_bare_id] = choice;

  schedule_poll_update_message(room);

  -- When the poll is anonymous, we bounce the messages (but count the votes).
  local must_bounce = room._data.current_poll["muc#roompoll_anonymous"] == true;
  if must_bounce then
    module:log("debug", "Invalid vote, bouncing it.");
    origin.send(st.error_reply(
      stanza,
      -- error_type
      "continue",
      -- error_condition
      "undefined-condition",
      "You vote is taken into account. Votes are anonymous, it will not be shown to other participants."
    ));
    return true; -- stop!
  end
end

local function room_restored(event)
  local room = event.room;
  if not room._data.current_poll then
    return;
  end

  module:log("info", "Restoring room %s with current ongoing poll.", room.jid);
  local now = get_time();
  if now >= room._data.current_poll.end_timestamp then
    module:log("info", "Current poll is over for room %s, ending it", room.jid);
    end_current_poll(room);
    return;
  end

  if scheduled_end[room.jid] then
    module:log("info", "Poll for room %s is not finished yet, the end is still scheduled", room.jid);
  else
    module:log("info", "Poll for room %s is not finished yet, rescheduling the end", room.jid);
    schedule_poll_end(room.jid, room._data.current_poll.end_timestamp);
  end
  -- just in case, we can also reschedule an update message
  schedule_poll_update_message(room);
end

return {
  end_current_poll = end_current_poll;
  create_poll = create_poll;
  handle_groupchat = handle_groupchat;
  room_restored = room_restored;
};
