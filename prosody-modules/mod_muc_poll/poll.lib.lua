-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local st = require "util.stanza";
local get_time = require "util.time".now;

local function end_current_poll (room)
  if not room._data.current_poll then
    return;
  end
  -- TODO: compute and send last result.
  module:log("debug", "Ending the current poll for room %s", room.jid);
  room._data.current_poll = nil;
end

local function create_poll(room, fields)
  module:log("debug", "Creating a new poll for room %s", room.jid);
  room._data.current_poll = fields;
  room._data.current_poll.end_timestamp = get_time() + (60 * fields["muc#roompoll_duration"]);
  room._data.current_poll.votes_by_occupant = {};
  room._data.current_poll.votes_by_choices = {};
  for field, _ in pairs(fields) do
    local c = field:match("^muc#roompoll_choice(%d+)$");
    if c then
      if fields["muc#roompoll_choice" .. c]:find("%S") then
        room._data.current_poll.votes_by_choices[c] = 0;
      end
    end
  end
  -- TODO: create and send poll message.
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

  if get_time() > room._data.current_poll.end_timestamp then
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
  local id = occupant.jid; -- FIXME: is this the correct value? or bare_jid?
  module:log("debug", "Counting a new vote for room %s: choice %i, voter %s", room.jid, choice, id);

  -- TODO: count the vote.

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

return {
  end_current_poll = end_current_poll;
  create_poll = create_poll;
  handle_groupchat = handle_groupchat;
};
