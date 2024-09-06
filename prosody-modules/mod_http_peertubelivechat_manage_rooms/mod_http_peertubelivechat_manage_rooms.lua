-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
--
-- SPDX-License-Identifier: AGPL-3.0-only

local json = require "util.json";
local jid_split = require"util.jid".split;
local jid_prep = require"util.jid".prep;
local array = require "util.array";
local st = require "util.stanza";

local mod_muc = module:depends"muc";
local all_rooms = rawget(mod_muc, "all_rooms");
local get_room_from_jid = rawget(mod_muc, "get_room_from_jid");

module:depends"http";

local mod_muc_peertubelivechat_terms = module:depends"muc_peertubelivechat_terms";
local set_muc_terms = rawget(mod_muc_peertubelivechat_terms, "set_muc_terms");
local mod_muc_peertubelivechat_restrict_message = module:depends"muc_peertubelivechat_restrict_message";
local set_peertubelivechat_emoji_only_mode = rawget(mod_muc_peertubelivechat_restrict_message, "set_peertubelivechat_emoji_only_mode");
local set_peertubelivechat_custom_emoji_regexp = rawget(mod_muc_peertubelivechat_restrict_message, "set_peertubelivechat_custom_emoji_regexp");

function check_auth(routes)
  local function check_request_auth(event)
    local apikey = module:get_option_string("peertubelivechat_manage_rooms_apikey", "")
    if apikey == "" then
      return false, 500;
    end
    if event.request.headers.authorization ~= "Bearer " .. apikey then
      return false, 401;
    end
    return true;
  end

  for route, handler in pairs(routes) do
    routes[route] = function (event, ...)
      local permit, code = check_request_auth(event);
      if not permit then
        return code;
      end
      return handler(event, ...);
    end;
  end
  return routes;
end

local function list_rooms(event)
  local request, response = event.request, event.response;
  local rooms_json = array();
  for room in all_rooms() do
    local localpart = jid_split(room.jid);
    local history = room._history;
    local lasttimestamp;
    if history ~= nil and #history > 0 then
      lasttimestamp = history[#history].timestamp;
    end
    rooms_json:push({
      jid = room.jid;
      localpart = localpart;
      name = room:get_name() or localpart;
      lang = room.get_language and room:get_language();
      description = room:get_description();
      lasttimestamp = lasttimestamp;
    })
  end

  event.response.headers["Content-Type"] = "application/json";
  return json.encode_array(rooms_json);
end

local function update_room(event)
  local request, response = event.request, event.response;
  event.response.headers["Content-Type"] = "application/json";

  local config = json.decode(request.body);
  if not config.jid then
    return json.encode({
      result = "failed";
    });
  end

  local room = get_room_from_jid(config.jid);
  if not room then
    return json.encode({
      result = "failed";
    });
  end

  local must104 = false;

  if type(config.name) == "string" then
    if room:get_name() ~= config.name then
      room:set_name(config.name);
      must104 = true;
    end
  end
  if type(config.slow_mode_duration) == "number" then
    if room._data.slow_mode_duration ~= config.slow_mode_duration then
      room._data.slow_mode_duration = config.slow_mode_duration;
      must104 = true;
    end
  end
  if type(config.moderation_delay) == "number" then
    if room._data.moderation_delay ~= config.moderation_delay then
      room._data.moderation_delay = config.moderation_delay;
    end
  end
  if type(config.livechat_emoji_only) == "boolean" then
    if set_peertubelivechat_emoji_only_mode then
      set_peertubelivechat_emoji_only_mode(room, config.livechat_emoji_only)
    end
  end
  if type(config.livechat_custom_emoji_regexp) == "string" then
    if set_peertubelivechat_custom_emoji_regexp then
      set_peertubelivechat_custom_emoji_regexp(room, config.livechat_custom_emoji_regexp)
    end
  end
  if (type(config.livechat_muc_terms) == "string") then
    -- to easily detect if the value is given or not, we consider that the caller passes "" when terms must be deleted.
    if set_muc_terms then
      set_muc_terms(room, config.livechat_muc_terms or nil);
    end
  end
  if type(config.removeAffiliationsFor) == "table" then
    -- array of jids
    for _, jid in ipairs(config.removeAffiliationsFor) do
      room:set_affiliation(true, jid, "none");
    end
  end
  if type(config.addAffiliations) == "table" then
    -- map of jid:affiliation
    for user_jid, aff in pairs(config.addAffiliations) do
      if type(user_jid) == "string" and type(aff) == "string" then
        local prepped_jid = jid_prep(user_jid);
        if prepped_jid then
          local ok, err = room:set_affiliation(true, prepped_jid, aff);
          if not ok then
            module:log("error", "Could not set affiliation in %s: %s", room.jid, err);
            -- FIXME: fail?
          end
        else
          module:log("error", "Invalid JID: %q", aff.jid);
          -- FIXME: fail?
        end
      end
    end
  end

  if must104 then
    -- we must broadcast a status 104 message, so that clients can update room info
    local msg = st.message({type='groupchat', from=room.jid})
      :tag('x', {xmlns='http://jabber.org/protocol/muc#user'})
    msg:tag("status", {code = '104';}):up();
    msg:up();
    room:broadcast_message(msg);
  end

  return json.encode({
    result = "ok";
    changed = must104;
  });
end

module:provides("http", {
  route = check_auth {
    ["GET /list-rooms"] = list_rooms;
    ["POST /update-room"] = update_room;
  };
});
