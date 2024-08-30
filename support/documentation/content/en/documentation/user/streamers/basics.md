---
title: "Some basics"
description: "Some basics about how to setup and use the chat for your live stream"
weight: 100
chapter: false
---

## Enabling the chat for you live streams

{{% notice warning %}}
Instance administrators can choose to disable or enable chat in specific cases.
Information in this section are only true in the default case.
{{% /notice %}}

When you create or modify a Peertube live, there is a "plugin settings" tab:

![Screenshot of the Peertube new live form.](/peertube-plugin-livechat/images/new_live.png?classes=shadow,border&height=200px "New live")

In the "plugin settings" tab, there is a "{{% livechat_label use_chat %}}" checkbox.
Just check or uncheck it to enable or disable the chat associated to your video.

![Screenshot of the form, with a "{{% livechat_label use_chat %}}" checkbox.](/peertube-plugin-livechat/images/new_live_activate_chat.png?classes=shadow,border&height=200px "Activate the chat")

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

The "{{% livechat_label share_chat_embed %}}" tab provide some links to embed the chat in websites, or in your live stream.

![Screenshot of the "{{% livechat_label share_chat_link %}}" dialog, where the "{{% livechat_label read_only %}}" option is checked.](/peertube-plugin-livechat/images/share_readonly.png?classes=shadow,border&height=200px "Share link popup")

You can customize some options:

* {{% livechat_label read_only %}}: you will only be able to read the chat, not write. This is useful to include the chat content in your live stream (see the [OBS documentation](/peertube-plugin-livechat/documentation/user/obs)).
* {{% livechat_label use_current_theme_color %}}: if checked, your current theme colors will be added to the url, so that any user that opens the link will have the same color set.
* {{% livechat_label generate_iframe %}}: instead of an url, you will obtain an HTML snippet that you can add to your website to embed the chat.

For more information on the "{{% livechat_label share_chat_dock %}}" tab, check the [OBS documentation](/peertube-plugin-livechat/documentation/user/obs).

![Screenshot of the "{{% livechat_label share_chat_link %}}" dialog, on the "{{% livechat_label share_chat_dock %}} tab. A token was generated, and is selectionable."](/peertube-plugin-livechat/images/share_dock.png?classes=shadow,border&height=200px "Share link popup - dock tab")

In the "{{% livechat_label web %}}" tab, the provided url opens the chat in the Peertube interface.
You can share this link to other users to invite them to join the chat.

![Screenshot of the "{{% livechat_label share_chat_link %}}" dialog, on the "{{% livechat_label web %}} tab. There is a url you can copy.](/peertube-plugin-livechat/images/share_web.png?classes=shadow,border&height=200px "Share link popup - web tab")

The "{{% livechat_label share_chat_link %}}" popup can also contain a "{{% livechat_label connect_using_xmpp %}}" tab.
This will only be available if your instance's administators have enabled an correctly configured this option.
Using this option, you can provide a link to join the chat using any [XMPP client software](https://en.wikipedia.org/wiki/XMPP#Clients).
Using such softwares can for example facilitate moderation actions.

![Screenshot of the "{{% livechat_label share_chat_link %}}" dialog, on the "{{% livechat_label connect_using_xmpp %}}" tab.](/peertube-plugin-livechat/images/share_xmpp_dialog.png?classes=shadow,border&height=200px "{{% livechat_label connect_using_xmpp %}}")

## Moderation

Please refer to the [moderation documentation](/peertube-plugin-livechat/documentation/user/streamers/moderation).

## Include the chat in your video stream

Please refer to the [OBS documentation](/peertube-plugin-livechat/documentation/user/obs).

## Chat persistence

By default, the chat is persistent.
This means that the room content will be kept for a while.
User joining will see messages posted before their arrival.

You can change the persistence behaviour.
[Open the chat dropdown menu](/peertube-plugin-livechat/documentation/user/viewers), and click on "Configure".

![Screenshot of the dropdown menu at the top of the chat. Several entries are available.](/peertube-plugin-livechat/images/top_menu.png?classes=shadow,border&height=200px "Chat menu")

There are several options that can be changed.

![Screenshot of the chat configuration form.](/peertube-plugin-livechat/images/configure.png?classes=shadow,border&height=200px "Configure chat room")

You can for example set the default and maximum number of messages to return to 0, so that new incomers won't see any previously sent message.

You can also uncheck "enable archiving": if unchecked, messages will be pruned if the server restarts.

By unchecking "Persistent", the room will be cleared if there is no more participant.

## Delete the chat content

If you want to delete the chat content, [open the chat dropdown menu](/peertube-plugin-livechat/documentation/user/viewers), then click on "Destroy".
A popup will open, asking a confirmation.

The chat will be automatically recreated each time someone tries to join it as long as the video exists, and has the "{{% livechat_label use_chat %}}" feature activated.
