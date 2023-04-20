+++
title="Einstellungen"
description="Plugin Peertube Livechat Einstellungen"
weight=10
chapter=false
+++

{{% notice note %}}
Die Einstellungsseite des Plugins kann momentan nicht übersätzt werden und ist daher nur auf englisch verfügbar. Deswegen wird hier die englische Bezeichnung der Knöpfe, Abschnitte, etc. verwendet. Für weitere Informationen bitte [dieses Problem](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/115) kontrollieren.
{{% /notice %}}

Dieser Abschnitt beschreibt die Einstellungsseite des Plugins.

## List existing rooms (Bestehende Räume auflisten)

Wenn der «Bestehende Räume auflisten» («List rooms») Knopf gedrückt wird, werden alle bestehenden Chaträume aufgelistet.
Sie können die Chaträume damit finden und moderieren.

## Federation

Following settings concern the fedration with other Peertube instances,
and other fediverse softwares.

### Don't display remote chats

By checking this setting, your instance will never display chats from remote videos.

### Don't publish chat information

By checking this setting, your instance will not publish chat information on the fediverse.
Remote Peertube instances will not be aware that they are chat rooms associated to your videos.

**Please note**: if you already had chats in progress, it is possible that the information has already been published.
You will have to wait for the next video update before the information is unpublished.
Also, if you disable this setting, you'll have to wait for the videos to be updated before the information are
published again. This update happens among others when a live event resumes or stops.

**Please note**: this setting only affects the publication of information via the ActivityPub protocol.
It will not prevent a remote application from otherwise detecting the presence of chats, and trying to connect to it.

## Chat behaviour (Chatverhalten)

### Room type (Raumtyp)

Sie können hier wählen, ob Sie für jedes Video einen eigenen Raum haben möchten oder ob Sie sie nach Kanälen gruppieren möchten.

### Automatically open the chat (Chat automatisch öffnen)

Wenn ausgewählt wird der Chat geladen, sobald Sie auf der Videoseite sind.

### Show the «open in new window» button (Zeige den «open in new window» Knopf)

Wenn Ihr Webchat-Tool in einem eigenen Fenster geöffnet werden kann, können Sie einen Knopf hinzufügen um dies zu tun.

Wenn Sie ein externes Web-Chat-Tool verwenden (siehe den Chat-Modus «Use an external web chat tool»), funktioniert es möglicherweise nicht im Vollbildmodus (z. B. wenn es auf das übergeordnete Fenster zugreifen muss, um Videoinformationen zu erhalten). Sie können diese Schaltfläche deaktivieren, indem Sie das Häkchen bei dieser Einstellung entfernen.

### Show the «share chat link» button (Zeige den Chat Link teilen Knopf)

Diese Funktion aktiviert das Dialogfenster «Chat-Link teilen». Mit diesem Fenster können Sie URLs generieren, um dem Chat beizutreten.
Der Chat kann angepasst werden (schreibgeschützter Modus, Verwendung des aktuellen Themas, ...).

Sie können zum Beispiel einen schreibgeschützten Link generieren und diesen in OBS verwenden, um den Chat in Ihren Live-Stream zu integrieren!

Diese Einstellung ermöglicht es Ihnen, festzulegen, wer auf dieses Fenster zugreifen kann.

### Chats are only available for local videos (Chats sind nur für lokale Videos verfügbar)

Peertube ist ein gemeinschaftlicher Dienst. Plugins sind nur auf dem Server verfügbar, auf dem Sie sich gerade befinden.
Wenn Sie also ein externes Video ansehen, steht der Webchat nur Ihnen zur Verfügung, nicht aber den Nutzern der anderen Instanzen.
Daher ist diese Option standardmäßig aktiviert und verhindert die Anzeige eines Webchats für entfernte Videos.

### Users can activate the chat for their lives (Nutzer können den Chat für ihre Live-Videos aktivieren)

Wenn diese Option aktiviert ist, haben alle Live-Videos in ihren Eigenschaften ein Feld zur Aktivierung des Webchats.
Der Videoeigentümer kann Webchats aktivieren.

