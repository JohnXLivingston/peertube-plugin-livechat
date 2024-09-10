---
title: "Slow mode"
description: "Plugin peertube-plugin-livechat slow mode"
weight: 320
chapter: false
---

{{% livechat_version_notice 8.3.0 %}}

## Introduction

As a streamer, you can choose to rate limit your viewers messages in the chat.

This can be really usefull to:

* avoid message flooding
* avoid unreadable chat if there are many viewers talking

You can set a number of seconds that users will have to wait after sending a message, before sending another.

This limitation does not apply to moderators.

## Slow mode option

On the [channel configuration page](/peertube-plugin-livechat/documentation/user/streamers/channel), you can set the slow mode option:

![Screenshot of the channel options form, with a slow mode field.](/peertube-plugin-livechat/images/slow_mode_channel_option.png?classes=shadow,border&height=400px "Channel configuration / Slow Mode")

This value will apply as a default value for all your channel's chatrooms.

Setting the value to `0` will disable the feature.

Setting the value to a positive integer will set the period during which users will not be able to post additional messages.

To modify the value for an already existing room, just open the room "configuration" menu (on top of the chat window), and change the slow mode value in the configuration form.

## For viewers

If the slow mode is enabled, users will be informed by a message.

![Screenshot of a chat session. There is a banner on the bottom of the chat, indicating that the slow mode is enabled, and that users can send a message every 2 seconds.](/peertube-plugin-livechat/images/slow_mode.png?classes=shadow,border&height=400px "Slow mode infobox")

When they send a message, the input field will be disabled for X seconds (where X is the slow mode duration).

This limitation does not apply to moderators.
