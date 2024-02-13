-- mod_muc_slow_mode
--
-- Copyright (C) 2024 John Livingston
--
-- This file is AGPL-v3 licensed.
-- Please see the Peertube livechat plugin copyright information.
-- https://livingston.frama.io/peertube-plugin-livechat/credits/
--
-- Implements: XEP-????: MUC Slow Mode (XEP to come).
--
-- Imports

-- Plugin dependencies
local mod_muc = module:depends "muc";

-- Getter/Setter
local function get_slow_mode_delay(room)
	return room._data.slow_mode_delay or 0;
end

local function set_slow_mode_delay(room, delay)
  if delay then
		delay = assert(tonumber(delay), "Slow mode delay is not a valid number");
	end
  if delay and delay < 0 then
    delay = 0;
  end
	room._data.slow_mode_delay = delay;
	return true;
end

-- Discovering support
local function add_disco_form(event)
  table.insert(event.room, {
    name = "muc#roomconfig_slow_mode_delay";
    value = "";
  });
  event.formdata["muc#roomconfig_slow_mode_delay"] = get_slow_mode_delay(event.room);
end

module:hook("mub-disco#info", add_disco_form);

-- Config form declaration
local function add_form_option(event)
  table.insert(event.form, {
    name = "muc#roomconfig_slow_mode_delay";
    type = "text-single";
		datatype = "xs:integer";
    label = "Slow Mode (0=disabled, any positive integer= minimal delay in seconds between two messages from the same user)";
    desc = "Minimal delay, in seconds, between two messages for the same user in the room. If value is set to 0, the slow mode is not active.";
    value = get_slow_mode_delay(event.room);
  });
end

module:hook("muc-config-submitted/muc#roomconfig_slow_mode_delay", function(event)
	if set_slow_mode_delay(event.room, event.value) then
    -- status 104 = configuration change: Inform occupants that a non-privacy-related room configuration change has occurred
		event.status_codes["104"] = true;
	end
end);

module:hook("muc-config-form", add_form_option, 100-4);
