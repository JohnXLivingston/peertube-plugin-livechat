-- mod_muc_moderation
--
-- Copyright (C) 2015-2020 Kim Alvefur
--
-- This file is MIT licensed.
--
-- Implements: XEP-0425: Message Moderation
--
-- Imports
local dt = require "util.datetime";
local id = require "util.id";
local jid = require "util.jid";
local st = require "util.stanza";

-- Plugin dependencies
local mod_muc = module:depends "muc";

local muc_util = module:require "muc/util";
local valid_roles = muc_util.valid_roles;

local muc_log_archive = module:open_store("muc_log", "archive");

if not muc_log_archive.set then
	module:log("warn", "Selected archive storage module does not support message replacement, no tombstones will be saved");
end

-- Namespaces
local xmlns_fasten = "urn:xmpp:fasten:0";
local xmlns_moderate = "urn:xmpp:message-moderate:0";
local xmlns_retract = "urn:xmpp:message-retract:0";

-- Discovering support
module:hook("muc-disco#info", function (event)
	event.reply:tag("feature", { var = xmlns_moderate }):up();
end);

-- Main handling
module:hook("iq-set/bare/" .. xmlns_fasten .. ":apply-to", function (event)
	local stanza, origin = event.stanza, event.origin;

	-- Collect info we need
	local apply_to = stanza.tags[1];
	local moderate_tag = apply_to:get_child("moderate", xmlns_moderate);
	if not moderate_tag then return end -- some other kind of fastening?

	local reason = moderate_tag:get_child_text("reason");

	local room_jid = stanza.attr.to;
	local room_node = jid.split(room_jid);
	local room = mod_muc.get_room_from_jid(room_jid);

	local stanza_id = apply_to.attr.id;

	-- Permissions
	local actor = stanza.attr.from;
	local actor_nick = room:get_occupant_jid(actor);
	local affiliation = room:get_affiliation(actor);
	local role = room:get_role(actor_nick) or room:get_default_role(affiliation);
	if valid_roles[role or "none"] < valid_roles.moderator then
		origin.send(st.error_reply(stanza, "auth", "forbidden", "You need a role of at least 'moderator'"));
		return true;
	end

	-- Original stanza to base tombstone on
	local original, err;
	if muc_log_archive.get then
		original, err = muc_log_archive:get(room_node, stanza_id);
	else
		-- COMPAT missing :get API
		err = "item-not-found";
		for i, item in muc_log_archive:find(room_node, { key = stanza_id, limit = 1 }) do
			if i == stanza_id then
				original, err = item, nil;
			end
		end
	end
	if not original then
		if err == "item-not-found" then
			origin.send(st.error_reply(stanza, "modify", "item-not-found"));
		else
			origin.send(st.error_reply(stanza, "wait", "internal-server-error"));
		end
		return true;
	end

	-- Replacements
	local tombstone = st.message({ from = original.attr.from, type = "groupchat", id = original.attr.id })
		:tag("moderated", { xmlns = xmlns_moderate, by = actor_nick })
			:tag("retracted", { xmlns = xmlns_retract, stamp = dt.datetime() }):up();

	local announcement = st.message({ from = room_jid, type = "groupchat", id = id.medium(), })
		:tag("apply-to", { xmlns = xmlns_fasten, id = stanza_id })
			:tag("moderated", { xmlns = xmlns_moderate, by = actor_nick })
			:tag("retract", { xmlns = xmlns_retract }):up();

	if reason then
		tombstone:text_tag("reason", reason);
		announcement:text_tag("reason", reason);
	end

	if muc_log_archive.set then
		-- Tombstone
		local was_replaced = muc_log_archive:set(room_node, stanza_id, tombstone);
		if not was_replaced then
			origin.send(st.error_reply(stanza, "wait", "internal-server-error"));
			return true;
		end
	end

	-- Done, tell people about it
	module:log("info", "Message with id '%s' in room %s moderated by %s, reason: %s", stanza_id, room_jid, actor, reason);
	room:broadcast_message(announcement);

	origin.send(st.reply(stanza));
	return true;
end);

module:hook("muc-message-is-historic", function (event)
	-- Ensure moderation messages are stored
	if event.stanza.attr.from == event.room.jid then
		return event.stanza:get_child("apply-to", xmlns_fasten);
	end
end, 1);
