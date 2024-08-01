-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

-- FIXME: these imports are copied from mod_muc_mam, we should avoid that.
local log_all_rooms = module:get_option_boolean("muc_log_all_rooms", false);
local log_by_default = module:get_option_boolean("muc_log_by_default", true);

-- FIXME: this function is copied from mod_muc_mam. We should not do so, and use directly the original function.
local function archiving_enabled(room)
	if log_all_rooms then
		module:log("debug", "Archiving all rooms");
		return true;
	end
	local enabled = room._data.archiving;
	if enabled == nil then
		module:log("debug", "Default is %s (for %s)", log_by_default, room.jid);
		return log_by_default;
	end
	module:log("debug", "Logging in room %s is %s", room.jid, enabled);
	return enabled;
end

return {
  archiving_enabled = archiving_enabled;
};
