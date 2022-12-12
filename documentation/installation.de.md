# Plugin peertube-plugin-livechat Installationsanleitung 🇩🇪

🇫🇷 French version / Version française [ici](./installation.fr.md).
🇬🇧 English version / version anglaise [here](./installation.md).
🇯🇵 Japanese version / 日本語バージョン [こちら](./installation.ja.md).

**Bevor Sie auf eine Hauptversion aktualisieren, lesen Sie bitte die Versionshinweise und die Liste der wichtigsten Änderungen : [CHANGELOG](CHANGELOG.md)**.

To install or update the plugin, just use the Peertube web admin interface.

## IMPORTANT NOTE

Since version v6.0.0, this plugin does not need any Prosody installation.

If you were using this plugin before this version, and if you had installed Prosody manually, you can safely uninstall Prosody.

If you were using the custom Peertube docker image that is embedding Prosody, you can switch back to the official Peertube image.

## Known issues: CPU compatibility

The Prosody AppImage included in the plugin will only work on x86_64 CPU.
It is not compatible with arm64 and other CPU architectures.

For now, I did not manage to make it work for other CPU architectures.
If you want te be notified when it will be possible, you can subscribe and comment this
[issue](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/124).

To use the plugin, you will have to manually install Prosody on your server
(see below).

Once it is done, you have to check `Use system Prosody` in the plugin settings.

### On non-docker Peertube installation

For standard installation, you just have to install the official `prosody` package
for your linux distribution.

For example, on Debian/Ubuntu:

```bash
sudo apt install prosody
```

You can then disable the service that starts automatically when you install
Prosody (the plugin will launch a Prosody process, there is no need for the
service to run).
For example, on Debian/Ubuntu (and other Systemd based linux distributions):

```bash
sudo systemctl disable prosody && sudo systemctl stop prosody
```

Warning: do not disable Prosody if it is used for another service on your server,
like for example Jitsi.

### Docker

You will have to generate a Peertube image that includes Prosody in the same
container that Peertube.
I know this is not the standard way to do this with Docker, but keep in mind it
is a temporary workaround.

To generate and use such an image, please refer to the Docker documentation.
The Docker file to generate the image should be:

```Docker
FROM chocobozzz/peertube:production-bullseye

RUN apt -y update && apt install -y prosody && apt -y clean
```

### Yunohost

You have to disable `metronome` (the XMPP server provided by Yunohost), and
install `prosody`.

This is already done by the Yunohost Peertube application, as it was required for the
plugin before the v6.0.0.
But it may be removed in a near feature (to avoid drawbacks of this method).
I have to discuss with Yunohost team, to decide how we can do to minimize drawbacks,
and maximize compatibility.
