-- This module create sort of a MEP equivalent to PEP, but for MUC chatrooms.
-- This idea is described in https://xmpp.org/extensions/xep-0316.html
-- but here there are some differences:
-- * there will be several nodes, using MUC JID+NodeID to access them
--	 (see https://xmpp.org/extensions/xep-0060.html#addressing-jid)
-- * nodes can only be subscribed by room admin/owner,
-- * ...

-- Note: all room admin/owner will have 'publisher' access:
-- so they can't modify configuration, affiliations or subscriptions.
-- There will be no owner. FIXME: is this ok? will prosody accept? (the XEP-0060 says that there must be an owner).

-- Implemented nodes:
-- * livechat-tasks: contains tasklist and task items, specific to livechat plugin.

-- There are some other tricks in this module:
-- * no message sent to offline users
-- * unsubscribing users when losing their affiliation

-- TODO: add disco support.

local pubsub = require "util.pubsub";
local jid_bare = require "util.jid".bare;
local jid_split = require "util.jid".split;
local jid_join = require "util.jid".join;
local cache = require "util.cache";
local st = require "util.stanza";
local new_id = require "util.id".medium;
local storagemanager = require "core.storagemanager";
local uuid_generate = require "util.uuid".generate;
local bare_sessions = prosody.bare_sessions;

local xmlns_pubsub = "http://jabber.org/protocol/pubsub";
local xmlns_pubsub_event = "http://jabber.org/protocol/pubsub#event";
local xmlns_pubsub_owner = "http://jabber.org/protocol/pubsub#owner";
local xmlns_tasklist = "urn:peertube-plugin-livechat:tasklist";
local xmlns_task = "urn:peertube-plugin-livechat:task"

local lib_pubsub = module:require "pubsub";

local mod_muc = module:depends"muc";
local get_room_from_jid = mod_muc.get_room_from_jid;

local muc_util = module:require "muc/util";
local valid_roles = muc_util.valid_roles;

-- room_jid => object passed to module:add_items()
local mep_service_items = {};

-- Size of caches with full pubsub service objects
-- We will have one service per MUC room.
local service_cache_size = module:get_option_number("livechat_mep_service_cache_size", 1000);

-- room_jid => util.pubsub service object
local services = cache.new(service_cache_size, function (room_jid, _)
	-- when service is evicted from cache, we must remove the associated item.
	local item = mep_service_items[room_jid];
	mep_service_items[room_jid] = nil;
	if item then
		module:remove_item("livechat-mep-service", item);
	end
end):table();

-- -- size of caches with smaller objects
-- local info_cache_size = module:get_option_number("livechat_mep_info_cache_size", 10000);

-- -- room_jid -> recipient -> set of nodes
-- local recipients = cache.new(info_cache_size):table();


local host = module.host;

-- store for nodes configuration
local node_config = module:open_store("livechat-mep", "map");
-- store for nodes content
local known_nodes = module:open_store("livechat-mep");

-- maximum number of items in a node:
local max_max_items = module:get_option_number("livechat_mep_max_items", 5000);

local function tonumber_max_items(n)
	if n == "max" then
		return max_max_items;
	end
	return tonumber(n);
end

function is_item_stanza(item)
	return st.is_stanza(item) and item.attr.xmlns == xmlns_pubsub and item.name == "item" and #item.tags == 1;
end

-- check_node_config: if someone try to change the node configuration, checks the values.
-- TODO: is this necessary? we should not allow config modification.
function check_node_config(node, actor, new_config)
	if (tonumber_max_items(new_config["max_items"]) or 1) > max_max_items then
		return false;
	end
	if new_config["access_model"] ~= "whitelist" then
		return false;
	end
	return true;
end

-- get the store for a given room nodes.
local function nodestore(room_jid)
	-- luacheck: ignore 212/self
	local store = {};
	function store:get(node)
		local data, err = node_config:get(room_jid, node)
		-- data looks like:
		-- data = {
		--	 name = node;
		--	 config = {};
		--	 subscribers = {};
		--	 affiliations = {};
		-- };
		return data, err;
	end
	function store:set(node, data)
		return node_config:set(room_jid, node, data);
	end
	function store:users() -- iterator over all available keys (see https://prosody.im/doc/developers/moduleapi)
		return pairs(known_nodes:get(room_jid) or {});
	end
	return store;
end

local function simple_itemstore(room_jid)
	local driver = storagemanager.get_driver(module.host, "livechat_mep_data");
	return function (config, node)
		local max_items = tonumber_max_items(config["max_items"]);
		module:log("debug", "Creating new persistent item store for room_jid %s, node %q", room_jid, node);
		local archive = driver:open("livechat_mep_"..node, "archive");
		return lib_pubsub.archive_itemstore(archive, max_items, room_jid, node, false);
	end
end

local function get_broadcaster(room_jid, room_host)
	local function simple_broadcast(kind, node, jids, item, _, node_obj)
		-- module:log("debug", "simple_broadcast call, kind=%q, from %s for node %s", kind, room_jid, node);

		if node_obj then
			if node_obj.config["notify_"..kind] == false then
				return;
			end
		end
		if kind == "retract" then
			kind = "items"; -- XEP-0060 signals retraction in an <items> container
		end
		if item then
			item = st.clone(item);
			item.attr.xmlns = nil; -- Clear the pubsub namespace
			if kind == "items" then
				if node_obj and node_obj.config.include_payload == false then
					item:maptags(function () return nil; end);
				end
			end
		end

		local id = new_id();
		-- FIXME: should we add a type=headline to the message? (this is what mod_pep does,
		-- and it seems that ConverseJS prefer to have it for server messages.)
		local message = st.message({ from = jid_join(room_jid, room_host), type = "headline", id = id })
			:tag("event", { xmlns = xmlns_pubsub_event })
				:tag(kind, { node = node });

		if item then
			message:add_child(item);
		end

		for jid in pairs(jids) do
			module:log("debug", "Sending notification to %s from %s for node %s", jid, room_jid, node);
			message.attr.to = jid;
			module:send(message);
		end
	end
	return simple_broadcast;
end

-- We only broadcast messages to users currently online.
local function get_subscriber_filter(room_jid, room_host)
	return function (jids, node)
		local broadcast_to = {};
		if (room_host ~= host) then;
			return broadcast_to;
		end

		local service = services[room_jid];
		for jid, opts in pairs(jids) do
			local bare_jid = jid_bare(jid);
			if (not bare_sessions[bare_jid]) then
				module:log("debug", "Filtering subscriptions for user %q, as he/she is not currently logged in.", bare_jid);
			else
				broadcast_to[jid] = opts;
			end
		end

		return broadcast_to;
	end
end


-- Read-only service with no nodes where nobody is allowed anything to act as a
-- fallback for interactions with non-existent rooms
local noroom_service = pubsub.new({
	node_defaults = {
		["max_items"] = 1;
		["persist_items"] = false;
		["access_model"] = "whitelist";
		["send_last_published_item"] = "never";
	};
	autocreate_on_publish = false;
	autocreate_on_subscribe = false;
	get_affiliation = function ()
		return "outcast";
	end;
});

function get_mep_service(room_jid, room_host)
	if (room_host ~= host) then
		module:log("debug", "Host %q for room %q is not the current host, returning the noroom service", room_host, room_jid);
		return noroom_service;
	end

	local service = services[room_jid];
	if service then
		return service;
	end

	local room = get_room_from_jid(jid_join(room_jid, room_host));
	if not room then
		module:log("debug", "No room for node %q, returning the noroom service", room_jid);
		return noroom_service;
	end

	module:log("debug", "Creating pubsub service for room %q", room_jid);
	service = pubsub.new({
		livechat_mep_room_jid = room_jid; -- FIXME: what is this for? this was inspired by mod_pep
		node_defaults = {
			["max_items"] = max_max_items;
			["persist_items"] = true;
			["access_model"] = "whitelist";
			["send_last_published_item"] = "never"; -- never send last item, clients will require all items at connection
		};
		max_items = max_max_items;

		autocreate_on_publish = true;
		autocreate_on_subscribe = true;

		nodestore = nodestore(room_jid);
		itemstore = simple_itemstore(room_jid);
		broadcaster = get_broadcaster(room_jid, room_host);
		subscriber_filter = get_subscriber_filter(room_jid, room_host);
		itemcheck = is_item_stanza;
		get_affiliation = function (jid)
			-- module:log("debug", "get_affiliation call for %q", jid);
			-- First checking if there is an affiliation on the room for this JID.
			local actor_bare_jid = jid_bare(jid);
			local room_affiliation = room:get_affiliation(actor_bare_jid);
			-- if user is banned, don't go any further
			if (room_affiliation == "outcast") then
				-- module:log("debug", "get_affiliation for %q: outcast (existing room affiliation)", jid);
				return "outcast";
			end
			if (room_affiliation == "owner" or room_affiliation == "admin") then
				module:log("debug", "get_affiliation for %q: publisher (because owner or admin affiliation)", jid);
				return "publisher"; -- always publisher! (see notes at the beginning of this file)
			end

			-- no access!
			-- module:log("debug", "get_affiliation for %q: outcast", jid);
			return "outcast";
		end;

		jid = room_jid;
		normalize_jid = jid_bare;

		check_node_config = check_node_config;
	});
	services[room_jid] = service;
	local item = { service = service, jid = room_jid }
	mep_service_items[room_jid] = item;
	module:add_item("livechat-mep-service", item);
	return service;
end

function handle_pubsub_iq(event)
	local origin, stanza = event.origin, event.stanza;
	if stanza.attr.to == nil then
		-- FIXME: or return to let another hook process?
		return origin.send(st.error_reply(stanza, "cancel", "bad-request"));
	end

	local room_jid, room_host = jid_split(stanza.attr.to);
	local service = get_mep_service(room_jid, room_host);

	return lib_pubsub.handle_pubsub_iq(event, service)
end

module:hook("iq/bare/"..xmlns_pubsub..":pubsub", handle_pubsub_iq);
module:hook("iq/bare/"..xmlns_pubsub_owner..":pubsub", handle_pubsub_iq); -- FIXME: should not be necessary, as we don't have owners.

-- FIXME: this code does not work, don't know why
-- -- When a livechat-tasks node is created, we create a first task list with the same name as the room.
-- module:hook("node-created", function (event)
-- 	local node = event.node;
-- 	local service = event.service;

-- 	if (node ~= 'livechat-tasks') then
-- 		return
-- 	end

-- 	module:log("debug", "New node %q created, we must create the first tasklist", node);

-- 	local id = uuid_generate();
-- 	local stanza = st.stanza("iq", {}); -- this stanza is only here to construct and get a child item.
-- 	stanza:tag("item", {})
-- 		:tag("tasklist", { xmlns = xmlns_tasklist })
-- 		:tag("name"):text(room.get_name()):up();

-- 	local item = stanza:get_child("item");

-- 	service:publish('livechat-tasks', true, id, item); -- true as second parameters: no actor, force rights.
-- end);

-- Destroying the node when the room is destroyed
-- FIXME: really? as the room will be automatically recreated in some cases...
module:hook("muc-room-destroyed", function(event)
	local room = event.room;
	local room_jid, room_host = jid_split(room.jid);
	if room_host == nil then
		room_host = host;
	end

	local service = services[room_jid];
	if service then
		module:log("debug", "Deleting nodes for room %q", room_jid);

		for node in pairs(service.nodes) do service:delete(node, true); end

		local item = mep_service_items[room_jid];
		mep_service_items[room_jid] = nil;
		if item then module:remove_item("livechat-mep-service", item); end

		-- recipients[room_jid] = nil;
	end
end);

-- When a user lose its admin/owner affilation, and is still subscribed to the node,
-- we must unsubscribe him.
module:hook("muc-set-affiliation", function(event)
	local previous_affiliation = event.previous_affiliation;
	local new_affiliation = event.affiliation;
	if (new_affiliation == 'owner' or new_affiliation == 'admin') then
		return;
	end
	if (previous_affiliation ~= 'owner' and previous_affiliation ~= 'admin') then
		return;
	end
	local jid = event.jid;
	local room = event.room;
	module:log(
		"debug",
		"User %q lost its admin/owner affilition in room %q, must remove node subscription (if exists).",
		jid, room.jid
	);

	local room_jid, room_host = jid_split(room.jid);
	local service = get_mep_service(room_jid, room_host);

	for node in pairs(service.nodes) do
		-- remove_subscription can fail if user is not subscribed, but that is ok.
		service:remove_subscription(node, true, jid);
	end
end);
