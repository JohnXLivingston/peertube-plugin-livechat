---
title: "Troubleshooting"
description: "Some classic mistakes and workarounds."
weight: 10
chapter: false
---

## I just installed/upgraded the plugin, but nothing happens

If you have just installed/upgraded the plugin, but nothing happens (no chat, no settings, buttons in the settings page does not work, ...), just try to reload the page.

## Diagnostic tool

If the chat does not work, there is a diagnostic tool in the plugin's settings pages.

Open the plugin settings, and click on the "launch diagnostic" button.

![Launch diagnostic](/peertube-plugin-livechat/images/launch_diagnostic.png?classes=shadow,border&height=200px)

If there is any error in the diagnostic page, you can search in this page for a solution, or refer to the [Bug tracking documentation page](/peertube-plugin-livechat/issues/) if you can't find any response.

![Diagnostic result](/peertube-plugin-livechat/images/diagnostic.png?classes=shadow,border&height=200px)

## Chat does not load

### Internal API calls

In some case (like for some Docker Peertube installation), the diagnostic tools displays an error for the test called "API Prosody -> Peertube is KO".

In such case, try changing the "{{% livechat_label prosody_peertube_uri_label %}}" settings, by setting `http://127.0.0.1:9000` (assuming 9000 is the port on which Peertube listen, ask your instance administrators if you don't know).

Check the help for [this setting](/peertube-plugin-livechat/documentation/admin/settings/) for more information.

### Websocket

If everything is fine in the diagnostic tools, but chat windows remains empty: it can be a Websocket issue.
Since Peertube version 5.0.0, there are some additional configuration to do on the server side.
Check with the instance administrators that they did not forgot to apply changes listed in the [Peertube v5.0.0 release notes](https://github.com/Chocobozzz/PeerTube/blob/master/CHANGELOG.md#v500).

You can confirm that it is a Websocket issue by opening your browser console, and checking for error logs talking about failed Websocket connection.

If you can't fix this immediatly, you can disable Websocket by unchecking "{{% livechat_label disable_websocket_label %}}" in the plugin setting page.
In such case, you should also check "{{% livechat_label federation_dont_publish_remotely_label %}}", as chat federation won't work without Websocket.
