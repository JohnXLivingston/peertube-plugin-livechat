<!--
SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>

SPDX-License-Identifier: AGPL-3.0-only
-->

# mod_s2s_peertubelivechat

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

This module provides some custom Websocket S2S tweaking.

For example, it ensures you can connect to a remote XMPP server that is not a Peertube instance
(unless you enabled S2S in the plugin).

It also provides specific Websocket S2S discovery methods.
