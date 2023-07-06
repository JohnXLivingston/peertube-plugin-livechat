+++
title="Third party"
description="Displaying the livechat with 3rd party software."
weight=20
chapter=false
+++

{{% notice warning %}}
This page describes experimental features.
These features are available with the plugin version >= 7.2.0.
{{% /notice %}}

## Introduction

Peertube is part of the Fediverse. So Peertube video can be watched from other Peertube instances,
and from various other softwares:

* from a Mastodon (or other fediverse application) instance,
* from a mobile app (Fedilab, Tusky, ...),
* from desktop fediverse app,
* ...

This livechat plugin is using well known standards, so it is possible to join chat rooms even when not viewing the video on Peertube.

There are basically 2 ways to join the chat room associated to a video:

* opening a web page (with an url like `https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535`),
* using a XMPP client (and joining a room like `xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join`)

{{% notice warning %}}
Joining the chat using a XMPP client is not always possible. It requires some DNS and server configuration.
It will only be possible if instance's admins have correctly setup the
[external XMPP clients connection](/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/) feature.
{{% /notice %}}

{{% notice warning %}}
Don't try to gues these url and connection methods yourself. Please report to next chapters.
{{% /notice %}}

## Chat discovery

### Using ActivityPub

The livechat plugin adds some data in Video ActivityPub objects, so that the chat can be discovered.

{{% notice info %}}
This requires Peertube >= 5.1
{{% /notice %}}

This follows the [FEP-1970](https://codeberg.org/fediverse/fep/src/branch/main/fep/1970/fep-1970.md) recommendations.

{{% notice warning %}}
At the time of the writing, this FEP is in draft status, and the livechat plugin is a Proof-of-concept.
Until the FEP is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
{{% /notice %}}

Basically, the chat will be declared as `attachments` on the `Video` object, using the `discussion` relation.

By default, here is an example of what you will get:

```javascript
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1",
    {
      "RsaSignature2017": "https://w3id.org/security#RsaSignature2017"
    },
    {
      // ...
    }
  ],
  "to": [
    "https://www.w3.org/ns/activitystreams#Public"
  ],
  "cc": [
    "https://yourinstance.tld/accounts/root/followers"
  ],
  "type": "Video",
  "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535",
  "name": "The video title",
  // ...
  "url": [ /* ... */ ],
  "attachment": [
    {
      "type": "Link",
      "name": "Chat for live stream: The video title",
      "rel": "discussion",
      "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535"
    }
  ]
}
```

In case the instance has activated the
 [external XMPP clients connection](/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/) feature:

```javascript
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1",
    {
      "RsaSignature2017": "https://w3id.org/security#RsaSignature2017"
    },
    {
      // ...
    }
  ],
  "to": [
    "https://www.w3.org/ns/activitystreams#Public"
  ],
  "cc": [
    "https://yourinstance.tld/accounts/root/followers"
  ],
  "type": "Video",
  "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535",
  "name": "The video title",
  // ...
  "url": [ /* ... */ ],
  "attachment": [
    {
      "type": "Link",
      "name": "Chat for live stream: The video title",
      "rel": "discussion",
      "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535"
    },
    {
      "type": "Link",
      "name": "Chat for live stream: The video title",
      "rel": "discussion",
      "href": "xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join"
    }
  ]
}
```

#### Algorithm

If you want to display the chat in a web page or in an iframe, here is what you should do:

* get the Video ActivityPub object,
* if there is no `attachment` key, stop.
* loop through the `attachment` values (if `attachment` is not an array, just iterate on this single value)
* search for an entry with `rel` === `discussion`, and with `href` using the `https` scheme (that begins with `https://`)
* if found, open this href

If you want to open the chat room using the XMPP protocol:

* get the Video ActivityPub object,
* if there is no `attachment` key, stop.
* loop through the `attachment` values (if `attachment` is not an array, just iterate on this single value)
* search for an entry with `rel` === `discussion`, and with `href` using the `xmpp` scheme (that begins with `xmpp://`)
* if found, open this xmpp uri with your client, or connect to the XMPP room at that address

#### Additional notes

In the ActivityPub object, there is also a `peertubeLiveChat` entry.
Don't use the content of this entry. This is specific to the livechat plugin, and can be changed or removed in a near future.
It is currently required for some endpoint discovery.

### Using Podcast RSS feed

The livechat plugin adds some data in Podcast RSS feeds under the [`<podcast:liveItem>`](https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md#live-item), so that the chat can be discovered for live streams.

{{% notice info %}}
This requires Peertube >= 5.2
{{% /notice %}}

{{% notice info %}}
The `<podcast:chat>` element is currently only supported for live streams.
{{% /notice %}}

This follows the [`<podcast:chat>`](https://github.com/Podcastindex-org/podcast-namespace/discussions/502) proposal.

{{% notice warning %}}
At the time of the writing, this proposal is in draft status, and the livechat plugin is a Proof-of-concept.
Until the proposal is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
{{% /notice %}}

Basically, the chat will be declared as tag under on the `<podcast:liveItem>` element.

By default, here is an example of what you will get:

```xml
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z">
  <title>The video title</title>
  <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid>
  <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link>
  <podcast:socialInteract
    uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535"
    protocol="activitypub"
    accountUrl="https://yourinstance.tld/a/youraccount"
  />
  <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" />
  <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true">
    <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" />
  </podcast:alternateEnclosure>
  <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" />
  <podcast:chat 
    server="yourinstance.tld"
    protocol="xmpp"
    embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535"
  />
</podcast:liveItem>
```

In case the instance has activated the
 [external XMPP clients connection](/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/) feature:

```xml
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z">
  <title>The video title</title>
  <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid>
  <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link>
  <podcast:socialInteract
    uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535"
    protocol="activitypub"
    accountUrl="https://yourinstance.tld/a/youraccount"
  />
  <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" />
  <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true">
    <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" />
  </podcast:alternateEnclosure>
  <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" />
  <podcast:chat 
    server="yourinstance.tld"
    protocol="xmpp"
    space="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld" 
    embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535"
  />
</podcast:liveItem>
```

#### Algorithm

If you want to display the chat in a web page or in an iframe, here is what you should do:

* get the Podcast RSS feed for the channel,
* if there is no `<podcast:liveItem>` element under the `<channel>`, stop.
* find the `<podcast:liveItem>` you are looking for
  * `<podcast:socialInteract>` can be used to cross-reference the items with ActivityPub
* if there is no `<podcast:chat>` element under the `<podcast:liveItem>`, stop.
* loop through the `<podcast:chat>` values (if `<podcast:chat>` is not an array, just iterate on this single value)
  * there should only be one, but you should expect to handle several just in case
* search for the first entry `protocol` === `xmpp` and an `embedUrl` attribute
* if found, open this embedUrl

If you want to open the chat room using the XMPP protocol:

* get the Podcast RSS feed for the channel,
* if there is no `<podcast:liveItem>` element under the `<channel>`, stop.
* find the `<podcast:liveItem>` you are looking for
  * `<podcast:socialInteract>` can be used to cross-reference the items with ActivityPub
* loop through the `<podcast:chat>` values (if `<podcast:chat>` is not an array, just iterate on this single value)
  * there should only be one, but you should expect to handle several just in case
* search for the first entry `protocol` === `xmpp` and a `space` attribute
  * space should be an XMPP JID for a MUC
* if found, open this XMPP JID with your client after converting it to a join URI, or connect to the XMPP room at that address
