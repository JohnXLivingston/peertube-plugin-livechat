+++
title="User documentation"
description="Plugin peertube-plugin-livechat user documentation"
weight=20
chapter=false
+++

## Moderation

You can access room settings and moderation tools by opening the chat in a new window,
and using the dropdown menu at the top right.

You can list all existing chatrooms: in the plugin settings screen, there is a button «List rooms».

You can delete old rooms: join the room, and use the menu on the top to destroy the room.

### Notes

All instance moderators and admins will be owner of created chat rooms.
If the video is local (not from a remote Peertube), the video owner will be admin in the chat room.

You can use [ConverseJS moderation commands](https://conversejs.org/docs/html/features.html#moderating-chatrooms) to moderate the room.
When you open the chat room in full screen, there will also be a menu with dedicated commands on the top right.

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

### Mixing multiple chats in your live stream

You can use the [social_stream browser extension](https://github.com/steveseguin/social_stream#readme) to mix multiple chat source (from Peertube, Twitch, Youtube, Facebook, ...) and include their contents in your live stream.
The compatibility with this plugin was added in recent versions.
