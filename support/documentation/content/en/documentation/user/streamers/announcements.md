---
title: "Announcements"
description: "Room owners and administrators can send special announcements in the chat."
weight: 250
chapter: false
---

{{% livechat_version_notice 12.0.0 %}}

Room owners and administrators can send special announcements in the chat.

These messages will be more visible than standard messages.

To send announcements, owners and administrators will have a "{{% livechat_label announcements_message_type %}}" selector on the top of the message field:

![Screenshot of a chat session. On top of the message field, there is a "{{% livechat_label announcements_message_type %}}" selector. In the chat, we can see three types of announcements: a highlighted message, an announcement, and a warning. Each of these announcements have a special color to distinguish them. The announcement and the warning have also bold titles.](/peertube-plugin-livechat/images/announcements.png?classes=shadow,border&height=400px "Announcements")

There are several message types:

* **{{% livechat_label announcements_message_type_standard %}}**: to send a standard message.
* **{{% livechat_label announcements_message_type_highlight %}}**: these messages will simply be highlighted in a blue box.
* **{{% livechat_label announcements_message_type_announcement %}}**: these messages will be in a green box, and a bold "{{% livechat_label announcements_message_type_announcement %}}" title will be added.
* **{{% livechat_label announcements_message_type_warning %}}**: these messages will be in a rend box, and a bold "{{% livechat_label announcements_message_type_announcement %}}" title will be added.

{{% notice info %}}
User that are not owner or administrator of the chatroom can't send such messages.
{{% /notice %}}

{{% notice warning %}}
Note: Standards XMPP clients will display announcements as standard messages.
{{% /notice %}}
