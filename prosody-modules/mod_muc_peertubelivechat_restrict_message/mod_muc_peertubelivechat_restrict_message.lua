-- mod_muc_peertubelivechat_roles
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

local rex = require "rex_onig"; -- We are using Oniguruma because PCRE2 does not handle long regexp.
rex.setdefaultsyntax ("PERL");

-- Plugin dependencies
local mod_muc = module:depends "muc";
local muc_util = module:require "muc/util";
local valid_roles = muc_util.valid_roles;

local common_emoji_regexp = assert(module:get_option_string('peertubelivechat_restrict_message_common_emoji_regexp'), 'Common emoji regexp is mandatory');

function get_peertubelivechat_emoji_only_mode(room)
  return room._data.x_peertubelivechat_emoji_only_mode;
end

function set_peertubelivechat_emoji_only_mode(room, emoji_only)
  emoji_only = emoji_only and true or nil;
  if get_peertubelivechat_emoji_only_mode(room) == emoji_only then return false; end
  room._data.x_peertubelivechat_emoji_only_mode = emoji_only;
  return true;
end

function get_peertubelivechat_custom_emoji_regexp(room)
  return room._data.x_peertubelivechat_custom_emoji_regexp;
end

function set_peertubelivechat_custom_emoji_regexp(room, emoji_only_regexp)
  if (emoji_only_regexp ~= nil and type(emoji_only_regexp) ~= "string") then
    return false;
  end
  if emoji_only_regexp == "" then emoji_only_regexp = nil; end
  if get_peertubelivechat_custom_emoji_regexp(room) == emoji_only_regexp then return false; end
  room._data.x_peertubelivechat_custom_emoji_regexp = emoji_only_regexp;

  -- and we must decache the compile regexp
  room.x_peertubelivechat_emoji_only_compiled_regexp = nil;
  return true;
end

module:hook("muc-disco#info", function(event)
  if get_peertubelivechat_emoji_only_mode(event.room) then
    event.reply:tag("feature", {var = "x_peertubelivechat_emoji_only_mode"}):up();
  end
end);

module:hook("muc-config-form", function(event)
  table.insert(event.form, {
    name = "muc#roomconfig_x_peertubelivechat_emoji_only_mode";
    type = "boolean";
    label = "Emoji only mode";
    desc = "Occupants will only be able to send emoji. This does not affect moderators.";
    value = get_peertubelivechat_emoji_only_mode(event.room);
  });
end, 122);

module:hook("muc-config-submitted/muc#roomconfig_x_peertubelivechat_emoji_only_mode", function(event)
  if set_peertubelivechat_emoji_only_mode(event.room, event.value) then
    event.status_codes["104"] = true;
  end
end);


-- handling groupchat messages
function handle_groupchat(event)
  local origin, stanza = event.origin, event.stanza;
  local room = event.room;

  if (not get_peertubelivechat_emoji_only_mode(room)) then
    return;
  end

  if not room.x_peertubelivechat_emoji_only_compiled_regexp then
    -- compute the regexp on first access
    local r = get_peertubelivechat_custom_emoji_regexp(room);
    if (r == nil or r == "") then
      r = common_emoji_regexp;
    else
      r = r .. "|" .. common_emoji_regexp;
    end
    r = "^\\s*(?:(?:" .. r .. ")\\s*)+\\s*$"

    room.x_peertubelivechat_emoji_only_compiled_regexp = rex.new(r, "i", "UTF8");
  end

  -- only consider messages with body (ie: ignore chatstate and other non-text xmpp messages)
  local body = stanza:get_child_text("body")
  if not body or #body < 1 then
    -- module:log("debug", "No body, message accepted");
    return;
  end

  -- Checking user's permissions (moderators are not subject to restrictions)
  local actor = stanza.attr.from;
  local actor_nick = room:get_occupant_jid(actor);
  local actor_jid = jid_bare(actor);
  -- Only checking role, not affiliation (restrictions only applies on users currently connected to the room)
  local role = room:get_role(actor_nick);
  if valid_roles[role or "none"] >= valid_roles.moderator then
    -- user bypasses
    -- module:log("debug", "User is moderator, bypassing restrictions");
    return;
  end

  -- testing the content
  if (room.x_peertubelivechat_emoji_only_compiled_regexp:match(body) ~= nil) then
    -- module:log("debug", "Message accepted");
    return;
  end

  module:log("debug", "Bouncing message for user %s", actor_nick);
  local reply = st.error_reply(
    stanza,
    -- error_type = 'modify' (see descriptions in RFC 6120 https://xmpp.org/rfcs/rfc6120.html#stanzas-error-syntax)
    "modify",
    -- error_condition = 'policy-violation' (see RFC 6120 Defined Error Conditions https://xmpp.org/rfcs/rfc6120.html#stanzas-error-conditions)
    "policy-violation",
    "Emoji only mode enabled"
  );

  origin.send(reply);
  return true; -- stoping propagation
end
module:hook("muc-occupant-groupchat", handle_groupchat);
