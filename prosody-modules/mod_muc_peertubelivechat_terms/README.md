<!--
SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>

SPDX-License-Identifier: AGPL-3.0-only
-->

# mod_muc_peertubelivechat_terms

This module is a custom module to handle Terms&Conditions in the livechat Peertube plugin.

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

## Features

When a new occupant session is created for a MUC, this module will send to the user the global terms,
and the MUC-specific terms (if defined).

This is done by sending groupchat messages.
These messages will contain a "x-livechat-terms" tag, so that livechat front-end can detect these messages, and display them differently.
For standard XMPP clients, these messages will show as standard MUC message coming from a specific nickname.

## Configuration

This modules take following options.

### muc_terms_service_nickname

The nickname that will be used by service messages.
This module reserves the nickname, so than nobody can use it in MUC rooms
(we don't want any user to spoof this nickname).

### muc_terms

The global terms.
