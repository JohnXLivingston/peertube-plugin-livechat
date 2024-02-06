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
local cache_user = {};

local peertube_url = assert(module:get_option_string("peertubelivechat_vcard_peertube_url", nil), "'peertubelivechat_vcard_peertube_url' is a required option");
if peertube_url:sub(-1,-1) == "/" then peertube_url = peertube_url:sub(1,-2); end

local function get_avatar_url(ret)
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
  if from_cache and from_cache["loading"] and promise.is_promise(from_cache["loading"]) then
    -- First case: already loading the vCard, from a previous request.
    module:log("debug", "vCard result for %s is already loading, waiting for the promise to resolve.", who);
    local vcard, err = async.wait_for(from_cache["loading"])
    if (vcard) then
      module:log("debug", "vCard result for %s loaded (promise resolved, with a result).", who);
      origin.send(st.reply(stanza):add_child(vcard));
    else
      module:log("debug", "vCard result for %s loaded (promise resolved, without a vcard).", who);
      origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    end
    return true;
  end

  if from_cache and from_cache["last_fetch_time"] and from_cache["last_fetch_time"] + CACHE_EXPIRY < gettime() then
    module:log("debug", "vCard result for %s was in cache but is expired.", who);
    cache_user[who] = nil
    from_cache = nil
  end

  if from_cache then
    if (from_cache['vcard']) then
      module:log("debug", "vCard result for %s is in cache, and contains a vCard.", who);
      origin.send(st.reply(stanza):add_child(from_cache["vcard"]));
    else
      module:log("debug", "vCard result for %s is in cache, but there is no vCard.", who);
      origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    end
    return true;
  end

  module:log("debug", "vCard result for %s is not in cache, loading it.", who);
  local vcard_temp = nil;

  local p = promise.new(function(resolve, reject)
    local url = peertube_url .. '/api/v1/accounts/' .. uh.urlencode(who);
    module:log("debug", "Calling Peertube API: %s", url);
    http.request(url, { accept = "application/json" }, function (body, code)
      local ret;
      if math.floor(code / 100) == 2 then
        local parsed, parse_err = json.decode(body);
        if not parsed then
          module:log("debug", "Got invalid JSON from %s: %s", url, parse_err);
        else
          module:log("debug", "Got valid JSON, so long everything is ok.");
          ret = parsed;
        end
      else
        module:log("debug", "Rejected by API: ", body);
      end

      if not ret then
        module:log("debug", "Peertube user not found, no vCard for %s", who);
        origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
        cache_user[who] = { last_fetch_time = gettime() };
        resolve(false);
        return;
      end

      local avatar_url = get_avatar_url(ret);
      if avatar_url then
        module:log("debug", "Downloading user avatar on %s", avatar_url);
        http.request(avatar_url, {}, function (body, code, response)
          if math.floor(code / 100) == 2 then
            module:log("debug", "Avatar found for %s", who);
            if (response and response.headers and response.headers["content-type"]) then
              module:log("debug", "Avatar content-type: %s", response.headers["content-type"]);
              local vcard_temp = st.stanza("vCard", { xmlns = "vcard-temp" });
              vcard_temp:text_tag("FN", ret.displayName);
              vcard_temp:text_tag("NICKNAME", ret.displayName);
              vcard_temp:text_tag("URL", ret.url);
              vcard_temp:tag("PHOTO");
              vcard_temp:text_tag("TYPE", response.headers["content-type"]);
              vcard_temp:text_tag("BINVAL", b64(body));
              vcard_temp:up();
              origin.send(st.reply(stanza):add_child(vcard_temp));
              cache_user[who] = { last_fetch_time = gettime(), vcard = vcard_temp };
              resolve(vcard_temp);
              return;
            else
              module:log("debug", "Avatar has no content-type.");
            end
          else
            module:log("debug", "Cant load avatar: ", body);
          end

          module:log("debug", "ignoring vCard", who);
          origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
          cache_user[who] = { last_fetch_time = gettime() };
          resolve(false);
          return;
        end)

      else
        module:log("debug", "No avatar url for user %s, so ignoring vCard", who);
        origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
        cache_user[who] = { last_fetch_time = gettime() };
        resolve(false);
        return;
      end
    end);
  end);
  cache_user[who] = { loading = p };
  return true;
end);
