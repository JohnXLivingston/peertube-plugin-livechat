local st = require "util.stanza";
local dataform = require "util.dataforms";
local jid_bare = require "util.jid".bare;

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
  });
  table.insert(form, {
    name = "muc#roompoll_duration";
    type = "text-single";
    datatype = "xs:integer";
    range_min = 1;
    label = "Poll duration (in minutes)";
    desc = "The number of minutes to run the poll.";
    value = "";
  });
  table.insert(form, {
    name = "muc#roompoll_anonymous";
    type = "text-single";
    label = "Anonymous results";
    desc = "By enabling this, user's votes won't be publicly shown in the room.";
    value = "";
  });
  table.insert(form, {
    name = "muc#roompoll_choice1";
    type = "text-single";
    label = "Choice 1";
    desc = "";
    value = "";
  });
  table.insert(form, {
    name = "muc#roompoll_choice2";
    type = "text-single";
    label = "Choice 2";
    desc = "";
    value = "";
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

-- module:hook("iq/bare", function (event)
--   local stanza = event.stanza;
--   local type = stanza.attr.type;
--   local child = stanza.tags[1];
--   local xmlns = child.attr.xmlns or "jabber:client";
--   module:log("info", "coucou %s %s %s", type, xmlns, child.name);
-- end, 1000);

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

-- Discovering support
module:hook("muc-disco#info", function (event)
	event.reply:tag("feature", { var = xmlns_poll }):up();
end);
