---
title: "Slow mode"
description: "Plugin peertube-plugin-livechat slow mode"
weight: 30
chapter: false
---

{{% notice info %}}
This features comes with the livechat plugin version 8.3.0.
{{% /notice %}}

## Introduction

As a streamer, you can choose to rate limit your viewers messages in the chat.

This can be really usefull to:

* avoid message flooding
* avoid unreadable chat if there are many viewsers talking

You can set a number of seconds that users will have to wait after sending a message, before sending another.

This limitation does not apply to moderators.

## Default channel value

On the [channel configuration page](/peertube-plugin-livechat/documentation/user/streamers/channel), you can set a default value for the slow mode option:

![Channel configuration / Default slow mode](/peertube-plugin-livechat/images/slow_mode_channel_option.png?classes=shadow,border&height=400px)

This value will apply as the default value for new chatrooms.
It will not apply on already existing chatrooms.

Setting the value to `0` will disable the feature.

Setting the value to a positive integer will set the period during which users will not be able to post additional messages.

## Modifying the value for an existing chatroom

To modify the slow mode duration for an existing chatroom, you first have to open it in [full screen mode](/peertube-plugin-livechat/documentation/user/viewers).
Then, open the top menu and click on "configure".

![Top menu](/peertube-plugin-livechat/images/top_menu.png?classes=shadow,border&height=200px)

You just have to change the "slow mode" field value.

![Configure chat room](/peertube-plugin-livechat/images/configure.png?classes=shadow,border&height=200px)

Setting the value to `0` will disable the feature.

Setting the value to a positive integer will set the period during which users will not be able to post additional messages.

The modification will immediatly apply.

## For viewers

If the slow mode is enabled, users will be informed by an message.

![Slow mode infobox](/peertube-plugin-livechat/images/slow_mode.png?classes=shadow,border&height=400px)

When they send a message, the input field will be disabled for X seconds (where X is the slow mode duration).

This limitation does not apply to moderators.
