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

module:hook("muc-config-submitted/muc#roomconfig_anonymize_moderation_actions", config_submitted);
module:hook("muc-config-form", add_form_option, form_position);
module:hook("muc-broadcast-presence", remove_actor);
