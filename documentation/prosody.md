# Prosody server controlled by Peertube

This is the recommended setup mode for this plugin.

Peertube will launch a [Prosody](https://prosody.im) process, with a custom configuration.

Prosody is a Free and Open Source XMPP/Jabber server software.

With this mode, the Peertube server will be able to communicate with the Prosody server, with following features:

- auto login: if a user is logged in on the Peertube instance, it will be automatically authenticated in the web chat
- access rights: Peertube instance's administrators and moderators will automatically be owner for all created chat rooms.
- access rights: the Peertube's user who has added the video will automatically be moderator on the chat room.
- moderation tools will be enabled
- it will not be possible to create a room that is not linked to a video
- chat room will automatically get some informations from the video (title, ...)

## Prerequisite

### For standard Peertube installations

You have to install [Prosody](https://prosody.im) on your server:

```bash
sudo apt-get install prosody
```

If you are not using prosody for anything else on your server, you can then disabled it:

```bash
sudo systemctl disable prosody && sudo systemctl stop prosody
```

And that's it!

The Prosody process launched by the plugin will listen on a specific port, and only on the localhost interface.
You don't to open any external port on your firewall.
The default local port will be 52800 and can be changed in the plugin settings.

### For Docker installations

In the docker-compose.yml file, replace the peertube service image
`image: chocobozzz/peertube:production-bullseye` by `image: johnxlivingston/peertubelivechat:production-bullseye`.

NB: if you are using debian buster (oldstable) image, replace instead
`image: chocobozzz/peertube:production-buster` by `image: johnxlivingston/peertubelivechat:production-buster`.

And that's it!

You can find the source for this Dockerfile [here](../docker/Dockerfile.bullseye) (or for debian buster/oldstable [here](../docker/Dockerfile.buster)).

### Yunohost

Yunohost comes with the Metronome XMPP server. Metronome is an old fork of Prosody, but this plugin is not compatible.
Unfortunately, the Metronome package conflicts with the Prosody package.
You can't install both using debian packages.

These packages are conflicting, because the two services can't run simultanously (ports would conflict).

However, this plugin does not need the Prosody service to run. It will launch its own process, on non-standard ports.
So you can easily build Prosody from sources, so that the plugin can use the executable.

The official documentation is here: [installing_from_source](https://prosody.im/doc/installing_from_source).
Please refer to this link for up-to-date instructions.
Here is a summary of the steps needed:

- create a folder where you will build prosody (anywhere in your home dir)
- in this folder, follow the instructions from [installing_from_source](https://prosody.im/doc/installing_from_source):
  
```bash
wget https://prosody.im/downloads/source/prosody-0.11.11.tar.gz # check on the official documentation if there is a newer version
tar xzf prosody-0.11.11.tar.gz
cd prosody-0.11.11
sudo apt-get build-dep prosody # (this should work, even if Metronome is installed ; otherwise try: sudo apt install lua5.2 liblua5.2-dev libidn11-dev libssl-dev )
./configure
make
sudo make install # should install Prosody in /usr/local.
```

## Settings

### Chat mode

Just select «Prosody server controlled by Peertube» as chat mode.

### Room type

You can choose here to have separate rooms for each video, or to group them by channel.

#### Prosody port

This is the port that the Prosody server will use. By default it is set to 52800. If you want to use another port, just change the value here.

### Chat behaviour

These settings are common with other chat modes.
Here is the documentation: [common settings](./common.md).

### Prosody advanced settings

#### Show the «share chat link» button

This feature enable a «share chat link» modal. With this modal, you can generate urls to join the chat.
The chat can be customized (readonly mode, use the current theme, ...).

You can for example generate a readonly url and use it in OBS to integrate the chat in your live stream!

This settings allows you to choose who can access this modal.

#### Peertube url for API calls

In some rare cases, Prosody can't call Peertube's API from its public URI.
If you have such issues (see the diagnostic tool result), you can try to set the value
of this settings to `http://localhost:9000` or `http://127.0.0.1:9000`
(supposing your Peertube is listening on port `9000`, check this in your Peertube `config/production.yaml` file).

#### Log rooms content by default

If checked, room content will be archived on the server by default.
This means that users who join the chan will see messages send before then joined.

Please note that it is always possible to enable/disable the content archiving for a specific room,
by editing its properties.

#### Room logs expiration

You can set here the expiration delay for rooms archives.
See the online help for accepted values.

#### Enable client to server connections

This setting enable XMPP clients to connect to the builtin Prosody server.
For now, this option **only allows connections from localhost clients**.

As example, this option can allow an instance of Matterbridge (once it could use anonymous login) *on the same machine* to bridge your chat with another services like a Matrix room.

##### Prosody client to server port

The port that will be used by the c2s module of the builtin Prosody server.
XMPP clients shall use this port to connect.
Change it if this port is already in use on your server.

#### Enable external XMPP components

This settings enable XMPP external components to connect to the server.
For now, this option **only allows connections from localhost components**.

This feature could be used to connect bridges or bots.

More informations on Prosody external components [here](https://prosody.im/doc/components).

## Moderation

You can access rooms settings and moderation tools by opening the chat in a new window,
and using the dropdown menu at the top right.

You can list all existing chatrooms: in the plugin settings screen, there is a button «List rooms».

You can delete old rooms: join the room, and use the menu on the top to destroy the room.

## Notes

All instance moderators and admins will be owner for created chat rooms.
If the video is local (not from a remote Peertube), the video owner will be admin in the chat room.

You can use [ConverseJS moderation commands](https://conversejs.org/docs/html/features.html#moderating-chatrooms) to moderate the room.
When you open the chat room in full screen, there will also be a menu with dedicated commands on the top right.

## Advanced usages

### OBS Overlay

#### Using readonly chat url

You can use the «share chat link» feature (see above) to generate an url to your chat.
Check the «readonly» checkbox in the modal.
Then use this link as a «web browser source» in OBS.

You can use the «Transparent background» to have a transparent background in OBS.

Note: you can customize colors. This is undocumented yet, but you can try this:
in the modal, check «use curent theme colors», then you can try to manually change color values in the url.
You must use valid CSS color values, and they must be properly url encoded.

#### Using Matterbridge

Here is a tutorial to use Matterbridge with the plugin: <https://gitlab.com/refrac/obs-matterbridge-overlay/-/blob/master/documentation/peertube.md>

#### Mixing multiple chats in your live stream

You can use the [social_stream browser extension](https://github.com/steveseguin/social_stream#readme) to mix multiple chat source (from Peertube, Twitch, Youtube, Facebook, ...) and include their contents in your live stream.
The compatibility with this plugin was added in recent versions.
