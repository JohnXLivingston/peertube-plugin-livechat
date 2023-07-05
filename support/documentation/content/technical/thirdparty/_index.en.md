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
* loop through the `attachment` values (if `attachment is not an array, just iterate on this single value)
* search for an entry with `rel` === `discussion`, and with `href` using the `https` scheme (that begins with `https://`)
* if found, open this href

If you want to open the chat room using the XMPP protocol:

* get the Video ActivityPub object,
* if there is no `attachment` key, stop.
* loop through the `attachment` values (if `attachment is not an array, just iterate on this single value)
* search for an entry with `rel` === `discussion`, and with `href` using the `xmpp` scheme (that begins with `xmpp://`)
* if found, open this xmpp uri with your client, or connect to the XMPP room at that address

#### Additional notes

In the ActivityPub object, there is also a `peertubeLiveChat` entry.
Don't use the content of this entry. This is specific to the livechat plugin, and can be changed or removed in a near future.
It is currently required for some endpoint discovery.

### Using RSS

{{% notice warning %}}
This part is not implemented yet, but should be available for v7.2.0 release.
{{% /notice %}}

{{% notice info %}}
This requires Peertube >= 5.2
{{% /notice %}}
