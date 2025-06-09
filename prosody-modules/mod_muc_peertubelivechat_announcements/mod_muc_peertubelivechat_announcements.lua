-- mod_muc_peertubelivechat_announcements
--
-- SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--

local st = require "util.stanza";
local jid_bare = require "util.jid".bare;

-- security check: only MUC owner/admin can add the x-livechat-announcement-type attribute on the body.
function handle_groupchat(event)
  local origin, stanza = event.origin, event.stanza;
  local room = event.room;
  local body = stanza:get_child("body")
  if not body or not body.attr then
    return;
  end
  if not body.attr["x-livechat-announcement-type"] then
    return;
  end

  local from = stanza.attr.from;
  local from_affiliation = room:get_affiliation(from);
  if (from_affiliation == "owner" or from_affiliation == "admin") then
    return;
  end

  module:log("info", "Someone tried to spoof x-livechat-announcement-type, bouncing the message.");
  local reply = st.error_reply(
    stanza,
    -- error_type = 'modify' (see descriptions in RFC 6120 https://xmpp.org/rfcs/rfc6120.html#stanzas-error-syntax)
    "modify",
    -- error_condition = 'policy-violation' (see RFC 6120 Defined Error Conditions https://xmpp.org/rfcs/rfc6120.html#stanzas-error-conditions)
    "policy-violation",
    "Only owner and admin can send announcements."
  );
  origin.send(reply);
  return true; -- stoping propagation
end
module:hook("muc-occupant-groupchat", handle_groupchat, 500);
