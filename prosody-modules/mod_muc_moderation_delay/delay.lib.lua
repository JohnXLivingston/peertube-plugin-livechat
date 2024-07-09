-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
local async = require "util.async";
local get_moderation_delay = module:require("config").get_moderation_delay;

local muc_util = module:require "muc/util";
local valid_roles = muc_util.valid_roles;

local function handle_broadcast_message(event)
  local room, stanza = event.room, event.stanza;
  local delay = get_moderation_delay(room);
  if delay == nil then
    return;
  end

  -- only delay groupchat messages with body.
  if stanza.attr.type ~= "groupchat" then
    return;
  end
  if not stanza:get_child("body") then
    return;
  end

  local id = stanza.attr.id;
  if not id then
    -- message should alway have an id, but just in case...
    module:log("warn", "Message has no id, wont delay it.");
    return;
  end

  -- TODO: detect message retractation, and stop broadcast for any waiting message.

  -- Message must be delayed, except for:
  -- * room moderators
  -- * the user that sent the message (if they don't get the echo quickly, their clients could have weird behaviours)

  module:log("debug", "Message must be delayed by %i seconds, sending first broadcast wave.", delay);
  local moderator_role_value = valid_roles["moderator"];
  local func = function (nick, occupant)
    if valid_roles[occupant.role or "none"] >= moderator_role_value then
      return true;
    end
    if nick == stanza.attr.from then
      return true;
    end
    return false;
  end;
  room:broadcast(stanza, func);
  async.sleep(delay);
  module:log("debug", "Message has been delayed, sending to remaining participants.");
  room:broadcast(stanza, function (nick, occupant)
    return not func(nick, occupant);
  end);
  return true; -- stop the default process
end

return {
  handle_broadcast_message = handle_broadcast_message;
};
