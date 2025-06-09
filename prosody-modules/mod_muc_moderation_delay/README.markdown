<!--
SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
SPDX-License-Identifier: AGPL-3.0-only
-->
# mod_muc_moderation_delay

With this module, you can apply a delay to groupchat messages delivery, so that room moderators can moderate them before other participants receives them.

This module is part of peertube-plugin-livechat, and is under AGPL-3.0.-only license.
This module can work on any Prosody server (version >= 0.12.x).
This module is still experimental.

## Configuration

Just enable the module on your MUC component.
The feature will be accessible throught the room configuration form.

The position in the room config form can be changed be setting the option `moderation_delay_form_position`.
This value will be passed as priority for the "muc-config-form" hook.
By default, the field will be between muc#roomconfig_changesubject and muc#roomconfig_moderatedroom.

``` lua
VirtualHost "muc.example.com"
  modules_enabled = { "muc_moderation_delay" }
  moderation_delay_form_position = 96
```

## Additional notes

For moderators, messages that are delayed will contain an extra `moderation-delay` xml tag, with `delay` and `waiting` attribute:

```xml
<message xmlns="jabber:client" type="groupchat" id="18821520-e49b-4e59-b6c6-b45cc133905d" to="root@example.com/QH1H89H1" xml:lang="en" from="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.example.com/root">
  <body>Hello world</body>
  <origin-id id="18821520-e49b-4e59-b6c6-b45cc133905d" xmlns="urn:xmpp:sid:0" />
  <markable xmlns="urn:xmpp:chat-markers:0" />
  <occupant-id id="V5gJudj4Ii3+LnikqUbSSH3NmPKO82zD+m7jRYushVY=" xmlns="urn:xmpp:occupant-id:0" />
  <stanza-id xmlns="urn:xmpp:sid:0" id="xkf36aYefSmQ9evPo1m6Neei" by="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.example.com" />
  <moderation-delay delay="4" waiting="1720177157" />
</message>
```

Note: the `waiting` attribute is the timestamp at which the message will be broadcasted.

So compatible xmpp clients can display some information.
