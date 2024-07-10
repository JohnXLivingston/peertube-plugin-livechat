---
title: "Moderation delay"
description: "Plugin peertube-plugin-livechat moderation delay"
weight: 325
chapter: false
---

{{% notice info %}}
This feature comes with the livechat plugin version 10.3.0.
{{% /notice %}}

## Introduction

As a streamer, you can choose to delay messages in the chat, to let some time to moderators to delete messages before they can even be read by other participants.

When this feature is enabled, moderators will see all messages without any delay.
Chat participants won't see that their own messages are delayed.

Please note that messages sent by moderators will also be delayed, to avoid them to respond to messages that are not even visible by other participants.

## Moderation delay option

On the [channel configuration page](/peertube-plugin-livechat/documentation/user/streamers/channel), you can set the "{{% livechat_label moderation_delay %}}" option:

![Channel configuration / Moderation delay](/peertube-plugin-livechat/images/moderation_delay_channel_option.png?classes=shadow,border&height=400px)

This value will apply as a default value for all your channel's chatrooms.

Setting the value to `0` will disable the feature.

Setting the value to a positive integer will set the delay, in seconds, to apply to messages.
Please avoid setting the value too high.
Ideally it should not exceed a few seconds (4 or 5 seconds for example).

To modify the value for an already existing room, just open the room "configuration" menu (on top of the chat window), and change the moderation delay value in the configuration form.

{{% notice warning %}}
Currently, this feature has one known bug: users that join the chat will get all messages, even messages that are still pending for other participants.
However, messages sent after they joined will be delayed correctly.
{{% /notice %}}

## In the chat

As a moderator, you will see the remaining time (in seconds) before the message is broadcasted, just besides the message datetime.

![Moderation delay timer](/peertube-plugin-livechat/images/moderation_delay_timer.png?classes=shadow,border)
