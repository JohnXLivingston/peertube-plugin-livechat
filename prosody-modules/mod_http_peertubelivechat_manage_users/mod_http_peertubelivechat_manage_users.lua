local json = require "util.json";
local jid_split = require"util.jid".split;
local usermanager = require "core.usermanager";

module:depends"http";

local module_host = module:get_host(); -- this module is not global

function check_auth(routes)
  local function check_request_auth(event)
    local apikey = module:get_option_string("peertubelivechat_manage_users_apikey", "")
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


local function ensure_user(event)
  local request, response = event.request, event.response;
  event.response.headers["Content-Type"] = "application/json";

  local config = json.decode(request.body);
  if not config.jid then
    return json.encode({
      result = "failed";
    });
  end

  module:log("debug", "Calling ensure_user", config.jid);

  local username, host = jid_split(config.jid);
  if module_host ~= host then
    module:log("error", "Wrong host", host);
    return json.encode({
      result = "failed";
      message = "Wrong host"
    });
  end

  -- TODO: handle avatars.

  -- if user exists, just update.
  if usermanager.user_exists(username, host) then
    module:log("debug", "User already exists, updating", filename);
    if not usermanager.set_password(username, config.password, host, nil) then
      module:log("error", "Failed to update the password", host);
      return json.encode({
        result = "failed";
        message = "Failed to update the password"
      });
    end
    return json.encode({
      result = "ok";
      message = "User updated"
    });
  end

  -- we must create the user.
  module:log("debug", "User does not exists, creating", filename);
  if (not usermanager.create_user(username, config.password, host)) then
    module:log("error", "Failed to create the user", host);
    return json.encode({
      result = "failed";
      message = "Failed to create the user"
    });
  end
  return json.encode({
    result = "ok";
    message = "User created"
  });
end

-- TODO: add a function to prune user that have not logged in since X days.

module:provides("http", {
  route = check_auth {
    ["POST /" .. module_host .. "/ensure-user"] = ensure_user;
  };
});
