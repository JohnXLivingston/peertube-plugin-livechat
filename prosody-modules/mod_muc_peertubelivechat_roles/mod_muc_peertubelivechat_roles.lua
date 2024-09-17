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

local check_follow_for = module:require("peertube").check_follow_for;

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

-- mute_non_followers: nil or an integer value.
-- nil: features disabled
-- integer: the number of minutes the user must be following the peertube channel.
local function get_peertubelivechat_mute_non_followers(room)
  return room._data.x_peertubelivechat_mute_non_followers;
end

local function set_peertubelivechat_mute_non_followers(room, mute_non_followers)
  if mute_non_followers ~= nil then
    mute_non_followers = assert(tonumber(mute_non_followers), "Mute non followers must be an integer value.");
    if mute_non_followers < 0 then
      mute_non_followers = nil;
    else
      mute_non_followers = math.floor(mute_non_followers);
    end
  end
  if get_peertubelivechat_mute_non_followers(room) == mute_non_followers then return false; end

  room._data.x_peertubelivechat_mute_non_followers = mute_non_followers;

  local role_to_test;
  local role_to_set;
  if (mute_non_followers ~= nil) then
    -- mute all users (with "participant" role)
    role_to_test = "participant";
    role_to_set = "visitor";
  else
    -- voice all users (with "visitor" role).
    role_to_test = "visitor";
    role_to_set = "participant";
  end

  for occupant_jid, occupant in room:each_occupant() do
    -- we ignore the anonymous host, it will be handled by set_peertubelivechat_mute_anonymous
    if (occupant.bare_jid:sub(-#anonymous_host) ~= anonymous_host) then
      if occupant.role == role_to_test then
        if role_to_set == "visitor" and check_follow_for(room.jid, occupant.bare_jid, mute_non_followers) then
          -- special case: if we already know that the user is a follower, don't set them as visitor
          module:log("debug", "Not setting back the user %s as visitor in room %s, as we know they are already a follower.", occupant.bare_jid, room.jid);
        else
          room:set_role(true, occupant_jid, role_to_set);
        end
      end
    end
  end

  if mute_non_followers ~= nil then
    -- We must also mute anonymous
    set_peertubelivechat_mute_anonymous(room, true);
  end

  return true
end

module:hook("muc-disco#info", function(event)
  if get_peertubelivechat_mute_anonymous(event.room) then
    event.reply:tag("feature", {var = "x_peertubelivechat_mute_anonymous"}):up();
  end
  local mute_non_followers = get_peertubelivechat_mute_non_followers(event.room);
  if mute_non_followers ~= nil then
    table.insert(event.form, {
      name = "muc#roominfo_x_peertubelivechat_mute_non_followers";
      value = "";
    });
    event.formdata["muc#roominfo_x_peertubelivechat_mute_non_followers"] = mute_non_followers;
  end
end);

module:hook("muc-config-form", function(event)
  table.insert(event.form, {
    name = "muc#roomconfig_x_peertubelivechat_mute_non_followers";
    type = "text-single";
    label = "Only users following your Peertube account since X minutes can talk.";
    desc =
      "Users will be muted by default. Only users following your Peertube account for at least X minutes will be able to talk. "
      .. "Let empty to disable the feature. "
      .. "Enabling this feature will also mute anonymous users.";
    value = get_peertubelivechat_mute_non_followers(event.room);
    datatype = "xs:integer";
    range_min = 0;
    required = false;
  });
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

module:hook("muc-config-submitted/muc#roomconfig_x_peertubelivechat_mute_non_followers", function(event)
  if set_peertubelivechat_mute_non_followers(event.room, event.value) then
    event.status_codes["104"] = true;
  end
end);

-- Note: muc-get-default-role does not get any occupant info.
-- So we won't use this hook to set default roles.
-- We will do something a little hacky...: change the role in a high priority muc-occupant-pre-join hook!
module:hook("muc-occupant-pre-join", function(event)
  local occupant = event.occupant;
  if occupant.role == "participant" then
    if get_peertubelivechat_mute_anonymous(event.room) and occupant.bare_jid ~= nil then
      if (occupant.bare_jid:sub(-#anonymous_host) == anonymous_host) then
        occupant.role = "visitor";
      end
    end
    local mute_non_followers = get_peertubelivechat_mute_non_followers(event.room);
    if mute_non_followers and occupant.bare_jid ~= nil then
      -- we ignore the anonymous host, it will be handled by set_peertubelivechat_mute_anonymous
      if (occupant.bare_jid:sub(-#anonymous_host) ~= anonymous_host) then
        if check_follow_for(event.room.jid, occupant.bare_jid, mute_non_followers) ~= true then
          occupant.role = "visitor";
        end
      end
    end
  end
end, 1000);

return {
  get = get_peertubelivechat_mute_anonymous;
  set = set_peertubelivechat_mute_anonymous;
};
