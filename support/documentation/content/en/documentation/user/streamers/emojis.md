---
title: "Custom emojis"
description: "Plugin peertube-plugin-livechat custom emojis"
weight: 330
chapter: false
---

{{% livechat_version_notice  10.1.0 %}}

## Channel emojis

Streamers can add custom emojis to their channels.

On the [channel configuration page](/peertube-plugin-livechat/documentation/user/streamers/channel), open the "{{% livechat_label livechat_configuration_channel_emojis_title %}}" tab:

![Screenshot of the emoji configuration page. There is a form where you can add new emojis.](/peertube-plugin-livechat/images/channel_custom_emojis_configuration.png?classes=shadow,border&height=400px "Channel configuration / Channel emojis configuration")

{{% livechat_label livechat_configuration_channel_emojis_desc %}}

![Screenshot of a chat session, with messages containing custom emojis. The emoji picker is open, and shows custom emojis.](/peertube-plugin-livechat/images/channel_custom_emojis.png?classes=shadow,border&height=400px "Channel configuration / Channel emojis")

{{% livechat_label livechat_emojis_shortname_desc %}}

### Import / Export

On the channel configuration page, there are an "{{% livechat_label action_import %}}" and an "{{% livechat_label action_export %}}" button.
The "{{% livechat_label action_export %}}" button generates a file than you can then import on another channel.

You can also generate a file to import from any other source (for example you can import your Twitch custom emojis).
The file must be a valid JSON file, using the following format:

```json
[
  {
    "sn": ":short_name:",
    "url": "https://example.com/image.png"
  }
]
```

The `sn` attribute is the short name code.
The `url` attribute can be any image url than your browser can access, or a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) representing the file you want to import.
