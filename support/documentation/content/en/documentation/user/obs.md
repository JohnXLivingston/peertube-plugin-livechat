---
title: "OBS"
description: "Documentation to stream the chat content using OBS."
weight: 40
chapter: false
---

[OBS](https://obsproject.com) is a popular Free And Open Source streaming software, with advanced capacities for your live streams.
In the current page, you will find some advices to handle your live chats using OBS.

## OBS Overlay

You can easily include the chat in your video stream.

![Screenshot of a Peertube live, replay, with the chat included at the bottom of the video stream.](/peertube-plugin-livechat/images/embed_chat_in_livestream.png?classes=shadow,border&height=200px "Embeding the chat in a live stream")

You can use the "{{% livechat_label share_chat_link %}}" feature to generate an URL to your chat.
This button should be near the chat if you are the video owner (unless it was desactivated by your server admins).

Check the "{{% livechat_label read_only %}}" checkbox in the modal.

![Screenshot of the "{{% livechat_label share_chat_link %}}" dialog, where the "{{% livechat_label read_only %}}" option is checked.](/peertube-plugin-livechat/images/share_readonly.png?classes=shadow,border&height=200px "Share link popup")

Then use this link as a "web browser source" in OBS.

![Screenshot of the OBS software, where the chat was added as web browser source.](/peertube-plugin-livechat/images/embed_chat_in_obs.png?classes=shadow,border&height=200px "Embeding the chat in OBS")

You can use the "{{% livechat_label transparent_background %}}" option to have a transparent background in OBS.
If you want to customize the background transparency, you can add this CSS in your OBS browser source's settings:

```css
:root {
  --livechat-transparent: rgba(255 255 255 / 90%) !important;
}
```

In the previous CSS snippet, you can of course change the color or the transparency, by adapting the color values.

Note: you can entirely customize chat colors. This is undocumented yet, but you can try this:
in the modal, check «use curent theme colors», then you can try to manually change color values in the URL.
You must use valid CSS color values, and they must be properly URL encoded.

## OBS Dock

{{% livechat_version_notice 10.1.0 %}}

{{% notice warning %}}
This feature can be disabled by the instance's adminitrators.
{{% /notice %}}

You can use OBS "Custom browser docks" to integrate the chat in your OBS while you are streaming.
The livechat plugin offers a way to create long term token that can identify you automatically to join the chat, so you don't have to enter your password in OBS.

To do so, just use the "{{% livechat_label share_chat_link %}}" feature, and open the "{{% livechat_label share_chat_dock %}}" tab.
From there, you can create a new token using the "+" button.

![Screenshot of the "{{% livechat_label share_chat_link %}}" dialog, on the "{{% livechat_label share_chat_dock %}} tab. A token was generated, and is selectionable."](/peertube-plugin-livechat/images/share_dock.png?classes=shadow,border&height=200px "Share link popup - dock tab")

Then, copy the url, and use the "Docks / Custom browser docks" menu from your OBS to add a dock with this URL.

![Screenshot of the OBS Dock menu, with a "Custom Browser Docks" entry.](/peertube-plugin-livechat/images/obs_dock_menu.png?classes=shadow,border&height=200px "OBS - Dock menu")

![Screenshot of the OBS Custom Browser Docks dialog, with a new dock called "My chat".](/peertube-plugin-livechat/images/obs_dock_dialog.png?classes=shadow,border&height=200px "OBS - Dock dialog")

Once you have done, you will have a new dock connected to the chat with your account.

![Screenshot of OBS with a new dock including the chat. The user is logged in with their Peertube account, and can chat directly from OBS.](/peertube-plugin-livechat/images/obs_dock.png?classes=shadow,border&height=200px "OBS - Dock")

{{% notice tip %}}
Tokens are valid to join any chat room. You don't have to generate separate tokens for each of your rooms.
You can also customize the nickame that will be used by changing the `n` parameter in the url.
{{% /notice %}}

Don't share these links to anyone, as it would allow them to connect as yourself.

If a token is compromised, or no more needed, you can revoke them.

{{% notice info %}}
These tokens can be used for other purposes, as connecting to your account with XMPP bots or clients.
This feature is not documented yet, and not officially supported. So use with care.
{{% /notice %}}

## Mixing multiple chats in your live stream

You can use the [social_stream browser extension](https://github.com/steveseguin/social_stream#readme) to mix multiple chat source (from Peertube, Twitch, Youtube, Facebook, ...) and include their contents in your live stream.
The compatibility with this plugin was added in recent versions.
