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

## channelConfigurationOptions

The `channelConfigurationOptions` folder contains JSON files describing channels advanced configuration.
Filenames are like `1.json` where `1` is the channel id.
The content of the files are similar to the content sent by the front-end when saving these configuration.

## channel2room and room2channel

Some parts of the plugin need a quick way to get the channel id from the room id, or the all room id from a channel id.
We won't use SQL queries, because we only want such information for video that have a chatroom.

So we have 2 folders: `channel2room` and `room2channel`.
When a chatroom is created, we create 2 empty files:

* `channel2room/channel_id/room_id@muc_domain`
* `room2channel/room_id@muc_domain/channel_id`

Where:

* `muc_domain` is the room's domain (should be `room.your_instance.tld`)
* `channel_id` is the channel numerical id
* `room_id` is the local part of the room JID

So we can easily list all rooms for a given channel id, just by listing files in `channel2room`.
Or get the channel id for a room JID (Jabber ID).

Note: we include muc_domain, in case the instance domain changes. In such case, existing rooms
could get lost, and we want a way to ignore them to avoid gettings errors.

Note: there could be some inconsistencies, when video or rooms are deleted.
The code must take this into account, and always double check room or channel existence.
There will be some cleaning batch, to delete deprecated files.
