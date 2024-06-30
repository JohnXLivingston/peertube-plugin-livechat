-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local st = require "util.stanza";
local dataform = require "util.dataforms";
local get_form_type = require "util.dataforms".get_type;
local xmlns_poll = module:require("constants").xmlns_poll;

local end_current_poll = module:require("poll").end_current_poll;
local create_poll = module:require("poll").create_poll;

local function get_form_layout(room, stanza)
  local form = dataform.new({
    title = "New poll",
    instructions = "Complete and submit this form to create a new poll. This will end and replace any existing poll.",
    {
      name = "FORM_TYPE";
      type = "hidden";
      value = xmlns_poll;
    }
  });

  table.insert(form, {
    name = "muc#roompoll_question";
    type = "text-single";
    label = "Question";
    desc = "The poll question.";
    value = "";
    required = true;
  });
  table.insert(form, {
    name = "muc#roompoll_duration";
    type = "text-single";
    datatype = "xs:integer";
    range_min = 1;
    label = "Poll duration (in minutes)";
    desc = "The number of minutes to run the poll.";
    value = "";
    required = true;
  });
  table.insert(form, {
    name = "muc#roompoll_anonymous";
    type = "boolean";
    label = "Anonymous results";
    desc = "By enabling this, user's votes won't be publicly shown in the room.";
    value = true;
  });
  table.insert(form, {
    name = "muc#roompoll_choice1";
    type = "text-single";
    label = "Choice 1";
    desc = "";
    value = "";
    required = true;
  });
  table.insert(form, {
    name = "muc#roompoll_choice2";
    type = "text-single";
    label = "Choice 2";
    desc = "";
    value = "";
    required = true;
  });
  table.insert(form, {
    name = "muc#roompoll_choice3";
    type = "text-single";
    label = "Choice 3";
    desc = "";
    value = "";
  });
  table.insert(form, {
    name = "muc#roompoll_choice4";
    type = "text-single";
    label = "Choice 4";
    desc = "";
    value = "";
  });
  table.insert(form, {
    name = "muc#roompoll_choice5";
    type = "text-single";
    label = "Choice 5";
    desc = "";
    value = "";
  });

  return form;
end

local function send_form(room, origin, stanza)
  module:log("debug", "Sending the poll form");
  origin.send(st.reply(stanza):query(xmlns_poll)
    :add_child(get_form_layout(room, stanza.attr.from):form())
) ;
end

local function dataform_error_message(err)
	local out = {};
	for field, errmsg in pairs(err) do
		table.insert(out, ("%s: %s"):format(field, errmsg))
	end
	return table.concat(out, "; ");
end


local function process_form(room, origin, stanza)
  if not stanza.tags[1] then
    origin.send(st.error_reply(stanza, "modify", "bad-request"));
    return true;
  end
  local form = stanza.tags[1]:get_child("x", "jabber:x:data");
  if not form then
    origin.send(st.error_reply(stanza, "modify", "bad-request"));
    return true;
  end

  local form_type, err = get_form_type(form);
  if not form_type then
    origin.send(st.error_reply(stanza, "modify", "bad-request", "Invalid dataform: "..err));
    return true;
  elseif form_type ~= xmlns_poll then
    origin.send(st.error_reply(stanza, "modify", "bad-request", "Unexpected FORM_TYPE, expected '"..xmlns_poll.."'"));
    return true;
  end

  if form.attr.type == "cancel" then
		origin.send(st.reply(stanza));
    return true;
	elseif form.attr.type ~= "submit" then
    origin.send(st.error_reply(stanza, "cancel", "bad-request", "Not a submitted form"));
    return true;
  end

  -- form submitted
  local fields, errors, present = get_form_layout(room, stanza.attr.from):data(form);
  if errors then
    origin.send(st.error_reply(stanza, "modify", "bad-request", dataform_error_message(errors)));
    return true;
  end

  -- stop any poll that is already here
  end_current_poll(room);

  -- create the new poll
  create_poll(room, fields);

  origin.send(st.reply(stanza));
  return true;
end

return {
  send_form = send_form;
  process_form = process_form;
};
