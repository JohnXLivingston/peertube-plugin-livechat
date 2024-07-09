-- mod_muc_moderation_delay
--
-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--

local add_disco_form = module:require("config").add_disco_form;
local config_submitted = module:require("config").config_submitted;
local add_form_option = module:require("config").add_form_option;
local handle_broadcast_message = module:require("delay").handle_broadcast_message;

-- form_position: the position in the room config form (this value will be passed as priority for the "muc-config-form" hook).
-- By default, field will be between muc#roomconfig_changesubject and muc#roomconfig_moderatedroom
local form_position = module:get_option_number("moderation_delay_form_position") or 80-2;

-- Plugin dependencies
local mod_muc = module:depends "muc";

-- muc-disco and muc-config to configure the feature:
module:hook("muc-disco#info", add_disco_form);
module:hook("muc-config-submitted/muc#roomconfig_moderation_delay", config_submitted);
module:hook("muc-config-form", add_form_option, form_position);

-- intercept muc-broadcast-message, and broadcast with delay if required.
-- Priority is negative, as we want it to be the last handler.
module:hook("muc-broadcast-message", handle_broadcast_message, -1000);
