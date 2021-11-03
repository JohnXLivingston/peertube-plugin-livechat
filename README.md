# PeerTube plugin livechat

This plugin is meant to provide web chat for Peertube videos.

**For release notes and breaking changes list, please see the [CHANGELOG](CHANGELOG.md) before updating the plugin.**

The plugin has to rely on an external tool as web chat backend. There are multiple ways to provide such functionality:

* **Prosody server controlled by Peertube (recommended):** this plugin can launch a [Prosody](https://prosody.im) process and auto-configure it. [Documentation](documentation/prosody.md). **This is the recommanded setup, and is almost automatic to setup**.
* **Connect to an existing XMPP server with ConverseJS:** you can use an external Jabber/XMPP server. This server has to provide BOSH or Websocket API, accept anonymous loggin, and accept room creation. [Documentation](documentation/conversejs.md)
* **Use an external web chat tool:** you can use any external web chat tool, that can be included in an iframe. [Documentation](documentation/external.md)

For the two first solutions, the connection to the XMPP server is made with the [converseJS](https://conversejs.org/) Javascript library.
XMPP is a protocol for chat applications. It is sometime known has Jabber.

If you have new feature requests, bugs, or difficulties to setup the plugin, you can use the [Github issue tracker](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues).

Here is a roadmap for upcoming features: [roadmap](ROADMAP.md).

If you are a webdesigner or a ConverseJS/Prosody/XMPP expert, and want to help improve this plugin, you are welcome.

## Contact me

If you have any question, or if you want to talk about this plugin, you can join this XMPP room with any Jabber client: [plugin-livechat-support@room.im.yiny.org](xmpp:plugin-livechat-support@room.im.yiny.org?join).

If you want to support the project financially, you can contact me by mail at git.[at].john-livingston.fr, or check my [liberapay profile](https://liberapay.com/JohnLivingston/).

## Settings

For the chat mode, and related settings, please refer to the corresponding documentation:

* [Prosody server controlled by Peertube (recommended)](documentation/prosody.md). **This is the recommanded setup**.
* [Connect to an existing XMPP server with ConverseJS](documentation/conversejs.md)
* [Use an external web chat tool](documentation/external.md)

There are several common settings. Please see the documentation here: [common settings documentation](documentation/common.md).

## Contribute

Please refer to the page [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Thanks to David Revoy for his work on Peertube's mascot, [Sepia](https://www.davidrevoy.com/index.php?tag/peertube).

Some material icons downloaded from this website where used for icons: [Material.io](https://material.io/resources/icons)

Some Prosody Modules in the `prosody-modules` folder are under MIT license. Please refer to README files in each subfolder, and to the [COPYING](./prosody-modules/COPYING) file. For more informations, here is [the official Prosody Modules website](https://modules.prosody.im).

Thanks to [Framasoft](https://framasoft.org) for making [Peertube](https://joinpeertube.org/) possible, and for the support.

Thanks to [ritimo](https://www.ritimo.org/) for the financial support.

Thanks to [Code Lutin](https://www.codelutin.com/) for the financial support.
