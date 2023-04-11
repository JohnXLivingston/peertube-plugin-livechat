-- Copyright (C) 2021 Kim Alvefur
--
-- This file is MIT licensed. Please see the
-- COPYING file in the source package for more information.
--

local http = require "net.http";
local async = require "util.async";
local uh = require "util.http";
local jid = require "util.jid";
local json = require "util.json";
local st = require "util.stanza";

local funcs = {jid_bare = jid.bare; jid_host = jid.host; jid_node = jid.node};
local render = require"util.interpolation".new("%b{}", uh.urlencode, funcs);

module:depends"muc";

local url_template = assert(module:get_option_string("muc_create_api_url", nil), "'muc_create_api_url' is a required option");
local apiauth = module:get_option_string("muc_create_api_auth", nil);

local ex = {
	headers = {
		accept = "application/json";
		authorization = apiauth;
	}
};

local problems = {
		format = "API server returned invalid data, see logs",
		config = "A problem occured while creating the room, see logs",
};

local function apply_config(room, settings)
	local affiliations = settings.affiliations;
	if type(affiliations) == "table" then

		-- COMPAT the room creator is unconditionally made 'owner'
		-- clear existing affiliation
		for existing_affiliation in pairs(room._affiliations) do
			room:set_affiliation(true, existing_affiliation, "none");
		end

		if affiliations[1] ~= nil then -- array of ( jid, affiliation, nick )
			for _, aff in ipairs(affiliations) do
				if type(aff) == "table" and type(aff.jid) == "string" and (aff.nick == nil or type(aff.nick) == "string") then
					local prepped_jid = jid.prep(aff.jid);
					if prepped_jid then
						local ok, err = room:set_affiliation(true, prepped_jid, aff.affiliation, aff.nick and { nick = aff.nick });
						if not ok then
							module:log("error", "Could not set affiliation in %s: %s", room.jid, err);
							return nil, "config";
						end
					else
						module:log("error", "Invalid JID returned from API for %s: %q", room.jid, aff.jid);
						return nil, "format";
					end
				else
					module:log("error", "Invalid affiliation item returned from API for %s: %q", room.jid, aff);
					return nil, "format";
				end
			end
		else -- map of jid : affiliation
			for user_jid, aff in pairs(affiliations) do
				if type(user_jid) == "string" and type(aff) == "string" then
					local prepped_jid = jid.prep(user_jid);
					if prepped_jid then
						local ok, err = room:set_affiliation(true, prepped_jid, aff);
						if not ok then
							module:log("error", "Could not set affiliation in %s: %s", room.jid, err);
							return nil, "config";
						end
					else
						module:log("error", "Invalid JID returned from API: %q", aff.jid);
						return nil, "format";
					end
				end
			end
		end
	elseif affiliations ~= nil then
		module:log("error", "Invalid affiliations returned from API for %s: %q", room.jid, affiliations);
		return nil, "format", { field = "affiliations" };
	end

	local config = settings.config;
	if type(config) == "table" then
		-- TODO reject invalid fields instead of ignoring them
		if type(config.name) == "string" then room:set_name(config.name); end
		if type(config.description) == "string" then room:set_description(config.description); end
		if type(config.language) == "string" then room:set_language(config.language); end
		if type(config.password) == "string" then room:set_password(config.password); end
		if type(config.subject) == "string" then room:set_subject(room.jid, config.subject); end

		if type(config.public) == "boolean" then room:set_public(config.public); end
		if type(config.members_only) == "boolean" then room:set_members_only(config.members_only); end
		if type(config.allow_member_invites) == "boolean" then room:set_allow_member_invites(config.allow_member_invites); end
		if type(config.moderated) == "boolean" then room:set_moderated(config.moderated); end
		if type(config.persistent) == "boolean" then room:set_persistent(config.persistent); end
		if type(config.changesubject) == "boolean" then room:set_changesubject(config.changesubject); end

		if type(config.historylength) == "number" then room:set_historylength(config.historylength); end
		if type(config.public_jids) == "boolean" then room:set_whois(config.public_jids and "anyone" or "moderators"); end
		-- Leaving out presence_broadcast for now

		-- mod_muc_mam
		if type(config.archiving) == "boolean" then room._config.archiving = config.archiving; end
	elseif config ~= nil then
		module:log("error", "Invalid config returned from API for %s: %q", room.jid, config);
		return nil, "format", { field = "config" };
	end
	return true;
end

module:hook("muc-room-pre-create", function(event)
	local url = render(url_template, event);
	module:log("debug", "Calling API at %q for room %s", url, event.room.jid);
	local wait, done = async.waiter();

	local ret, err;
	http.request(url, ex, function (body, code)
		if math.floor(code / 100) == 2 then
			local parsed, parse_err = json.decode(body);
			if not parsed then
				module:log("debug", "Got invalid JSON from %s: %s", url, parse_err);
				err = problems.format;
			else
				ret = parsed;
			end
		else
			module:log("debug", "Rejected by API: ", body);
			err = "Rejected by API";
		end

		done()
	end);

	wait();
	if not ret then
		event.room:destroy();
		event.origin.send(st.error_reply(event.stanza, "cancel", "internal-server-error", err, module.host));
		return true;
	end

	local configured, err = apply_config(event.room, ret);
	if not configured then
		event.room:destroy();
		event.origin.send(st.error_reply(event.stanza, "cancel", "internal-server-error", err, event.room.jid or module.host));
		return true;
	end
end, -2);
