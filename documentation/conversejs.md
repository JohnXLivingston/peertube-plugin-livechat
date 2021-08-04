# Connect to an existing XMPP server with ConverseJS

If you have an XMPP server, and don't want to provide a web chat application by yourself, you can use the builtin ConverseJS implementation.

ConverseJS is an Free and Open Source Javascript library to connect to Jabber/XMPP servers.

**Important Note**: If you don't have a running XMPP server, here is a
**[tutorial to install Prosody XMPP Server](./tutorials/prosody.md) on your Peertube instance**.

## Plugin Settings

### Chat mode

Just select «Connect to an existing XMPP server with ConverseJS» as chat mode.

#### XMPP service server (mandatory)

The XMPP server. For example: ```peertube.im.your_domain```.

NB: If you have an existing Prosody server, you can use its address if it has anonymous authentication on.
Otherwise, you can create a subdomain (see [the example file](documentation/examples/prosody/virtualhost.cfg.lua)).
The ```peertube.im``` is part of the example, you have to replace the entire value.

#### XMPP room template (mandatory)

The room to join on your XMPP server.
You can have a single room for all webchats, or you can use any of there placeholders:

- ```{{VIDEO_UUID}}``` to insert the video UUID and have a custom room for each video.
- ```{{CHANNEL_ID}}``` to insert the channel numerical ID and have a custom room for each channel.
- ```{{CHANNEL_NAME}}``` to insert the channel name (see the Peertube's documentation for possible characters) and have a custom room for each channel.

You can mix several placeholders.

Example: ```room_{{VIDEO_UUID}}@room.peertube.im.your_domain```

NB: when using CHANNEL_ID or CHANNEL_NAME with remote videos, you can have unexpected results. You should consider disabling webchat for remote videos.

#### BOSH uri OR Websocket uri

You have to provide at least one of these two settings.

Example for BOSH: ```https://peertube.im.yiny.org/http-bind```

Example for Websocket: ```wss://peertube.im.yiny.org/xmpp-websocket```

NB: ConverseJS can also use the ```/.well-known/host-meta``` file to discover services.
See ConverseJS [documentation](https://conversejs.org/docs/html/configuration.html#discover-connection-methods)
and XMPP [documentation](https://xmpp.org/extensions/xep-0156.html#httpexamples).

### Chat behaviour

These settings are common with other chat modes.
Here is the documentation: [common settings](./common.md).
