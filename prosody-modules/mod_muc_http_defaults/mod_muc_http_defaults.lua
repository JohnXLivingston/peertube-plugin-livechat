-- SPDX-FileCopyrightText: 2021 Kim Alvefur
-- SPDX-FileCopyrightText: 2024-2025 John Livingston
--
-- SPDX-License-Identifier: MIT
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This version contains a modification to take into account new config options:
-- * "slow_mode_duration"
-- * "mute_anonymous"
-- * "moderation_delay"
-- * "anonymize_moderation_actions"
-- * "livechat_emoji_only"
-- * "livechat_custom_emoji_regexp"
-- * "livechat_muc_terms"
-- These options are introduced in the Peertube livechat plugin.
--
-- The "slow_mode_duration" comes with mod_muc_slow_mode.
-- There will be a XEP proposal for this one. When done, these modifications will be submitted to the mod_muc_http_defaults maintainer.
--
-- The "moderation_delay" comes with mod_muc_moderation_delay
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

		-- specific to peertube-plugin-livechat:
		if (type(config.slow_mode_duration) == "number") and config.slow_mode_duration >= 0 then
			room._data.slow_mode_duration = config.slow_mode_duration;
		end
		if (type(config.moderation_delay) == "number") and config.moderation_delay >= 0 then
			room._data.moderation_delay = config.moderation_delay;
		end
		if (type(config.mute_anonymous) == "boolean") then
			room._data.x_peertubelivechat_mute_anonymous = config.mute_anonymous;
		end
		if (type(config.livechat_emoji_only) == "boolean") then
			room._data.x_peertubelivechat_emoji_only_mode = config.livechat_emoji_only;
		end
		if (type(config.livechat_custom_emoji_regexp) == "string" and config.livechat_custom_emoji_regexp ~= "") then
			room._data.x_peertubelivechat_custom_emoji_regexp = config.livechat_custom_emoji_regexp;
		end
		if (type(config.livechat_muc_terms) == "string") then
			-- we don't need to use set_muc_terms here, as this is called for a newly created room
			-- (and thus we don't need to broadcast changes)
			room._data.livechat_muc_terms = config.livechat_muc_terms;
		end
		if (type(config.anonymize_moderation_actions) == "boolean") then
			room._data.anonymize_moderation_actions = config.anonymize_moderation_actions;
		end
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
