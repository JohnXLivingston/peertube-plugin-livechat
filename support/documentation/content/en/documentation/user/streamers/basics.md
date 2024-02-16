---
title: "Some basics"
description: "Some basics about how to setup and use the chat for your live stream"
weight: 10
chapter: false
---

## Enabling the chat for you live streams

{{% notice warning %}}
Instance administrators can choose to disable or enable chat in specific cases.
Information in this section are only true in the default case.
{{% /notice %}}

When you create or modify a Peertube live, there is a "plugin settings" tab:

![New live](/peertube-plugin-livechat/images/new_live.png?classes=shadow,border&height=200px)

In the "plugin settings" tab, there is a "{{% livechat_label use_chat %}}" checkbox.
Just check or uncheck it to enable or disable the chat associated to your video.

![Activate the chat](/peertube-plugin-livechat/images/new_live_activate_chat.png?classes=shadow,border&height=200px)

{{% notice tip %}}
There can be other settings in this tab, depending on plugins installed on your Peertube instance.
{{% /notice %}}

### Per channel chat

On the instance level, Peertube's administrators can choose if chat rooms are unique per video, or if there will be an unique chat room per channel.
Please contact your instance's administrators for more information on how they configure the livechat plugin.

## Share the chat

On top of the chat, there is a "{{% livechat_label share_chat_link %}}" button.

This button opens a popup, where you can obtain an url to join the chat.
This url can be shared.

![Share link popup](/peertube-plugin-livechat/images/share_readonly.png?classes=shadow,border&height=200px)

You can customize some options:

* {{% livechat_label read_only %}}: you will only be able to read the chat, not write. This is useful to include the chat content in your live stream (see the [OBS documentation](/peertube-plugin-livechat/documentation/user/obs)).
* {{% livechat_label use_current_theme_color %}}: if checked, your current theme colors will be added to the url, so that any user that opens the link will have the same color set.
* {{% livechat_label generate_iframe %}}: instead of an url, you will obtain an HTML snippet that you can add to your website to embed the chat.

The "{{% livechat_label share_chat_link %}}" popup can also contain a "{{% livechat_label connect_using_xmpp %}}" tab.
This will only be available if your instance's administators have enabled an correctly configured this option.
Using this option, you can provide a link to join the chat using any [XMPP client software](https://en.wikipedia.org/wiki/XMPP#Clients).
Using such softwares can for example facilitate moderation actions.

## Moderation

Please refer to the [moderation documentation](/peertube-plugin-livechat/documentation/user/streamers/moderation).

## Include the chat in your video stream

Please refer to the [OBS documentation](/peertube-plugin-livechat/documentation/user/obs).

## Chat persistence

By default, the chat is persistent.
This means that the room content will be kept for a while.
User joining will see messages posted before their arrival.

You can change the persistence behaviour.
[Open the chat in fullscreen](/peertube-plugin-livechat/documentation/user/viewers), then open the top menu and click on "Configure".

![Top menu](/peertube-plugin-livechat/images/top_menu.png?classes=shadow,border&height=200px)

There are several options that can be changed.

![Configure chat room](/peertube-plugin-livechat/images/configure.png?classes=shadow,border&height=200px)

You can for example set the default and maximum number of messages to return to 0, so that new incomers won't see any previously sent message.

You can also uncheck "enable archiving": if unchecked, messages will be pruned if the server restarts.

By unchecking "Persistent", the room will be cleared if there is no more participant.

## Delete the chat content

If you want to delete the chat content, [open the chat in fullscreen](/peertube-plugin-livechat/documentation/user/viewers), then open the top menu and click on "Destroy".
A popup will open, asking a confirmation.
To avoid errors, the popup will ask you the "XMPP address" of the chat room.
This address can be obtain using the "Details" menu in the top menu.

The chat will be automatically recreated each time someone tries to join it as long as the video exists, and has the "{{% livechat_label use_chat %}}" feature activated.
