local st = require "util.stanza";
local http = require "net.http";
local async = require "util.async";
local b64 = require "util.encodings".base64.encode;
local jid_split = require "util.jid".split;
local json = require "util.json";
local uh = require "util.http";

module:add_feature("vcard-temp");

local peertube_url = assert(module:get_option_string("peertubelivechat_vcard_peertube_url", nil), "'peertubelivechat_vcard_peertube_url' is a required option");
if peertube_url:sub(-1,-1) == "/" then peertube_url = peertube_url:sub(1,-2); end

module:hook("iq-get/bare/vcard-temp:vCard", function (event)
  local origin, stanza = event.origin, event.stanza;
  local who = jid_split(stanza.attr.to) or origin.username
  module:log("debug", "vCard request for %s", who);

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
    return true;
  end
  
  local vcard_temp = st.stanza("vCard", { xmlns = "vcard-temp" });
  vcard_temp:text_tag("NICKNAME", ret.displayName);
  
  if ret.avatar and ret.avatar.path then
    module:log("debug", "Downloading user avatar on %s", peertube_url .. ret.avatar.path);
    local waitAvatar, doneAvatar = async.waiter();
    http.request(peertube_url .. ret.avatar.path, {}, function (body, code, response)
      if math.floor(code / 100) == 2 then
        module:log("debug", "Avatar found for %s", who);
        vcard_temp:tag("PHOTO")
        if (response and response.headers and response.headers["Content-Type"]) then
          module:log("debug", "Avatar Content-Type: %s", response.headers["Content-Type"]);
          vcard_temp:text_tag("TYPE", response.headers["Content-Type"])
        end
        vcard_temp:text_tag("BINVAL", b64(body))
        vcard_temp:up()
      else
        module:log("debug", "Cant load avatar: ", body);
      end
      doneAvatar();
    end)

    waitAvatar();
  end

  origin.send(st.reply(stanza):add_child(vcard_temp));
  return true;
end, 1); -- TODO: Negative priority, so if the user has set a custom vCard (mod_vcard_legacy), it will be used?
-- TODO: cache results for N seconds
