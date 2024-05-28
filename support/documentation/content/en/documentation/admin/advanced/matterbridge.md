---
title: "Using Matterbridge"
description: "Using Matterbridge to bridge with other chats"
weight: 50
chapter: false
---

The following is based on a tutorial to use Matterbridge with the plugin: [Matterbridge + Peertube](https://gitlab.com/refrac/obs-matterbridge-overlay/-/blob/master/documentation/peertube.md)

## Requirements

- [PeerTube plugin livechat](https://github.com/JohnXLivingston/peertube-plugin-livechat) version 3.2.0 or later.
- [Matterbridge](https://github.com/42wim/matterbridge) version 1.22.4 or later.

The easiest is if the PeerTube instance and Matterbridge run on the same server.

## Internal connections only (basic)

You will need to enable `{{% livechat_label prosody_c2s_label %}}` in the livechat plugin settings.

This will allow localhost XMPP clients to connect to the Prosody XMPP server.

You may need to add some line to your `/etc/hosts`:

```
127.0.0.1       anon.example.com room.example.com
```

Replace `example.com` by your actual instance domain name. Afterwards you can continue with the Matterbridge configuration below.

## Allow external connections (advanced)

By default, the internal Prosody XMPP server only listens on localhost (127.0.0.1).

On livechat versions >= 10.1.0 a new option call `Client to server network interfaces` was added to allow changing this.

It allows to add a list of IPs to listen on, coma separated (spaces will be stripped).

You can also use `*` to listen on all IPv4 interfaces, and `::` for all IPv6. Doing so allows external access to the client to server interface.

Then you need to open the C2S port (by default `52822`, but check the plugin settings to get the current value) in your firewall so that it can be reached from the internet.
If you don't want to use C2S connections for anything else than your Matterbridge service, you should restrict access to this port to your Matterbridge server IP.

You also need to add DNS records (A and AAAA) for `anon.example.com` and `room.example.com` (replace `example.com` by your actual domain name).

In case you are using a port other than `5222` (XMPP standard port) you also need to set the [xmpp-client SRV record](https://prosody.im/doc/dns#srv_records) to the correct port.

## Configurating Matterbridge

In the version 1.22.4, Matterbridge added support for XMPP anonymous connections needed to connect to the built-in prosody.

So in the TOML config file put:

``` TOML
[xmpp.mypeertube]
Anonymous=true
Server="anon.example.com:52822"
Muc="room.example.com"
Nick="Matterbridge"
RemoteNickFormat="[{PROTOCOL}] <{NICK}> "
NoTLS=true
```

- Replace `example.com` by your actual instance domain name.
- Replace `52822` by the actual port if you changed it.
- `mypeertube` can be replaced by another name.
- Using `peertube` as the Nick will provide put PeerTube icon for overlay messages, can be also done with overlay config modification.
- The setting `NoTLS=true` allows connecting to a server with self-signed certificates.

Now you can add this account to gateways and bridge specific live-chat channels.
