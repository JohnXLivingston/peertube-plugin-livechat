# Plugin peertube-plugin-livechat Installationsanleitung 🇩🇪

🇫🇷 French version / Version française [ici](./installation.fr.md).
🇬🇧 English version / version anglaise [here](./installation.md).

**Wichtig:** leider funktioniert dieses Plugin (noch) nicht von selbst, es muss auf externe Tools zurückgreifen.

**Bevor Sie auf eine Hauptversion aktualisieren, lesen Sie bitte die Versionshinweise und die Liste der wichtigsten Änderungen : [CHANGELOG](CHANGELOG.md)**.

Dieses Plugin kann auf verschiedene Weise verwendet werden:

| Modus | Beschreibung | Dokumentation
---|---|---
**Prosody-Server, der von Peertube gesteuert wird (empfohlen)** | Dieses Plugin kann einen [Prosody](https://prosody.im)-Prozess starten und ihn automatisch konfigurieren | [Prosody+Peertube-Installation](./prosody.md). **Dies ist der empfohlene Modus, und die Einrichtung erfolgt fast automatisch**
**Verbindung zu einem bestehenden XMPP-Server mit ConverseJS** | Sie können einen externen Jabber/XMPP-Server verwenden. Dieser Server muss BOSH oder Websocket API anbieten, anonyme Anmeldung und Raumerstellung akzeptieren. | [ConverseJS+XMPP Installation](./conversejs.md)
**Verwenden Sie ein externes Web-Chat-Tool** | Sie können ein beliebiges externes Web-Chat-Tool verwenden, das in einen iframe eingebunden werden kann. | [Externe Chat-Installation](./external.md)

Bei den ersten beiden Lösungen wird die Verbindung zum XMPP-Server mit der [converseJS](https://conversejs.org/) Javascript-Bibliothek hergestellt.
XMPP ist ein Protokoll für Chat-Anwendungen. Es ist auch unter dem Namen Jabber bekannt.

Es gibt eine Dokumentation für allgemeine Einstellungen hier: [Allgemeine Einstellungsdokumentation](./common.md).
