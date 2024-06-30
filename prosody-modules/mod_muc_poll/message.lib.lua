-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local function poll_start_message(room)
  -- TODO
end

local function schedule_poll_update_message(room)
  -- TODO
end

local function poll_end_message(room)
  -- TODO
end

return {
  poll_start_message = poll_start_message;
  poll_end_message = poll_end_message;
  schedule_poll_update_message = schedule_poll_update_message;
};
