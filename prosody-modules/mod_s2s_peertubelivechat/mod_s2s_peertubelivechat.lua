module:set_global();

-- module:depends("s2s");

local path = require "util.paths";
local json = require "util.json";
-- local st = require "util.stanza";
-- local websocket = require "net.websocket";
-- local server = require "net.server".addclient;
-- local add_filter = require "util.filters".add_filter;
-- local s2s_new_outgoing = require "core.s2smanager".new_outgoing;
-- local s2s_destroy_session = require "core.s2smanager".destroy_session;
-- local bounce_sendq = module:depends "s2s".route_to_new_session.bounce_sendq;
-- local portmanager = require "core.portmanager";
-- local initialize_filters = require "util.filters".initialize;

local server_infos_dir = assert(module:get_option_string("peertubelivechat_server_infos_path", nil), "'peertubelivechat_server_infos_path' is a required option");
local instance_url = assert(module:get_option_string("peertubelivechat_instance_url", nil), "'peertubelivechat_instance_url' is a required option");

-- local stanza_size_limit = module:get_option_number("s2s_stanza_size_limit", 1024 * 512);
-- local frame_buffer_limit = module:get_option_number("websocket_frame_buffer_limit", 2 * stanza_size_limit);
-- local frame_fragment_limit = module:get_option_number("websocket_frame_fragment_limit", 8);

-- local sessions = module:shared("sessions");

-- -- The proxy_listener handles connection while still connecting to the remote websocket server,
-- -- then it hands them over to the normal listener (in mod_s2s)
-- local proxy_listener = { default_port = nil, default_mode = "*a", default_interface = "*" };

-- function proxy_listener.onconnect(conn, ws)
-- 	local session = sessions[conn];

-- 	-- Now the real s2s listener can take over the connection.
-- 	local listener = portmanager.get_service("s2s").listener;

-- 	local log = session.log;

-- 	local function websocket_close(code, message)
-- 		conn:write(build_close(code, message));
-- 		conn:close();
-- 	end
-- 	local function websocket_handle_error(session, code, message)
-- 		if code == 1009 then -- stanza size limit exceeded
-- 			-- we close the session, rather than the connection,
-- 			-- otherwise a resuming client will simply resend the
-- 			-- offending stanza
-- 			session:close({ condition = "policy-violation", text = "stanza too large" });
-- 		else
-- 			websocket_close(code, message);
-- 		end
-- 	end

