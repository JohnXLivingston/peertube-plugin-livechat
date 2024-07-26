<!--
SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
SPDX-License-Identifier: AGPL-3.0-only
-->
# mod_muc_anonymize_moderation_actions

This modules allows to anonymize affiliation and role changes in MUC rooms.

Enabling this module on a MUC Virtualhost will add a settings in the roomconfig form.
When the feature is enabled, when a moderator changes the role or affiliation of an occupant (kick, ban, ...) their name will be removed from the broadcasted message, to not disclose who did the moderation action.

This is particularly usefull to prevent some revenge when a moderator bans someone.

This module is under AGPL-3.0 license.

It was tested on Prosody 0.12.x.

## Configuration

Just enable the module on your MUC VirtualHost.
The feature will be accessible throught the room configuration form.

You can tweak the position of the settings in the MUC configuration form using `anonymize_moderation_actions_form_position`.
This value will be passed as priority for the "muc-config-form" hook, so you can move field up by increasing the value, or down by decreasing the value.

By default, the field will be between muc#roomconfig_changesubject and muc#roomconfig_moderatedroom (default value is `78`).

``` lua
VirtualHost "muc.example.com"
  modules_enabled = { "muc_anonymize_moderation_actions" }
  anonymize_moderation_actions_form_position = 96
```
