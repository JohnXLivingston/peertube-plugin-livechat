# PeerTube plugin livechat *ALPHA VERSION*

Work In Progress

Plugin that allows to integrated an iframe with an external webchat application.

This is under development. It is not functional yet.

The webchat has to be setup by your own. For example with a XMPP Server and the ConverseJS Javascript.
You will find in this repository example config files to setup this with [Prosody](https://prosody.im),
[converseJS](https://conversejs.org/) and [nginx](https://www.nginx.com/).
This documentation is Work In Progress.

## Settings

There are several options in the plugin settings page.

### Automatically open the chat

If checked, the chat will be loaded as soon as you are on the video page.

### Activate chat for all lives

The chat will be available for all Peertube Live on your instance.

### Activate chat for all non-lives

The chat will be available for all Peertube video that are not live.

### Activate chat for specific videos

You can choose some UUIDs for which the chat will be available.

NB: this feature will probably soon disappear. I planned to add a checkbox in each video settings.

### Webchat url

You have to speficy here the url for you chat application.

You can add the string {{VIDEO_UUID}} in the url, it will be replaced by the video UUID.

It is possible to use a single chat for all your videos if you omit this parameter.

Example:
```https://peertube.im.your_domain?room={{VIDEO_UUID}}```

### Webchat iframe style attribute

You can add some custom styles that will be added to the iframe.
For example a custom height:

```height:400px;```

## XMPP backend with ConverseJS

### ConverseJS

Once you have a XMPP server that allow anonymous authentication, with bosh
(or websocket) enabled, you can - for example - setup a html page that looks like
[this one](documentation/examples/converseJS/index.html). You have of course to
replace the path /conversejs/7.0.3 with your converseJS path, and replace your_domain
by your actual domain.

NB : there is a bug in the converseJS 7.0.4 release. The dist files don't work.
So if you are not building converseJS yourself, use version 7.0.3 instead.

NB: for converseJS to find your server configuration (bosh, websocket, ...),
you have to add a file [/.well-known/host-meta](documentation/examples/converseJS/host-meta).
Please refer to the converseJS documentation.

### XMPP Server: Prosody

You can use Prosody for the XMPP backend.

You can find an example configuration file [here](documentation/examples/prosody/virtualhost.cfg.lua).

You have to place this file in /etc/prosody/conf.avail/your_domain.cfg.lua.

Replace peertube.im.your_domain with the domain you want.

Replace admin@im.your_domain with Jabber ids of users that you want to be admin for your server and public chatrooms.

There must be a DNS record for that domain.

NB : no need to have a DNS record for room.peertube.im.your_domain.

To create the certificate, you can use certbot with letsencrypt:

```certbot certonly --nginx --emailyour_email -d peertube.im.your_domain```

Then:

```prosodyctl --root cert import /etc/letsencrypt/live/```

Please refer to the [Prosody documentation](https://prosody.im/doc/).

NB : if you have not nginx on your server, please replace by the correct parameter.

### XMPP over HTTP: nginx

You can use the reverse proxy nginx to server the Prosody Bosh server.
So your requests will be on the 443 port, and it will minimise cross domains constraints.

There is an example file [here](documentation/examples/nginx/site.conf).

NB: this example files also serve the static html files with converseJS.

NB: it is recommanded to change ```Access-Control-Allow-Origin``` to something else that ```"*"```.
