<!--
SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>

SPDX-License-Identifier: AGPL-3.0-only
-->

# mod_muc_peertubelivechat_roles

This module is a custom module that handles default roles for users.

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

## Features

### Only registered users can talk

This feature will set default user roles to 'visitor' for anonymous users.

The feature is associated to a room configuration field (muc#roomconfig_x_peertubelivechat_mute_anonymous).
The default value for this field will be set by mod_muc_http_defaults (which is a custom version of the original module).

Note: currently, all anonymous users are joining the original Peertube instance.
This means we only have to handle anonymous users on the local "anon" virtualhost.

If anonymous users are muted, the room disco features will include "x_peertubelivechat_mute_anonymous".
This is used by the ConverseJs frontend to display a message explaining why the user is muted.

### Only Peertube channel followers can talk

This feature will come later.
