local json = require "util.json";

module:depends"http";

function check_auth(routes)
	local function check_request_auth(event)
    local apikey = module:get_option_string("peertubelivechat_test_apikey", "")
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

module:provides("http", {
	route = check_auth {
		["GET /test-peertube-prosody"] = test_peertube_prosody;
    -- ["GET /test-prosody-peertube"] = test_prosody_peertube;
	};
});
