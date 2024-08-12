---
title: "Moderation"
description: "Plugin peertube-plugin-livechat advanced moderation features"
weight: 300
chapter: false
---

{{% notice warning %}}
This section is still incomplete.
{{% /notice %}}

{{% notice warning %}}
This page describes the behaviour of livechat versions >= 10.0.0.
There were some changes in the way we manage access rights for Peertube administrators and moderators.
{{% /notice %}}

## The chat bot

You can use a chat bot, that will help you for moderation.
Check [the chat bot documentation](/peertube-plugin-livechat/documentation/user/streamers/bot) for more information.

## Accessing moderation tools

You can access room settings and moderation tools using the [chat dropdown menu](/peertube-plugin-livechat/documentation/user/viewers) at the top of the chat.

![Chat menu](/peertube-plugin-livechat/images/top_menu.png?classes=shadow,border&height=200px)

{{% notice tip %}}
The video owner will be owner of the chat room.
This means they can configure the room, delete it, promote other users as admins, ...
{{% /notice %}}

{{% notice tip %}}
Starting with livechat v10.0.0, Peertube instance's admins and moderators have no special rights on rooms by default.
However, they have a special button available on top of the chat: "{{% livechat_label promote %}}".
Clicking this button will give them owner access on the room.
{{% /notice %}}

You can use [ConverseJS moderation commands](https://conversejs.org/docs/html/features.html#moderating-chatrooms) to moderate the room.
When you open the chat room in full screen, there will also be a menu with dedicated commands on the top right.

## {{% livechat_label livechat_configuration_channel_mute_anonymous_label %}}

{{% notice info %}}
This feature comes with the livechat plugin version 10.2.0.
{{% /notice %}}

You can prevent anonymous users to send messages. In such case, only registered users will be able to talk in the chat.

To enable or disable this feature, use the [chat dropdown menu](/peertube-plugin-livechat/documentation/user/viewers), open the "configure" menu.
In the form, you will find a "{{% livechat_label livechat_configuration_channel_mute_anonymous_label %}}" checkbox.

![Room configuration / Mute anonymous users](/peertube-plugin-livechat/images/configure_mute_anonymous.png?classes=shadow,border&height=400px)

Anonymous users won't have the message field, and will see following prompt: "{{% livechat_label muted_anonymous_message %}}"

![Room configuration / Muted anonymous users](/peertube-plugin-livechat/images/anonymous_muted.png?classes=shadow,border&height=400px)

When this feature is enabled, anonymous users will be assigned the "visitor" role.
You can change their role to "participant" if you want to allow some of them to talk.

If you change the room configuration, all anonymous users will be muted or unmuted.

You can choose to enable or disable this feature for new chatrooms on the [channel configuration page](/peertube-plugin-livechat/documentation/user/streamers/channel).

## Roles and affiliations

There are several roles that can be assignated to users in chat rooms: owner, moderators, member, ...

{{% notice warning %}}
This section is still incomplete.
{{% /notice %}}

You can promote users as moderators, if you need some help.

## {{% livechat_label livechat_configuration_channel_anonymize_moderation_label %}}

{{% notice info %}}
This feature comes with the livechat plugin version 11.0.0.
{{% /notice %}}

It is possible to anonymize moderation actions, to avoid disclosing who is banning/kicking/… occupants.

To enable or disable this feature, use the [chat dropdown menu](/peertube-plugin-livechat/documentation/user/viewers), open the "configure" menu.
In the form, you will find a "{{% livechat_label livechat_configuration_channel_anonymize_moderation_label %}}" checkbox.

You can choose to enable or disable this feature for new chatrooms on the [channel configuration page](/peertube-plugin-livechat/documentation/user/streamers/channel).

## Participant message history search

{{% notice info %}}
This feature comes with the livechat plugin version 11.0.0.
{{% /notice %}}

As a room admin or owner, you can search all messages sent by a given participant.

To do so, you have several ways:

* using the "{{% livechat_label search_occupant_message %}}" action in the dropdown menu besides participants in the sidebar
* using the "{{% livechat_label search_occupant_message %}}" action in the dropdown menu besides chat messages

![Message history search](/peertube-plugin-livechat/images/message_search.png?classes=shadow,border&height=200px)

{{% notice tip %}}
To have more space and better readability, open the chat in full-page mode.
{{% /notice %}}

In the search results, there are several informations that are shown at the right of the participant nickname:

* if the current nickname is different than the nickname when the participant has sent the message, the original nickname will be shown
* you will see the [JID (Jabber ID)](https://xmpp.org/extensions/xep-0029.html) of the participant
* you will also see the [occupant-id](https://xmpp.org/extensions/xep-0421.html) of the participant

The search result will also include all messages related to participants who had the same nickname.
You can differenciate them by comparing [JID](https://xmpp.org/extensions/xep-0029.html) and [occupant-id](https://xmpp.org/extensions/xep-0421.html).

## Delete room content

You can delete old rooms: join the room, and use the menu on the top to destroy the room.

## Instance moderation

As Peertube instance moderator or administrator, you will probably need to check that your users are not behaving badly.

You can list all existing chatrooms: in the plugin settings screen, there is a button «List rooms».

From there, you can also promote yourself as room moderator by using the "{{% livechat_label promote %}}" button on the right.
