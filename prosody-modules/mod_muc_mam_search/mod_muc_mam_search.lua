-- mod_muc_mam_search
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--

local archiving_enabled = module:require("archive").archiving_enabled;
local item_match = module:require("filter").item_match;
local jid_split = require "util.jid".split;
local jid_bare = require "util.jid".bare;
local st = require "util.stanza";
local datetime = require"util.datetime";
local dataform = require "util.dataforms".new;
local get_form_type = require "util.dataforms".get_type;

local mod_muc = module:depends"muc";
local get_room_from_jid = mod_muc.get_room_from_jid;
local muc_log_archive = module:open_store("muc_log", "archive");

local xmlns_mam     = "urn:xmpp:mam:2";
local xmlns_mam_search = "urn:xmpp:mam:2#x-search";
local xmlns_delay   = "urn:xmpp:delay";
local xmlns_forward = "urn:xmpp:forward:0";

module:hook("muc-disco#info", function(event)
  if archiving_enabled(event.room) then
    event.reply:tag("feature", {var=xmlns_mam_search}):up();
  end
end);

local query_form = dataform {
	{ name = "FORM_TYPE"; type = "hidden"; value = xmlns_mam_search };
	{ name = "from"; type = "jid-single" };
	{ name = "occupant_id"; type = "text-single" };
};

-- Serve form
module:hook("iq-get/bare/"..xmlns_mam_search..":query", function(event)
	local origin, stanza = event.origin, event.stanza;
	origin.send(st.reply(stanza):query(xmlns_mam_search):add_child(query_form:form()));
	return true;
end);

-- Handle archive queries
module:hook("iq-set/bare/"..xmlns_mam_search..":query", function(event)
  local origin, stanza = event.origin, event.stanza;
	local room_jid = stanza.attr.to;
	local room_node = jid_split(room_jid);
	local orig_from = stanza.attr.from;
	local query = stanza.tags[1];

	local room = get_room_from_jid(room_jid);
	if not room then
		origin.send(st.error_reply(stanza, "cancel", "item-not-found"))
		return true;
	end
	local from = jid_bare(orig_from);

	-- Must be room admin or owner.
	local from_affiliation = room:get_affiliation(from);
  if (from_affiliation ~= "owner" and from_affiliation ~= "admin") then
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  local qid = query.attr.queryid;

  -- Search query parameters
  local search_from;
  local search_occupant_id;
	local form = query:get_child("x", "jabber:x:data");
	if form then
		local form_type, err = get_form_type(form);
		if not form_type then
			origin.send(st.error_reply(stanza, "modify", "bad-request", "Invalid dataform: "..err));
			return true;
		elseif form_type ~= xmlns_mam_search then
			origin.send(st.error_reply(stanza, "modify", "bad-request", "Unexpected FORM_TYPE, expected '"..xmlns_mam_search.."'"));
			return true;
		end
		form, err = query_form:data(form);
		if err then
			origin.send(st.error_reply(stanza, "modify", "bad-request", select(2, next(err))));
			return true;
		end

		search_from = form["from"];
    search_occupant_id = form["occupant_id"];
  else
    module:log("debug", "Missing query form, forbidden.")
    origin.send(st.error_reply(stanza, "modify", "bad-request", "Missing dataform"));
    return true;
	end

  -- TODO: handle RSM (pagination)?
  module:log("debug", "Archive query by %s id=%s", from, qid);

  -- Load all the data!
	local data, err = muc_log_archive:find(room_node, {
		start = nil; ["end"] = nil;
		with = "message<groupchat"; -- we only want groupchat messages
		limit = nil;
		before = nil; after = nil;
		ids = nil;
		reverse = false;
		total = false;
	});

  if not data then
		module:log("debug", "Archive query id=%s failed: %s", qid or stanza.attr.id, err);
		if err == "item-not-found" then
			origin.send(st.error_reply(stanza, "modify", "item-not-found"));
		else
			origin.send(st.error_reply(stanza, "cancel", "internal-server-error"));
		end
		return true;
	end

  local msg_reply_attr = { to = stanza.attr.from, from = stanza.attr.to };

	local count = 0;
  for id, item, when in data do
    if not st.is_stanza(item) then
      item = st.deserialize(item);
    end

    -- We still need to filter items (as muc_log_archive:find has not the required filters)
    if item_match(id, item, search_from, search_occupant_id) then
      count = count + 1;
      local fwd_st = st.message(msg_reply_attr)
			-- The result uses xmlns_mam and not xmlns_mam_search, so that the frontend handles this in the same way than xmlns_mam.
			:tag("result", { xmlns = xmlns_mam, queryid = qid, id = id })
				:tag("forwarded", { xmlns = xmlns_forward })
					:tag("delay", { xmlns = xmlns_delay, stamp = datetime.datetime(when) }):up();

      -- mod_muc_mam strips <x> tag, containing the original senders JID, unless the room makes this public.
      -- but we only allow this feature to owner and admin, so we don't need to remove this.

      item.attr.to = nil;
      item.attr.xmlns = "jabber:client";
      fwd_st:add_child(item);

      origin.send(fwd_st);
    end
  end

  origin.send(st.reply(stanza)
	-- The result uses xmlns_mam and not xmlns_mam_search, so that the frontend handles this in the same way than xmlns_mam.
    :tag("fin", { xmlns = xmlns_mam, complete = "true" }));

  -- That's all folks!
	module:log("debug", "Archive query id=%s completed, %d items returned", qid or stanza.attr.id, count);
	return true;
end);
