local json = require "util.json";
local jid_split = require"util.jid".split;
local array = require "util.array";

local mod_muc = module:depends"muc";
local all_rooms = rawget(mod_muc, "all_rooms")

module:depends"http";

function check_auth(routes)
  local function check_request_auth(event)
    local apikey = module:get_option_string("peertubelivechat_list_rooms_apikey", "")
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

module:provides("http", {
  route = check_auth {
    ["GET /list-rooms"] = list_rooms;
  };
});
