# Tutorial: quick setup for Prosody XMPP server on your Peertube's instance

**IMPORTANT NOTE:** This tutorial is not the best way to use this plugin. If you want to use the recommanded Prosody setup, please refer to [this](../installation.md) and [this](../prosody.md).

**IMPORTANT NOTE: if you are comming from the Framasoft blog post, the right link is [this one](../prosody.md).**

## Abstract

This tutorial is meant to help you configure [Prosody](https://prosody.im)
on your Peertube server.

This tutorial is for debian-like systems (debian, ubuntu, ...).
It was tested with Debian 10 (Buster).

## Important notes about this tutorial

### File editor

I use the `editor` command to edit files. This is a command that switch to
the configured editor («vi», «vim», «nano», ...).
If you don't have the `editor` command, you can replace with your favorite
editor command.
To change the editor used by `editor`, you can do:

```bash
sudo update-alternatives --config editor
```

If you don't know which editor to choose, the Nano editor is often a good choice
for non-sysadmin users.
If you run `vi` or `vim` accidentaly and are stuck withing (that is a *very*
common mistake), type `:q!` to exit.

## Step 1: install Prosody

Prosody is a XMPP server. XMPP is a communication protocol.
It is a robust instant messaging protocol, used by many softwares.

```bash
sudo apt-get update
sudo apt-get install -y prosody
```

## Step 2: configure Prosody

Prosody works with a «virtualhosts» mecanism. You can define multiple
virtualhosts, each one having his own configuration.

**Imporante note**: some settings are global. If you have already a
prosody installed (using it as a Jabber server, or because you installed Jisti),
some settings may affect existing services. In such case, please read Prosody
documentation and be sure to understand what you are doing.

First step, we are going to create a configuration file.

```bash
sudo editor /etc/prosody/conf.avail/peertube.cfg.lua
```

Then you can add this content to the file:

```lua
-- these global settings can affect an existing Prosody installation.
-- Use them with care.
-- NB: prosody http will be behind the nginx reverse proxy.
cross_domain_bosh = false;
consider_bosh_secure = true;
cross_domain_websocket = false;
consider_websocket_secure = true;
https_ports = {};
trusted_proxies = { "127.0.0.1", "::1" }

VirtualHost "${PEERTUBE_DOMAIN}"
  authentication = "anonymous"
  allow_anonymous_s2s = false
  ssl = {
    key = "/etc/prosody/certs/${PEERTUBE_DOMAIN}.key";
    certificate = "/etc/prosody/certs/${PEERTUBE_DOMAIN}.crt";
  }
  modules_enabled = {
    "http";
    "bosh";
    "ping";
    -- TODO: does not work for now "websocket";
  }
  http_host = "${PEERTUBE_DOMAIN}"
  http_external_url = "http://${PEERTUBE_DOMAIN}"
  -- if you have an external XMPP account
  -- that you want to be moderator,
  -- uncomment this line and set your adress
  -- admins = { "admin@your_xmpp_provider_domain" }

Component "room.${PEERTUBE_DOMAIN}" "muc"
  -- if you have an external XMPP account
  -- that you want to be moderator,
  -- uncomment this line and set your adress
  -- admins = { "admin@your_xmpp_provider_domain" }

  -- if you want room persistence, uncomment these lines
  -- (requires prosody>=0.11, for older version there is the mam_muc module)
  -- modules_enabled = { "muc_mam" }
  -- muc_log_by_default = true
  -- muc_log_presences = true
  -- log_all_rooms = true
  -- muc_log_expires_after = "1w"
  -- muc_log_cleanup_interval = 4 * 60 * 60

  restrict_room_creation = "local"
  muc_room_locking = false
  muc_tombstones = false
  muc_room_default_language = "fr"
  muc_room_default_public = true
  muc_room_default_persistent = false
  muc_room_default_members_only = false
  muc_room_default_moderated = false
  muc_room_default_public_jids = false
  muc_room_default_change_subject = false
  muc_room_default_history_length = 20

```

You have to replace `${PEERTUBE_DOMAIN}` with your actual Peertube server
domain name. You can do it by hand, or with the following command
(replace `[peertube-domain]` with your domain):

```bash
sudo sed -i 's/${PEERTUBE_DOMAIN}/[peertube-domain]/g' /etc/prosody/conf.avail/peertube.cfg.lua
```

By default, if a chat room is empty, it content will be dropped.
If you want to activate room persistence (chat room content will be kept even
if there is no more users), uncomment the lines in the config file,
and change the `muc_log_expires_after` parameter as you want. Please refer to
the [muc_mam module documentation](https://prosody.im/doc/modules/mod_muc_mam).
This requires Prosody >= 0.11. For older version, see
[mam_muc](https://modules.prosody.im/mod_mam_muc.html).

We have now to activate this configuration file:

```bash
sudo ln -s /etc/prosody/conf.avail/peertube.cfg.lua /etc/prosody/conf.d/
```

You have now to import your ssl certificates from your web server.
Prosody use a different certificate format than your web server.
See [Prosody certificates documentation](https://prosody.im/doc/certificates)
or [Prosody letsencrypt documentation](https://prosody.im/doc/letsencrypt)

**Important note**: This assume you are using letsencrypt certificates and
`certbot` to update them.
If you are using other certificates, you have to change the commande. Please
reffer to the [Prosody](https://prosody.im) documentation
([Prosody certificates documentation](https://prosody.im/doc/certificates)
or [Prosody letsencrypt documentation](https://prosody.im/doc/letsencrypt)).

```bash
sudo prosodyctl --root cert import /etc/letsencrypt/live/
```

To do this automatically after each certificate renewall, you can create
this file:

```bash
sudo touch /etc/letsencrypt/renewal-hooks/deploy/prosody.sh
sudo chmod u+x /etc/letsencrypt/renewal-hooks/deploy/prosody.sh
sudo editor /etc/letsencrypt/renewal-hooks/deploy/prosody.sh
```

With this content:

```bash
#!/bin/sh
/usr/bin/prosodyctl --root cert import /etc/letsencrypt/live

```

You can now restart Prosody.

```bash
sudo systemctl restart prosody
```

And you can check prosody status with:

```bash
sudo systemctl status prosody
```

## Step 3: Configure nginx

Open your peertube's nginx config file:

```bash
sudo editor /etc/nginx/sites-enabled/peertube
```

At the end of the `server { ... }` section, **just before the final curly bracket (`}`)**
(assuming you have no custom modification in this file), add:

```nginx
  location /http-bind {
    proxy_pass  http://localhost:5280/http-bind;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_buffering off;
    tcp_nodelay on;
  }

  location /xmpp-websocket {
    proxy_pass http://localhost:5280/xmpp-websocket;
    proxy_http_version 1.1;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Upgrade $http_upgrade;

    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_read_timeout 900s;
  }

```

Save the file, and reload nginx:

```bash
sudo systemctl reload nginx
```

## Step 4: Configure the plugin

**NB**: If you have not installed peertube-plugin-livechat it is time to do so
now.

Now log in to your peertube instance, and go to the plugin settings page
(/admin/plugins/show/peertube-plugin-livechat).
Change settings has you want (`Automatically open the chat`, ...).

Check `Use builtin ConverseJS`.

Set `Builtin webchat: XMPP service server` to `PEERTUBE_DOMAIN`,
replacing `PEERTUBE_DOMAIN` by your actual peertube domain.
Don't add `https://` before, you should only set your domain (example.com).

Set `Builtin webchat: XMPP room template` to something like
`video_{{VIDEO_UUID}}@room.PEERTUBE_DOMAIN`, once again by replacing
`PEERTUBE_DOMAIN` by your actual peertube domain.

Set `Builtin webchat: BOSH uri` to `https://PEERTUBE_DOMAIN/http-bind`
(you got the point... replace `PEERTUBE_DOMAIN` by your actual peertube domain).

**TODO: does not work for now**
~~Set `Builtin webchat: WS uri` to `wss://PEERTUBE_DOMAIN/xmpp-websocket`
(/!\\ the scheme is `wss`, not `https`!).~~

Save the settings.

That's it!

## TODOs

* TODO: mention that the first user will be granted with moderator rights and
  how to handle this.
* TODO: how to open with jabber clients (or prevent that).
* TODO: firewall configuration.
* TODO: talk about security issues
  (for now, rooms can be created without restriction).
* TODO: talk about legal notices (specially in case of persistent rooms).
