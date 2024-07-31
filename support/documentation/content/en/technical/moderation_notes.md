---
title: "Moderator notes overview"
description: "Moderator Notes Application technical overview"
weight: 75
chapter: false
livechatnotranslation: true
---

The livechat plugin includes a [Moderation Notes Application](/peertube-plugin-livechat/documentation/user/streamers/moderation_notes).
The present document describes how this is implemented.

## Basics

This features relies on [XEP-0060: Publish-Subscribe](https://xmpp.org/extensions/xep-0060.html).
This XEP provide a way to store and retrieve items, and to receive push notifications when an item is created/deleted/modified.

There is a Prosody Module, [mod_pubsub_peertubelivechat](https://github.com/JohnXLivingston/peertube-plugin-livechat/tree/main/prosody-modules/mod_pubsub_peertubelivechat), to implement some specific use of the pubsub mechanism.

This module is also used for [Tasks](/peertube-plugin-livechat/technical/tasks/).

We use the [JID+NodeID addressing](https://xmpp.org/extensions/xep-0060.html#addressing-jidnode) to specify some nodes related to each MUC room.
The JID is the MUC room JID, the NodeID is functionnality we want to address.

This modules implement the "livechat-notes" node, to handle moderator notes.

The "livechat-notes" node contains one type of objects: Note (XML Namespaces: `urn:peertube-plugin-livechat:note`).

On the front-end, we have the [livechat-converse-notes](https://github.com/JohnXLivingston/peertube-plugin-livechat/tree/main/conversejs/custom/plugins/notes) plugin for ConverseJS.

## Workflow / Unsubscribing

This is basically the same as for [Tasks](/peertube-plugin-livechat/technical/tasks/).

## Items

Here we describes the content of note items.

* Item tag: `note`
* XML Namespace: `urn:peertube-plugin-livechat:note`
* item attributes:
  * `order`: the order of the note in the note list
* item childs:
  * `description`: the text content of the note
  * `note-about`: an optional tag, if the note is associated to a participant

The `note-about` tag, if present, has following structure:

* Item tag: `note-about`
* XML Namespace: none
* item attributes:
  * `jid`: the JID of the occupant
  * `nick` the nick of the occupant, at time of note creation
* item childs:
  * `occupant-id`: see [XEP-0421](https://xmpp.org/extensions/xep-0421.html).

Example:

```xml
<iq
  from="user@example.com"
  id="64da7e38-4dd5-4f55-b46f-297232232971:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com"
  type="set"
  xmlns="jabber:client">
  <pubsub xmlns="http://jabber.org/protocol/pubsub">
    <publish node="livechat-notes">
      <item id="8ab78df9-a7b9-4315-943d-c340935482af">
        <note
          order="11" 
          xmlns="urn:peertube-plugin-livechat:note"
        >
          <description>Some text.</description>
          <note-about
            jid="khkecy3nkddwxdllgzdub-dv@anon.p1.localhost"
            nick="Mickey"
          >
            <occupant-id
              id="ga4mR2IKEvRKuzN1gJYVafCTbY1gNvgNvNReqdVKexI="
              xmlns="urn:xmpp:occupant-id:0"
            />
          </note-about>
        </note>
      </item>
    </publish>
  </pubsub>
</iq>
```
