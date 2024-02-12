---
title: "Settings"
description: "Plugin Peertube Livechat settings"
weight: 10
chapter: false
---

This section describes the plugin settings page.

## {{% livechat_label "list_rooms_label" %}}

When pressing the «List rooms» button, all existing chatrooms will be listed.
You can then find them and moderated them.

## Federation

Following settings concern the federation with other Peertube instances, and other fediverse softwares.

### {{% livechat_label federation_no_remote_chat_label %}}

{{% livechat_label federation_no_remote_chat_description %}}

### {{% livechat_label federation_dont_publish_remotely_label %}}

{{% livechat_label federation_dont_publish_remotely_description %}}

## Channel advanced configuration

Following settings concern the advanced channel options:
users will be able to add some customization on their channels, activate the moderation bot, ...

### {{% livechat_label disable_channel_configuration_label %}}

If you encounter any issue with this feature, you can disable it.

## Chat behaviour

### {{% livechat_label room_type_label %}}

{{% livechat_label room_type_description %}}

### {{% livechat_label auto_display_label %}}

{{% livechat_label auto_display_description %}}

### {{% livechat_label open_blank_label %}}

{{% livechat_label open_blank_description %}}

### {{% livechat_label share_url_label %}}

This feature enables a «share chat link» modal. With this modal, you can generate URLs to join the chat.
The chat can be customized (readonly mode, use the current theme, ...).

You can for example generate a readonly URL and use it in OBS to integrate the chat in your live stream!

This settings allows you to choose who can access this modal.

### {{% livechat_label per_live_video_label %}}

{{% livechat_label per_live_video_description %}}

The video owner will be able to activate web chats.

### {{% livechat_label all_lives_label %}}

{{% livechat_label all_lives_description %}}

### {{% livechat_label all_non_lives_label %}}

{{% livechat_label all_non_lives_label %}}

### {{% livechat_label videos_list_label %}}

{{% livechat_label videos_list_label %}}

### {{% livechat_label no_anonymous_label %}}

{{% livechat_label no_anonymous_description %}}

