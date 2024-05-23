-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
--
-- SPDX-License-Identifier: AGPL-3.0-only

local json = require "util.json";
local async = require "util.async";
local http = require "net.http";

module:depends"http";

local apikey = assert(module:get_option_string("peertubelivechat_test_apikey", nil), "'peertubelivechat_test_apikey' is a required option");
local peertube_url = assert(module:get_option_string("peertubelivechat_test_peertube_api_url", nil), "'peertubelivechat_test_peertube_api_url' is a required option");

local ex = {
	headers = {
		accept = "application/json";
	}
};

local function check_auth(routes)
	local function check_request_auth(event)
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

local function test_peertube_prosody(event)
	local request, response = event.request, event.response;
  local json_response = {
    ok = true;
  }
  event.response.headers["Content-Type"] = "application/json";
	return json.encode(json_response);
end

local function test_prosody_peertube(event)
  local request, response = event.request, event.response;

  local ret, err;
	http.request(peertube_url, ex, function (body, code)
		if math.floor(code / 100) == 2 then
			local parsed, parse_err = json.decode(body);
			if not parsed then
				module:log("debug", "Got invalid JSON from %s: %s", peertube_url, parse_err);
				err = problems.format;
			else
				ret = parsed;
			end
		else
			module:log("debug", "Rejected by API: ", body);
			err = "Rejected by API";
		end

		local json_response;
    if not ret then
      json_response = {
        ok = false;
        error = err;
      };
    else
      json_response = ret;
    end
    response:send(json.encode(json_response));
	end);

  event.response.headers["Content-Type"] = "application/json";
  return true
end

module:provides("http", {
	route = check_auth {
		["GET /test-peertube-prosody"] = test_peertube_prosody;
    ["GET /test-prosody-peertube"] = test_prosody_peertube;
	};
});
