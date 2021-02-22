# PeerTube plugin livechat

This plugin can provide webchat for peertube videos.

Warning: the webchat is not provided by this plugin. You have to rely on an external tool.
There are multiple way to provide such functionality:

* by having a Jabber/XMPP server with BOSH or Websocket and anonymous loggin
* by having an external webchat tool, that will be included in an iframe

The connection to a XMPP server is made with [converseJS](https://conversejs.org/).

You will also find in this repository example config files to setup the XMPP server with [Prosody](https://prosody.im).

If you have new feature requests, bugs, or difficulties to setup the plugin, you can use the [Github issue tracker](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues).

If you are a webdesigner or a ConverseJS/Prosody/XMPP expert, and want to help improve this plugin, you are welcome.

## Join me

You can join this XMPP room with any Jabber client if you want to talk with me: plugin-livechat-support@room.im.yiny.org.

## Settings

There are several options in the plugin settings page.

### Automatically open the chat

If checked, the chat will be loaded as soon as you are on the video page.

### Show the «open in new window» button

If your webchat can be opened in a full window, you can add a button to do so.

NB: The builtin ConverseJS is compatible with this feature.

### Chats are only available for local videos

Peertube is a federated service. Plugins are only available on the server you are browsing.
So, if you are watching a remote video, only you will have the webchat, not users from remote instances.
Therefore, this options is checked by default and prevent displaying a webchat for remote videos.

### Activate chat for all lives

The chat will be available for all Peertube Live on your instance.
This is the main purpose of this plugin: providing a chatting experience to user watching a live video.

### Activate chat for all non-lives

The chat will be available for all Peertube video that are not live.

### Activate chat for specific videos

You can choose some UUIDs for which the chat will be available.
If you don't want te enable the feature for all videos, you can use this field to list videos UUIDs.
You can add comments: everything rights to the # character will be stripped off, as for empty lines.

NB: this feature will probably soon disappear. I planned to add a checkbox in each video settings.

### Use builtin ConverseJS

If you have an XMPP server, and don't want to provide a webchat application by yourself, you can use the builtin ConverseJS implementation.

You have to fill the following parameters:

#### Builtin webchat: XMPP service server (mandatory)

The XMPP server. For example: ```peertube.im.your_domain```.

NB: If you have an existing Prosody server, you can use its address if it has anonymous authentication on.
Otherwise, you can create a subdomain (see [the example file](documentation/examples/prosody/virtualhost.cfg.lua)).
The ```peertube.im``` is part of the example, you have to replace the entire value.

#### Builtin webchat: XMPP room template (mandatory)

The room to join on your XMPP server.
You can have a single room for all webchats, or you can use the placeholder ```{{{VIDEO_UUID}}}``` to insert the video UUID and have a custom room for each video.

Example: ```room_{{VIDEO_UUID}}@room.peertube.im.your_domain```

#### Builtin webchat: BOSH uri OR Builtin webchat: WS uri

You have to provide at least one of these two settings.

Example for BOSH: ```https://peertube.im.yiny.org/http-bind```

Example for Websocket: ```wss://peertube.im.yiny.org/xmpp-websocket```

NB: ConverseJS can also use the ```/.well-known/host-meta``` file to discover services.
See ConverseJS [documentation](https://conversejs.org/docs/html/configuration.html#discover-connection-methods)
and XMPP [documentation](https://xmpp.org/extensions/xep-0156.html#httpexamples).

### Webchat url

If you are not using the builtin ConverseJS feature, you can speficy here the url for you chat application.

You can add the string {{VIDEO_UUID}} in the url, it will be replaced by the video UUID.

It is possible to use a single chat for all your videos if you omit this parameter.

Example:
```https://peertube.im.your_domain?room={{VIDEO_UUID}}```

### Webchat iframe style attribute

You can add some custom styles that will be added to the iframe.
For example a custom width:

```width:400px;```

## XMPP backend with ConverseJS

### ConverseJS

You can use the builtin ConverseJS implementation.

#### Custom ConverseJS webchat

If you want to setup your own webchat with converseJS on a different webserver, here is some tips.

Once you have a XMPP server that allow anonymous authentication, with bosh
(or websocket) enabled, you can - for example - setup a html page that looks like
[this one](documentation/examples/converseJS/index.html). You have of course to
replace the path /conversejs/dist with your converseJS path, and replace peertube.im.your_domain
by your actual domain.

NB: converseJS has an option «discover_connection_methods» to find your server configuration (bosh, websocket, ...).
To use it, you have to add a file [/.well-known/host-meta](documentation/examples/converseJS/host-meta).
Please refer to the converseJS documentation.

### XMPP Server: Prosody

You can use Prosody for the XMPP backend.

You can find an example configuration file [here](documentation/examples/prosody/virtualhost.cfg.lua).

You have to place this file in /etc/prosody/conf.avail/peertube.im.your_domain.cfg.lua and create a symlink:
```cd /etc/prosody/conf.d && ln -s /etc/prosody/conf.avail/peertube.im.your_domain.cfg.lua```

Replace peertube.im.your_domain with the domain you want.

Replace admin@im.your_domain with Jabber ids of users that you want to be admin for your server and public chatrooms.
This user has to be on another virtualhost (which don't use anonymous authentication).
It can even be on another XMPP server.
If you have no XMPP account, remove the line (but you will not be able to moderate rooms).

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
