-- mod_muc_poll
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--
-- Implements: XEP-????: MUC Poll (XEP to come).

local st = require "util.stanza";
local jid_bare = require "util.jid".bare;

local mod_muc = module:depends"muc";
local get_room_from_jid = mod_muc.get_room_from_jid;

local xmlns_poll = module:require("constants").xmlns_poll;
local send_form = module:require("form").send_form;
local process_form = module:require("form").process_form;
local handle_groupchat = module:require("poll").handle_groupchat;
local remove_specific_tags_from_groupchat = module:require("message").remove_specific_tags_from_groupchat;
local handle_new_occupant_session = module:require("message").handle_new_occupant_session;
local room_restored = module:require("poll").room_restored;

local poll_groupchat_votes_priority = module:get_option_number("poll_groupchat_votes_priority") or 500;


-- new poll creation, get form
module:hook("iq-get/bare/" .. xmlns_poll .. ":query", function (event)
  local origin, stanza = event.origin, event.stanza;
  local room_jid = stanza.attr.to;
  module:log("debug", "Received a request for the poll form");
  local room = get_room_from_jid(room_jid);
  if not room then
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end
  local from = jid_bare(stanza.attr.from);

  local from_affiliation = room:get_affiliation(from);
  if (from_affiliation ~= "owner" and from_affiliation ~= "admin") then
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  send_form(room, origin, stanza);
  return true;
end);

-- new poll creation, form submission
module:hook("iq-set/bare/" .. xmlns_poll .. ":query", function (event)
  local origin, stanza = event.origin, event.stanza;
  local room_jid = stanza.attr.to;
  local from = stanza.attr.from;
  module:log("debug", "Received a form submission for the poll form on %s from %s", room_jid, from);
  local room = get_room_from_jid(room_jid);
  if not room then
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end

  local occupant = room:get_occupant_by_real_jid(from);
  if not occupant then
    module:log("debug", "No occupant, ignoring...");
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  local from_bare = jid_bare(stanza.attr.from);
  local from_affiliation = room:get_affiliation(from_bare);
  if (from_affiliation ~= "owner" and from_affiliation ~= "admin") then
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  return process_form(room, origin, stanza, occupant);
end);

-- Discovering support
module:hook("muc-disco#info", function (event)
	event.reply:tag("feature", { var = xmlns_poll }):up();
end);

-- On groupchat messages, we check if this is a vote for the current poll.
-- Note: we use a high priority, so it will be handled before the slow mode.
module:hook("muc-occupant-groupchat", handle_groupchat, poll_groupchat_votes_priority);

-- security check: we must remove all specific tags, to be sure nobody tries to spoof polls!
module:hook("muc-occupant-groupchat", remove_specific_tags_from_groupchat, 1000);

-- when a room is restored (after a server restart for example),
-- we must resume any current poll
module:hook("muc-room-restored", room_restored);

-- when a new session is opened, we must send the current poll to the client
-- Note: it should be in the MAM. But it is easier for clients to ignore delayed messages
-- when displaying polls (to ignore old polls).
module:hook("muc-occupant-session-new", handle_new_occupant_session, 10); -- must be after subject (20, see Prosody code)
