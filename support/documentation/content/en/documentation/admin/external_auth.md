---
title: "External Authentication"
description: "Plugin Peertube Livechat settings - External Authentication"
weight: 15
chapter: false
---

Users that are not connected to your Peertube instance are joining the chat using "anonymous accounts" (they can freely choose a nickname, and will be assigned a random avatar).

You can enable some external authentication methods to allow user to create chat accounts.
In such case their nickname and avatar will be automatically initialized with the remote account information.

Such "external account users" will be easier to moderate than anonymous accounts.

This also allows user to join the chat without creating Peertube account (in case your instance has closed registration for example, or without waiting for account approval).

![External login button](/peertube-plugin-livechat/images/external_login_button.png?classes=shadow,border&height=200px)

![External login dialog - OpenID Connect](/peertube-plugin-livechat/images/external_login_dialog_oidc.png?classes=shadow,border&height=200px)

This page will describe available authentication methods.

For the user documentation, see [user documentation](/peertube-plugin-livechat/documentation/user/viewers/)

## OpenID Connect

{{% notice warning %}}
This feature is still experimental.
This feature is available with the plugin version >= 9.0.0.
{{% /notice %}}

You can configure one external [OpenID Connect](https://openid.net/developers/how-connect-works/) compatible provider.

Doing so, you can for example use your website for Single Sign-On.

Popular CMS softwares (Wordpess, ...) offers plugins implementing OpenID Connect.

To enable this feature, first you have to create a client on your provider side (check the related documentation for enabling OpenID Connect).
Then go to the [plugin settings](/peertube-plugin-livechat/documentation/admin/settings), and enable "{{% livechat_label external_auth_custom_oidc_label %}}".

Note: if you want to restrict allowed redirection urls on the provider side (best security practice), the plugin will show you the url to allow.
Just copy it in your OpenID Connect application configuration.

You will now have to fill some settings.

### {{% livechat_label external_auth_custom_oidc_button_label_label %}}

{{% livechat_label external_auth_custom_oidc_button_label_description %}}

This is the button label in the following screenshot:

![External login dialog - OpenID Connect](/peertube-plugin-livechat/images/external_login_dialog_oidc.png?classes=shadow,border&height=200px)

For now, it is not possible to localize this label.

### {{% livechat_label external_auth_custom_oidc_discovery_url_label %}}

Your OpenID Connect provider must implement the [discovery URL](https://openid.net/specs/openid-connect-discovery-1_0.html).
Just set here the discovery url, that should be something like `https://example.com/.well-known/openid-configuration`.

Note: if your provider use the standard `/.well-known/openid-configuration` path, you can omit it.
For example `https://accounts.google.com` will work.

### {{% livechat_label external_auth_oidc_client_id_label %}}

Your application Client ID.

### {{% livechat_label external_auth_oidc_client_secret_label %}}

You application Client secret.

### Google, Facebook, ...

In addition to that, you can also configure one or several "standard" Open ID Connect provider (Google, Facebook, ...).

For these providers, discovery url and button label are preset.
You just have to create an OAuth2 application on the provider side, and configure Client ID and Client Secret.

If you think of a standard provider that is not available, you can ask for implementation by [opening a new issue](/peertube-plugin-livechat/issues/).

### Troubleshooting

If the button does not appear for end users, there might be a configuration issue.
You can try the [diagnostic tool](/peertube-plugin-livechat/documentation/installation/troubleshooting/) to get more information.

Note: if you are connected to your Peertube account, the button will never show. So use a private browser window to test.

If the button is displayed but is not working, check your Peertube logs.
It could be because the remote service does not use standard scopes or attribute names.

## More to come

Other authentication methods will be implemented in the future.
