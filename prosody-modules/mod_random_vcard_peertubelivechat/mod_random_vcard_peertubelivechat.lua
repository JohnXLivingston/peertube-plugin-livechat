-- SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

local st = require "util.stanza";
local path = require "util.paths";
local b64 = require "util.encodings".base64.encode;
local jid = require "util.jid";

module:add_feature("vcard-temp");

local avatars_dir = assert(module:get_option_string("peertubelivechat_random_vcard_avatars_path", nil), "'peertubelivechat_random_vcard_avatars_path' is a required option");
local avatars_files = assert(module:get_option_array("peertubelivechat_random_vcard_avatars_files", nil), "'peertubelivechat_random_vcard_avatars_files' is a required option");
local avatars = {};
local function load_avatar(filename)
  local file = assert(io.open(path.join(avatars_dir, filename), "r"));
  -- FIXME: check filetype, to only allow jpg or png. (for the day we would allow users to add custom avatars sets)
  local filetype = filename.sub(filename, -3); -- jpg or png
  local result = {
    type = 'image/' .. filetype,
    content = b64(file:read("*a"))
  };
  file:close();
  return result;
end
local AVATARS_COUNT = 0;
for _, filename in pairs(avatars_files) do
  AVATARS_COUNT = AVATARS_COUNT + 1;
  avatars[AVATARS_COUNT] = load_avatar(filename);
end
module:log("info", "Loaded " .. AVATARS_COUNT .. ' avatars for host ' .. module:get_host() .. '.' );

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
