---
title: "Forbidden words"
description: "The bot can automatically moderate messages containing forbidden words."
weight: 20
chapter: false
---

{{% livechat_label livechat_configuration_channel_forbidden_words_desc %}}

![Screenshot of the channel options page, with several fields to configure the forbidden words.](/peertube-plugin-livechat/images/bot_forbidden_words.png?classes=shadow,border&height=400px "Forbidden words configuration")

![Screenshot of a chat message that was deleted, with the following reason: "No url allowed".](/peertube-plugin-livechat/images/bot_deleted_message.png?classes=shadow,border&height=100px "Deleted message")

You can fill several "{{% livechat_label livechat_configuration_channel_forbidden_words_label %}}" fields.
When a user sends a message that match the configured criteria, the message will automatically be deleted.

## {{% livechat_label livechat_configuration_channel_forbidden_words_label %}}

In this field, you can set several words, group of words, or "regular expressions".

{{% livechat_label livechat_configuration_channel_forbidden_words_desc2 %}}

Each time a user sends a message, these words will be tested.
If the message containes one of them, the message will be deleted.

You can for example fill this field with a swear words list.

To get some examples, please check these [forbidden words suggestions](https://framagit.org/Livingston/peertube-plugin-livechat/-/tree/main/support/forbidden_words).

If you have some usefull words lists, you are welcome to contribute to this suggestion page.
There are in the `support/forbidden_words` folder of the livechat source code.
See the [contribution guide](/peertube-plugin-livechat/contributing/) for more information.

{{% notice tip %}}
These words are case insensitive.
{{% /notice %}}

{{% notice tip %}}
You can combine a short [moderation delay](/peertube-plugin-livechat/documentation/user/streamers/moderation_delay) (1 second for example) with the [moderation bot](/peertube-plugin-livechat/documentation/user/streamers/bot) to delete messages containing swear words before any non-moderator user will see them.
{{% /notice %}}

{{% notice warning %}}
This features is still experimental.
There might be some issues with non-latin alphabets.
You can [open an issue](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues) to report your problems.
{{% /notice %}}

## {{% livechat_label livechat_configuration_channel_forbidden_words_regexp_label %}}

By checking this option, each line of the "{{% livechat_label livechat_configuration_channel_forbidden_words_label %}}" field will be considered as a [regular expression](https://en.wikipedia.org/wiki/Regular_expression).

## {{% livechat_label livechat_configuration_applytomoderators_label %}}

{{% livechat_label livechat_configuration_applytomoderators_desc %}}

## {{% livechat_label livechat_configuration_channel_retractation_reason_label %}}

{{% livechat_label livechat_configuration_channel_retractation_reason_desc %}}

## {{% livechat_label livechat_configuration_channel_forbidden_words_comments_label %}}

{{% livechat_label livechat_configuration_channel_forbidden_words_comments_desc %}}
