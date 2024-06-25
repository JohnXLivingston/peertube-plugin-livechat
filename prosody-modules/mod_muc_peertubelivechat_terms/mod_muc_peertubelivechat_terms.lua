-- mod_muc_peertubelivechat_terms
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--
local jid_escape = require "util.jid".escape;
local jid_resource = require "util.jid".resource;
local st = require "util.stanza";
local id = require "util.id";

local service_nickname = module:get_option_string("muc_terms_service_nickname", "Service");
local global_terms = module:get_option_string("muc_terms", "");

-- send the terms when joining:
function send_terms(event)
  local origin = event.origin;
	local room = event.room;
	local occupant = event.occupant;
  if global_terms then
    local from = room.jid .. '/' .. jid_escape(service_nickname);
    module:log("debug", "Sending global terms to %s from %s (room %s)", occupant.jid, from, room);
    local message = st.message({
			type = "groupchat",
			to = occupant.jid,
			from = from,
			id = id.medium()
		}, global_terms)
      :tag('x-livechat-terms', { type = "global" }):up(); -- adding a custom tag to specify that it is a "terms" message, so that frontend can display it with a special template.
		origin.send(message);
  end
end
-- Note: we could do that on muc-occupant-joined or muc-occupant-session-new.
-- The first will not send it to multiple clients, the second will.
-- After some reflexion, i will try muc-occupant-session-new, and see if it works as expected.
module:hook("muc-occupant-session-new", send_terms);

-- reserve the service_nickname:
function enforce_nick_policy(event)
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
