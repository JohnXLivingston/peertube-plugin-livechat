# Builtin Prosody XMPP Server

Althought this mode is still experimental and under heavy development, it is the recommanded setup mode.

Peertube will launch a [Prosody](https://prosody.im) process, with a custom configuration.

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

### For Docker installations

In the docker-compose.yml file, replace the peertube service image
`image: chocobozzz/peertube:production-buster` by `image: johnxlivingston/peertubelivechat:production-buster`.

And that's it!

You can find the source for this Dockerfile [here](../docker/Dockerfile.buster).

## Settings

### Common settings

First you have to configure [common settings](./common.md).

Then, left settings related to the [builtin converseJS](./conversejs.md) blank, and fill following settings according to this page.

### Use the builtin Prosody XMPP Server

Check this checkbox to activate this mode.

#### Builtin prosody: Prosody port

This is the port that the Prosody server will use. By default it is set to 52800. If you want to use another port, just change the value here.

## Notes

All instance moderators and admins will be owner for created chat rooms.
If the video is local (not from a remote Peertube), the video owner will be admin in the chat room.

You can use [ConverseJS moderation commands](https://conversejs.org/docs/html/features.html#moderating-chatrooms) to moderate the room.
When you open the chat room in full screen, there will also be a menu with dedicated commands in the top right.
