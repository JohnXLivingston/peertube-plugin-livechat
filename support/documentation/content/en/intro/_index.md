---
title: "Introduction"
description: "Introduction"
weight: 5
chapter: false
---

## What is the livechat plugin?

This [Peertube](https://joinpeertube.org/) plugin is meant to provide a chat system for Peertube videos.

By default, once you have installed the plugin on your Peertube instance, a chat room will automatically be created for each live stream.

On the following screenshot, you can see a classic Peertube video page, with a chat room on the right (click on the picture to view it full screen):

![Chat screenshot](/peertube-plugin-livechat/images/chat.png?classes=shadow,border&height=200px)

The chat room will be accessible for all viewers, even those who don't have an account on your instance. Those "anonymous" users just have to choose a nickname before they can begin talking in the chat.

By default, the chat is displayed next to the video.
But you can open it in another browser tab, using the button on top of it :

![Fullscreen chat screenshot](/peertube-plugin-livechat/images/fullscreen.png?classes=shadow,border&height=200px)

{{% notice tip %}}
You can test the livechat plugin with this [demo page](https://www.yiny.org/w/399a8d13-d4cf-4ef2-b843-98530a8ccbae).
{{% /notice %}}

## Installation

As a Peertube administrator, you can setup this plugin on your instance simply by using the Peertube plugin marketplace included in the administration interface.
Search for "livechat", then click "install": that's it!

![Livechat installation](/peertube-plugin-livechat/images/installation.png?classes=shadow,border&height=200px)

## Livechat capabilities

The plugin has many advanced features.
As it is using the [XMPP](https://xmpp.org/) standard "under the hood", it is possible for Peertube administrators to allow advanced usages (connection using XMPP clients, chatbots, bridge to other chat protocols, ...).
More information in the relevant sections of this documentation.

## Federation

Peertube is part of the fediverse: you can create a network of Peertube instances, sharing content between them.

This plugin can handle federation: when viewing a livestream from a remote instance, you will join the chat room with your local account.
You will be automatically connected with your current nickname and avatar.

Of course, for the federation to work, the plugin must be installed on both instances.

## Moderation

Some times, you have to protect your community from bad people.
As an instance administrator, you can choose to disallow federation for the livechat plugin.
If remote actors behave badly, streamers, moderators and administrators can ban or mute users.

## Chat persistence

When joining a room, you will see previous messages.
Even those sent before you joined the room.

This behaviour can be changed room by room, and default retention duration can be chosen by instance's administrators.

## Integrate the chat in your live stream

When using software as [OBS](https://obsproject.com) for you live stream, you can embed the chat in the video stream.
This is for example usefull for replays.

In the following screenshot, you can see a live replay, where the chat content is embeded on bottom of the video:

![Embeding the chat in a live stream](/peertube-plugin-livechat/images/embed_chat_in_livestream.png?classes=shadow,border&height=200px)

In the following screenshot, you can see an OBS setup, where the chat is included as a source in the current scene (background color can be changed, and can be transparent):

![Embeding the chat in OBS](/peertube-plugin-livechat/images/embed_chat_in_obs.png?classes=shadow,border&height=200px)

## Other usages

By default, each streamer will be able to activate/deactivate the chat for their live streams.

But on the instance level, administrators can choose to activate the chat for all videos (live and/or VOD).

You can even activate the chat for specific VOD videos.
This is how the [demo](https://www.yiny.org/w/399a8d13-d4cf-4ef2-b843-98530a8ccbae) page works: it is not a live stream, but I have activated the chat specifically for this video.
