# mod_websocket_s2s_peertubelivechat

This module is part of peertube-plugin-livechat, and is under the same LICENSE.

This module implements [XEP-0468: WebSocket S2S](https://xmpp.org/extensions/xep-0468.html).

It is not 100% usable in a non-Peertube Prosody. Here is what is missing:

* should be merged with mod_websocket (by adding an option to enable Websocket S2S)
* should listen on the same HTTP endpoint than mob_websocket
* missing remote Websocket S2S discovering (discovery is done by a `discover-websocket-s2s` hook, with a custom implementation in mod_s2s_peertubelivechat)
* should use net.websocket instead of duplicating code (not possible with the current Prosody code, as net.websocket.connect expect to remain the connection listener)
