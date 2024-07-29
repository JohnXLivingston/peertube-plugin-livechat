-- mod_muc_anonymize_moderation_actions
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

-- form_position: the position in the room config form (this value will be passed as priority for the "muc-config-form" hook).
-- By default, field will be between muc#roomconfig_changesubject and muc#roomconfig_moderatedroom
local form_position = module:get_option_number("anonymize_moderation_actions_form_position") or 80-2;

local function get_anonymize_moderation_actions(room)
	return room._data.anonymize_moderation_actions or false;
end

local function set_anonymize_moderation_actions(room, anonymize_moderation_actions)
	anonymize_moderation_actions = anonymize_moderation_actions and true or nil;
	if get_anonymize_moderation_actions(room) == anonymize_moderation_actions then return false; end
	room._data.anonymize_moderation_actions = anonymize_moderation_actions;
	return true;
end

-- Config form declaration
local function add_form_option(event)
  table.insert(event.form, {
    name = "muc#roomconfig_anonymize_moderation_actions";
    type = "boolean";
    label = "Anonymize moderation actions";
    desc = "When this is enabled, moderation actions will be anonymized, to avoid disclosing who is banning/kicking/… occupants.";
    value = get_anonymize_moderation_actions(event.room);
  });
end

local function config_submitted(event)
  set_anonymize_moderation_actions(event.room, event.value);
end

local function remove_actor(event)
  if (event.room and get_anonymize_moderation_actions(event.room)) then
    event.actor = nil;
  end
end

local function remove_moderate_actor(event)
  local room, announcement, tombstone = event.room, event.announcement, event.tombstone;
  if not get_anonymize_moderation_actions(room) then
    return;
  end

  local moderated = announcement:find("{urn:xmpp:fasten:0}apply-to/{urn:xmpp:message-moderate:0}moderated");
  if moderated then
    module:log("debug", "We must anonymize the moderation announcement for stanza %s", event.stanza_id);
    -- FIXME: XEP-0245 has changed.
    -- urn:xmpp:message-moderate:0 requires a "by" attribute
    -- urn:xmpp:message-moderate:1 do not require the "by" attribute
    -- So, for now, settings the room jid, as we only implement urn:xmpp:message-moderate:0.
    moderated.attr.by = room.jid;
    moderated:remove_children("occupant-id", "urn:xmpp:occupant-id:0");
  end

  if tombstone then
    local moderated = tombstone:get_child("moderated", "urn:xmpp:message-moderate:0");
    if moderated then
      module:log("debug", "We must anonymize the moderation tombstone for stanza %s", event.stanza_id);
      -- FIXME: XEP-0245 has changed.
      -- urn:xmpp:message-moderate:0 requires a "by" attribute
      -- urn:xmpp:message-moderate:1 do not require the "by" attribute
      -- So, for now, settings the room jid, as we only implement urn:xmpp:message-moderate:0.
      moderated.attr.by = room.jid;
      moderated:remove_children("occupant-id", "urn:xmpp:occupant-id:0");
    end
  end
end

module:hook("muc-config-submitted/muc#roomconfig_anonymize_moderation_actions", config_submitted);
module:hook("muc-config-form", add_form_option, form_position);
module:hook("muc-broadcast-presence", remove_actor);
module:hook("muc-moderate-message", remove_moderate_actor);
