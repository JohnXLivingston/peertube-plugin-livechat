-- Prosody IM
-- Copyright (C) 2012-2014 Florian Zeitz
-- Copyright (C) 2023 John Livingston
-- Copied from original Prosody mod_websocket module (MIT/X11 licensed). Provided with Peertube Livechat plugin (AGPL-v3).

module:set_global();

local add_task = require "util.timer".add_task;
local add_filter = require "util.filters".add_filter;
local sha1 = require "util.hashes".sha1;
local base64 = require "util.encodings".base64.encode;
local st = require "util.stanza";
local parse_xml = require "util.xml".parse;
local contains_token = require "util.http".contains_token;
local portmanager = require "core.portmanager";
local s2s_new_outgoing = require "core.s2smanager".new_outgoing;
local s2s_destroy_session = require "core.s2smanager".destroy_session;
local log = module._log;
local dbuffer = require "util.dbuffer";
local new_id = require "util.id".short;

local websocket = require "net.websocket";
local websocket_frames = require"net.websocket.frames";
local parse_frame = websocket_frames.parse;
local build_frame = websocket_frames.build;
local build_close = websocket_frames.build_close;
local parse_close = websocket_frames.parse_close;

local t_concat = table.concat;

local stanza_size_limit = module:get_option_number("s2s_stanza_size_limit", 1024 * 512);
local frame_buffer_limit = module:get_option_number("websocket_frame_buffer_limit", 2 * stanza_size_limit);
local frame_fragment_limit = module:get_option_number("websocket_frame_fragment_limit", 8);
local stream_close_timeout = module:get_option_number("s2s_close_timeout", 5);
local consider_websocket_secure = module:get_option_boolean("consider_websocket_secure");

local xmlns_framing = "urn:ietf:params:xml:ns:xmpp-framing-server";
local xmlns_streams = "http://etherx.jabber.org/streams";
local xmlns_server = "jabber:server";
local stream_xmlns_attr = {xmlns='urn:ietf:params:xml:ns:xmpp-streams'};

module:depends("s2s")
local bounce_sendq = module:depends "s2s".route_to_new_session.bounce_sendq;

local sessions = module:shared("s2s/sessions");
local s2s_listener = portmanager.get_service("s2s").listener;

--- Session methods
local function session_open_stream(session, from, to)
	local log = session.log or log;
	log("debug", "Opening stream from %s to %to.", from, to);
	local attr = {
		xmlns = xmlns_framing,
		["xml:lang"] = "en",
		version = "1.0",
		id = session.streamid or "",
		from = from or session.host, to = to,
	};
	if session.stream_attrs then
		session:stream_attrs(from, to, attr)
	end
	session.sends2s(st.stanza("open", attr));
end

local function session_close(session, reason)
	local log = session.log or log;
	log("debug", "Closing session...");
	local close_event_payload = { session = session, reason = reason };
	module:context(session.host):fire_event("pre-session-close", close_event_payload);
	reason = close_event_payload.reason;
	if session.conn then
		if session.notopen then
			session:open_stream();
		end
		if reason then -- nil == no err, initiated by us, false == initiated by client
			local stream_error = st.stanza("stream:error");
			if type(reason) == "string" then -- assume stream error
				stream_error:tag(reason, {xmlns = 'urn:ietf:params:xml:ns:xmpp-streams' });
			elseif st.is_stanza(reason) then
				stream_error = reason;
			elseif type(reason) == "table" then
				if reason.condition then
					stream_error:tag(reason.condition, stream_xmlns_attr):up();
					if reason.text then
						stream_error:tag("text", stream_xmlns_attr):text(reason.text):up();
					end
					if reason.extra then
						stream_error:add_child(reason.extra);
					end
				end
			end
			log("debug", "Disconnecting s2s websocket server, <stream:error> is: %s", stream_error);
			session.sends2s(stream_error);
		end

		session.sends2s(st.stanza("close", { xmlns = xmlns_framing }));
		function session.sends2s() return false; end

		-- luacheck: ignore 422/reason
		-- FIXME reason should be handled in common place
		local reason = (reason and (reason.name or reason.text or reason.condition)) or reason;
		session.log("debug", "s2s stream for %s closed: %s", session.full_jid or ("<"..session.ip..">"), reason or "session closed");

		-- Authenticated incoming stream may still be sending us stanzas, so wait for </stream:stream> from remote
		local conn = session.conn;
		if reason == nil and not session.notopen and session.type == "s2s" then
			-- Grace time to process data from authenticated cleanly-closed stream
			add_task(stream_close_timeout, function ()
				if not session.destroyed then
					session.log("warn", "Failed to receive a stream close response, closing connection anyway...");
					s2s_destroy_session(session, reason);
					conn:write(build_close(1000, "Stream closed"));
					conn:close();
				end
			end);
		else
			s2s_destroy_session(session, reason);
			conn:write(build_close(1000, "Stream closed"));
			conn:close();
		end
	end
