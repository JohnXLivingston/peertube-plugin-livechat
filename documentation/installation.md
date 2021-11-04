# Plugin peertube-plugin-livechat installation guide 🇬🇧

🇫🇷 Version française [ici](./installation.fr.md)

**IMPORTANT:** unfortunately this plugin does not (yet) work by itself, it must rely on external tools.

**Before updating to a major release, please read the release notes and breaking changes list : [CHANGELOG](../CHANGELOG.md)**.

This plugin can be used in different ways:

| Mode | Description | Documentation
---|---|---
**Prosody server controlled by Peertube (recommended):** | This plugin can launch a [Prosody](https://prosody.im) process and auto-configure it | [Documentation](./prosody.md). **This is the recommanded setup, and is almost automatic to setup**
**Connect to an existing XMPP server with ConverseJS:** | You can use an external Jabber/XMPP server. This server has to provide BOSH or Websocket API, accept anonymous loggin, and accept room creation. | [Documentation](./conversejs.md)
**Use an external web chat tool:** | You can use any external web chat tool, that can be included in an iframe. | [Documentation](./external.md)

For the two first solutions, the connection to the XMPP server is made with the [converseJS](https://conversejs.org/) Javascript library.
XMPP is a protocol for chat applications. It is sometime known has Jabber.

There are some documentation for common settings here: [common settings documentation](./common.md).
