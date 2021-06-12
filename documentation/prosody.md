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
`image: chocobozzz/peertube:production-buster` by `image: johnxlivingston/peertubelivechat:production-buster`.

And that's it!

You can find the source for this Dockerfile [here](../docker/Dockerfile.buster).

## Settings

### Chat mode

Just select «Prosody server controlled by Peertube» as chat mode.

#### Prosody port

This is the port that the Prosody server will use. By default it is set to 52800. If you want to use another port, just change the value here.

### Chat behaviour

These settings are common with other chat modes.
Here is the documentation: [common settings](./common.md).

## Moderation

You can list all existing chatrooms: in the plugin settings screen, there is a button «List rooms».

You can delete old rooms: join the room, and use the menu on the top to destroy the room.

## Notes

All instance moderators and admins will be owner for created chat rooms.
If the video is local (not from a remote Peertube), the video owner will be admin in the chat room.

You can use [ConverseJS moderation commands](https://conversejs.org/docs/html/features.html#moderating-chatrooms) to moderate the room.
When you open the chat room in full screen, there will also be a menu with dedicated commands on the top right.
