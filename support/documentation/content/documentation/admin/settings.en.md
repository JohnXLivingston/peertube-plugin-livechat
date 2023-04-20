+++
title="Settings"
description="Plugin Peertube Livechat settings"
weight=10
chapter=false
+++

This section describes the plugin settings page.

## List existing rooms

When pressing the «List rooms» button, all existing chatrooms will be listed.
You can then find them and moderated them.

## Federation

Following settings concern the fedration with other Peertube instances,
and other fediverse softwares.

### Don't display remote chats

By checking this setting, your instance will never display chats from remote videos.

### Don't publish chat information

By checking this setting, your instance will not publish chat information on the fediverse.
Remote Peertube instances will not be aware that they are chat rooms associated to your videos.

**Please note**: if you already had chats in progress, it is possible that the information has already been published.
You will have to wait for the next video update before the information is unpublished.
Also, if you disable this setting, you'll have to wait for the videos to be updated before the information are
published again. This update happens among others when a live event resumes or stops.

**Please note**: this setting only affects the publication of information via the ActivityPub protocol.
It will not prevent a remote application from otherwise detecting the presence of chats, and trying to connect to it.

## Chat behaviour

### Room type

You can choose here to have separate rooms for each video, or to group them by channel.

### Automatically open the chat

If checked, the chat will be loaded as soon as you are on the video page.

### Show the «open in new window» button

If your web chat tool can be opened in a full window, you can add a button to do so.

If you are using an external web chat tool (see the chat mode «Use an external web chat tool»), maybe it will not work in fullscreen (for example if it needs to access the parent window to get video informations). You can disable this button by unchecking this settings.

### Show the «share chat link» button

This feature enables a «share chat link» modal. With this modal, you can generate URLs to join the chat.
The chat can be customized (readonly mode, use the current theme, ...).

You can for example generate a readonly URL and use it in OBS to integrate the chat in your live stream!

This settings allows you to choose who can access this modal.

### Chats are only available for local videos

Peertube is a federated service. Plugins are only available on the server you are browsing.
So, if you are watching a remote video, only you will have the webchat, not users from remote instances.
Therefore, this options is checked by default and prevent displaying a webchat for remote videos.

### Users can activate the chat for their lives

If checked, all live videos will have a checkbox in their properties for enabling the web chat.
The video owner will be able to activate web chats.

### Activate chat for all lives

The chat will be available for all Peertube live videos on your instance.

### Activate chat for all non-lives

The chat will be available for all Peertube video that are not live.

### Activate chat for these videos

You can choose some UUIDs for which the chat will be available.
If you don't want te enable the feature for all videos, you can use this field to list videos UUIDs.
You can add comments: everything rights to the # character will be stripped off, as for empty lines.

### Hide the chat for anonymous users

If checked, anonymous Peertube users won't see the chat.

Note: for now this feature simply hide the chat.
In a future release, the chat will be replaced by a message saying «please log in to [...]».
See [v5.7.0 Release Notes](https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/CHANGELOG.md#570) for more information.

## Theming

### ConverseJS theme

You can choose which theme to use for ConverseJS:

- Peertube theme: this is a special theme, made especially for peertube's integration.
- Default ConverseJS theme: this is the default ConverseJS theme.
- ConverseJS concord theme: this is a theme provided by ConverseJS.

### Automatic color detection

Try to autodetect colors from user's current theme.
When this settings is enabled, the plugin tries to auto-detect colors to apply to the chat theme.
If this is not correctly working for some of your Peertube theme, you can disable this option.

### Webchat iframe style attribute

You can add some custom styles that will be added to the iframe.
For example a custom width:

```width:400px;```

## Chat server advanced settings

### Use system Prosody

The plugin comes with an AppImage that is used to run the [Prosody XMPP server](https://prosody.im).
If this AppImage is not working, you can fallback to the Prosody that is packaged for your server. Just install the `prosody` package.

This settings should only be used if the plugin is broken, and waiting for a patch.

### Disable Websocket

With Peertube >= 5.0.0, this plugin try to use Websocket connection for chatting.
If the user's browser or connection is not compatible, the browser will automatically fallback on the BOSH protocol.

But in rare case, this can fail. For example if you have a reverse proxy in front of Peertube that does not
allow Websocket connection for plugins.
In this case, you can check this setting to disable Websocket connections.

### Prosody port

This is the port that the Prosody server will use. By default it is set to 52800. If you want to use another port, just change the value here.

### Peertube URL for API calls

In some rare cases, Prosody can't call Peertube's API from its public URI.
If you have such issues (see the diagnostic tool result), you can try to set the value
of this settings to `http://localhost:9000` or `http://127.0.0.1:9000`
(supposing your Peertube is listening on port `9000`. Check that in your Peertube `config/production.yaml` file).

### Log rooms content by default

If checked, room content will be archived on the server by default.
This means that users who join the chan will see messages sent before they have joined.

Please note that it is always possible to enable/disable the content logging for a specific room,
by editing its properties.

### Room logs expiration

You can set here the expiration delay for room logs.
See the online help for accepted values.

### Enable connection to room using external XMPP accounts

By enabling this option, it will be possible to connect to rooms using external XMPP accounts and XMPP clients.<br>
Warning, enabling this option can request extra server and DNS configuration.
Please refer to the documentation: [Enable external XMPP account connections](/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/).

### Prosody server to server port

The port that will be used for XMPP s2s (server to server) connections.<br>
You should use the standard 5269 port.
Otherwise you should [setup a specific DNS record](https://prosody.im/doc/s2s).

### Server to server network interfaces

The network interfaces to listen on for server to server connections.<br>
List of IP to listen on, coma separated (spaces will be stripped).<br>
You can use «*» to listen on all IPv4 interfaces, and «::» for all IPv6.<br>
Examples:

- `*, ::`
- `*`
- `127.0.0.1, ::1`
- `172.18.0.42`

### Certificates directory

If this field is empty, the plugin will generate and use self-signed certificates.<br>
If you want to use other certificates, just specify here the folder where
Prosody can find them. Note: the `peertube` user must have read access to this directory.

### Enable client to server connections

This setting enable XMPP clients to connect to the built-in Prosody server.
For now, this option **only allows connections from localhost clients**.

As example, this option can allow an instance of Matterbridge (once it could use anonymous login) *on the same machine* to bridge your chat with another services like a Matrix room.

#### Prosody client to server port

The port that will be used by the c2s module of the built-in Prosody server.
XMPP clients shall use this port to connect.
Change it if this port is already in use on your server.

### Enable external XMPP components

This settings enable XMPP external components to connect to the server.
For now, this option **only allows connections from localhost components**.

This feature could be used to connect bridges or bots.

More informations on Prosody external components [here](https://prosody.im/doc/components).
