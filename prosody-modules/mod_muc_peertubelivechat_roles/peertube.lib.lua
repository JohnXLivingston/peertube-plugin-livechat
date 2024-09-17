-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local cache = require "util.cache";
local get_time = require "util.time".now;
local http = require "net.http";
local json = require "util.json";

local peertube_follow_api_url = assert(module:get_option_string("peertubelivechat_roles_follow_api_url", nil), "'peertubelivechat_roles_follow_api_url' is a required option");

-- follow_cache:
-- {
--    time: the timestamp at which it was computed
--    following: true, false or nil. Nil <=> there is an ongoing request.
-- }
local follow_cache = cache.new(100000); -- not too low to avoid emptying cache too soon, not to big to avoid memory leak.


local function _get_follow_cache(cache_key, mute_non_followers)
  local result = follow_cache:get(cache_key);

  if result == nil then return nil; end

  local now = math.floor(get_time());
  if result.following == true  or result.following == nil then
    -- We only keep the positive following values for 1 hour, to handle unsubscriptions.
    -- And we arbitrary choose to do the some for result.following == nil. (this should not last more than a few ms, but...)
    if now - result.time > 3600 then
      follow_cache:set(cache_key, nil);
      return nil;
    end
    return result;
  end

  -- when following == false, the timeout is mute_non_followers minutes.
  if now - result.time > 60 * mute_non_followers then
    follow_cache:set(cache_key, nil);
    return nil;
  end
  return result;
end

local is_ongoing_request = false;
local request_pool = {};

local function _process_request_pool()
  local item_number = 0;

  local to_request = {};
  for cache_key, entry in pairs(request_pool) do
    item_number = item_number + 1;
    to_request[cache_key] = {
      room = entry.room_jid;
      bare_jid = entry.occupant_bare_jid;
    };
  end

  -- and we reset! (to avoid loop on recursive call, see http.request callback)
  request_pool = {};

  if item_number == 0 then
    module:log("debug", "No item in the request pool, stopping.");
    return;
  end
  
  module:log("debug", "Processing request pool (%i items)...", item_number);
  local options = {
    accept = "application/json";
    body = json.encode(to_request);
  };
  http.request(peertube_follow_api_url, options, function (body, code)
    is_ongoing_request = false;

    -- we can already re-run _process_request_pool, in case there are new items to process.
    _process_request_pool();

    -- Note: in case of API fail, we don't request again.
    -- User should just try to reload.

    if not(math.floor(code / 100) == 2) then
      module:log("error", "Peertube follow API failed with code %s: %s", code, body);
      return;
    end

    local parsed, parse_err = json.decode(body);
    if not parsed then
      module:log("error", "Peertube follow API returned invalid JSON: %s", parse_err);
      return;
    end

    module:log("debug", "Got results from the Peertube follow API.");
  end);
end

local function _request_follow(cache_key, room_jid, occupant_bare_jid, mute_non_followers)
  -- we can create a cache entry, to store that we are currently requesting for this room/occupant.
  follow_cache:set(cache_key, {
    following = nil;
    time = math.floor(get_time());
  });

  request_pool[cache_key] = {
    room_jid = room_jid;
    occupant_bare_jid = occupant_bare_jid;
    mute_non_followers = mute_non_followers;
  };

  if is_ongoing_request then
    module:log("debug", "Must request %s, but there is already an outgoing request, so we will add to request_pool.", cache_key);
    return;
  end

  is_ongoing_request = true;
  _process_request_pool();
end


-- This function checks if the occupant is a follower for at least 'mute_non_followers' minutes.
-- This function returns:
-- * nil if the result is not in cache
-- * false if the result is in cache, and we know they are not a follower
-- * true if the result is in cache, and we know they are a follower
-- In case the result is not in cache, a request will be sent to Peertube,
-- and the occupant role could be updated when the result is available (if occupant still in the room).
-- This API call is non bloquant.
-- The API calls can be grouped to avoid spamming the Peertube server.
local function check_follow_for(room_jid, occupant_bare_jid, mute_non_followers)
  local cache_key = room_jid .. '//' .. occupant_bare_jid;

  local cached = _get_follow_cache(cache_key, mute_non_followers);
  if cached then
    return cached.following;
  end

  -- and now, lauch a non-bloquant request
  _request_follow(cache_key, room_jid, occupant_bare_jid, mute_non_followers);
  return nil;
end


return {
  check_follow_for = check_follow_for;
};