-- 	initialize_filters(session);
-- 	local frameBuffer = dbuffer.new(frame_buffer_limit, frame_fragment_limit);
-- 	add_filter(session, "bytes/in", function(data)
-- 		if not frameBuffer:write(data) then
-- 			session.log("warn", "websocket frame buffer full - terminating session");
-- 			session:close({ condition = "resource-constraint", text = "frame buffer exceeded" });
-- 			return;
-- 		end

-- 		local cache = {};
-- 		local frame, length, partial = parse_frame(frameBuffer);

-- 		while frame do
-- 			frameBuffer:discard(length);
-- 			local result, err_status, err_text = handle_frame(frame);
-- 			if not result then
-- 				websocket_handle_error(session, err_status, err_text);
-- 				break;
-- 			end
-- 			cache[#cache+1] = filter_open_close(result);
-- 			frame, length, partial = parse_frame(frameBuffer);
-- 		end

-- 		if partial then
-- 			-- The header of the next frame is already in the buffer, run
-- 			-- some early validation here
-- 			local frame_ok, err_status, err_text = validate_frame(partial, stanza_size_limit);
-- 			if not frame_ok then
-- 				websocket_handle_error(session, err_status, err_text);
-- 			end
-- 		end

-- 		return t_concat(cache, "");
-- 	end);

-- 	add_filter(session, "stanzas/out", function(stanza)
-- 		stanza = st.clone(stanza);
-- 		local attr = stanza.attr;
-- 		attr.xmlns = attr.xmlns or xmlns_client;
-- 		if stanza.name:find("^stream:") then
-- 			attr["xmlns:stream"] = attr["xmlns:stream"] or xmlns_streams;
-- 		end
-- 		return stanza;
-- 	end, -1000);

-- 	add_filter(session, "bytes/out", function(data)
-- 		return build_frame({ FIN = true, opcode = 0x01, data = tostring(data)});
-- 	end);
-- 	local filter = session.filters;

-- 	session.version = 1;

-- 	session.sends2s = function (t)
-- 		log("debug", "sending (s2s over proxy): %s", (t.top_tag and t:top_tag()) or t:match("^[^>]*>?"));
-- 		if t.name then
-- 			t = filter("stanzas/out", t);
-- 		end
-- 		if t then
-- 			t = filter("bytes/out", tostring(t));
-- 			if t then
-- 				return conn:write(tostring(t));
-- 			end
-- 		end
-- 	end

-- 	session.open_stream = function ()
-- 		session.sends2s(st.stanza("stream:stream", {
-- 			xmlns='jabber:server', ["xmlns:db"]='jabber:server:dialback',
-- 			["xmlns:stream"]='http://etherx.jabber.org/streams',
-- 			from=session.from_host, to=session.to_host, version='1.0', ["xml:lang"]='en'}):top_tag());
-- 	end

-- 	conn.setlistener(conn, listener);

-- 	listener.register_outgoing(conn, session);

-- 	listener.onconnect(conn);
-- end

-- function proxy_listener.register_outgoing(conn, session)
-- 	session.direction = "outgoing";
-- 	sessions[conn] = session;
-- end

-- function proxy_listener.ondisconnect(conn, err)
-- 	sessions[conn]  = nil;
-- end

function discover_websocket_s2s(event)
	local to_host = event.to_host;
  module:log("debug", "Searching websocket s2s for remote host %s", to_host);

	local f_s2s = io.open(path.join(server_infos_dir, to_host, 's2s'), "r");
	if f_s2s ~= nil then
		io.close(f_s2s);
		module.log("debug", "Remote host is a known Peertube %s that has s2s activated, we will let legacy s2s module handle the connection", to_host);
		return;
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
		["peertube-livechat-ws-s2s-instance-url"] = instance_url;
	};
	properties["url"] = remote_ws_proxy_conf["url"];
	return properties;



	-- local host_session = s2s_new_outgoing(from_host, to_host);

	-- -- Store in buffer
	-- host_session.bounce_sendq = bounce_sendq;
	-- host_session.sendq = { {tostring(stanza), stanza.attr.type ~= "error" and stanza.attr.type ~= "result" and st.reply(stanza)} };
	-- host_session.log("debug", "stanza [%s] queued until connection complete", tostring(stanza.name));

	-- local ex = {};
	-- ex.headers = {
	-- 	["peertube-livechat-ws-s2s-instance-url"] = instance_url;
	-- 	["sec_websocket_protocol"] = 'xmpp';
	-- }

	-- local ws_listeners = {};
	-- ws_listeners.onopen = function ()
	-- 	local conn = self.conn;
	-- 	module:log("debug", "Websocket s2s connection is open, attaching it to the session.");
	-- 	host_session.conn = conn;
	-- end
	-- ws_listeners.onclose = function (code, message)
	-- 	module:log("debug", "Closing websocket connection for host %s with code '%s' and message '%s'", to_host, json.encode(code), json.encode(message));
	-- 	s2s_destroy_session(host_session, 'websocket-proxy-connection-closed');
	-- end
	-- ws_listeners.onerror = function (code)
	-- 	module:log("debug", "Error on websocket connection for host %s: '%s'", to_host, json.encode(code));
	-- 	s2s_destroy_session(host_session, 'websocket-proxy-connection-error');
	-- end
	-- ws_listeners.onmessage = function (data, data_type)
	-- 	module:log("debug", "Receiving %s data for host %s", tostring(data_type), to_host);
	-- 	-- TODO ...
	-- end

	-- module:log("debug", "Starting the websocket connection process");
	-- local ws_connection = websocket.connect(remote_ws_proxy_conf['url'], ex, ws_listeners);

	-- -- local conn = addclient(to_host, nil, proxy_listener, "*a");
	-- -- proxy_listener.register_outgoing(conn, host_session);
	-- -- host_session.conn = conn;

	-- return true;

	-- local inject = injected and injected[to_host];
	-- if not inject then return end
	-- module:log("debug", "opening a new outgoing connection for this stanza");
	-- local host_session = new_outgoing(from_host, to_host);

	-- -- Store in buffer
	-- host_session.bounce_sendq = bounce_sendq;
	-- host_session.sendq = { {tostring(stanza), stanza.attr.type ~= "error" and stanza.attr.type ~= "result" and st.reply(stanza)} };
	-- host_session.log("debug", "stanza [%s] queued until connection complete", tostring(stanza.name));

	-- local host, port = inject[1] or inject, tonumber(inject[2]) or 5269;

	-- local conn = addclient(host, port, proxy_listener, "*a");

	-- proxy_listener.register_outgoing(conn, host_session);

	-- host_session.conn = conn;
	-- return true;
end

function module.add_host(module)
	module:hook("discover-websocket-s2s", discover_websocket_s2s, -9);
end

if require"core.modulemanager".get_modules_for_host("*"):contains(module.name) then
	module:add_host();
end
