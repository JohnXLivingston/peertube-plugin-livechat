---
title: "Moderation"
description: "Plugin peertube-plugin-livechat advanced moderation features"
weight: 60
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
This means he can configure the room, delete it, promote other users as admins, ...
{{% /notice %}}

{{% notice tip %}}
Starting with livechat v10.0.0, Peertube instance's admins and moderators have no special rights on rooms by default.
However, they have a special button available on top of the chat: "{{% livechat_label promote %}}".
Clicking this button will give them owner access on the room.
{{% /notice %}}

You can use [ConverseJS moderation commands](https://conversejs.org/docs/html/features.html#moderating-chatrooms) to moderate the room.
When you open the chat room in full screen, there will also be a menu with dedicated commands on the top right.

## Roles and affiliations

There are several roles that can be assignated to users in chat rooms: owner, moderators, member, ...

{{% notice warning %}}
This section is still incomplete.
{{% /notice %}}

You can promote users as moderators, if you need some help.

## Delete room content

You can delete old rooms: join the room, and use the menu on the top to destroy the room.

## Instance moderation

As Peertube instance moderator or administrator, you will probably need to check that your users are not behaving badly.

You can list all existing chatrooms: in the plugin settings screen, there is a button «List rooms».

From there, you can also promote yourself as room moderator by using the "{{% livechat_label promote %}}" button on the right.
