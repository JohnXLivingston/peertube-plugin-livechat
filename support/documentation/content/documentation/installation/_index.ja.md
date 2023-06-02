+++
title="Installation guide"
description="Plugin peertube-plugin-livechat installation guide"
weight=10
chapter=false
+++

{{% notice info %}}
メジャーリリースのアップデート実施前に、リリースノートをお読み頂き、変更をご確認ください : [変更履歴](https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/CHANGELOG.md).
{{% /notice %}}

本プラグインをインストールまたはアップデートは、PeerTubeの管理画面から実施できます。

## 重要事項

v6.0.0から、このプラグインはProsodyのインストールが不要になりました。

このバージョンより前の環境で本プラグインを既にご使用中で、手動でProsodyをインストールした場合は、Prosodyのアンインストールが可能です。

Prosodyが内蔵されたカスタムDockerイメージをご利用の場合は、公式のPeerTube Dockerイメージに切り替えることができるようになりました。

## Known issues: CPU compatibility

The Prosody AppImage included in the plugin will only work on x86_64 and arm64 CPU.
It is not compatible with arm64 and other CPU architectures.

To use the plugin, you will have to manually install Prosody on your server
(see below).

Note: the plugin requires Prosody >= 0.12.0.
If you are using an older version, Chat Federation could be broken, and it could have some unexpected behaviour.

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
