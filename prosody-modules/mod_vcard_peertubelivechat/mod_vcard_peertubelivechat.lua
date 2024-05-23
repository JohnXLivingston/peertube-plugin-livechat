-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
--
-- SPDX-License-Identifier: AGPL-3.0-only

local st = require "util.stanza";
local http = require "net.http";
local gettime = require 'socket'.gettime;
local async = require "util.async";
local promise = require "util.promise";
local b64 = require "util.encodings".base64.encode;
local jid_split = require "util.jid".split;
local json = require "util.json";
local uh = require "util.http";

module:add_feature("vcard-temp");

local CACHE_EXPIRY = 3600;
local cache_user = {}; -- keeps track of vCards requests. Foreach "who", keeps the last query time (so we can expire it), and a promise that resolves with a vCards, or rejects if no vCard

local peertube_url = assert(module:get_option_string("peertubelivechat_vcard_peertube_url", nil), "'peertubelivechat_vcard_peertube_url' is a required option");
if peertube_url:sub(-1,-1) == "/" then peertube_url = peertube_url:sub(1,-2); end

local function read_avatar_url(ret)
  -- Note:
  -- * before Peertube v6.0.0: using ret.avatar
  -- * after Peertube v6.0.0: using ret.avatars, searching for width 48, or for the smallest width
  if ret.avatar and ret.avatar.path then
    module:log("debug", "User avatar path (Peertube < v6): %s", peertube_url .. ret.avatar.path);
    return peertube_url .. ret.avatar.path;
  end
  local min_width = 100000;
  local min_path = nil;
  if ret.avatars and type(ret.avatars) == "table" then
    for _, avatar in ipairs(ret.avatars) do
      if avatar.path and avatar.width then
        if (avatar.width == 48) then
          module:log("debug", "User avatar path (Peertube >= v6, width 48): %s", peertube_url .. avatar.path);
          return peertube_url .. avatar.path;
        end
        if (avatar.width < min_width) then;
          min_path = avatar.path;
          min_width = avatar.width;
        end
      end
    end
    if min_path then
      module:log("debug", "User avatar path (Peertube >= v6, minimal width): %s", peertube_url .. min_path);
      return peertube_url .. min_path;
    end
  end
  module:log("debug", "Cant find user avatar url");
  return nil;
end

module:hook("iq-get/bare/vcard-temp:vCard", function (event)
  local origin, stanza = event.origin, event.stanza;
  local who = jid_split(stanza.attr.to) or origin.username
  module:log("debug", "vCard request for %s", who);

  local from_cache = cache_user[who];
  if from_cache and from_cache["last_fetch_time"] and from_cache["last_fetch_time"] + CACHE_EXPIRY < gettime() then
    module:log("debug", "vCard promise for %s was in cache but is expired.", who);
    cache_user[who] = nil;
    from_cache = nil;
  end

  if not from_cache then
    module:log("debug", "vCard for %s is not in cache, loading it.", who);
    local p = promise.new(function(resolve, reject)
      local url = peertube_url .. '/api/v1/accounts/' .. uh.urlencode(who);
      module:log("debug", "Calling Peertube API: %s", url);
      http.request(url, { accept = "application/json" }, function (body, code)
        if not(math.floor(code / 100) == 2) then
          reject("Rejected by API for " .. who .. ": " .. body);
          return;
        end

        local parsed, parse_err = json.decode(body);
        if not parsed then
          reject("Got invalid JSON for " .. who .. " from " .. url .. ': ' .. parse_err);
          return;
        end

        module:log("debug", "Got valid JSON, so far everything is ok.");

        local avatar_url = read_avatar_url(parsed);
        if not avatar_url then
          reject("No avatar url for user " .. who .. ", so ignoring vCard");
          return;
        end

        module:log("debug", "Downloading user avatar using %s", avatar_url);
        http.request(avatar_url, {}, function (body, code, response)
          if not(math.floor(code / 100) == 2) then
            reject("Cant load avatar for " .. who .. ": " .. body);
            return;
          end
          if not (response and response.headers and response.headers["content-type"]) then
            reject("Avatar for " .. who .. " has no content-type.");
            return;
          end

          module:log("debug", "Avatar found for %s, with content-type: %s", who, response.headers["content-type"]);
          local vcard_temp = st.stanza("vCard", { xmlns = "vcard-temp" });
          vcard_temp:text_tag("FN", parsed.displayName);
          vcard_temp:text_tag("NICKNAME", parsed.displayName);
          vcard_temp:text_tag("URL", parsed.url);
          vcard_temp:tag("PHOTO");
          vcard_temp:text_tag("TYPE", response.headers["content-type"]);
          vcard_temp:text_tag("BINVAL", b64(body));
          vcard_temp:up();
          resolve(vcard_temp);
          return;
        end)
      end);
    end);
    from_cache = { last_fetch_time = gettime(), promise = p };
    cache_user[who] = from_cache;
  end

  if not (from_cache and from_cache["promise"] and promise.is_promise(from_cache["promise"])) then
    module:log("error", "Missing from_cache promise (user %s).", who);
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end

  module:log("debug", "There is a vCard promise for %s.", who);
  local vcard, err = async.wait_for(from_cache["promise"])
  if (vcard) then
    module:log("debug", "vCard for %s loaded.", who);
    origin.send(st.reply(stanza):add_child(vcard));
  else
    module:log("debug", "no vCard for %s (%s).", who, err);
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
  end
  return true;
end);
