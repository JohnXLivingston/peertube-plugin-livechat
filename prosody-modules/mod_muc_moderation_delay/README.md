<!--
SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
SPDX-License-Identifier: AGPL-3.0-only
-->
# mod_muc_moderation_delay

With this module, you can apply a delay to groupchat messages delivery, so that room moderators can moderate them before other participants receives them.

This module is part of peertube-plugin-livechat, and is under the same LICENSE.
This module can work on any Prosody server (version >= 0.12.x).

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
