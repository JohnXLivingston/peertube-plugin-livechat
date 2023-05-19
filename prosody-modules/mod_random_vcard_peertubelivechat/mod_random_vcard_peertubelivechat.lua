local st = require "util.stanza";
local path = require "util.paths";
local b64 = require "util.encodings".base64.encode;
local jid = require "util.jid";

module:add_feature("vcard-temp");

local avatars_dir = assert(module:get_option_string("peertubelivechat_random_vcard_avatars_path", nil), "'peertubelivechat_random_vcard_avatars_path' is a required option");
local avatars = {};
local function load_avatar(filename)
  local file = assert(io.open(path.join(avatars_dir, filename), "r"));
  local result = {
    type = 'image/jpg',
    content = b64(file:read("*a"))
  };
  file:close();
  return result;
end
local AVATARS_COUNT = 130;
for i = 1, AVATARS_COUNT do
  avatars[i] = load_avatar(i .. '.jpg');
end

module:hook("iq-get/bare/vcard-temp:vCard", function (event)
  local origin, stanza = event.origin, event.stanza;

  -- module:log("debug", "From '%s', To '%s', username '%s'.", stanza.attr.from, stanza.attr.to, origin.username);

  local who = jid.split(stanza.attr.to) or origin.username;
  if not who then
    module:log("debug", "No who, will not generate random vCard");
    origin.send(st.error_reply(stanza, "cancel", "item-not-found"));
    return true;
  end

  module:log("debug", "random vCard request for %s", who);

  local n = 1;
  for c in who:gmatch"." do
    n = math.fmod(n + c:byte(), AVATARS_COUNT) + 1;
  end

  module:log("debug", "%s will have the avatar number %s.", who, n);

  local vcard_temp = st.stanza("vCard", { xmlns = "vcard-temp" });
  -- vcard_temp:text_tag("FN", who);
  -- vcard_temp:text_tag("NICKNAME", who);
  vcard_temp:tag("PHOTO");
  vcard_temp:text_tag("TYPE", avatars[n].type);
  vcard_temp:text_tag("BINVAL", avatars[n].content);
  vcard_temp:up();

  origin.send(st.reply(stanza):add_child(vcard_temp));
  return true;
end);
