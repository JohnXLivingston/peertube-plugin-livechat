---
title: "Prosody mod_firewall"
description: "Advanced firewall rules for the Prosody server"
weight: 30
chapter: false
---

{{% livechat_version_notice 11.0.0 %}}

You can enable [mod_firewall](https://modules.prosody.im/mod_firewall) on your Prosody server.

Doing so, Peertube admins will be able to define advanced firewall rules.

{{% notice warning %}}
These rules could be used to run arbitrary code on the server.
If you are a hosting provider, and you don't want to allow Peertube admins to write such rules, you can disable the online editing by creating a `disable_mod_firewall_editing` file in the plugin directory (`plugins/data/peertube-plugin-livechat/disable_mod_firewall_editing`).
This is opt-out, as Peertube admins can already run arbitrary code just by installing any plugin.
You can still use mod_firewall by editing files directly on the server.
{{% /notice %}}

## Edit rules

First, you must enable the feature in the [plugin settings](/peertube-plugin-livechat/documentation/admin/settings).

Just bellow the settings, you will find a "Configure mod_firewall" button.
This button will open a configuration page.

![Screenshot of the "{{% livechat_label prosody_firewall_configuration %}}" form.](/peertube-plugin-livechat/images/mod_firewall.png?classes=shadow,border&height=400px "{{% livechat_label prosody_firewall_configuration %}}")

Here you can add several configuration files.

You can enable/disable each files.

Files will be loaded in the alphabetical order.
You can use a number as prefix to easily choose the order.

{{% notice info %}}
You can also edit these firewall rules directly on the server, in the `plugins/data/peertube-plugin-livechat/prosody/mod_firewall_config/` directory.
File names must only contains alphanumerical characters, underscores and hyphens.
The extension must be `.pfw`, or `.pfw.disabled` if you want to disable a file.
Please be sure that the peertube system user has write access to these files, else the web editing interface will fail.
Once you have edited these files, you must reload prosody.
This can be done by saving the plugin settings, or saving the mod_firewall configuration in the web interface, or by restarting Peertube.
{{% /notice %}}

When you save the configuration, the server will automatically reload it, and your rules will apply immediatly.
You can check that there is no parsing error in the Prosody error log.
To do so, you can read the `plugins/data/peertube-plugin-livechat/prosody/prosody.err` file, or use the [diagnostic tool](/peertube-plugin-livechat/documentation/installation/troubleshooting/) that will show last Prosody errors.

## Examples

Don't hesitate to share your rules.
To do so, you can for example edit this [page](/peertube-plugin-livechat/contributing/document/#write-documentation).
