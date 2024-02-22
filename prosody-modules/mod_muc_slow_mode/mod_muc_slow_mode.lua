-- mod_muc_slow_mode
--
-- Copyright (C) 2024 John Livingston
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--
-- Implements: XEP-????: MUC Slow Mode (XEP to come).
--
-- Imports
local st = require "util.stanza";
local jid_bare = require "util.jid".bare;
local gettime = require 'socket'.gettime;

-- Plugin dependencies
local mod_muc = module:depends "muc";

local muc_util = module:require "muc/util";
local valid_roles = muc_util.valid_roles;

-- Namespaces
local xmlns_muc = "http://jabber.org/protocol/muc";

-- Options

-- form_position: the position in the room config form (this value will be passed as priority for the "muc-config-form" hook).
-- Depending on your application, it is possible that the slow mode is more important than other fields (for example for a video streaming service).
-- So there is an option to change this.
-- By default, field will be between muc#roomconfig_changesubject and muc#roomconfig_moderatedroom
local form_position = module:get_option_number("slow_mode_duration_form_position") or 80-2;

-- Getter/Setter
local function get_slow_mode_duration(room)
  return room._data.slow_mode_duration or 0;
end

local function set_slow_mode_duration(room, duration)
  if duration then
    duration = assert(tonumber(duration), "Slow mode duration is not a valid number");
  end
  if duration and duration < 0 then
    duration = 0;
  end

  if get_slow_mode_duration(room) == duration then return false; end

  room._data.slow_mode_duration = duration;
  return true;
end

-- Discovering support
local function add_disco_form(event)
  table.insert(event.form, {
    name = "muc#roominfo_slow_mode_duration";
    value = "";
  });
  event.formdata["muc#roominfo_slow_mode_duration"] = get_slow_mode_duration(event.room);
end

module:hook("muc-disco#info", add_disco_form);

-- Config form declaration
local function add_form_option(event)
  table.insert(event.form, {
    name = "muc#roomconfig_slow_mode_duration";
    type = "text-single";
    datatype = "xs:integer";
    label = "Slow Mode (0=disabled, any positive integer= users can send a message every X seconds.)";
    -- desc = "";
    value = get_slow_mode_duration(event.room);
  });
end

module:hook("muc-config-submitted/muc#roomconfig_slow_mode_duration", function(event)
  if set_slow_mode_duration(event.room, event.value) then
    -- status 104 = configuration change: Inform occupants that a non-privacy-related room configuration change has occurred
    event.status_codes["104"] = true;
  end
end);

module:hook("muc-config-form", add_form_option, form_position);

-- handling groupchat messages
function handle_groupchat(event)
  local origin, stanza = event.origin, event.stanza;
  local room = event.room;

  -- only consider messages with body (ie: ignore chatstate and other non-text xmpp messages)
  local body = stanza:get_child_text("body")
  if not body or #body < 1 then
    -- module:log("debug", "No body, message accepted");
    return;
  end

  local duration = get_slow_mode_duration(room) or 0;
  if duration <= 0 then
    -- no slow mode for this room
    -- module:log("debug", "No slow mode for this room");
    return;
  end

  -- Checking user's permissions (moderators are not subject to slow mode)
  local actor = stanza.attr.from;
  local actor_nick = room:get_occupant_jid(actor);
  local actor_jid = jid_bare(actor);
  -- Only checking role, not affiliation (slow mode only applies on users currently connected to the room)
  local role = room:get_role(actor_nick);
  if valid_roles[role or "none"] >= valid_roles.moderator then
    -- user bypasses the slow mode.
    -- module:log("debug", "User is moderator, bypassing slow mode");
    return;
  end

  if not room.slow_mode_last_messages then
    -- We store last message time for each users in room.slow_mode_last_messages:
    -- * key: bare jid (without the nickname)
    -- * value: last message timestamp
    -- If room is cleared from memory, these data are lost. But should not be an issue.
    -- For now, i don't clean slow_mode_last_messages, it should not use too much memory.
    -- module:log("debug", "Initializing slow_mode_last_messages for the room.");
    room.slow_mode_last_messages = {};
  end

  local now = gettime();
  local previous = room.slow_mode_last_messages[actor_jid];
  -- module:log(
  --   "debug",
  --   "Last message for user %s was at %s, now is %s, duration is %s, now - previous is %s",
  --   actor_jid,
  --   previous or 0,
  --   now,
  --   duration,
  --   (now - (previous or 0))
  -- );
  if ((not previous) or (now - previous > duration)) then
    -- module:log("debug", "Message accepted");
    room.slow_mode_last_messages[actor_jid] = now;
    return;
  end

  module:log("debug", "Bouncing message for user %s", actor_nick);
  local reply = st.error_reply(
    stanza,
    -- error_type = 'wait' (see descriptions in RFC 6120 https://xmpp.org/rfcs/rfc6120.html#stanzas-error-syntax)
    "wait",
    -- error_condition = 'policy-violation' (see RFC 6120 Defined Error Conditions https://xmpp.org/rfcs/rfc6120.html#stanzas-error-conditions)
    "policy-violation",
    "You have exceeded the limit imposed by the slow mode in this room. You have to wait " .. duration .. " seconds between messages. Please try again later"
  );

  -- Note: following commented lines were inspired by mod_muc_limits, but it seems it is not required.
  -- if body then
  --   reply:up():tag("body"):text(body):up();
  -- end
  -- local x = stanza:get_child("x", xmlns_muc);
  -- if x then
  --   reply:add_child(st.clone(x));
  -- end

  origin.send(reply);
  return true; -- stoping propagation
end

module:hook("muc-occupant-groupchat", handle_groupchat);
