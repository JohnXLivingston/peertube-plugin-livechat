---
title: "For viewers"
description: "How to chat for stream viewers"
weight: 10
chapter: false
---

## Joining chat rooms

When you are watching a Peertube video that has the chat activated, you will see the chat next to the video:

![Screenshot of a Peertube video page, with a web chat on the right of the video.](/peertube-plugin-livechat/images/chat.png?classes=shadow,border&height=200px "Chat screenshot")

There are two slightly different use cases, depending on wether or not you have an account on the Peertube instance.
See bellow for more informations.

### If you haven't a Peertube account

{{% notice warning %}}
This feature can be disabled by the instance's adminitrators.
{{% /notice %}}

If you are not logged in on the Peertube instance where you are watching the video, you will automatically join the chat.
You will be assigned a random nickname (something like "Anonymous 12345").

![Screenshot of a chat. In the participant list, there is John Livingston, and an anonymous account using "Anonymous 212873" nickname.](/peertube-plugin-livechat/images/chat_with_anonymous.png?classes=shadow,border&height=200px "Chat with an anonymous user")

Before being able to speak in the chat room, you have to enter a nickname in the field on the bottom of the window.

![Screenshot of the chat. The current user is not logged in, and must choose a nickname before being able to write in the chat.](/peertube-plugin-livechat/images/chat_anonymous.png?classes=shadow,border&height=200px "Joining chat when not connected")

#### Log in using an external authentication provider

{{% notice warning %}}
This feature can be disabled by the instance's adminitrators.
{{% /notice %}}

The Peertube instance can configure external authentication providers (Mastodon accounts, Google accounts, ...).
In such case, you will see a "{{% livechat_label login_using_external_account %}}" button, that will open a dialog modal.
In this dialog modal, there will be some buttons to connect using a remote account.

![Screenshot of a Peertube video page, with a chat on the right. At the bottom of the chat, there is a "{{% livechat_label login_using_external_account %}}" button.](/peertube-plugin-livechat/images/external_login_button.png?classes=shadow,border&height=200px "{{% livechat_label login_using_external_account %}} button")

![Screenshot of a dialog with an "OpenID Connect" button.](/peertube-plugin-livechat/images/external_login_dialog_oidc.png?classes=shadow,border&height=200px "External login dialog - OpenID Connect")

Once you signed in the remote account, and have granted access, your nickname and avatar (if available) will be automatically fetched.
No other data will be stored.
These data will be automatically deleted several hours after your quit the chat.

### If you have a Peertube account

If you are connected with your Peertube account, you will automatically join the room, using your Peertube nickname and avatar.

{{% notice tip %}}
If you are watching a live on an instance on which you have no account, but you have an account on another instance:
if the livechat plugin is installed on both instances, it is possible to join the chat using your account.
To do so, just open the video on your instance (you can for example copy/paste the video url in the search field of your instance).
{{% /notice %}}

## If you have a Peertube account on another Peertube instance

{{% notice info %}}
This feature comes with the livechat plugin version 9.0.0.
{{% /notice %}}

If you have a Peertube account, but not on the current instance, there is a "{{% livechat_label login_using_external_account %}}" button.
This button will open a dialog where you can enter your Peertube instance URL.
Once you entered it, it will check if the livechat plugin is available on the remote instance, and if the video is available.
If it is the case, you will be redirected to the video on the remote instance.

![Screenshot of a Peertube video page, with a chat on the right. At the bottom of the chat, there is a "{{% livechat_label login_using_external_account %}}" button.](/peertube-plugin-livechat/images/external_login_button.png?classes=shadow,border&height=200px "{{% livechat_label login_using_external_account %}} button")

![Screenshot of the "{{% livechat_label login_using_external_account %}}" dialog. There is a field where you can enter a Peertube url.](/peertube-plugin-livechat/images/external_login_dialog.png?classes=shadow,border&height=200px "External login dialog")

## Chatting

To send messages, just type them in the "message" field on the bottom of the screen.
You can send them by pressing the enter key on your keyboard, or by clicking on the "send" button.

If you want to add line breaks in your messages, you can use the "shift+enter" key combination.

You can add emojis to your messages.
You can for example use the emojis menu, or directly type emojis shortcuts like `:smiley:`.

You can mention other participants.
To do so, you can type the first nickname letters, then press the tab key.
You can also type `@`: this will directly open the menu.
You can also click on a nickname in the participants list to insert it in the message field.

## Participants list

To see the list of participants, just open the right menu:

![Screenshot of a chat session, with on the right the list of participants.](/peertube-plugin-livechat/images/open_participants_list.png?classes=shadow,border&height=200px "Participants list")

You can see that some participants have special rights (moderator, owner, ...).

## Chat dropdown menu

There is a dropdown menu on the top of the chat, with some advanced features.
This is especially useful for [moderation features](/peertube-plugin-livechat/documentation/user/streamers/moderation).
Available features depends on your access level.

![Screenshot of the dropdown menu at the top of the chat. Several entries are available.](/peertube-plugin-livechat/images/top_menu.png?classes=shadow,border&height=200px "Chat menu")

## Opening full screen

On top of the chat, there is a button to open the chat in fullscreen.
This will open a new browser tab with the following content:

![Screenshot of a chat using the full web page.](/peertube-plugin-livechat/images/fullscreen.png?classes=shadow,border&height=200px "Fullscreen chat screenshot")

It can be easier to chat using a full browser tab.

## Changing nickname

You can change your nickname by typing `/nick your_new_nickname` in the message field.

You can also change your nickname using the chat menu.
