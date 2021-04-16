# PeerTube plugin livechat

This plugin can provide webchat for peertube videos.

There are multiple way to provide such functionality:

* **builtin prosody:** this plugin can launch a [Prosody](https://prosody.im) process and auto-configure it. [Documentation](documentation/prosody.md). Althought this is still experimental and under development, it is the recommanded setup.
* **builtin converseJS:** you can use an external Jabber/XMPP server with BOSH or Websocket and anonymous loggin enabled. [Documentation](documentation/conversejs.md)
* **external tool:** you can use any external webchat tool, that can be included in an iframe. [Documentation](documentation/external.md)

For the two first solutions, the connection to the XMPP server is made with [converseJS](https://conversejs.org/).

If you have new feature requests, bugs, or difficulties to setup the plugin, you can use the [Github issue tracker](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues).

If you are a webdesigner or a ConverseJS/Prosody/XMPP expert, and want to help improve this plugin, you are welcome.

## Contact me

If you have any question, or if you want to talk about this plugin, you can join this XMPP room with any Jabber client: [plugin-livechat-support@room.im.yiny.org](xmpp:plugin-livechat-support@room.im.yiny.org?join).

## Settings

There are several common settings. Please see the documentation here: [common settings documentation](documentation/common.md).

Then, please refer to the documentation associated with the mode you are planning to use:

* **builtin prosody:** this plugin can launch a [Prosody](https://prosody.im) process and auto-configure it. [Documentation](documentation/prosody.md)
* **builtin converseJS:** you can use an external Jabber/XMPP server with BOSH or Websocket and anonymous loggin enabled. [Documentation](documentation/conversejs.md)
* **external tool:** you can use any external webchat tool, that can be included in an iframe. [Documentation](documentation/external.md)

## Credits

Thanks to David Revoy for his work on Peertube's mascot, [Sepia](https://www.davidrevoy.com/index.php?tag/peertube).

Some material icons downloaded from this website where used for icons: [Material.io](https://material.io/resources/icons)
