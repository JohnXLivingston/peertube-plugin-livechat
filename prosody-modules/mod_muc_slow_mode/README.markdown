<!--
SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
SPDX-License-Identifier: AGPL-3.0-only
-->
# mod_muc_slow_mode

This module is a custom module that allows slow mode for MUC rooms.

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

There will probably be a XEP proposal for this module behaviour. When done, this module will be published in the prosody-modules repository.

## Configuration

Just enable the module on your MUC component.
The feature will be accessible throught the room configuration form.

Depending on your application, it is possible that the slow mode is more important than other fields (for example for a video streaming service).
The position in the room config form can be changed be setting the option `slow_mode_duration_form_position`.
This value will be passed as priority for the "muc-config-form" hook.
By default, the field will be between muc#roomconfig_changesubject and muc#roomconfig_moderatedroom.

``` lua
VirtualHost "muc.example.com"
  modules_enabled = { "muc_slow_mode" }
  slow_mode_duration_form_position = 96
```
