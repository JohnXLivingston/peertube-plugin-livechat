-- mod_muc_peertubelivechat_hide_participants
--
-- SPDX-FileCopyrightText: 2026 Chocobozzz <https://github.com/Chocobozzz>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--
-- Hiding participants relies on the native Prosody "presence_broadcast" room setting
-- This module makes sure moderators still receive all presences

local st = require "util.stanza";
local jid_bare = require "util.jid".bare;

local mod_muc = module:depends"muc";
local room_mt = mod_muc.room_mt;

local xmlns_muc_user = "http://jabber.org/protocol/muc#user";

local original_publicise_occupant_status = room_mt.publicise_occupant_status;
local original_send_occupant_list = room_mt.send_occupant_list;

local function is_hidden_role(room, role)
  return not room:get_presence_broadcast()[role or "none"];
end

local function is_hiding_participants(room)
  return is_hidden_role(room, "participant") or is_hidden_role(room, "visitor");
end

-- Sends to the real JID `to` the presences (or unavailable presences) of occupants that Prosody does not broadcast
local function send_hidden_presences(room, to, unavailable, filter)
  local to_bare = jid_bare(to);
  local is_anonymous = room:is_anonymous_for(to);
  for occupant_jid, occupant in room:each_occupant() do
    -- Prosody always sends the user's own occupants
    if occupant.bare_jid ~= to_bare
      and is_hidden_role(room, occupant.role)
      and (filter == nil or filter(occupant_jid, occupant))
    then
      local pres = st.clone(occupant:get_presence());
      if unavailable then
        pres.attr.type = "unavailable";
      end
      pres.attr.to = to;
      pres:add_child(room:build_item_list(occupant, st.stanza("x", {xmlns = xmlns_muc_user}), is_anonymous));
      module:fire_event("muc-build-occupant-presence", { room = room, occupant = occupant, stanza = pres });
      room:route_stanza(pres);
    end
  end
end

local function publicise_occupant_status(room, occupant, x, nick, actor, reason, prev_role, force_unavailable, recipient)
  -- Single recipient (probe answer): only moderators and the occupant may see a hidden occupant
  if recipient ~= nil then
    if is_hiding_participants(room) and is_hidden_role(room, occupant.role)
      and recipient.role ~= "moderator" and recipient.bare_jid ~= occupant.bare_jid
    then
      return;
    end
    return original_publicise_occupant_status(room, occupant, x, nick, actor, reason, prev_role, force_unavailable, recipient);
  end

  -- Room broadcast: let Prosody send to everyone, applying presence_broadcast
  original_publicise_occupant_status(room, occupant, x, nick, actor, reason, prev_role, force_unavailable, recipient);
  if not is_hiding_participants(room) then return; end

  local role = occupant.role;

  -- Occupant is hidden: fix what moderators received from the broadcast (nothing, or a wrong unavailable)
  if is_hidden_role(room, role) then
    local prosody_sent_unavailable = force_unavailable or (prev_role ~= nil and not is_hidden_role(room, prev_role));
    if role ~= nil or not prosody_sent_unavailable then
      -- Prosody does not fire "muc-broadcast-presence" for single recipients
      -- So mod_muc_anonymize_moderation_actions can't remove the actor: do it here
      local moderator_actor = not room._data.anonymize_moderation_actions and actor or nil;
      for _, moderator in room:each_occupant() do
        if moderator.role == "moderator" and moderator.nick ~= occupant.nick then
          original_publicise_occupant_status(room, occupant, x, nick, moderator_actor, reason, prev_role, nil, moderator);
        end
      end
    end
  end

  -- Occupant gained or lost the moderator role: show or hide all hidden occupants for them
  if role ~= nil and prev_role ~= nil and (role == "moderator") ~= (prev_role == "moderator") then
    for real_jid in occupant:each_session() do
      send_hidden_presences(room, real_jid, role ~= "moderator");
    end
  end
end

local function send_occupant_list(room, to, filter)
  original_send_occupant_list(room, to, filter);
  if not is_hiding_participants(room) then return; end

  local recipient = room:get_occupant_by_real_jid(to);
  if recipient ~= nil and recipient.role == "moderator" then
    send_hidden_presences(room, to, false, filter);
  end
end

-- Prosody has no hook to filter presences per recipient, so we wrap these methods
room_mt.publicise_occupant_status = publicise_occupant_status;
room_mt.send_occupant_list = send_occupant_list;

function module.unload()
  room_mt.publicise_occupant_status = original_publicise_occupant_status;
  room_mt.send_occupant_list = original_send_occupant_list;
end

-- Display in the frontend that non-moderators can't see the full participant list
module:hook("muc-disco#info", function(event)
  if is_hiding_participants(event.room) then
    event.reply:tag("feature", {var = "x_peertubelivechat_hide_participants"}):up();
  end
end);
