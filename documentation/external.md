# Use an external webchat tool

You can use any webchat tool that can be included in an «iframe».

## Common settings

First you have to configure [common settings](./common.md).

Then, left settings related to the [builtin prosody](./prosody.md) and [builtin converseJS](./conversejs.md) blank, and fill following settings according to this page.

## Webchat url

If you are not using the builtin ConverseJS feature, you can speficy here the url for you chat application.

You can add the string {{VIDEO_UUID}} in the url, it will be replaced by the video UUID.

It is possible to use a single chat for all your videos if you omit this parameter.

Example:
```https://peertube.im.your_domain?room={{VIDEO_UUID}}```

## Tips: install your own XMPP webchat

Here are some tips if you want to setup a XMPP server yourself.

### Custom ConverseJS webchat

If you want to setup your own webchat with converseJS on a different webserver, here is some tips.

Once you have a XMPP server that allow anonymous authentication, with bosh
(or websocket) enabled, you can - for example - setup a html page that looks like
[this one](./examples/converseJS/index.html). You have of course to
replace the path /conversejs/dist with your converseJS path, and replace peertube.im.your_domain
by your actual domain.

NB: converseJS has an option «discover_connection_methods» to find your server configuration (bosh, websocket, ...).
To use it, you have to add a file [/.well-known/host-meta](./examples/converseJS/host-meta).
Please refer to the converseJS documentation.

### XMPP Server: Prosody

You can use Prosody for the XMPP backend.

You can find an example configuration file [here](./examples/prosody/virtualhost.cfg.lua) or use [this tutorial](./tutorials/prosody.md)
to setup Prosody from scratch.

Replace admin@your_xmpp_provider_domain with Jabber ids of users that you want to be admin for your server and public chatrooms.
This users have to be on another domain/virtualhost (which don't use anonymous authentication).
It can even be on another XMPP server. Or you can add a virtualhost on the
Peertube server's prosody config.
If you have no XMPP account, remove the line (but you will not be able to moderate rooms).

Please refer to the [Prosody documentation](https://prosody.im/doc/) and to [the tutorial](./tutorials/prosody.md) for other modifications
(how to get the ssl certificates, ...).

NB : if you have not nginx on your server, please replace by the correct parameter.

### XMPP over HTTP: nginx

You can use the reverse proxy nginx to server the Prosody Bosh server.
So your requests will be on the 443 port, and it will minimise cross domains constraints.

There is an example file [here](./examples/nginx/site.conf).

NB: this example files also serve the static html files with converseJS.

NB: it is recommanded to change ```Access-Control-Allow-Origin``` to something else that ```"*"``` (your peertubes uri).
