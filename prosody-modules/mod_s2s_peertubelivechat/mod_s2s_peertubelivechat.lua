module:set_global();

local path = require "util.paths";
local json = require "util.json";

local server_infos_dir = assert(module:get_option_string("peertubelivechat_server_infos_path", nil), "'peertubelivechat_server_infos_path' is a required option");
local instance_url = assert(module:get_option_string("peertubelivechat_instance_url", nil), "'peertubelivechat_instance_url' is a required option");

function discover_websocket_s2s(event)
	local to_host = event.to_host;
  module:log("debug", "Searching websocket s2s for remote host %s", to_host);

	-- FIXME: dont to this room. prefix thing. Peertube should create needed files.
	local to_host_room = to_host;
	if string.sub(to_host_room, 1, 5) ~= 'room.' then
		to_host_room = 'room.'..to_host_room;
	end

	local f_s2s = io.open(path.join(server_infos_dir, to_host_room, 's2s'), "r");
	if f_s2s ~= nil then
		io.close(f_s2s);
		module.log("debug", "Remote host is a known Peertube %s that has s2s activated, we will let legacy s2s module handle the connection", to_host_room);
		return;
	end

	local f_ws_proxy = io.open(path.join(server_infos_dir, to_host_room, 'ws-s2s'), "r");
	if f_ws_proxy == nil then
		module:log("debug", "Remote host %s is not a known remote Peertube, we will let legacy s2s module handle the connection", to_host_room);
		return;
	end
	local content = f_ws_proxy:read("*all");
	io.close(f_ws_proxy);

	local remote_ws_proxy_conf = json.decode(content);
	if (not remote_ws_proxy_conf) then
		module:log("error", "Remote host %s has empty ws-s2s configuration", to_host);
		return;
	end
	if (not remote_ws_proxy_conf['url']) then
		module:log("error", "Remote host %s has missing Websocket url in ws-s2s configuration", to_host);
		return;
	end

	module:log("debug", "Found a Websocket endpoint to proxify s2s communications to remote host %s", to_host);
	local properties = {};
	properties["extra_headers"] = {
		["peertube-livechat-ws-s2s-instance-url"] = instance_url;
	};
	properties["url"] = remote_ws_proxy_conf["url"];
	return properties;
end

function module.add_host(module)
	module:hook("discover-websocket-s2s", discover_websocket_s2s, -9);
end

if require"core.modulemanager".get_modules_for_host("*"):contains(module.name) then
	module:add_host();
end
