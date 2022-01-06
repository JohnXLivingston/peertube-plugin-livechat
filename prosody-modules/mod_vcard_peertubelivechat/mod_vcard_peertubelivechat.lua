local st = require "util.stanza";
local http = require "net.http";
local gettime = require 'socket'.gettime;
local async = require "util.async";
local b64 = require "util.encodings".base64.encode;
local jid_split = require "util.jid".split;
local json = require "util.json";
local uh = require "util.http";

module:add_feature("vcard-temp");

local CACHE_EXPIRY = 3600;
local cache_user = {};

local peertube_url = assert(module:get_option_string("peertubelivechat_vcard_peertube_url", nil), "'peertubelivechat_vcard_peertube_url' is a required option");
if peertube_url:sub(-1,-1) == "/" then peertube_url = peertube_url:sub(1,-2); end

module:hook("iq-get/bare/vcard-temp:vCard", function (event)
  local origin, stanza = event.origin, event.stanza;
  local who = jid_split(stanza.attr.to) or origin.username
  module:log("debug", "vCard request for %s", who);

  local from_cache = cache_user[who];
  if from_cache then
    if from_cache["last_fetch_time"] and from_cache["last_fetch_time"] + CACHE_EXPIRY < gettime() then
      module:log("debug", "vCard result for %s was in cache but is expired.", who);
      cache_user[who] = nil
    else
      module:log("debug", "vCard result for %s is in cache.", who);
      if (from_cache['vcard']) then
        origin.send(st.reply(stanza):add_child(from_cache["vcard"]));
      else
        origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
      end
      return true;
    end
  else
    module:log("debug", "vCard result for %s is not in cache.", who);
  end

  local wait, done = async.waiter();
  local url = peertube_url .. '/api/v1/accounts/' .. uh.urlencode(who);
  module:log("debug", "Calling Peertube API: %s", url);
  local ret;
  http.request(url, { accept = "application/json" }, function (body, code)
    if math.floor(code / 100) == 2 then
			local parsed, parse_err = json.decode(body);
			if not parsed then
				module:log("debug", "Got invalid JSON from %s: %s", url, parse_err);
			else
				ret = parsed;
			end
		else
			module:log("debug", "Rejected by API: ", body);
		end
    done();
  end)

  wait();

  if not ret then
    module:log("debug", "Peertube user not found, no vCard for %s", who);
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    cache_user[who] = { last_fetch_time = gettime() };
    return true;
  end

  local vcard_temp = st.stanza("vCard", { xmlns = "vcard-temp" });

  vcard_temp:text_tag("FN", ret.displayName);
  vcard_temp:text_tag("NICKNAME", ret.displayName);
  vcard_temp:text_tag("URL", ret.url);

  if ret.avatar and ret.avatar.path then
    module:log("debug", "Downloading user avatar on %s", peertube_url .. ret.avatar.path);
    local waitAvatar, doneAvatar = async.waiter();
    http.request(peertube_url .. ret.avatar.path, {}, function (body, code, response)
      if math.floor(code / 100) == 2 then
        module:log("debug", "Avatar found for %s", who);
        vcard_temp:tag("PHOTO");
        if (response and response.headers and response.headers["content-type"]) then
          module:log("debug", "Avatar content-type: %s", response.headers["content-type"]);
          vcard_temp:text_tag("TYPE", response.headers["content-type"]);
          vcard_temp:text_tag("BINVAL", b64(body));
          vcard_temp:up();
        else
          module:log("debug", "Avatar has no content-type.");
        end
      else
        module:log("debug", "Cant load avatar: ", body);
      end
      doneAvatar();
    end)

    waitAvatar();
  end

  origin.send(st.reply(stanza):add_child(vcard_temp));
  cache_user[who] = { last_fetch_time = gettime(), vcard = vcard_temp };
  return true;
end);
