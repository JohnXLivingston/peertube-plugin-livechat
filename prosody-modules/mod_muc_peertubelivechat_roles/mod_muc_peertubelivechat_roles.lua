-- mod_muc_peertubelivechat_roles
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--

-- To compute the anonymous host, we will simply replace "room." by "anon." in the current module host.
-- This part is very peertube-plugin-livechat specific, but that's okay :)
local anonymous_host = "@anon." .. module.host:sub(#"^room.");

local function get_peertubelivechat_mute_anonymous(room)
  return room._data.x_peertubelivechat_mute_anonymous;
end

local function set_peertubelivechat_mute_anonymous(room, mute_anonymous)
  mute_anonymous = mute_anonymous and true or nil;
  if get_peertubelivechat_mute_anonymous(room) == mute_anonymous then return false; end
  room._data.x_peertubelivechat_mute_anonymous = mute_anonymous;

  local role_to_test;
  local role_to_set;
  if (mute_anonymous) then
    -- mute all anonymous users (with "participant" role)
    role_to_test = "participant";
    role_to_set = "visitor";
  else
    -- voice all anonymous users (with "visitor" role).
    role_to_test = "visitor";
    role_to_set = "participant";
  end

  for occupant_jid, occupant in room:each_occupant() do
    if (occupant.bare_jid:sub(-#anonymous_host) == anonymous_host) and occupant.role == role_to_test then
      room:set_role(true, occupant_jid, role_to_set);
    end
  end

  return true;
end

module:hook("muc-disco#info", function(event)
  if get_peertubelivechat_mute_anonymous(event.room) then
    event.reply:tag("feature", {var = "x_peertubelivechat_mute_anonymous"}):up();
  end
end);

module:hook("muc-config-form", function(event)
  table.insert(event.form, {
    name = "muc#roomconfig_x_peertubelivechat_mute_anonymous";
    type = "boolean";
    label = "Mute anonymous users";
    desc = "Anonymous users will be muted by default.";
    value = get_peertubelivechat_mute_anonymous(event.room);
  });
end, 121);

module:hook("muc-config-submitted/muc#roomconfig_x_peertubelivechat_mute_anonymous", function(event)
  if set_peertubelivechat_mute_anonymous(event.room, event.value) then
    event.status_codes["104"] = true;
  end
end);

-- Note: muc-get-default-role does not get any occupant info.
-- So we want use this hook to set default roles.
-- We will do something a little hacky...: change the role in a high priority muc-occupant-pre-join hook!
module:hook("muc-occupant-pre-join", function(event)
  local occupant = event.occupant;
  if occupant.role == "participant" then
    if get_peertubelivechat_mute_anonymous(event.room) and occupant.bare_jid ~= nil then
      if (occupant.bare_jid:sub(-#anonymous_host) == anonymous_host) then
        occupant.role = "visitor";
      end
    end
  end
end, 1000);

return {
  get = get_peertubelivechat_mute_anonymous;
  set = set_peertubelivechat_mute_anonymous;
};
