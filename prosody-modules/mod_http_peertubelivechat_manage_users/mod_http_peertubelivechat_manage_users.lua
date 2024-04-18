local json = require "util.json";
local jid_split = require"util.jid".split;
local usermanager = require "core.usermanager";
local st = require "util.stanza"

module:depends"http";

local module_host = module:get_host(); -- this module is not global

local bare_sessions = prosody.bare_sessions;

local vcards = module:open_store("vcard");

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


local function update_vcard(username, avatar)
  if not avatar then
    module:log("debug", "No avatar for user %s, deleting vcard", username);
    vcards:set(username, nil)
    return
  end

  module:log("debug", "There is a avatar for user %s, storing the relevant vcard.", username);
  local vcard_temp = st.stanza("vCard", { xmlns = "vcard-temp" });
  vcard_temp:tag("PHOTO");
  vcard_temp:text_tag("TYPE", avatar.mimetype);
  -- avatar.base64 is already base64 encoded
  vcard_temp:text_tag("BINVAL", avatar.base64);
  vcard_temp:up();
  if not vcards:set(username, st.preserialize(vcard_temp)) then
    module:log("error", "Failed to store the vcard for user %s", username);
  end
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

  module:log("debug", "Calling ensure_user for %s", config.jid);

  local username, host = jid_split(config.jid);
  if module_host ~= host then
    module:log("error", "Wrong host %s", host);
    return json.encode({
      result = "failed";
      message = "Wrong host"
    });
  end

  -- if user exists, just update.
  if usermanager.user_exists(username, host) then
    module:log("debug", "User already exists, updating");
    if not usermanager.set_password(username, config.password, host, nil) then
      module:log("error", "Failed to update the password");
      return json.encode({
        result = "failed";
        message = "Failed to update the password"
      });
    end

    update_vcard(username, config.avatar);

    return json.encode({
      result = "ok";
      message = "User updated"
    });
  end

  -- we must create the user.
  module:log("debug", "User does not exists, creating");
  if (not usermanager.create_user(username, config.password, host)) then
    module:log("error", "Failed to create the user");
    return json.encode({
      result = "failed";
      message = "Failed to create the user"
    });
  end

  update_vcard(username, config.avatar);

  return json.encode({
    result = "ok";
    message = "User created"
  });
end


local function prune_users(event) -- delete all users that are not connected!
  local request, response = event.request, event.response;
  event.response.headers["Content-Type"] = "application/json";

  module:log("info", "Calling prune_users for host %s", module_host);

  for user in usermanager.users(module_host) do
    -- has the user still open sessions?
    if (bare_sessions[user..'@'..module_host] ~= nil) then
      module:log("debug", "User %s on host %s has still active sessions, ignoring.", user, module_host);
    else
      -- FIXME: there is a little chance that we delete a user that is currently connecting...
      -- As this prune should not be called too often, we can consider it is not an issue for now.

      module:log("debug", "Deleting user %s on host %s", user, module_host);
      update_vcard(user, nil);
      usermanager.delete_user(user, module_host);
    end
  end

  return json.encode({
    result = "ok";
  });
end

module:provides("http", {
  route = check_auth {
    ["POST /" .. module_host .. "/ensure-user"] = ensure_user;
    ["POST /" .. module_host .. "/prune-users"] = prune_users;
  };
});
