-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

-- Getter/Setter
local function get_moderation_delay(room)
  return room._data.moderation_delay or nil;
end

local function set_moderation_delay(room, delay)
  if delay == 0 then
    delay = nil;
  end
  if delay ~= nil then
    delay = assert(tonumber(delay), "Moderation delay is not a valid number");
    if delay < 0 then
      delay = nil;
    end
  end

  if get_moderation_delay(room) == delay then return false; end

  room._data.moderation_delay = delay;
  return true;
end

-- Discovering support
local function add_disco_form(event)
  table.insert(event.form, {
    name = "muc#roominfo_moderation_delay";
    value = "";
  });
  event.formdata["muc#roominfo_moderation_delay"] = get_moderation_delay(event.room);
end


-- Config form declaration
local function add_form_option(event)
  table.insert(event.form, {
    name = "muc#roomconfig_moderation_delay";
    type = "text-single";
    datatype = "xs:integer";
    range_min = 0;
    range_max = 60; -- do not allow too big values, it does not make sense.
    label = "Moderation delay (0=disabled, any positive integer= messages will be delayed for X seconds for non-moderator participants.)";
    -- desc = "";
    value = get_moderation_delay(event.room);
  });
end

local function config_submitted(event)
  set_moderation_delay(event.room, event.value);
  -- no need to 104 status, this feature is invisible for regular participants.
end

return {
  set_moderation_delay = set_moderation_delay;
  get_moderation_delay = get_moderation_delay;
  add_disco_form = add_disco_form;
  add_form_option = add_form_option;
  config_submitted = config_submitted;
}
