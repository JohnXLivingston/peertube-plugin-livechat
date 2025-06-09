-- SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
--
-- SPDX-License-Identifier: AGPL-3.0-only

module:set_global();

local path = require "util.paths";
local json = require "util.json";

local server_infos_dir = assert(module:get_option_string("peertubelivechat_server_infos_path", nil), "'peertubelivechat_server_infos_path' is a required option");
local current_instance_url = assert(module:get_option_string("peertubelivechat_instance_url", nil), "'peertubelivechat_instance_url' is a required option");
local no_outgoing_directs2s_to_peertube = module:get_option_boolean("s2s_peertubelivechat_no_outgoing_directs2s_to_peertube");

function discover_websocket_s2s(event)
	local to_host = event.to_host;
  module:log("debug", "Searching websocket s2s for remote host %s", to_host);

	if not no_outgoing_directs2s_to_peertube then
		local f_s2s = io.open(path.join(server_infos_dir, to_host, 's2s'), "r");
		if f_s2s ~= nil then
			io.close(f_s2s);
			module:log("debug", "Remote host is a known Peertube %s that has s2s activated, we will let legacy s2s module handle the connection", to_host);
			return;
		end
	end

	local f_ws_proxy = io.open(path.join(server_infos_dir, to_host, 'ws-s2s'), "r");
	if f_ws_proxy == nil then
		module:log("debug", "Remote host %s is not a known remote Peertube, we will let legacy s2s module handle the connection", to_host);
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
		["peertube-livechat-ws-s2s-instance-url"] = current_instance_url;
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
