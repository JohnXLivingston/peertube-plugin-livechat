+++
title="OBS"
description="Documentation to stream the chat content using OBS."
weight=10
chapter=false
+++

## OBS Overlay

If you are using OBS for streaming, you can easily include the chat in your stream.

You can use the «share chat link» feature to generate an URL to your chat.
The button should be near the chat if you are the video owner (unless it was desactivated by your server admins).

Check the «readonly» checkbox in the modal.
Then use this link as a «web browser source» in OBS.

You can use the «Transparent background» to have a transparent background in OBS.
If you want to customize the background transparency, you can add this CSS in your OBS browser source's settings:

```css
:root {
  --livechat-transparent: rgba(255 255 255 / 90%) !important;
}
```

Note: you can customize colors. This is undocumented yet, but you can try this:
in the modal, check «use curent theme colors», then you can try to manually change color values in the URL.
You must use valid CSS color values, and they must be properly URL encoded.

## Mixing multiple chats in your live stream

You can use the [social_stream browser extension](https://github.com/steveseguin/social_stream#readme) to mix multiple chat source (from Peertube, Twitch, Youtube, Facebook, ...) and include their contents in your live stream.
The compatibility with this plugin was added in recent versions.
