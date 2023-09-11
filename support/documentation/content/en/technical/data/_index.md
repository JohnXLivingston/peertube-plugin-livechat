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

## room-channel/muc_domain.json

Some parts of the plugin need a quick way to get the channel id from the room Jabber ID, or the all room Jabber ID from a channel id.
We won't use SQL queries, because we only want such information for video that have a chatroom.

So we will store in the `room-channel/muc_domain.json` file (where `muc_domain` is the actual MUC domain,
something like `room.instance.tld`) a JSON object representing these relations.

In the JSON object, keys are the channel ID (as string), values are arrays of strings representing the rooms JIDs local part (without the MUC domain).

When a chatroom is created, the corresponding entry will be added.

Here is a sample file:

```json
{
  "1": [
    "8df24108-6e70-4fc8-b1cc-f2db7fcdd535"
  ]
}
```

This file is loaded at the plugin startup into an object that can manipulate these data.

So we can easily list all rooms for a given channel id or get the channel id for a room JID (Jabber ID).

Note: we include the MUC domain (`room.instance.tld`) in the filename in case the instance domain changes.
In such case, existing rooms could get lost, and we want a way to ignore them to avoid gettings errors.

Note: there could be some inconsistencies, when video or rooms are deleted.
The code must take this into account, and always double check room or channel existence.
There will be some cleaning batch, to delete deprecated files.
