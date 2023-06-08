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
See bellow for more information.

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

If you are **not using the standard `5269` port**, you must also add a SRV record
for `_xmpp-server._tcp.your_instance.tld.` (same as above, just without the `room.` prefix).
Of course, you can also add this record if you use the standard port. It will also work.

### Using trusted certificates

The self-signed certificates that this plugin uses by default can be rejected by some XMPP servers, for security reasons.

It is possible to use certificates validated by a certification authority.
However, this requires advanced system administration knowledge.
Indeed, due to the multitude of possible use cases, it is impossible to document all situations here.
This documentation will therefore only explain the goal to be reached, and give an example which will only be suitable for a "basic" situation (manual installation of Peertube, using letsencrypt).
If you are in another situation (Docker installation, certificates signed by another authority, etc...), you will have to adapt this approach by yourself.

#### Basic principle

It is up to you to generate valid certificates for domains `your_instance.tld` and `room.your_instance.tld`.
You can use any [method supported by Prosody](https://prosody.im/doc/certificates).

You must then place these certificates in a folder that will be accessible to the `peertube` user, and specify this folder in the plugin setting "Certificate folder".

{{% notice tip %}}
If you want to use the ProsodyCtl utility to import
certificates, this utility is available (once Peertube is started) using
the following command (adapting the path to your Peertube data folder,
and replacing "xxx" with the arguments you wish to pass to
prosodyctl):
`sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl xxx`
{{% /notice %}}

The plugin will check once a day to see if any files have been modified in this folder, and reload Prosody if necessary.

#### Method for the simple case

We assume here that your Peertube installation is "classic" (no use of Docker), and that the certificates are generated by letsencrypt, using the certbot tool.

First of all, we'll have to create a certificate for the subdomain `room.your_instance.tld` : this is the uri of the
MUC (XMPP chat rooms) component. Even if the connections are made on `your_instance.tld`, we will need a valid certificate for this subdomain.

So start by setting up a DNS entry for `room.your_instance.tld`, which points to your server.
You can use a CNAME entry (or an A entry and a AAAA entry).

Next, we'll use nginx (already installed for your Peertube) to generate the certbot certificate.
We will create a new site. In the file `/etc/nginx/site-available/room.peertube`, add:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name room.your_instance.tld;

  location /.well-known/acme-challenge/ {
    default_type "text/plain";
    root /var/www/certbot;
  }
  location / { return 301 https://your_instance.tld; }
}
```

Then enable the site:

```bash
ln -s /etc/nginx/sites-available/room.peertube /etc/nginx/sites-enabled/
systemc reload nginx
```

Then we prepare the folder in which we will later import the certificates.
We assume here that you already have the plugin active. We will create the following folder (if it doesn't already exist),
with the user `peertube` to make sure there are no permissions issues:

```bash
sudo -u peertube mkdir /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/certs
```

Now you have to configure this folder in the plugin settings, for the parameter "Certificate folders".
It's important to do this now, otherwise the certificate import script will put the certificates in the wrong folder.

We will configure certbot to import the generated certificates into the Prosody folder.
We can use the ProsodyCtl utility packaged in the plugin.

Note: for it to be available, the plugin must have been started at least once.

We will create a file `/etc/letsencrypt/renewal-hooks/deploy/prosody.sh` containing:

```bash
#!/bin/sh
/var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl \
  --root \
  --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \
  cert import \
  room.your_instance.tld your_instance.tld /etc/letsencrypt/live
```

Then we ask to generate the certificate:

```bash
certbot -d room.videos.john-livingston.fr
```

If certbot offers you several methods to generate the certificate, choose "nginx".

Normally you should now find the certificates in the configured folder.

Note: the first time you do this, you will have to reload Prosody. The easiest way to do this is to restart Peertube.

#### Method for the Docker case

This method works with the officially supported [Docker guide](https://docs.joinpeertube.org/install/docker) from PeerTube.

First, ensure you create a DNS entry for `room.your_instance.tld`, which points to your server.
You can use a CNAME entry (or an A entry and a AAAA entry).
This is necessary for Let's Encrypt to validate the domain for certificate generation.

Enter the directory where your `docker-compose.yml` file exists.

Open a shell in the certbot container:

```bash
docker exec -it certbot /bin/sh
```

Run certbot:

```bash
certbot
```

You will be presented with a series of prompts.  Enter `2` for the authentication type:

```text
How would you like to authenticate with the ACME CA?
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
```

Enter the domain name `room.your_instance.tld`:

```text
Please enter the domain name(s) you would like on your certificate (comma and/or
space separated) (Enter 'c' to cancel): room.your_instance.tld
```

Enter the directory where the PeerTube webserver serves requests for Let's Encrypt, `/var/www/certbot`:

```text
Input the webroot for <room.your_instance.tld>: (Enter 'c' to cancel): /var/www/certbot
```

You should see output like the following:

```text
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/room.your_instance.tld/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/room.your_instance.tld/privkey.pem
```

Run the below command inside the certbot container to give read access to the new certs and private keys to the peertube group.
*Note*:  This will also make the files readable to the group with id 999 on the host system.
Check the groups on your system to assess this as a risk before running this command.

```bash
chown -R root:999 /etc/letsencrypt/live; \
chmod 750 /etc/letsencrypt/live; \
chown -R root:999 /etc/letsencrypt/archive; \
chmod 750 /etc/letsencrypt/archive; \
find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} \;
```

Exit the certbot container:

```bash
exit
```

Modify your `docker-compose.yml` file, changing the `entrypoint` line under the `certbot` service to the following.
This is the same as the above, but to be automatically executed after every certificate renewal.

```text
  entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot; chown -R root:999 /etc/letsencrypt/live; chmod 750 /etc/letsencrypt/live; chown -R root:999 /etc/letsencrypt/archive; chmod 750 /etc/letsencrypt/archive; find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} +; sleep 12h & wait $${!}; done;"
```

Continuing to modify `docker-compose.yml`, add the certbot certificate volume into the peertube container.
It should look something like this:

```text
  volumes:
    - ./docker-volume/certbot/conf:/etc/letsencrypt
```

Restart your services:

```bash
docker-compose down; docker-comopse up -d
```

In the livechat plugin settings from your PeerTube administration settings, set the certificate directory to the following:

```text
/etc/letsencrypt/live
```

Save the plugin settings and verify Prosody can see the certificates:

```bash
docker-compose exec -u peertube \
  peertube \
  /data/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun \
  prosodyctl \
  --config /data/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \
  check certs
```

### Troubleshooting

If you can't make it work, you can use the diagnostic tool
(there is a button on top of the plugin settings page),
and take a close look on the «Prosody check» section.
