-- SPDX-FileCopyrightText: Prosody Modules <https://hg.prosody.im/prosody-modules>
-- SPDX-License-Identifier: MIT

module:set_global();

local jid_bare, jid_host = require "util.jid".bare, require "util.jid".host;
local st = require "util.stanza";
local xmlns_muc_user = "http://jabber.org/protocol/muc#user";

local trusted_services = module:get_option_inherited_set("muc_ban_ip_trusted_services", {});
local trust_local_restricted_services = module:get_option_boolean("muc_ban_ip_trust_local_restricted_services", true);

local ip_bans = module:shared("bans");
local full_sessions = prosody.full_sessions;

local function is_local_restricted_service(host)
	local muc_service = prosody.hosts[host] and prosody.hosts[host].modules.muc;
	if muc_service and module:context(host):get_option("restrict_room_creation") ~= nil then -- COMPAT: May need updating post-0.12
		return true;
	end
	return false;
end

local function ban_ip(session, from)
	local ip = session.ip;
	if not ip then
		module:log("warn", "Failed to ban IP (IP unknown) for %s", session.full_jid);
		return;
	end
	local from_host = jid_host(from);
	if trusted_services:contains(from_host) or (trust_local_restricted_services and is_local_restricted_service(from_host)) then
		from = from_host; -- Ban from entire host
	end
	local banned_from = ip_bans[ip];
	if not banned_from then
		banned_from = {};
		ip_bans[ip] = banned_from;
	end
	banned_from[from] = true;
	-- Specific to peertube-plugin-livechat: log level=info.
	module:log("info", "Added ban for IP address %s from %s", ip, from);
end

local function check_for_incoming_ban(event)
	local stanza = event.stanza;
	local to_session = full_sessions[stanza.attr.to];
	if to_session then
		local directed = to_session.directed;
		local from = stanza.attr.from;
		if directed and directed[from] and stanza.attr.type == "unavailable" then
			-- This is a stanza from somewhere we sent directed presence to (may be a MUC)
			local x = stanza:get_child("x", xmlns_muc_user);
			if x then
				for status in x:childtags("status") do
					if status.attr.code == '301' then
						ban_ip(to_session, jid_bare(from));
					end
				end
			end
		end
	end
end

local function check_for_ban(event)
	local origin, stanza = event.origin, event.stanza;
	local ip = origin.ip;
	local to, to_host = jid_bare(stanza.attr.to), jid_host(stanza.attr.to);
	if ip_bans[ip] and (ip_bans[ip][to] or ip_bans[ip][to_host]) then
		(origin.log or module._log)("debug", "IP banned: %s is banned from %s", ip, to)
		if stanza.attr.type ~= "error" then
			origin.send(st.error_reply(stanza, "auth", "forbidden")
				:tag("x", { xmlns = xmlns_muc_user })
					:tag("status", { code = '301' }));
		end
		return true;
	end
	(origin.log or module._log)("debug", "IP not banned: %s from %s", ip, to)
end

function module.add_host(module)
	module:hook("presence/full", check_for_incoming_ban, 100);
	module:hook("pre-presence/full", check_for_ban, 100);
end
