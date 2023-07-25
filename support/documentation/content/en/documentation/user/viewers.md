---
title: "For viewers"
description: "How to chat for stream viewers"
weight: 10
chapter: false
---

## Joining chat rooms

When you are watching a Peertube video that has the chat activated, you will see the chat next to the video:

![Chat screenshot](/peertube-plugin-livechat/images/chat.png?classes=shadow,border&height=200px)

There are two slightly different use cases, depending on wether or not you have an account on the Peertube instance.
See bellow for more informations.

### If you haven't a Peertube account

{{% notice warning %}}
This feature can be disabled by the instance's adminitrators.
{{% /notice %}}

If you are not logged in on the Peertube instance where you are watching the video, you will automatically join the chat.
You will be assigned a random nickname (something like "Anonymous 12345").

![Chat with an anonymous user](/peertube-plugin-livechat/images/chat_with_anonymous.png?classes=shadow,border&height=200px)

Before being able to speak in the chat room, you have to enter a nickname in the field on the bottom of the window.

![Joining chat when not connected](/peertube-plugin-livechat/images/chat_anonymous.png?classes=shadow,border&height=200px)

### If you have a Peertube account

If you are connected with your Peertube account, you will automatically join the room, using your Peertube nickname and avatar.

{{% notice tip %}}
If you are watching a live on an instance on which you have no account, but you have an account on another instance:
if the plugin is installed on both instances, it is possible to join the chat using your account.
To do so, just open the video on your instance (you can for example copy/paste the video url in the search field of your instance).
{{% /notice %}}

## Chatting

To send messages, just type them in the "message" field on the bottom of the screen.
You can send them by pressing the enter key on your keyboard, or by clicking on the "send" button.

If you want to add line breaks in your messages, you can use the "shift+enter" key combinaison.

You can add emojis to your messages.
You can for example use the emojis menu, or directly type emojis shortcuts like `:smiley:`.

You can mention other participants.
To do so, you can type the first nickname letters, then press the tab key.
You can also type `@`: this will directly open the menu.
You can also click on a nickname in the participants list to insert it in the message field.

## Participants list

To see the list of participants, just open the right menu:

![Participants list](/peertube-plugin-livechat/images/open_participants_list.png?classes=shadow,border&height=200px)

You can see that some participants have special rights (moderator, owner, ...).

## Opening full screen

On top of the chat, there is a button to open the chat in fullscreen.
This will open a new browser tab with the following content:

![Fullscreen chat screenshot](/peertube-plugin-livechat/images/fullscreen.png?classes=shadow,border&height=200px)

It can be easier to chat using a full browser tab.

This fullscreen view also adds a top menu with advances features.
This is especially useful for [moderation features](/peertube-plugin-livechat/documentation/user/moderation).

## Changing nickname

You can change your nickname by typing `/nickname your_new_nickname` in the message field.

You can also change your nickname using the top menu when you are in fullscreen mode.
