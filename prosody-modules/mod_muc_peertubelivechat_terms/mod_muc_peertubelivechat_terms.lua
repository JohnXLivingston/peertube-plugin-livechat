-- mod_muc_peertubelivechat_terms
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--

-- Exposed functions:
-- get_muc_terms
-- set_muc_terms

local jid_escape = require "util.jid".escape;
local jid_resource = require "util.jid".resource;
local st = require "util.stanza";
local id = require "util.id";

local service_nickname = module:get_option_string("muc_terms_service_nickname", "Service");
local global_terms = module:get_option_string("muc_terms_global", "");

local function create_terms_message(room, type, terms)
  local from = room.jid .. '/' .. jid_escape(service_nickname);
  module:log("debug", "Creating %s terms message from %s (room %s)", type, from, room);
  local msg = st.message({
    type = "groupchat",
    from = from,
    id = id.medium()
  }, terms)
    :tag('x-livechat-terms', { type = type }):up(); -- adding a custom tag to specify that it is a "terms" message, so that frontend can display it with a special template.

  return msg;
end

-- MUC Getter/Setter
function get_muc_terms(room)
  return room._data.livechat_muc_terms or nil;
end

function set_muc_terms(room, terms)
  if terms == "" then
    terms = nil;
  end

  if get_muc_terms(room) == terms then return false; end

  room._data.livechat_muc_terms = terms;
  if terms ~= nil then
    -- we must send new terms to all occupants.
    local msg = create_terms_message(room, "muc", terms);
    module:log("debug", "Broadcasting terms message to room %s", room);
    room:broadcast_message(msg);
  end
  return true;
end

-- send the terms when joining:
local function send_terms(event)
  local origin = event.origin;
	local room = event.room;
	local occupant = event.occupant;
  if global_terms then
    module:log("debug", "Sending global terms to %s", occupant.jid);
    local msg = create_terms_message(room, "global", global_terms);
    msg.attr.to = occupant.jid;
    origin.send(msg);
  end

  local muc_terms = get_muc_terms(room);
  if muc_terms then
    local from = room.jid .. '/' .. jid_escape(service_nickname);
    module:log("debug", "Sending muc terms to %s", occupant.jid);
    local msg = create_terms_message(room, "muc", muc_terms);
    msg.attr.to = occupant.jid;
    origin.send(msg);
  end
end
-- Note: we could do that on muc-occupant-joined or muc-occupant-session-new.
-- The first will not send it to multiple clients, the second will.
-- After some reflexion, i will try muc-occupant-session-new, and see if it works as expected.
module:hook("muc-occupant-session-new", send_terms);

-- reserve the service_nickname:
local function enforce_nick_policy(event)
  local origin, stanza = event.origin, event.stanza;
  local requested_nick = jid_resource(stanza.attr.to);
  local room = event.room;
	if not room then return; end

  if requested_nick == service_nickname then
    module:log("debug", "Occupant tried to use the %s reserved nickname, blocking it.", service_nickname);
    local reply = st.error_reply(stanza, "cancel", "conflict", nil, room.jid):up();
		origin.send(reply);
    return true;
  end
end
module:hook("muc-occupant-pre-join", enforce_nick_policy);
module:hook("muc-occupant-pre-change", enforce_nick_policy);

-- security check: we must remove all "x-livechat-terms" tag, to be sure nobody tries to spoof terms!
module:hook("muc-occupant-groupchat", function(event)
  event.stanza:maptags(function (child)
    if child.name == 'x-livechat-terms' then
      return nil;
    end
    return child;
  end);
end, 100);
