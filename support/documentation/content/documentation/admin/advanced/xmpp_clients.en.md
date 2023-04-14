+++
title="XMPP clients"
description="Allow connections using XMPP clients"
weight=30
chapter=false
+++

This chat module is based on the XMPP protocol, also known as Jabber.
It is therefore possible to connect to the chats using [XMPP client software](https://en.wikipedia.org/wiki/XMPP#Clients).
This can for example be useful to facilitate moderation operations.

For the user documentation associated with these features, please refer to the [user documentation page](/peertube-plugin-livechat/documentation/user/xmpp_clients/).

{{% notice info %}}
Enabling these features requires configuration changes on the server, and
on the DNS records. It is not possible to configure this only from the
Peertube interface, and it requires some basic system some basic system
admin skills.
{{% /notice %}}

## Login to your Peertube account

{{% notice warning %}}
This feature is not yet available, and will come in a future version of the plugin.
{{% /notice %}}

## Connection using an external XMPP account

To enable this feature, you will need to set up your server and DNS
records, so that XMPP clients can find and access the
[Prosody server](https://prosody.im) that this plugin uses internally.

### Plugin settings

Start by going to the livechat plugin settings of your instance, then
enable the setting "Enable connection to room using external XMPP accounts".
By checking this settings, new settings appear below.

First of all, the "Prosody server to server port" field.
This one defaults to 5269, which is the standard port for this service.
You can however change to another port, if this is already in use on your server.

Next, the field "Server to server network interfaces" field allows you to specify
which network interfaces the server should listen on.
The default value "*, ::" indicates to listen on all IP addresses.
You can change these values, if you wish to listen on only certain IP addresses.
The syntax is explained next to the setting.

For the "Certificate folder" setting, you can leave it empty.
In this case, the plugin will automatically generate self-signed certificates.
Some XMPP servers may refuse to connect, depending on their configuration.
In this case, you can indicate here a path on the server, in which you 
must place certificates to be used by the module.
It is up to you to generate and renew them.
You can refer to the [Prosody documentation](https://prosody.im/doc/certificates).

{{% notice tip %}}
If you want to use the ProsodyCtl utility to import
certificates, this utility is available (once Peertube is started) using
the following command (adapting the path to your Peertube data folder,
and replacing "xxx" with the arguments you wish to pass to
prosodyctl):
`sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl xxx`
{{% /notice %}}

### Firewall

You must open the configured port (5269 by default) on your firewall.

If you are using Docker for your Peertube, you need to modify the
`docker-compose.yml` file to open port 5269 of the `peertube` container,
so that the outer world can connect to it.

### DNS

You need to add a [DNS record](https://prosody.im/doc/dns) allowing
remote servers to find the "room.your_instance.tld" component.

The easiest way to do this is to add an SRV record for the "room"
[subdomain](https://prosody.im/doc/dns#subdomains):

* record name: _xmpp-server._tcp.room.your_instance.tld. (replace «your_instance.tld» by your instance uri)
* TTL: 3600
* class: IN
* SRV: 0
* priority: 0
* weight: 5
* port: 5269 (adapt if your changed the default port)
* target: your_instance.tld. (replace by your instance uri)

Be careful to keep the dot after "your_instance.tld".

Using the `dig` command to check your record,
you should get a result similar to this:

```bash
$ dig +short _xmpp-server._tcp.room.videos.john-livingston.fr. SRV
0 5 5269 videos.john-livingston.fr.
```

### Troubleshooting

If you can't make it work, you can use the diagnostic tool
(there is a button on top of the plugin settings page),
and take a close look on the «Prosody check» section.
