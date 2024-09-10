---
title: "Terms & conditions"
description: "Configure channel's chat terms & conditions"
weight: 310
chapter: false
---

{{% livechat_version_notice 10.2.0 %}}

## Configuration

You can add terms & conditions to your channel.
These terms will be shown to all users joining the chat.

To configure the terms & conditions, go to the [channel configuration page](/peertube-plugin-livechat/documentation/user/streamers/channel):

![Screenshot of the channel options form, with a field to configure your terms and conditions.](/peertube-plugin-livechat/images/channel_terms_config.png?classes=shadow,border&height=400px "Channel configuration / Terms")

URL in the message will be clickable.
You can also do some styling: [Message Styling](https://xmpp.org/extensions/xep-0393.html).

## Viewers

When joining the chat, viewers will see the terms:

![Screenshot of a chat session. On the top of the chat, there are terms and conditions for both the server and the channel.](/peertube-plugin-livechat/images/terms.png?classes=shadow,border&height=400px "Terms")

{{% notice info %}}
Peertube instance's admin can also set global terms & conditions.
If so, these terms will be shown above your channel's terms.
{{% /notice %}}

{{% notice info %}}
Anonymous users will only see the terms & conditions once they have chosen their nickname (in other words: once they are able to talk).
{{% /notice %}}

You can change the terms content at any time, it will be instantly updated for all viewers.

Users can hide the terms & conditions.
When doing so, terms won't be shown again, unless you change the content.

{{% notice info %}}
If your Peertube instance allows joining chat with [XMPP clients](https://livingston.frama.io/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/), users using such clients will see the terms as chat messages, coming from a "Peertube" account.
When you update terms, they will receive a new message with the update terms content.
{{% /notice %}}
