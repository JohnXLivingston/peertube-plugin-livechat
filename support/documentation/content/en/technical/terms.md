---
title: "Terms&Conditions"
description: "Terms&Conditions implementation"
weight: 65
chapter: false
livechatnotranslation: true
---

You can set terms & conditions on the instance level (called "global terms"), or at the streamers' channels level (called "muc terms", as it is related to muc rooms).

## Backend

The `mod_muc_peertubelivechat_terms` prosody modules handles the terms configuration.

It has a configuration option for the global terms.
It also adds muc terms in the room data.

When a new occupant session is opened, this modules sends him messages containing the global and muc terms (if set).

Here is an example of sent messages:

```xml
<message xmlns="jabber:client" id="_iRSEs061gi5GBjF7zGh7f-M" type="groupchat" to="root@p1.localhost/QH1H89H1" from="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost/Peertube">
  <body>The global terms.</body>
  <x-livechat-terms type="global" />
  <delay xmlns="urn:xmpp:delay" stamp="2024-06-25T11:02:25Z" />
  <stanza-id by="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost" xmlns="urn:xmpp:sid:0" id="InoL5fonvOoR8X9gOlAYsz_N" />
</message>

<message xmlns="jabber:client" id="_iRSEs061gi5GBjF7zGh7f-M" type="groupchat" to="root@p1.localhost/QH1H89H1" from="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost/Peertube">
  <body>The muc terms.</body>
  <x-livechat-terms type="muc" />
  <delay xmlns="urn:xmpp:delay" stamp="2024-06-25T11:02:25Z" />
  <stanza-id by="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost" xmlns="urn:xmpp:sid:0" id="InoL5fonvOoR8X9gOlAYsz_N" />
</message>
```

Notice the `x-livechat-terms` tag.

Standard XMPP clients will show these messages as standard message.

Message are sent from a "service nickname": this occupant does not exist.
The service nickname is an option of the module (livechat use "Peertube", hard coded for now).
This nickname is reserved, no-one can spoof it (the module will bounce any request to use this nickname).
We must do so, because without nickname, some XMPP clients won't show the messages (tested with Gajim).

We also add a `delay` tag, to trick the moderation bot (see comments in code).
This also ensure clients will not drop the message because there is no occupant with this name.

When muc terms are updated, the new terms will be broadcasted.

To avoid anyone spoofing terms & conditions, incoming message stanza are filtered, and any `x-livechat-terms` tag will be removed.

Message history is disabled for message containing the `x-livechat-terms`, so that messages broadcasted when the terms change are not stored by muc_mam modume ("Message Archiving Management").

## Frontend

For standard XMPP clients, terms will be shown as delayed messages.

For the livechat frontend, there is a `livechat-converse-terms` Converse plugin that will intercept these messages, and prevent them to be shown in the chat history.

It will also create infobox at the top of the chat to display the terms content.
If muc terms are updated, the new terms will be shown.

Users can hide the terms.
To remember that a user has already hidden the terms, we store the content in localStorage.
We will only show terms again if the content in this localStorage changes.
We do so for both global terms and muc terms, in two separate localStorage keys.
The keys in localstorage does not depends on the room JID or the origin peertube instance.
This means that message will be shown again:

* if terms are modified
* if the user switch to another channel
* if the user switch to a video from a different peertube instance