### Activate chat for all lives (Den Chat für alle Live-Videos aktivieren)

Der Chat wird für alle Peertube-Live-Videos auf Ihrer Instanz verfügbar sein.

### Activate chat for all non-lives (Aktiviere den Chat für alle Nicht-Live-Videos)

Der Chat wird für alle Peertube-Videos verfügbar sein, die nicht live sind.

### Activate chat for these videos (Aktivieren Sie den Chat für diese Videos)

Sie können einige UUIDs auswählen, für die der Chat verfügbar sein soll.
Wenn Sie die Funktion für alle Videos nicht aktivieren möchten, können Sie dieses Feld verwenden, um die UUIDs der Videos aufzulisten.
Sie können Kommentare hinzufügen: alles, was dem Zeichen # entspricht, wird entfernt, ebenso wie leere Zeilen.

### Hide the chat for anonymous users (Den Chat für anonyme Benutzer ausblenden)

Wenn diese Option aktiviert ist, können anonyme Peertube-Nutzer den Chat nicht sehen.

Hinweis: Im Moment blendet diese Funktion einfach den Chat aus.
In einer zukünftigen Version wird der Chat durch eine Meldung ersetzt, die besagt "Bitte melden Sie sich an, um [...]".
Siehe [v5.7.0 Release Notes](https://github.com/JohnXLivingston/peertube-plugin-livechat/blob/main/CHANGELOG.md#570) für weitere Informationen.

## Theming

### ConverseJS theme (ConverseJS Thema)

Sie können wählen, welches Thema Sie für ConverseJS verwenden möchten:

- Peertube-Theme: Dies ist ein spezielles Thema, das speziell für die Integration von Peertube erstellt wurde.
- Standard-ConverseJS-Theme: Dies ist das Standard-Thema von ConverseJS.
- ConverseJS-concord-Theme: Dies ist ein Thema, das von ConverseJS bereitgestellt wird.

### Automatic color detection (Automatische Farberkennung)

Versucht, die Farben aus dem aktuellen Thema des Benutzers automatisch zu erkennen.
Wenn diese Einstellung aktiviert ist, versucht das Plugin, die Farben für das Chat-Thema automatisch zu erkennen.
Wenn dies für einige Ihrer Peertube-Themen nicht korrekt funktioniert, können Sie diese Option deaktivieren.

### Webchat iframe style attribute (Webchat Iframe Stil-Attribute)

Sie können einige benutzerdefinierte Stile hinzufügen, die dem Iframe hinzugefügt werden.
Zum Beispiel eine benutzerdefinierte Breite:

```width:400px;```

## Chat server advanced settings (Erweiterte Einstellungen des Chatservers)

### Use system Prosody (System Prosody benutzen)

Das Plugin wird mit einem AppImage geliefert, das zum Ausführen des [Prosody XMPP-Servers] (https://prosody.im) verwendet wird.
Wenn dieses AppImage nicht funktioniert, können Sie auf das Prosody-Paket zurückgreifen, das für Ihren Server erstellt wurde. Installieren Sie einfach das Paket `prosody`.

Diese Einstellung sollte nur verwendet werden, wenn das Plugin defekt ist und auf einen Patch wartet.

### Disable Websocket (Websocket deaktivieren)

Mit Peertube >= 5.0.0 versucht dieses Plugin, eine Websocket-Verbindung zum Chatten zu verwenden.
Wenn der Browser oder die Verbindung des Benutzers nicht kompatibel ist, wird der Browser automatisch auf das BOSH-Protokoll zurückgreifen.

Aber in seltenen Fällen kann dies fehlschlagen. Zum Beispiel, wenn Sie einen Reverse Proxy vor Peertube haben, der keine
Websocket-Verbindung für Plugins erlaubt.
In diesem Fall können Sie diese Einstellungen überprüfen, um Websocket-Verbindungen zu deaktivieren.

### Prosody port

Dies ist der Port, den der Prosody-Server verwenden wird. Standardmäßig ist er auf 52800 eingestellt. Wenn Sie einen anderen Port verwenden möchten, ändern Sie einfach den Wert hier.

### Peertube URL for API calls (Peertube-URL für API-Aufrufe)

In einigen seltenen Fällen kann Prosody die API von Peertube nicht über seine öffentliche Adresse (URI) aufrufen.
Wenn Sie solche Probleme haben (siehe das Ergebnis des Diagnosetools), können Sie versuchen, den Wert
dieser Einstellung auf `http://localhost:9000` oder `http://127.0.0.1:9000` zu setzen
zu setzen (unter der Annahme, dass Ihr Peertube auf Port `9000` hört). Überprüfen Sie das in Ihrer Peertube `config/production.yaml` Datei).

### Log rooms content by default (Standardmäßig Inhalte von Räumen protokollieren)

Wenn diese Option aktiviert ist, wird der Rauminhalt standardmäßig auf dem Server archiviert.
Das bedeutet, dass Benutzer, die dem Chat beitreten, Nachrichten sehen, die vor ihrem Beitritt gesendet wurden.

Bitte beachten Sie, dass es immer möglich ist, die Inhaltsprotokollierung für einen bestimmten Raum zu aktivieren/deaktivieren,
indem Sie seine Eigenschaften bearbeiten.

### Room logs expiration (Ablaufzeit von Raumprotokollen)

Hier können Sie die Ablaufzeit für Raumprotokolle einstellen.
Siehe die Online-Hilfe für akzeptierte Werte.

### Enable connection to room using external XMPP accounts

By enabling this option, it will be possible to connect to rooms using external XMPP accounts and XMPP clients.<br>
Warning, enabling this option can request extra server and DNS configuration.
Please refer to the documentation: [Enable external XMPP account connections](/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/).

### Prosody server to server port

The port that will be used for XMPP s2s (server to server) connections.<br>
You should use the standard 5269 port.
Otherwise you should [setup a specific DNS record](https://prosody.im/doc/s2s).

### Server to server network interfaces

The network interfaces to listen on for server to server connections.<br>
List of IP to listen on, coma separated (spaces will be stripped).<br>
You can use «*» to listen on all IPv4 interfaces, and «::» for all IPv6.<br>
Examples:

- `*, ::`
- `*`
- `127.0.0.1, ::1`
- `172.18.0.42`

### Certificates directory

If this field is empty, the plugin will generate and use self-signed certificates.<br>
If you want to use other certificates, just specify here the folder where
Prosody can find them. Note: the `peertube` user must have read access to this directory.

### Enable client to server connections (Aktivieren von Client-Server-Verbindungen)

Diese Einstellung ermöglicht es XMPP-Clients, sich mit dem eingebauten Prosody-Server zu verbinden.
Im Moment erlaubt diese Option **nur Verbindungen von localhost-Clients**.

Zum Beispiel kann diese Option einer Instanz von Matterbridge (sobald sie einen anonymen Login verwenden kann) *auf demselben Rechner* erlauben, Ihren Chat mit einem anderen Dienst wie einem Matrix-Raum zu verbinden.

#### Prosody client to server port (Prosody Client-Server-Verbindungsport)

Der Port, der vom c2s-Modul des eingebauten Prosody-Servers verwendet wird.
XMPP-Clients sollen diesen Port für die Verbindung verwenden.
Ändern Sie ihn, wenn dieser Port bereits auf Ihrem Server verwendet wird.

### Enable external XMPP components (Aktivieren externer XMPP-Komponenten)

Diese Einstellung ermöglicht es externen XMPP-Komponenten, sich mit dem Server zu verbinden.
Im Moment erlaubt diese Option **nur Verbindungen von localhost-Komponenten**.

Diese Funktion könnte genutzt werden, um Bridges oder Bots zu verbinden.

Weitere Informationen über externe Prosody-Komponenten [hier](https://prosody.im/doc/components).