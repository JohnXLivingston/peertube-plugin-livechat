---
title: "OBS"
description: "Documentation to stream the chat content using OBS."
weight: 40
chapter: false
---

[OBS](https://obsproject.com) is a popular Free And Open Source streaming software, with advanced capacities for your live streams.
In the current page, you will find some adviced to handle your live chats using OBS.

## OBS Overlay

You can easily include the chat in your stream.

![Embeding the chat in a live stream](/peertube-plugin-livechat/images/embed_chat_in_livestream.png?classes=shadow,border&height=200px)

You can use the "{{% livechat_label share_chat_link %}}" feature to generate an URL to your chat.
This button should be near the chat if you are the video owner (unless it was desactivated by your server admins).

Check the "{{% livechat_label read_only %}}" checkbox in the modal.

![Share link popup](/peertube-plugin-livechat/images/share_readonly.png?classes=shadow,border&height=200px)

Then use this link as a "web browser source" in OBS.

![Embeding the chat in OBS](/peertube-plugin-livechat/images/embed_chat_in_obs.png?classes=shadow,border&height=200px)

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

## Mixing multiple chats in your live stream

You can use the [social_stream browser extension](https://github.com/steveseguin/social_stream#readme) to mix multiple chat source (from Peertube, Twitch, Youtube, Facebook, ...) and include their contents in your live stream.
The compatibility with this plugin was added in recent versions.