end


--- Filters
local function filter_open_close(data)
	if not data:find(xmlns_framing, 1, true) then return data; end

	local oc = parse_xml(data);
	if not oc then return data; end
	if oc.attr.xmlns ~= xmlns_framing then return data; end
	if oc.name == "close" then return "</stream:stream>"; end
	if oc.name == "open" then
		oc.name = "stream:stream";
		oc.attr.xmlns = nil;
		oc.attr["xmlns:stream"] = xmlns_streams;
		return oc:top_tag();
	end

	return data;
end

local default_get_response_text = "It works!"
local websocket_get_response_text = module:get_option_string("websocket_get_response_text", default_get_response_text)

local default_get_response_body = [[<!DOCTYPE html><html><head><title>Websocket</title></head><body>
<p>]]..websocket_get_response_text..[[</p>
</body></html>]]
local websocket_get_response_body = module:get_option_string("websocket_get_response_body", default_get_response_body)

local function validate_frame(frame, max_length)
	local opcode, length = frame.opcode, frame.length;

	if max_length and length > max_length then
		return false, 1009, "Payload too large";
	end

	-- Error cases
	if frame.RSV1 or frame.RSV2 or frame.RSV3 then -- Reserved bits non zero
		return false, 1002, "Reserved bits not zero";
	end

	if opcode == 0x8 and frame.data then -- close frame
		if length == 1 then
			return false, 1002, "Close frame with payload, but too short for status code";
		elseif length >= 2 then
			local status_code = parse_close(frame.data)
			if status_code < 1000 then
				return false, 1002, "Closed with invalid status code";
			elseif ((status_code > 1003 and status_code < 1007) or status_code > 1011) and status_code < 3000 then
				return false, 1002, "Closed with reserved status code";
			end
		end
	end

	if opcode >= 0x8 then
		if length > 125 then -- Control frame with too much payload
			return false, 1002, "Payload too large";
		end

		if not frame.FIN then -- Fragmented control frame
			return false, 1002, "Fragmented control frame";
		end
	end

	if (opcode > 0x2 and opcode < 0x8) or (opcode > 0xA) then
		return false, 1002, "Reserved opcode";
	end

	-- Check opcode
	if opcode == 0x2 then -- Binary frame
		return false, 1003, "Only text frames are supported, RFC 7395 3.2";
	elseif opcode == 0x8 then -- Close request
		return false, 1000, "Goodbye";
	end

	-- Other (XMPP-specific) validity checks
	if not frame.FIN then
		return false, 1003, "Continuation frames are not supported, RFC 7395 3.3.3";
	end
	if opcode == 0x01 and frame.data and frame.data:byte(1, 1) ~= 60 then
		return false, 1007, "Invalid payload start character, RFC 7395 3.3.3";
	end

	return true;
end

