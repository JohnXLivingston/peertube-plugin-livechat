-- mod_muc_poll
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--
-- Implements: XEP-????: MUC Poll (XEP to come).

local st = require "util.stanza";
local jid_bare = require "util.jid".bare;

local mod_muc = module:depends"muc";
local get_room_from_jid = mod_muc.get_room_from_jid;

local xmlns_poll = module:require("constants").xmlns_poll;
local send_form = module:require("form").send_form;
local process_form = module:require("form").process_form;

-- new poll creation, get form
module:hook("iq-get/bare/" .. xmlns_poll .. ":query", function (event)
  local origin, stanza = event.origin, event.stanza;
  local room_jid = stanza.attr.to;
  module:log("debug", "Received a request for the poll form");
  local room = get_room_from_jid(room_jid);
  if not room then
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end
  local from = jid_bare(stanza.attr.from);

  local from_affiliation = room:get_affiliation(from);
  if (from_affiliation ~= "owner" and from_affiliation ~= "admin") then
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  send_form(room, origin, stanza);
  return true;
end);

-- new poll creation, form submission
module:hook("iq-set/bare/" .. xmlns_poll .. ":query", function (event)
  local origin, stanza = event.origin, event.stanza;
  local room_jid = stanza.attr.to;
  module:log("debug", "Received a form submission for the poll form");
  local room = get_room_from_jid(room_jid);
  if not room then
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end
  local from = jid_bare(stanza.attr.from);

  local from_affiliation = room:get_affiliation(from);
  if (from_affiliation ~= "owner" and from_affiliation ~= "admin") then
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  return process_form(room, origin, stanza);
end);

-- Discovering support
module:hook("muc-disco#info", function (event)
	event.reply:tag("feature", { var = xmlns_poll }):up();
end);
