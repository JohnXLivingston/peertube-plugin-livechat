local st = require "util.stanza";
local dataform = require "util.dataforms";
local get_form_type = require "util.dataforms".get_type;
local jid_bare = require "util.jid".bare;
local get_time = require "util.time".now;

local mod_muc = module:depends"muc";
local get_room_from_jid = mod_muc.get_room_from_jid;

-- FIXME: create a XEP to standardize this, and remove the "x-".
local xmlns_poll = "http://jabber.org/protocol/muc#x-poll";

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

local function end_current_poll (room)
  if not room._data.current_poll then
    return;
  end
  -- TODO: compute and send last result.
  room._data.current_poll = nil;
end

local function create_poll(room, fields)
  room._data.current_poll = fields;
  room._data.current_poll.end_timestamp = now() + (60 * fields["muc#roompoll_duration"]);
  room._data.current_poll.votes = {};
  -- TODO: create and send poll message.
end

-- new poll creation, get form
module:hook("iq-get/bare/" .. xmlns_poll .. ":query", function (event)
  local origin, stanza = event.origin, event.stanza;
  local room_jid = stanza.attr.to;
  module:log("debug", "Received a request for the poll form");
  local room = get_room_from_jid(room_jid);
  if not room then
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end
  local from = jid_bare(stanza.attr.from);

  local from_affiliation = room:get_affiliation(from);
  if (from_affiliation ~= "owner" and from_affiliation ~= "admin") then
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  send_form(room, origin, stanza);
  return true;
end);


-- new poll creation, form submission
module:hook("iq-set/bare/" .. xmlns_poll .. ":query", function (event)
  local origin, stanza = event.origin, event.stanza;
  local room_jid = stanza.attr.to;
  module:log("debug", "Received a form submission for the poll form");
  local room = get_room_from_jid(room_jid);
  if not room then
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end
  local from = jid_bare(stanza.attr.from);

  local from_affiliation = room:get_affiliation(from);
  if (from_affiliation ~= "owner" and from_affiliation ~= "admin") then
    origin.send(st.error_reply(stanza, "auth", "forbidden"))
    return true;
  end

  return process_form(room, origin, stanza);
end);

-- Discovering support
module:hook("muc-disco#info", function (event)
	event.reply:tag("feature", { var = xmlns_poll }):up();
end);
