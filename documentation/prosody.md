# Builtin Prosody XMPP Server

Althought this mode is still experimental and under heavy development, it is the recommanded setup mode.

Peertube will launch a [Prosody](https://prosody.im) process, with a custom configuration.

## For Docker installations

This mode is not yet compatible with a Docker Peertube installation.
If you are using Docker and want to help to make this work, please contact me.

## Prerequisite

You have to install [Prosody](https://prosody.im) on your server:

```bash
sudo apt-get install prosody
```

If you are not using prosody for anything else on your server, you can then disabled it:

```bash
sudo systemctl disable prosody && sudo systemctl stop prosody
```

**NB:** the plugin will create a directory in the `/tmp/` folder. Please ensure that the `peertube` user has write access to this directory.

And that's it!

The Prosody process launched by the plugin will listen on a specific port, and only on the localhost interface.

## Settings

### Common settings

First you have to configure [common settings](./common.md).

Then, left settings related to the [builtin converseJS](./converseJS.md) blank, and fill following settings according to this page.

### Use the builtin Prosody XMPP Server

Check this checkbox to activate this mode.

#### Builtin prosody: Prosody port

This is the port that the Prosody server will use. By default it is set to 52800. If you want to use another port, just change the value here.
