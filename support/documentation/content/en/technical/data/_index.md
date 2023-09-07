---
title: "Data on the server"
description: "Date files and folders used on the server"
weight: 50
chapter: false
livechatnotranslation: true
---

The livechat plugin stores some date on the server,
in the `/var/www/peertube/storage/plugins/data/peertube-plugin-livechat/` folder.
This page describes these data.

## prosody

The `prosody` folder is used by the Prosody XMPP server to store its data and logs.

## prosodyAppImage

This plugin uses the Prosoxy XMPP server in background.
This server code is embedded as an AppImage.

When the plugin starts, it deflate this AppImage in the `prosodyAppImage` folder.

## serverInfos

To handle federation between Peertube instances, the plugin needs to store some
information concerning remote instances (available protocols, ...).

The plugin stores these data in the `serverInfos/instance_uri` folder
(where `instance_uri` is replaced by the instance uri).

In each instance's folder, there can be these files:

* `last-update`: json file containing the timestamp of the last information update. So we can avoid refreshing too often.
* `ws-s2s`: if the server allows XMPP S2S Websocket connections, here are the endpoint information
* `s2s`: if the server allows direct XMPP S2S connections, here are the port and url information

## videoInfos

To handle federation the plugin needs to store some information about remote videos.

So, each time we open a new remote chat, a file `videoInfos/remote/instance_uri/video_uuid.json` is created
(where `instance_uri` is the origin instance uri, and `video_uuid` is the video uuid).

This JSON files contain some data about the remote chat (is it enabled, are anonymous users authorized,
which protocol can we use, ...).
These data can then be read by the Prosody server to connect to the remote chat.

Moreover, when the current instance builds such data for local videos,
it stores it in `videoInfos/local/video_uuid.json` (where `video_uuid` is the video uuid).