local function wrap_websocket(session, conn)
	local log = session.log or log;
	log("Debug", "Calling wrap_websocket");

	local function websocket_close(code, message)
		log("debug", "Websocket close, writing a build_close frame");
		conn:write(build_close(code, message));
		conn:close();
	end

	local function websocket_handle_error(session, code, message)
		log("debug", "handling an error");
		if code == 1009 then -- stanza size limit exceeded
			-- we close the session, rather than the connection,
			-- otherwise a resuming client will simply resend the
			-- offending stanza
			session:close({ condition = "policy-violation", text = "stanza too large" });
		else
			websocket_close(code, message);
		end
	end

	local function handle_frame(frame)
		log("debug", "Websocket received frame: opcode=%0x, %i bytes", frame.opcode, #frame.data);

		-- Check frame makes sense
		local frame_ok, err_status, err_text = validate_frame(frame, stanza_size_limit);
		if not frame_ok then
			return frame_ok, err_status, err_text;
		end

		local opcode = frame.opcode;
		if opcode == 0x9 then -- Ping frame
			frame.opcode = 0xA;
			frame.MASK = false; -- Clients send masked frames, servers don't, see #1484
			conn:write(build_frame(frame));
			return "";
		elseif opcode == 0xA then -- Pong frame, MAY be sent unsolicited, eg as keepalive
			return "";
		elseif opcode ~= 0x1 then -- Not text frame (which is all we support)
			log("warn", "Received frame with unsupported opcode %i", opcode);
			return "";
		end

		return frame.data;
	end
	
	local frameBuffer = dbuffer.new(frame_buffer_limit, frame_fragment_limit);
	add_filter(session, "bytes/in", function(data)
		log("debug", "Calling the bytes/in filter");

		if not frameBuffer:write(data) then
			log("warn", "websocket frame buffer full - terminating session");
			session:close({ condition = "resource-constraint", text = "frame buffer exceeded" });
			return;
		end

		local cache = {};
		local frame, length, partial = parse_frame(frameBuffer);

		while frame do
			frameBuffer:discard(length);
			local result, err_status, err_text = handle_frame(frame);
			if not result then
				websocket_handle_error(session, err_status, err_text);
				break;
			end
			cache[#cache+1] = filter_open_close(result);
			frame, length, partial = parse_frame(frameBuffer);
		end

		if partial then
			-- The header of the next frame is already in the buffer, run
			-- some early validation here
			local frame_ok, err_status, err_text = validate_frame(partial, stanza_size_limit);
			if not frame_ok then
				websocket_handle_error(session, err_status, err_text);
			end
		end

		return t_concat(cache, "");
	end);

	add_filter(session, "stanzas/out", function(stanza)
		log("debug", "Calling the stanzas/out filter");

		stanza = st.clone(stanza);
		local attr = stanza.attr;
		attr.xmlns = attr.xmlns or xmlns_server;
		if stanza.name:find("^stream:") then
			attr["xmlns:stream"] = attr["xmlns:stream"] or xmlns_streams;
		end
		return stanza;
	end, -1000);

	add_filter(session, "bytes/out", function(data)
		log("debug", "Calling the bytes/out filter");
		return build_frame({ FIN = true, opcode = 0x01, data = tostring(data)});
	end);
end

function handle_request(event)
	local request, response = event.request, event.response;
	local conn = response.conn;

	conn.starttls = false; -- Prevent mod_tls from believing starttls can be done

	if not request.headers.sec_websocket_key or request.method ~= "GET" then
		return module:fire_event("http-message", {
			response = event.response;
			---
			title = "Prosody S2s WebSocket endpoint";
			message = websocket_get_response_text;
			warning = not (consider_websocket_secure or request.secure) and "This endpoint is not considered secure!" or nil;
		}) or websocket_get_response_body;
		end

	local wants_xmpp = contains_token(request.headers.sec_websocket_protocol or "", "xmpp");

	if not wants_xmpp then
		log("debug", "Client didn't want to talk XMPP, list of protocols was %s", request.headers.sec_websocket_protocol or "(empty)");
		return 501;
	end

	conn:setlistener(s2s_listener);
	s2s_listener.onconnect(conn);

	local session = sessions[conn];

	-- Use upstream IP if a HTTP proxy was used
	-- See mod_http and #540
	session.ip = request.ip;

	session.secure = consider_websocket_secure or request.secure or session.secure;
	session.websocket_request = request;

	session.open_stream = session_open_stream;
	session.close = session_close;

	wrap_websocket(session, conn);

	response.status_code = 101;
	response.headers.upgrade = "websocket";
	response.headers.connection = "Upgrade";
	response.headers.sec_webSocket_accept = base64(sha1(request.headers.sec_websocket_key .. "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"));
	response.headers.sec_webSocket_protocol = "xmpp";

	module:fire_event("websocket-session", { session = session, request = request });

	log("debug", "Sending S2S WebSocket handshake");

	return "";
end

local function keepalive(event)
	local session = event.session;
	if session.open_stream == session_open_stream then
		return session.conn:write(build_frame({ opcode = 0x9, FIN = true }));
	end
end

-- OUTGOING CONNECTIONS


-- local pending_ws_connection_methods = {};
-- local pending_ws_connection_mt = {
-- 	__name = "pending_ws_connection";
-- 	__index = pending_ws_connection_methods;
-- 	__tostring = function (p)
-- 		return "<pending websocket connection "..p.id.." to "..tostring(p.data.session.to_host)..">";
-- 	end;
-- };

-- function pending_ws_connection_methods:log(level, message, ...)
-- 	log(level, "[pending connection %s] "..message, self.id, ...);
-- end

-- function pending_ws_connection_methods:onopen()
-- 	self:log("debug", "Pending WS Connection onopen event.");
-- 	local conn = self.conn;
-- 	local session = self.data.session;
-- 	log("debug", "Successfully connected");
-- 	conn:setlistener(s2s_listener);
-- 	s2s_listener.onconnect(conn);
-- 	wrap_websocket(session, conn);
-- end

-- function pending_ws_connection_methods:onclose(code, message)
-- 	self:log("debug", "Pending WS Connection onclose event.");
-- 	-- FIXME/TODO: what can i do??
-- 	-- if p.listeners.onfail then
-- 	-- 	p.listeners.onfail(p.data, p.last_error or "unable to connect to websocket");
-- 	-- end
-- end

-- -- pending_ws_connections_map[ws_connection] = pending_connection
-- local pending_ws_connections_map = {};
-- local pending_ws_connection_listeners = {};

-- function pending_ws_connection_listeners.onopen(ws_connection)
-- 	log("debug", "Pending WS Connection onopen event.");

-- 	local p = pending_ws_connections_map[ws_connection];
-- 	if not p then
-- 		if ws_connection.conn then
-- 			module:log("warn", "Successful connection, but unexpected! Closing.");
-- 			ws_connection.conn:close();
-- 		else
-- 			module:log("error", "Successful connection, but unexpected, and no conn attribute!");
-- 		end
-- 		return;
-- 	end
-- 	pending_ws_connections_map[ws_connection] = nil;
-- 	local conn = ws_connection.conn;
-- 	p:log("debug", "Successfully connected");
-- 	conn:setlistener(p.listeners, p.data);
-- 	p.listeners.onconnect(conn);
-- 	wrap_websocket(session, conn);
-- end

-- function pending_ws_connection_listeners.onclose(ws_connection, reason)
-- 	log("debug", "Pending WS Connection onclose event.");

-- 	local p = pending_ws_connections_map[ws_connection];
-- 	if not p then
-- 		module:log("warn", "Failed connection, but unexpected!");
-- 		return;
-- 	end
-- 	p.last_error = reason or "unknown reason";
-- 	p:log("debug", "Connection attempt failed: %s", p.last_error);
-- 	if p.listeners.onfail then
-- 		p.listeners.onfail(p.data, p.last_error or "unable to connect to websocket");
-- 	end
-- end


-- DIRTY HACK BEGINS: copying net.websocket code... because net.websocket tries to handle incomming data, but we don't want to.
local t_concat = table.concat;

local http = require "net.http";
local frames = require "net.websocket.frames";
local base64 = require "util.encodings".base64;
local sha1 = require "util.hashes".sha1;
local random_bytes = require "util.random".bytes;
local timer = require "util.timer";
local log = require "util.logger".init "websocket";

local close_timeout = 3; -- Seconds to wait after sending close frame until closing connection.

local websockets = {};

local websocket_listeners = {};
function websocket_listeners.ondisconnect(conn, err)
	local s = websockets[conn];
	if not s then return; end
	websockets[conn] = nil;
	if s.close_timer then
		timer.stop(s.close_timer);
		s.close_timer = nil;
	end
	s.readyState = 3;
	if s.close_code == nil and s.onerror then s:onerror(err); end
	if s.onclose then s:onclose(s.close_code, s.close_message or err); end
end

function websocket_listeners.ondetach(conn)
	websockets[conn] = nil;
end

local function fail(s, code, reason)
	log("warn", "WebSocket connection failed, closing. %d %s", code, reason);
	s:close(code, reason);
	s.conn:close();
	return false
end

local websocket_methods = {};
local function close_timeout_cb(now, timerid, s) -- luacheck: ignore 212/now 212/timerid
	s.close_timer = nil;
	log("warn", "Close timeout waiting for server to close, closing manually.");
	s.conn:close();
end
function websocket_methods:close(code, reason)
	if self.readyState < 2 then
		code = code or 1000;
		log("debug", "closing WebSocket with code %i: %s" , code , reason);
		self.readyState = 2;
		local conn = self.conn;
		conn:write(frames.build_close(code, reason, true));
		-- Do not close socket straight away, wait for acknowledgement from server.
		self.close_timer = timer.add_task(close_timeout, close_timeout_cb, self);
	elseif self.readyState == 2 then
		log("debug", "tried to close a closing WebSocket, closing the raw socket.");
		-- Stop timer
		if self.close_timer then
			timer.stop(self.close_timer);
			self.close_timer = nil;
		end
		local conn = self.conn;
		conn:close();
	else
		log("debug", "tried to close a closed WebSocket, ignoring.");
	end
end
function websocket_methods:send(data, opcode)
	if self.readyState < 1 then
		return nil, "WebSocket not open yet, unable to send data.";
	elseif self.readyState >= 2 then
		return nil, "WebSocket closed, unable to send data.";
	end
	if opcode == "text" or opcode == nil then
		opcode = 0x1;
	elseif opcode == "binary" then
		opcode = 0x2;
	end
	local frame = {
		FIN = true;
		MASK = true; -- RFC 6455 6.1.5: If the data is being sent by the client, the frame(s) MUST be masked
		opcode = opcode;
		data = tostring(data);
	};
	log("debug", "WebSocket sending frame: opcode=%0x, %i bytes", frame.opcode, #frame.data);
	return self.conn:write(frames.build(frame));
end

local websocket_metatable = {
	__index = websocket_methods;
};
local function custom_connect(url, ex, listeners)
	ex = ex or {};

	--[[RFC 6455 4.1.7:
		The request MUST include a header field with the name
	|Sec-WebSocket-Key|.  The value of this header field MUST be a
	nonce consisting of a randomly selected 16-byte value that has
	been base64-encoded (see Section 4 of [RFC4648]).  The nonce
	MUST be selected randomly for each connection.
	]]
	local key = base64.encode(random_bytes(16));

	-- Either a single protocol string or an array of protocol strings.
	local protocol = ex.protocol;
	if type(protocol) == "string" then
		protocol = { protocol, [protocol] = true };
	elseif type(protocol) == "table" and protocol[1] then
		for _, v in ipairs(protocol) do
			protocol[v] = true;
		end
	else
		protocol = nil;
	end

	local headers = {
		["Upgrade"] = "websocket";
		["Connection"] = "Upgrade";
		["Sec-WebSocket-Key"] = key;
		["Sec-WebSocket-Protocol"] = protocol and t_concat(protocol, ", ");
		["Sec-WebSocket-Version"] = "13";
		["Sec-WebSocket-Extensions"] = ex.extensions;
	}
	if ex.headers then
		for k,v in pairs(ex.headers) do
			headers[k] = v;
		end
	end

	local s = setmetatable({
		readbuffer = "";
		databuffer = nil;
		conn = nil;
		close_code = nil;
		close_message = nil;
		close_timer = nil;
		readyState = 0;
		protocol = nil;

		url = url;

		onopen = listeners.onopen;
		onclose = listeners.onclose;
		onmessage = listeners.onmessage;
		onerror = listeners.onerror;
	}, websocket_metatable);

	local http_url = url:gsub("^(ws)", "http");
	local http_req = http.request(http_url, { -- luacheck: ignore 211/http_req
		method = "GET";
		headers = headers;
		sslctx = ex.sslctx;
		insecure = ex.insecure;
	}, function(b, c, r, http_req)
		if c ~= 101
		   or r.headers["connection"]:lower() ~= "upgrade"
		   or r.headers["upgrade"] ~= "websocket"
		   or r.headers["sec-websocket-accept"] ~= base64.encode(sha1(key .. "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))
		   or (protocol and not protocol[r.headers["sec-websocket-protocol"]])
		   then
			s.readyState = 3;
			log("warn", "WebSocket connection to %s failed: %s", url, b);
			if s.onerror then s:onerror("connecting-failed"); end
			return;
		end

		s.protocol = r.headers["sec-websocket-protocol"];

		-- Take possession of socket from http
		local conn = http_req.conn;
		http_req.conn = nil;
		s.conn = conn;
		websockets[conn] = s;
		conn:setlistener(websocket_listeners);

		log("debug", "WebSocket connected successfully to %s", url);
		s.readyState = 1;
		if s.onopen then s:onopen(); end
		-- websocket_listeners.onincoming(conn, b);
	end);

	return s;
end
-- DIRTY HACK END

function route_to_new_session(event)
	local from_host, to_host, stanza = event.from_host, event.to_host, event.stanza;
  log("debug", "Trying to route to %s", to_host);

	local ws_properties = module:fire_event("discover-websocket-s2s", { to_host = to_host });
	if not ws_properties then
		log("debug", "No websocket s2s capabilities from remote host %s", to_host);
		return;
	end

	log("debug", "Found a Websocket endpoint for s2s communications to remote host %s", to_host);
	local session = s2s_new_outgoing(from_host, to_host);
	session.version = 1;

	-- Store in buffer
	session.bounce_sendq = bounce_sendq;
	session.sendq = { {tostring(stanza), stanza.attr.type ~= "error" and stanza.attr.type ~= "result" and st.reply(stanza)} };
	session.log("debug", "stanza [%s] queued until connection complete", tostring(stanza.name));

	-- FIXME: this is needed for admin tools to count this connection.
	-- session.websocket_request = request;

	session.open_stream = session_open_stream;
	session.close = session_close;

	local ex = {};
	ex["headers"] = ws_properties.extra_headers or {};
	ex["protocol"] = "xmpp";

	session.log("debug", "Starting the s2s websocket connection process");
	local log = session.log;

	local function onopen(s)
		log("debug", "Outgoing Websocket S2S: Successfully connected");
		local conn = s.conn;
		conn.starttls = false; -- FIXME: it is needed? Prevent mod_tls from believing starttls can be done
		session.conn = conn;
		wrap_websocket(session, conn);
		conn:setlistener(s2s_listener);
		s2s_listener.register_outgoing(conn, session);
		s2s_listener.onconnect(conn);
	end

	local function onclose(s, code, message)
		log("debug", "Pending WS Connection onclose event.");
		-- FIXME: is this ok?
		s2s_destroy_session(session, message or code or "unable to connect to websocket");
	end

	local ws_connection = custom_connect(ws_properties['url'], ex, {
		onopen = onopen;
		onclose = onclose;
	});

	return true;
end

function module.add_host(module)
	module:hook("s2s-read-timeout", keepalive, -0.9);

	module:hook("route/remote", route_to_new_session, -2);

	module:depends("http");
	module:provides("http", {
		name = "websocket";
		default_path = "xmpp-websocket-s2s";
		cors = {
			enabled = true;
		};
		route = {
			["GET"] = handle_request;
			["GET /"] = handle_request;
		};
	});

	module:hook("s2s-read-timeout", keepalive, -0.9);
end

if require"core.modulemanager".get_modules_for_host("*"):contains(module.name) then
	module:add_host();
end
