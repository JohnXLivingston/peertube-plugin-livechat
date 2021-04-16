# Use an external XMPP server

**Important Note**: If you don't have a running XMPP server, here is a
**[tutorial to install Prosody XMPP Server](./tutorials/prosody.md) on your Peertube instance**.

## Plugin Settings

### Common settings

First you have to configure [common settings](./common.md).

Then, left settings related to the [builtin prosody](./prosody.md) blank, and fill following settings according to this page.

### Use builtin ConverseJS

Check this checkbox to use this mode.

If you have an XMPP server, and don't want to provide a webchat application by yourself, you can use the builtin ConverseJS implementation.

If you don't have a running XMPP server, you can use
[this tutorial](./tutorials/prosody.md) to setup Prosody Server
on your Peertube's instance.

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
