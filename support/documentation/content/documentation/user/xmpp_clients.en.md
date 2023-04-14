+++
title="XMPP Clients"
description="Connect to chat using a XMPP client"
weight=40
chapter=false
+++

This chat plugin relies on the XMPP protocol (also known as Jabber).
It is therefore possible to connect to the chats using
[XMPP client software](https://en.wikipedia.org/wiki/XMPP#Clients).
This can be useful for example to facilitate moderation operations.

{{% notice info %}}
The features described on this page must be enabled and configured by
your Peertube instance's administrators. You may therefore not have access to them.
{{% /notice %}}

## Login to your Peertube account

{{% notice warning %}}
This feature is not yet available, and will come in a future version of the plugin.
{{% /notice %}}

## Connection using an external XMPP account

If this feature is enabled on your instance, you can connect to Peertube
chats using any XMPP account.

To get the address of the room you want to join, you can use the "share chat"
button that is located above the chat:

![Share button](/peertube-plugin-livechat/images/share_button.png?classes=shadow,border&height=200px)

{{% notice info %}}
By default, the share button is only visible to the owner of the video,
and the admins/moderators of the instance.
However, admins can decide to display this button for everyone.
{{% /notice %}}

Then, choose "Connect using XMPP":

![Share XMPP](/peertube-plugin-livechat/images/share_xmpp_dialog.png?classes=shadow,border&height=200px)

Then you just have to click on "open" or copy/paste the address of the chat room into your XMPP client
(using the "join a room" feature).
