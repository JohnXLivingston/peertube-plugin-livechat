---
title: "Using Matterbridge"
description: "Using Matterbridge to bridge with other chats"
weight: 50
chapter: false
---

The following is based on a tutorial to use Matterbridge with the plugin: <https://gitlab.com/refrac/obs-matterbridge-overlay/-/blob/master/documentation/peertube.md>

## Requirements
- [PeerTube plugin livechat](https://github.com/JohnXLivingston/peertube-plugin-livechat) version 3.2.0 or later.
- [Matterbridge](https://github.com/42wim/matterbridge) version 1.22.4 or later.

The easiest is if the PeerTube instance and Matterbridge run on the same machine.

## Internal connections only (basic)
You will need to enable the new advanced option added in 3.2.0 for built-in Prosody: **`Enable client to server connections`**.

This will allow localhost XMPP clients to connect to the Prosody server.

You may need to add some line to your `/etc/hosts`:

```
127.0.0.1       anon.example.org room.example.org
```
Replace `example.org` by your actual instance domain name. Afterwards you can continue with the Matterbridge configuration below.

## Allow external connections (advanced)

By default, the internal Prosody server only listens on localhost (127.0.0.1). 

On versions later than 10.0.2 a new option call `Client to server network interfaces` was added to allow changing this.

It allows to add a list of IPs to listen on, coma separated (spaces will be stripped). 

You can also use `*` to listen on all IPv4 interfaces, and `::` for all IPv6. Doing so allows external access to the client to server interface.

Then you need to open and forward the C2S port (by default `5222`) in your firewall so that it can be reached from the internet.

And you need to add DNS records for `anon.example.org` and `room.example.org` to your domain. 

In case you are using a port other than `5222` you also need to set the [xmpp-client SRV record](https://prosody.im/doc/dns#srv_records) to the correct port.

## Configurating Matterbridge

In the version 1.22.4, Matterbridge added support for XMPP anonymous connections needed to connect to the built-in prosody.

So in the TOML config file put:

``` TOML
[xmpp.mypeertube]
Anonymous=true
Server="anon.example.org:5222"
Muc="room.example.org"
Nick="Matterbridge"
RemoteNickFormat="[{PROTOCOL}] <{NICK}> "
NoTLS=true
```
- Replace `example.org` by your actual instance domain name.
- Replace `5222` by the actual port if you changed it.
- `mypeertube` can be replaced by another name.
- Using `peertube` as the Nick will provide put PeerTube icon for overlay messages, can be also done with overlay config modification.
- The setting `NoTLS=true` allows connecting to a server with self-signed certificates.

Now you can add this account to gateways and bridge specific live-chat channels.
