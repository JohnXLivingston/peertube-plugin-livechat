-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only
local st = require "util.stanza";
local timer = require "util.timer";
local get_moderation_delay = module:require("config").get_moderation_delay;

local muc_util = module:require "muc/util";
local valid_roles = muc_util.valid_roles;

local xmlns_fasten = "urn:xmpp:fasten:0";
local xmlns_moderated_0 = "urn:xmpp:message-moderate:0";
local xmlns_retract_0 = "urn:xmpp:message-retract:0";
local xmlns_moderated_1 = "urn:xmpp:message-moderate:1";
local xmlns_retract_1 = "urn:xmpp:message-retract:1";
local xmlns_st_id = "urn:xmpp:sid:0";

local queued_messages_retracted = {};

local function is_retractation_for_stanza_id(stanza)
  -- XEP 0425 was revised in 2023. For now, mod_muc_moderation uses the previous version.
  -- But we will make the code compatible with both.
  local apply_to = stanza:get_child("apply-to", xmlns_fasten);
  if apply_to and apply_to.attr.id then
    local moderated = apply_to:get_child("moderated", xmlns_moderated_0);
    if moderated then
      local retract = moderated:get_child("retract", xmlns_retract_0);
      if retract then
        return apply_to.attr.id;
      end
    end
  end

  local moderated = stanza:get_child("moderated", xmlns_moderated_1);
  if moderated then
    if moderated:get_child("retract", xmlns_retract_1) then
      return moderated.attr.id;
    end
  end

  return nil;
end

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

  -- detect retractations:
  local retracted_stanza_id = is_retractation_for_stanza_id(stanza);
  if retracted_stanza_id then
    module:log("debug", "Got a retractation message for %s", retracted_stanza_id);
    if queued_messages_retracted[retracted_stanza_id] == false then
      module:log("info", "Got a retractation message, for message %s that is currently waiting for broadcast. Cancelling.", retracted_stanza_id);
      queued_messages_retracted[retracted_stanza_id] = true;
      -- and we continue...
    end
  end

  if not stanza:get_child("body") then
    -- Dont want to delay message without body.
    -- This is usually messages like "xxx is typing", or any other service message.
    -- This also should concern retractation messages.
    -- Clients that will receive retractation messages for message they never got, should just drop them. And that's ok.
    return;
  end

  local stanza_id = nil; -- message stanza id... can be nil!
  local stanza_id_child = stanza:get_child("stanza-id", xmlns_st_id);
  if not stanza_id_child then
    -- this can happen when muc is not archived!
    -- in such case, message retractation is not possible.
    -- so, this is a normal use case, and we should handle it properly.
  else
    stanza_id = stanza_id_child.attr.id;
  end
  local id = stanza.attr.id;
  if not id then
    -- message should alway have an id, but just in case...
    module:log("warn", "Message has no id, wont delay it.");
    return;
  end

  -- Message must be delayed, except for:
  -- * room moderators
  -- * the user that sent the message (if they don't get the echo quickly, their clients could have weird behaviours)
  module:log("debug", "Message %s / %s must be delayed by %i seconds, sending first broadcast wave.", id, stanza_id, delay);
  if stanza_id then
    queued_messages_retracted[stanza_id] = false;
  end
  local moderator_role_value = valid_roles["moderator"];
  local cond_func = function (nick, occupant)
    if valid_roles[occupant.role or "none"] >= moderator_role_value then
      return true;
    end
    if nick == stanza.attr.from then
      return true;
    end
    return false;
  end;

  local cloned_stanza = st.clone(stanza); -- we must clone, to send a copy for the second wave.
  room:broadcast(stanza, cond_func);

  timer.add_task(delay, function ()
    if stanza_id then
      if queued_messages_retracted[stanza_id] == true then
        module:log("info", "Message %s was retracted during the delay, cancelling the broadcast.", stanza_id);
        queued_messages_retracted[stanza_id] = nil;
        return;
      end

      queued_messages_retracted[stanza_id] = nil;
    end
  
    module:log("debug", "Message %s has been delayed, sending to remaining participants.", id);
    room:broadcast(cloned_stanza, function (nick, occupant)
      return not cond_func(nick, occupant);
    end);
  end);

  return true; -- stop the default broadcast_message processing.
end

return {
  handle_broadcast_message = handle_broadcast_message;
};