Note: for now this feature simply hide the chat.
In a future release, the chat will be replaced by a message saying «please log in to [...]».
See [v5.7.0 Release Notes](https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/CHANGELOG.md#570) for more information.

### {{% livechat_label auto_ban_anonymous_ip_label %}}

{{% livechat_label auto_ban_anonymous_ip_description %}}

**Important note**:
If you enable this feature, and are using a custom reverse proxy on front of Peertube, please make sure that your setup is correctly configured to forward real user's IPs to Peertube.
Otherwise it could block all anonymous users at once.

## Theming

### {{% livechat_label avatar_set_label %}}

You can choose from several different sets the default avatars that will be used for chat users.

{{% livechat_label avatar_set_option_sepia %}}: [David Revoy's Peertube avatar generator](https://www.peppercarrot.com/extras/html/2023_peertube-generator/), [CC-By](https://creativecommons.org/licenses/by/4.0/) license

![Sepia](/peertube-plugin-livechat/images/avatar_sepia.png?classes=shadow,border&height=40px)

{{% livechat_label avatar_set_option_cat %}}: [David Revoy's cat avatar generator](https://www.peppercarrot.com/extras/html/2016_cat-generator/), [CC-By](https://creativecommons.org/licenses/by/4.0/) license

![Cats](/peertube-plugin-livechat/images/avatar_cat.png?classes=shadow,border&height=40px)

{{% livechat_label avatar_set_option_bird %}}: [David Revoy's bird avatar generator](https://www.peppercarrot.com/extras/html/2019_bird-generator/), [CC-By](https://creativecommons.org/licenses/by/4.0/) license

![Birds](/peertube-plugin-livechat/images/avatar_bird.png?classes=shadow,border&height=40px)

{{% livechat_label avatar_set_option_fenec %}}: [David Revoy's fenec/mobilizon avatar generator](https://www.peppercarrot.com/extras/html/2020_mobilizon-generator/), [CC-By](https://creativecommons.org/licenses/by/4.0/) license

![Fenecs](/peertube-plugin-livechat/images/avatar_fenec.png?classes=shadow,border&height=40px)

{{% livechat_label avatar_set_option_legacy %}}: Based on [David Revoy' work](https://www.davidrevoy.com), [AGPL-v3](https://www.gnu.org/licenses/agpl-3.0.en.html) license

![Legacy](/peertube-plugin-livechat/images/avatar_legacy.jpg?classes=shadow,border&height=40px)

If you can't see the change immediatly, it could be because of your browser cache. Just clear your browser session storage, or restart it.

### {{% livechat_label converse_theme_label %}}

You can choose which theme to use for ConverseJS:

- Peertube theme: this is a special theme, made especially for peertube's integration.
- Default ConverseJS theme: this is the default ConverseJS theme.
- ConverseJS concord theme: this is a theme provided by ConverseJS.

### {{% livechat_label autocolors_label %}}

{{% livechat_label autocolors_description %}}

### {{% livechat_label chat_style_label %}}

{{% livechat_label chat_style_description %}}

## Chat server advanced settings

### {{% livechat_label system_prosody_label %}}

The plugin comes with an AppImage that is used to run the [Prosody XMPP server](https://prosody.im).
If this AppImage is not working, you can fallback to the Prosody that is packaged for your server. Just install the `prosody` package.

This settings should only be used if the plugin is broken, and waiting for a patch.

### {{% livechat_label disable_websocket_label %}}

{{% livechat_label disable_websocket_description %}}

### {{% livechat_label prosody_port_label %}}

{{% livechat_label prosody_port_description %}}

### {{% livechat_label prosody_peertube_uri_label %}}

{{% livechat_label prosody_peertube_uri_description %}}

If this settings is left empty, and you are using Peertube >= 5.1 or later, the plugin will use values from your Peertube configuration file to guess on which interface and port request have to be done.

In last resort, it will use your Peertube public URI.
So, any API Call will go throught your Nginx server.
This could fail in some case: for example if you are in a Docker container, where the public hostname does not resolve to the correct IP.
In such case, try changing the "{{% livechat_label prosody_peertube_uri_label %}}" settings, by setting `http://127.0.0.1:9000` (assuming 9000 is the port on which Peertube listen, ask your instance administrators if you don't know).

### {{% livechat_label prosody_muc_log_by_default_label %}}

{{% livechat_label prosody_muc_log_by_default_description %}}

### {{% livechat_label prosody_muc_expiration_label %}}

{{% livechat_label prosody_muc_expiration_description %}}

### {{% livechat_label prosody_room_allow_s2s_label %}}

{{% livechat_label prosody_room_allow_s2s_description %}}

### {{% livechat_label prosody_s2s_port_label %}}

{{% livechat_label prosody_s2s_port_description %}}

### {{% livechat_label prosody_s2s_interfaces_label %}}

{{% livechat_label prosody_s2s_interfaces_description %}}

### {{% livechat_label prosody_certificates_dir_label %}}

{{% livechat_label prosody_certificates_dir_description %}}

### {{% livechat_label prosody_c2s_label %}}

{{% livechat_label prosody_c2s_description %}}

This setting enable XMPP clients to connect to the built-in Prosody server.
For now, this option **only allows connections from localhost clients**.

As example, this option can allow an instance of Matterbridge (once it could use anonymous login) *on the same machine* to bridge your chat with another services like a Matrix room.

#### {{% livechat_label prosody_c2s_port_label %}}

{{% livechat_label prosody_c2s_port_description %}}

### {{% livechat_label prosody_components_label %}}

This settings enable XMPP external components to connect to the server.
By default, this option **only allows connections from localhost components**.
You have to change the "{{% livechat_label prosody_components_interfaces_label %}}" value to listen on other network interfaces.

This feature could be used to connect bridges or bots.

More informations on Prosody external components [here](https://prosody.im/doc/components).

#### {{% livechat_label prosody_components_label %}}

{{% livechat_label prosody_components_description %}}

#### {{% livechat_label prosody_components_port_label %}}

{{% livechat_label prosody_components_port_description %}}

#### {{% livechat_label prosody_components_interfaces_label %}}

{{% livechat_label prosody_components_interfaces_description %}}

#### {{% livechat_label prosody_components_list_label %}}

{{% livechat_label prosody_components_list_description %}}
