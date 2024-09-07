var relearn_search_index=[{breadcrumb:"Peertube livechat",content:`Was ist das Livechat Plugin? Dieses Peertube Plugin ist dafür gedacht, ein Chatsystem für Peertube-Videos bereitzustellen.
Sobald Sie das Plugin auf Ihrer Peertube-Instanz installiert haben, wird standardmäßig für jeden Live-Stream automatisch ein Chatroom erstellt.
Auf dem folgenden Bildschirmfoto sehen Sie eine klassische Peertube-Videoseite mit einem Chatroom auf der rechten Seite (klicken Sie auf das Bild, um es im Vollbildmodus anzuzeigen):
Der Chat-Raum wird für alle Zuschauer zugänglich sein, auch für diejenigen, die kein Konto auf Ihrer Instanz haben. Diese “anonymen” Benutzer müssen nur einen Spitznamen wählen, bevor sie im Chat sprechen können.
Standardmäßig wird der Chat neben dem Video angezeigt. Sie können ihn aber in einem anderen Browser-Tab öffnen, indem Sie die Schaltfläche oben verwenden:
Tipp Sie können das Livechat-Plugin mit dieser Demo-Seite testen.
Installation Als Peertube-Administrator können Sie dieses Plugin auf Ihrer Instanz einrichten, indem Sie einfach den Peertube-Plugin-Marktplatz in der Administrationsoberfläche nutzen. Suchen Sie nach “livechat” und klicken Sie dann auf “installieren”: Das war’s!
Livechat Funktionen Das Plugin hat viele erweiterte Funktionen. Da es den XMPP-Standard “unter der Haube” verwendet, ist es für Peertube-Administratoren möglich, fortgeschrittene Nutzungen zu ermöglichen (Verbindung über XMPP-Clients, Chatbots, Brücken zu anderen Chat-Protokollen, …). Weitere Informationen finden Sie in den entsprechenden Abschnitten dieser Dokumentation.
Föderation Peertube ist Teil des fediverse: Sie können ein Netzwerk von Peertube-Instanzen erstellen und Inhalte zwischen ihnen austauschen.
Dieses Plugin kann Föderation handhaben: Wenn Sie einen Livestream von einer entfernten Instanz ansehen, werden Sie dem Chatraum mit Ihrem lokalen Konto beitreten. Sie werden automatisch mit Ihrem aktuellen Nickname und Avatar verbunden.
Damit der Zusammenschluss funktioniert, muss das Plugin natürlich auf beiden Instanzen installiert sein.
Moderation Manchmal muss man seine Community vor bösen Menschen schützen. Als Instanzadministrator können Sie die Föderation für das Livechat-Plugin deaktivieren. Wenn sich entfernte Akteure schlecht benehmen, können Streamer, Moderatoren und Administratoren Nutzer sperren oder stummschalten.
Chatbot Dieses Plugin verfügt über einen eingebauten Chatbot. Weitere Informationen dazu finden Sie in der Dokumentation.
Sie können auch jeden anderen XMPP-Chatbot einbinden, indem Sie XMPP External Components verwenden. Dazu müssen Sie nur den Zugriff auf externe Komponenten in den Plugin-Einstellungen konfigurieren.
Chat Dauerhaftigkeit Wenn Sie einem Raum beitreten, sehen Sie frühere Nachrichten. Auch solche, die gesendet wurden, bevor Sie dem Raum beigetreten sind.
Dieses Verhalten kann von Raum zu Raum geändert werden, und die Standardverweildauer kann von den Instanzadministratoren festgelegt werden.
Integrieren Sie den Chat in Ihren Live-Stream Wenn Sie Software wie OBS für Ihren Live-Stream verwenden, können Sie den Chat in den Videostream einbetten. Dies ist zum Beispiel für Wiederholungen nützlich.
Im folgenden Screenshot sehen Sie eine Live-Wiedergabe, bei der der Chat-Inhalt am unteren Rand des Videos eingebettet ist:
Im folgenden Screenshot sehen Sie ein OBS-Setup, bei dem der Chat als Quelle in die aktuelle Szene eingebunden ist (die Hintergrundfarbe kann geändert werden und kann transparent sein):
Andere Verwendungen Standardmäßig kann jeder Streamer den Chat für seine Live-Streams aktivieren/deaktivieren.
Auf der Instanzebene können Administratoren jedoch den Chat für alle Videos (live und/oder VOD) aktivieren.
Sie können den Chat sogar für bestimmte VOD-Videos aktivieren. So funktioniert die Demonstrationsseite: Es handelt sich nicht um einen Live-Stream, aber ich habe den Chat speziell für dieses Video aktiviert.`,description:"Einführung",tags:[],title:"Einführung",uri:"/peertube-plugin-livechat/de/intro/index.html"},{breadcrumb:"Peertube livechat > Dokumentation",content:` Für ZuschauerWie man chattet für Live-Stream Zuschauer
OBSDokumentation zum Streamen des Chat-Inhalts mit OBS.
XMPP ClientsVerbindung zum Chat über einen XMPP-Client
Für StreamerSo richten Sie den Chat für Ihren Live-Stream ein
Einige GrundlagenEinige grundlegende Informationen zur Einrichtung und Nutzung des Chats für Ihren Livestream
KanalkonfigurationPeertube Kanal Chaträume Konfiguration
ModerationPlugin peertube-plugin-livechat Erweiterte Moderationsfunktionen
NutzungsbedingungenKonfigurieren Sie die Chat-Nutzungsbedingungen für den Kanal
Langsamer ModusPlugin peertube-plugin-livechat Langsamer Modus
ModerationsverzögerungPlugin peertube-plugin-livechat Moderationsverzögerung
Benutzerdefinierte EmojisPlugin peertube-plugin-livechat benutzerdefinierte Emojis
Nur Emojis-ModusPlugin peertube-plugin-livechat nur Emojis Modus
UmfragenSie können Umfragen erstellen, um die Zuschauer nach ihrer Meinung zu fragen
Aufgaben / To-do-ListenSie können Aufgaben und Aufgabenlisten mit Ihrem Moderationsteam bearbeiten.
ModerationsnotizenPlugin peertube-plugin-livechat Moderationnotizen
ChatbotChatbot Einrichtung
Special charactersThe bot can automatically moderate messages containing too many special characters.
Verbotene WörterDer Chatbot kann automatisch Nachrichten moderieren, die verbotene Wörter enthalten.
TimerDer Chatbot kann in regelmäßigen Abständen einige Nachrichten senden.
BefehleDer Chatbot kann auf verschiedene Befehle reagieren.`,description:"Plugin peertube-plugin-livechat Benutzer Dokumentation",tags:[],title:"Benutzer Dokumentation",uri:"/peertube-plugin-livechat/de/documentation/user/index.html"},{breadcrumb:"Peertube livechat",content:` Benutzer DokumentationPlugin peertube-plugin-livechat Benutzer Dokumentation
Für ZuschauerWie man chattet für Live-Stream Zuschauer
OBSDokumentation zum Streamen des Chat-Inhalts mit OBS.
XMPP ClientsVerbindung zum Chat über einen XMPP-Client
Für StreamerSo richten Sie den Chat für Ihren Live-Stream ein
Einige GrundlagenEinige grundlegende Informationen zur Einrichtung und Nutzung des Chats für Ihren Livestream
KanalkonfigurationPeertube Kanal Chaträume Konfiguration
ModerationPlugin peertube-plugin-livechat Erweiterte Moderationsfunktionen
NutzungsbedingungenKonfigurieren Sie die Chat-Nutzungsbedingungen für den Kanal
Langsamer ModusPlugin peertube-plugin-livechat Langsamer Modus
ModerationsverzögerungPlugin peertube-plugin-livechat Moderationsverzögerung
Benutzerdefinierte EmojisPlugin peertube-plugin-livechat benutzerdefinierte Emojis
Nur Emojis-ModusPlugin peertube-plugin-livechat nur Emojis Modus
UmfragenSie können Umfragen erstellen, um die Zuschauer nach ihrer Meinung zu fragen
Aufgaben / To-do-ListenSie können Aufgaben und Aufgabenlisten mit Ihrem Moderationsteam bearbeiten.
ModerationsnotizenPlugin peertube-plugin-livechat Moderationnotizen
ChatbotChatbot Einrichtung
InstallationsanleitungPlugin peertube-plugin-livechat Installationsanleitung
FehlerbehebungEinige klassische Fehler und Umgehungsmöglichkeiten.
Bekannte Probleme: CPU KompatibilitätDerzeit funktioniert das Plugin standartmäßig nur für x86_64 und arm64 CPU Architekturen. Hier sind einige Anleitungen für andere CPU Architekturen.
Aktualisieren von Versionen vor 6.0.0Wichtige Hinweise zum aktualisieren von älteren Versionen.
Admin DokumentationPlugin Peertube Livechat Administation
EinstellungenPlugin Peertube Livechat Einstellungen
Externe AuthentifizierungPlugin Peertube Livechat Einstellungen - Externe Authentifizierung
Prosody mod_firewallErweiterte Firewall-Regeln für den Prosody-Server
Fortgeschrittene NutzungEinige erweiterte Funktionen
XMPP-ClientsVerbindungen über XMPP-Clients zulassen
Matterbridge benutzenMatterbridge als Brücke zu anderen Chats nutzen`,description:"Plugin Dokumentation",tags:[],title:"Dokumentation",uri:"/peertube-plugin-livechat/de/documentation/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Admin Dokumentation",content:`Dieser Abschnitt beschreibt die Seite mit den Plugin Einstellungen.
Chat Nutzungsbedingungen und Konditionen des Kanals Sie können eine “Nutzungsbedingungen”-Nachricht konfigurieren, die Benutzern angezeigt wird, die Ihren Chaträumen beitreten.
Weitere Informationen zu dieser Funktion finden Sie in der Dokumentation zu den Kanal-Nutzungsbedingungen.
Info Wenn Sie diese Einstellung ändern, wird der Chatserver neu gestartet, und alle Benutzer werden für kurze Zeit getrennt.
Bestehende Räume auflisten Wenn Sie auf die Schaltfläche «Räume auflisten» klicken, werden alle bestehenden Chaträume aufgelistet. Sie können sie dann finden und moderieren.
Föderation Die folgenden Einstellungen betreffen die Föderation mit anderen Peertube Instanzen und anderer Fediverse-Software.
Chats von anderen Instanzen nicht anzeigen Wenn Sie diese Einstellung aktivieren, werden in Ihrer Instanz niemals Chats von Videos anderer Instanzen angezeigt.
Chat-Information nicht veröffentlichen Wenn Sie diese Einstellung aktivieren, wird Ihre Instanz keine Chat Informationen im Fediverse veröffentlichen. Andere Peertube-Instanzen wissen nicht, dass mit Ihren Videos Chaträume verbunden sind. Bitte beachten Sie: Wenn Sie bereits Chats geführt haben, ist es möglich, dass die Informationen bereits veröffentlicht wurden. Sie müssen das nächste Video Update abwarten, bevor die Informationen nicht mehr öffentlich zugänglich sind. Wenn Sie diese Einstellung deaktivieren, müssen Sie außerdem warten, bis die Videos aktualisiert wurden, bevor die Informationen erneut veröffentlicht werden. Diese Aktualisierung erfolgt unter anderem, wenn ein Live Event fortgesetzt oder beendet wird. Bitte beachten Sie: Diese Einstellung betrifft nur die Veröffentlichung von Informationen über das ActivityPub-Protokoll. Dies hindert eine entfernte Anwendung nicht daran, das Vorhandensein von Chats zu erkennen und zu versuchen, eine Verbindung herzustellen.
Authentifizierung Livechat-Token deaktivieren Falls Sie Probleme mit den Langzeit-Authentifizierungs-Tokens haben, können Sie diese Funktion hier deaktivieren.
Externe Authentifizierung Siehe die ausführliche Dokumentationsseite:
Externe Authentifizierung
Erweiterte Kanaleinstellungen Die folgenden Einstellungen betreffen die erweiterten Kanaloptionen: Nutzer können ihre Kanäle individuell anpassen, den Moderationsbot aktivieren, …
Die erweiterten Kanalkonfiguration und den Chatbot deaktivieren Wenn Sie Probleme mit dieser Funktion haben, können Sie sie deaktivieren.
Chatverhalten Raumtyp Sie können hier wählen, ob Sie für jedes Video einen eigenen Raum haben möchten oder ob Sie sie nach Kanälen gruppieren möchten.
Chat automatisch öffnen Wenn ausgewählt wird der Chat geladen, sobald Sie auf der Videoseite sind.
Zeige den «Chat in neuem Fenster öffnen» Knopf Es wird einen Knopf zum Öffnen des Webchats in einem neuen Fenster geben.
Zeige den «Chat Link teilen» Knopf Diese Funktion fügt eine «Chat-Link teilen» Schaltfläche hinzu. Mit dieser Schaltfläche können Sie URLs generieren, um dem Chat beizutreten. Der Chat kann angepasst werden (schreibgeschützter Modus, Verwendung des aktuellen Themas, …).
Sie können zum Beispiel eine schreibgeschützte URL generieren und diese in OBS verwenden, um den Chat in Ihren Live-Stream zu integrieren!
Mit dieser Einstellung können Sie festlegen, wer auf diese Schaltfläche zugreifen kann.
Nutzer können den Chat für ihre Live-Videos aktivieren Wenn diese Option aktiviert ist, haben alle Live-Videos in ihren Eigenschaften ein Feld zur Aktivierung des Webchats.
Der Eigentümer des Videos kann Webchats aktivieren.
Chat für alle Live-Videos aktivieren Wenn diese Option markiert ist, wird der Chat für alle Live-Videos aktiviert.
Chat für alle Nicht-Live-Videos aktivieren Chat für alle Nicht-Live-Videos aktivieren
Chat für diese Videos aktivieren Chat für diese Videos aktivieren
Chat für anonyme Benutzer ausblenden Wenn die Option aktiviert ist, können anonyme Peertube-Nutzer den Chat nicht sehen. Diese Funktion ist noch experimentell. Wenn Sie diese Option aktiviert haben, wird empfohlen auch die Option “Chat-Informationen nicht veröffentlichen” zu aktivieren. Andernfalls könnten einige Tools von Drittanbietern versuchen, den Chat zu öffnen, und ein unvorhersehbares Verhalten verursachen.
Hinweis: Im Moment blendet diese Funktion einfach den Chat aus. In einer zukünftigen Version wird der Chat durch eine Meldung ersetzt, die besagt «Bitte melden Sie sich an, um […]». Siehe v5.7.0 Release Notes für weitere Informationen.
IP eines anonymen Benutzers sperren, wenn dieser aus einem Chatraum verbannt wird Wenn Sie diese Option aktivieren, wird jedes Mal, wenn ein anonymer Benutzer aus einem Chatraum verbannt wird, seine IP auch vom Chatserver verbannt. Warnung: wenn Ihre Instanz für die Registrierung offen ist, könnte jeder Benutzer einen gefangenen Raum erstellen, Benutzer zum Beitritt einladen und automatisch alle IPs der anonymen Benutzer sperren. Die Liste der gesperrten IPs wird nicht gespeichert, sie wird beim Neustart des Servers gelöscht, oder wenn Sie die Einstellungen eines Plugins ändern. Die gesperrten IPs werden in den Logdateien des Prosody-Servers protokolliert, so dass die Administratoren des Servers eventuell externe Tools (wie fail2ban) verwenden können, um IPs in größerem Umfang zu sperren.
Wichtiger Hinweis: Wenn Sie diese Funktion aktivieren und einen benutzerdefinierten Reverse-Proxy vor Peertube verwenden, stellen Sie bitte sicher, dass Ihr Setup korrekt konfiguriert ist, um die IPs echter Benutzer an Peertube weiterzuleiten. Andernfalls könnten alle anonymen Benutzer auf einmal blockiert werden.
Farbthemen Avatar-Satz Sie können aus mehreren verschiedenen Sets von Standard-Avataren wählen, die für Chat-Benutzer verwendet werden sollen.
Sepia (Peertube-Maskottchen): David Revoy’s Peertube Avatargenerator, CC-By Lizenz
Katzen: David Revoy’s Katzen Avatargenerator, CC-By Lizenz
Vögel: David Revoy’s Vögel Avatargenerator, CC-By Lizenz
Fenecs (Mobilizon-Maskottchen): David Revoy’s Fenec/Mobilizon Avatargenerator, CC-By Lizenz
Abstrakt: David Revoy’s Abstrakt Avatargenerator, CC-By Lizenz
Ältere Sepia-Avatare (die in früheren Plugin-Versionen enthalten waren): Basierend auf David Revoys Arbeit, AGPL-v3 Lizenz
Wenn Sie die Änderung nicht sofort sehen können, könnte es an Ihrem Browser-Cache liegen. Löschen Sie einfach den Sitzungsspeicher Ihres Browsers, oder starten Sie ihn neu.
ConverseJS Thema Sie können wählen, welches Thema Sie für ConverseJS verwenden möchten:
Peertube theme: Dies ist ein spezielles Thema, das speziell für die Integration von Peertube entwickelt wurde. Default ConverseJS theme: Dies ist das standard ConverseJS Thema. ConverseJS cyberpunk theme: Dies ist ein von ConverseJS bereitgestelltes Thema. Automatische Farberkennung Versucht, die Farben des aktuellen Themas des Benutzers automatisch zu erkennen. Wenn diese Einstellung aktiviert ist, versucht das Plugin, die Farben für das Chat-Thema automatisch zu erkennen. Wenn dies für einige Ihrer Peertube-Themen nicht korrekt funktioniert, können Sie diese Option deaktivieren. Sie können den Fehler im offiziellen Issue Tracker melden. Vergessen Sie nicht anzugeben, welches Thema nicht funktioniert.
Webchat Iframe Stil-Attribut Sie können einige benutzerdefinierte Stile hinzufügen, die dem Iframe hinzugefügt werden. Zum Beispiel eine benutzerdefinierte Breite: width:400px;
Erweiterte Einstellungen des Chatservers System Prosody benutzen Das Plugin wird mit einem AppImage geliefert, das zum Ausführen des Prosody XMPP-Servers verwendet wird. Wenn dieses AppImage nicht funktioniert, können Sie auf das Prosody-Paket zurückgreifen, das für Ihren Server gepackt ist. Installieren Sie einfach das Paket prosody.
Diese Einstellung sollte nur verwendet werden, wenn das Plugin defekt ist und auf einen Patch wartet.
Websocket deaktivieren Mit Peertube >= 5.0.0 versucht dieses Plugin, eine Websocket-Verbindung zum Chatten zu verwenden. Wenn der Browser oder die Verbindung des Benutzers nicht kompatibel ist, wird der Browser automatisch auf das BOSH-Protokoll zurückgreifen. Aber in seltenen Fällen kann dies fehlschlagen. Zum Beispiel, wenn Sie einen Reverse Proxy vor Peertube haben, der keine Websocket-Verbindung für Plugins erlaubt. In diesem Fall können Sie diese Einstellungen überprüfen, um Websocket-Verbindungen zu deaktivieren.
Prosody Port Der Port, der vom integrierten Prosody-Server verwendet wird. Ändern Sie ihn, wenn dieser Port bereits auf Ihrem Server verwendet wird. Sie können diesen Port auf Ihrer Firewall schließen, es wird nicht von der Außenwelt darauf zugegriffen. Hinweis: Dies könnte sich in naher Zukunft ändern, da geplant ist, eine Funktion zum Aktivieren externer Verbindungen hinzuzufügen.
Peertube-URL für API-Aufrufe Bitte lassen Sie diese Einstellungen leer, wenn Sie nicht wissen, was Sie tun. In einigen seltenen Fällen kann Prosody die API von Peertube nicht von seiner öffentlichen URI aufrufen. Sie können dieses Feld verwenden, um die URI von Peertube für Prosody-Module anzupassen (z.B. mit «http://localhost:9000» oder «http://127.0.0.1:9000»).
Wenn diese Einstellung leer gelassen wird und Sie Peertube >= 5.1 oder später verwenden, wird das Plugin die Werte aus Ihrer Peertube-Konfigurationsdatei verwenden, um zu erraten, auf welcher Schnittstelle und welchem Port die Anfrage erfolgen muss.
Schlussendlich wird es Ihre öffentliche Peertube-URI verwenden. So wird jeder API-Aufruf über Ihren Nginx-Server laufen. Dies kann in einigen Fällen fehlschlagen: z.B. wenn Sie sich in einem Docker-Container befinden, wo der öffentliche Hostname nicht zur richtigen IP aufgelöst wird. Versuchen Sie in diesem Fall, die “Peertube-URL für API-Aufrufe” Einstellungen zu ändern, indem Sie http://127.0.0.1:9000 einstellen (unter der Annahme, dass 9000 der Port ist, auf dem Peertube lauscht; fragen Sie Ihre Instanzadministratoren, wenn Sie es nicht wissen).
Standardmäßig Inhalte von Räumen protokollieren Wenn diese Option aktiviert ist, werden die Rauminhalte standardmäßig gespeichert. Jeder Benutzer, der einem Raum beitritt, sieht, was bereits geschrieben wurde, bevor er dem Chat beitrat. Bitte beachten Sie, dass es immer möglich ist, die Inhaltsarchivierung für einen bestimmten Raum zu aktivieren/deaktivieren, indem Sie seine Eigenschaften bearbeiten.
Ablaufzeit von Raumprotokollen Sie können hier auswählen, wie lange der Inhalt des Chatrooms vom Server aufbewahrt wird. Der Wert kann sein:
Verbindung zum Raum mit externen XMPP Konten aktivieren Durch Aktivieren dieser Option ist es möglich, über externe XMPP-Konten und XMPP-Clients eine Verbindung zu Räumen herzustellen. Achtung: Durch die Aktivierung dieser Option können zusätzliche Server- und DNS-Konfigurationen erforderlich sein. Bitte beachten Sie die Dokumentation: Aktivieren Sie externe XMPP-Kontoverbindungen. Prosody Server Port zu Server Port Der Port, der für XMPP s2s-Verbindungen (Server zu Server) verwendet wird. Sie sollten den Standardport 5269 verwenden. Andernfalls müssen Sie einen bestimmten DNS Eintrag erstellen .
Server zu Server Netzwerkschnittstellen Die Netzwerkschnittstellen, die für Server zu Server Verbindungen verwendet werden sollen. Liste der zu nutzenden IPs, durch Kommata getrennt (Leerzeichen werden entfernt). Sie können «*» verwenden, um alle IPv4-Schnittstellen zu nutzen, und «::» für alle IPv6-Schnittstellen. Beispiele:
Zertifikate Ordner Wenn dieses Feld leer ist, erzeugt und verwendet das Plugin selbstsignierte Zertifikate. Wenn Sie andere Zertifikate verwenden wollen, geben Sie hier einfach den Ordner an, in dem Prosody sie finden kann. Hinweis: Der Benutzer “peertube” muss Lesezugriff auf diesen Ordner haben.
Aktivieren von Client-Server-Verbindungen Ermöglichen Sie XMPP-Clients die Verbindung zum integrierten Prosody-Server. Diese Option allein lässt nur Verbindungen von localhost-Clients zu.
Diese Einstellung ermöglicht es XMPP-Clients, sich mit dem eingebauten Prosody-Server zu verbinden. Im Moment erlaubt diese Option nur Verbindungen von localhost-Clients.
Zum Beispiel kann diese Option einer Instanz von Matterbridge (sobald sie einen anonymen Login verwenden kann) auf demselben Rechner erlauben, Ihren Chat mit einem anderen Dienst wie einem Matrix-Raum zu verbinden.
Prosody Client-Server-Verbindungsport Der Port, der vom c2s-Modul des integrierten Prosody-Servers verwendet wird. XMPP-Clients müssen diesen Port zum Verbinden verwenden. Ändern Sie ihn, wenn dieser Port bereits auf Ihrem Server verwendet wird. Sie können diesen Port auf Ihrer Firewall vorerst geschlossen halten, es wird nicht von der Außenwelt darauf zugegriffen. Hinweis: Dies könnte sich in naher Zukunft ändern, da geplant ist, eine Funktion zum Aktivieren externer Verbindungen hinzuzufügen.
Client zu Server Netzwerkschnittstellen Die Netzwerkschnittstellen, die für Client-Server-Verbindungen überwacht werden sollen. Diese Einstellung ist für fortgeschrittene Benutzer gedacht. Ändern Sie diese Einstellung nicht, wenn Sie nicht genau wissen, was sie bedeutet. Liste der zu überwachenden IPs, durch Kommata getrennt (Leerzeichen werden entfernt). Sie können “*” verwenden, um auf allen IPv4-Schnittstellen zu lauschen, und “::” für alle IPv6-Schnittstellen. Beispiele:
Aktivieren externer XMPP-Komponenten Diese Einstellung ermöglicht es externen XMPP-Komponenten, sich mit dem Server zu verbinden. Standardmäßig erlaubt diese Option nur Verbindungen von localhost-Komponenten. Sie müssen den Wert “Prosody externe Komponenten Netzwerkschnittstellen” ändern, um an anderen Netzwerkschnittstellen zu lauschen.
Diese Funktion könnte für die Verbindung von Brücken oder Bots genutzt werden.
Weitere Informationen zu den externen Komponenten von Prosody finden Sie hier.
Aktivieren externer XMPP-Komponenten Aktivieren Sie die Verwendung externer XMPP-Komponenten. Diese Option allein erlaubt nur Verbindungen von localhost. Sie müssen die Netzwerkschnittstellen einrichten und den Port auf Ihrer Firewall öffnen, um sie von entfernten Servern aus verfügbar zu machen. Diese Funktion kann beispielsweise verwendet werden, um einige Bots mit den Chatrooms zu verbinden.
Port für externe Komponenten zur Verbindung mit Prosody Der Port, der von XMPP-Komponenten verwendet wird, um sich mit dem Prosody-Server zu verbinden. Ändern Sie ihn, wenn dieser Port bereits auf Ihrem Server verwendet wird. Sie können diesen Port in Ihrer Firewall geschlossen lassen, wenn Sie den Zugriff von anderen Schnittstellen als localhost nicht zulassen möchten.
Prosody externe Komponenten Netzwerkschnittstellen Die Netzwerkschnittstellen, die für externe Komponentenverbindungen überwacht werden sollen. Liste der zu überwachenden IP, durch Kommata getrennt (Leerzeichen werden entfernt). Sie können «*» verwenden, um auf allen IPv4-Schnittstellen zu lauschen, und «::» für alle IPv6-Schnittstellen. Beispiele:
Externe Komponenten Die zu erstellenden externen Komponenten:
Prosody mod_firewall einschalten Sie können mod_firewall auf Ihrem Prosody-Server aktivieren.
Weitere Informationen finden Sie in der Dokumentation.`,description:"Plugin Peertube Livechat Einstellungen",tags:[],title:"Einstellungen",uri:"/peertube-plugin-livechat/de/documentation/admin/settings/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Installationsanleitung",content:`Ich habe das Plugin gerade installiert/aktualisiert, aber es passiert nichts Wenn Sie das Plugin gerade installiert/aktualisiert haben, aber nichts passiert (kein Chat, keine Einstellungen, Schaltflächen auf der Einstellungsseite funktionieren nicht, …), versuchen Sie einfach, die Seite neu zu laden.
Diagnosewerkzeug Wenn der Chat nicht funktioniert, gibt es ein Diagnosetool auf den Einstellungsseiten des Plugins.
Öffnen Sie die Plugin-Einstellungen, und klicken Sie auf die Schaltfläche “Diagnose starten”.
Wenn auf der Diagnoseseite ein Fehler auftritt, können Sie auf dieser Seite nach einer Lösung suchen oder auf der Bugtracking Dokumentationsseite nachsehen, wenn Sie keine Antwort finden.
Chat wird nicht geladen Interne API-Aufrufe In manchen Fällen (z. B. bei einer Docker-Peertube-Installation) zeigen die Diagnosewerkzeuge einen Fehler für den Test namens “API Prosody -> Peertube is KO” an.
Versuchen Sie in diesem Fall, die “Peertube-URL für API-Aufrufe” Einstellungen zu ändern, indem Sie http://127.0.0.1:9000 einstellen (unter der Annahme, dass 9000 der Port ist, auf dem Peertube lauscht, fragen Sie Ihre Instanzadministratoren, wenn Sie es nicht wissen).
Weitere Informationen finden Sie in der Hilfe für diese Einstellung.
Websocket Wenn in den Diagnosetools alles in Ordnung ist, aber die Chat-Fenster leer bleiben: Es kann ein Websocket-Problem sein. Seit Peertube Version 5.0.0 müssen einige zusätzliche Konfigurationen auf der Serverseite vorgenommen werden. Vergewissern Sie sich bei den Instanzadministratoren, dass sie nicht vergessen haben, die in den Peertube v5.0.0 release notes aufgeführten Änderungen anzuwenden.
Sie können bestätigen, dass es sich um ein Websocket-Problem handelt, indem Sie Ihre Browserkonsole öffnen und nach Fehlerprotokollen suchen, in denen von einer fehlgeschlagenen Websocket-Verbindung die Rede ist.
Wenn Sie dies nicht sofort beheben können, können Sie Websocket deaktivieren, indem Sie das Häkchen bei “Websocket deaktivieren” auf der Plugin Einstellungsseite entfernen. In diesem Fall sollten Sie auch das Häkchen bei “Chat-Information nicht veröffentlichen” setzen, da die Chat-Föderation ohne Websocket nicht funktioniert.`,description:"Einige klassische Fehler und Umgehungsmöglichkeiten.",tags:[],title:"Fehlerbehebung",uri:"/peertube-plugin-livechat/de/documentation/installation/troubleshooting/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation",content:`Chaträumen beitreten Wenn Sie ein Peertube-Video ansehen, bei dem der Chat aktiviert ist, sehen Sie den Chat neben dem Video:
Es gibt zwei leicht unterschiedliche Anwendungsfälle, je nachdem, ob Sie ein Konto auf der Peertube-Instanz haben oder nicht. Siehe unten für weitere Informationen.
Wenn Sie kein Peertube-Konto haben Warnung Diese Funktion kann von den Administratoren der Instanz deaktiviert werden.
Wenn Sie auf der Peertube-Instanz, auf der Sie das Video ansehen, nicht eingeloggt sind, treten Sie automatisch dem Chat bei. Ihnen wird ein zufälliger Spitzname zugewiesen (z. B. “Anonymous 12345”).
Bevor Sie im Chatraum sprechen können, müssen Sie einen Spitznamen in das Feld am unteren Rand des Fensters eingeben.
Anmeldung über einen externen Authentifizierungsanbieter Warnung Diese Funktion kann von den Administratoren der Instanz deaktiviert werden.
Die Peertube-Instanz kann externe Authentifizierungsanbieter konfigurieren (Mastodon-Konten, Google-Konten, …). In diesem Fall sehen Sie eine “Mit einem externem Account anmelden” Schaltfläche, die ein Dialogfenster öffnet. In diesem Dialogfenster gibt es einige Schaltflächen, um eine Verbindung mit einem externen Konto herzustellen.
Sobald Sie sich bei dem entfernten Konto angemeldet und der Zugang gewährt wurde, werden Ihr Nickname und Ihr Avatar (falls vorhanden) automatisch abgerufen. Es werden keine weiteren Daten gespeichert. Diese Daten werden einige Stunden nach Beendigung des Chats automatisch gelöscht.
Wenn Sie ein Peertube-Konto haben Wenn Sie mit Ihrem Peertube-Konto verbunden sind, treten Sie dem Raum automatisch bei, indem Sie Ihren Peertube Spitznamen und Avatar verwenden.
Tipp Wenn Sie ein Live-Video auf einer Instanz ansehen, auf der Sie kein Konto haben, aber ein Konto auf einer anderen Instanz: Wenn das Livechat-Plugin auf beiden Instanzen installiert ist, ist es möglich, dem Chat mit Ihrem Konto beizutreten. Öffnen Sie dazu einfach das Video auf Ihrer Instanz (Sie können zum Beispiel die Video-URL in das Suchfeld Ihrer Instanz kopieren/einfügen).
Wenn Sie ein Peertube Konto auf einer anderen Peertube Instanz haben Info Diese Funktion wird mit dem Livechatplugin Version 9.0.0 verfügbar sein.
Wenn Sie ein Peertube Konto haben, aber nicht auf der aktuellen Instanz, gibt es einen “Mit einem externem Account anmelden”-Button. Diese Schaltfläche öffnet einen Dialog, in dem Sie die URL Ihrer Peertube Instanz eingeben können. Sobald Sie diese eingegeben haben, wird geprüft, ob das Livechatplugin auf der entfernten Instanz verfügbar ist und ob das Video verfügbar ist. Wenn dies der Fall ist, werden Sie zu dem Video auf der entfernten Instanz weitergeleitet.
Chatten Um Nachrichten zu senden, geben Sie sie einfach in das Feld “Nachricht” am unteren Rand des Bildschirms ein. Sie können sie durch Drücken der Eingabetaste auf Ihrer Tastatur oder durch Klicken auf die Schaltfläche “Senden” senden.
Wenn Sie in Ihren Nachrichten Zeilenumbrüche einfügen möchten, können Sie die Tastenkombination “Umschalt+Eingabe” verwenden.
Sie können Emojis zu Ihren Nachrichten hinzufügen. Sie können zum Beispiel das Emojis-Menü verwenden oder direkt Emojis-Kurzbefehle wie :smiley: eingeben.
Sie können andere Teilnehmer erwähnen. Dazu können Sie die ersten Buchstaben des Spitznamens eingeben und dann die Tabulatortaste drücken. Sie können auch “@” tippen: Damit öffnen Sie direkt das Menü. Sie können auch auf einen Spitznamen in der Teilnehmerliste klicken, um ihn in das Nachrichtenfeld einzufügen.
Teilnehmerliste Um die Liste der Teilnehmer zu sehen, öffnen Sie einfach das rechte Menü:
Sie können sehen, dass einige Teilnehmer besondere Rechte haben (Moderator, Eigentümer, …).
Chat Dropdown Menü Es gibt ein Dropdownmenü am oberen Rand des Chats, das einige erweiterte Funktionen enthält. Dies ist besonders nützlich für die Moderationsfunktionen. Die verfügbaren Funktionen hängen von Ihrer Zugriffsstufe ab.
Vollbild öffnen Oben im Chat gibt es eine Schaltfläche, um den Chat im Vollbildmodus zu öffnen. Dadurch wird eine neue Browser-Registerkarte mit dem folgenden Inhalt geöffnet:
Es kann einfacher sein, in einer seperaten Browser-Registerkarte zu chatten.
Spitznamen ändern Sie können Ihren Spitznamen ändern, indem Sie /nick ihr_neuer_spitzname in das Nachrichtenfeld eingeben.
Sie können Ihren Spitznamen auch über das Chatmenü ändern.`,description:"Wie man chattet für Live-Stream Zuschauer",tags:[],title:"Für Zuschauer",uri:"/peertube-plugin-livechat/de/documentation/user/viewers/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`This page describes the different source code folders and their content.
build files Files in the root dir that begins with build- are files used to build the plugin. See the package.json file for more information.
assets assets/images The assets/images folder contains all icons files used by the plugin.
There is also the assets/images/avatars folders, which contains avatars used for anonymous chat users. These files are used to generate multiple avatars (see the build-avatars.js script for more information).
assets/images/avatars/legacy contains legacy avatar set (livechat versions until 8.1.0 included) assets/images/avatars/sepia contains new sepia avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/cat contains new cats avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/bird contains new birds avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/fenec contains new fenecs avatar set, based on the work of David Revoy (see copyright informations) assets/images/avatars/abstract contains new abstract avatar set, based on the work of David Revoy (see copyright informations) assets/styles The assets/styles folder contains the livechat plugin SCSS source files.
build The build folder is not part of the source code, but is used to put some files during the build process.
For example, build-conversejs.js use the folder build/conversejs to build a customized ConverseJS version.
client The client folder contains the front-end source code.
Files like client/common-client-plugin.ts, admin-plugin-client-plugin.ts, … are the base files that are loaded by Peertube for different “scopes” (common, videowatch, …). Please refer to the Peertube plugin documentation for more information.
conversejs The conversejs folder contains code relative to the use of ConverseJS.
conversejs/custom The conversejs/custom folder contains some files that are used to customize ConverseJS. See the build-conversejs.sh script for more information.
dist The dist folder is where goes all files created during the build process. It is not part of the source code.
documentation The folder documentation is deprecated. We only keep files in this folder to avoid dead links (links to these files were shared on many websites or social media posts).
The source code for the new documentation is in support/documentation/content/en, and is used to generate the documentation web site.
languages The folder languages contains the languages files. These files are translated using Weblate).
prosody-modules The prosody-modules folder contains some modules used by Prosody.
Some of them are “officials” plugins, others are specific to this plugin.
server The server folder contains the backend source code.
shared The shared folder contains comme code that will be used both on frontend and backend.
support/documentation The support/documentation contains the documentation source code.
vendor The vendor folder is not part of the source code. It is used during the build process to download some external source code.`,description:"Source code organization",tags:[],title:"Source code",uri:"/peertube-plugin-livechat/de/technical/sourcecode/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer > Chatbot",content:`Forbid special characters Info Diese Funktion wird mit dem Livechatplugin Version 11.1.0 verfügbar sein.
Konfiguration By enabling this option, the moderation bot will automatically delete messages containing more than X special characters. Special characters are those that don’t fit into one of these categories: letters, numbers, punctuation symbols, currency symbols, emojis.
Tolérance Number of special characters to accept before deleting messages.
Grund Anzuzeigender Grund anstelle der gelöschen Nachricht
Auch Nachrichten von Moderatoren moderieren By default, moderator messages will not be affected by this feature. By checking this option, messages from moderators will also be deleted.`,description:"The bot can automatically moderate messages containing too many special characters.",tags:[],title:"Special characters",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/bot/special_chars/index.html"},{breadcrumb:"Peertube livechat > Beitragen",content:` Tipp Dieser Verhaltenskodex basiert auf dem Contributor Covenant, Version 2.1, verfügbar unter https://www.contributor-covenant.org/version/2/1/code_of_conduct.html. Übersetzungen sind unter https://www.contributor-covenant.org/translations verfügbar. Fälle von beleidigendem, belästigendem oder anderweitig inakzeptablem Verhalten können den für die Durchsetzung verantwortlichen Gemeinschaftsleitern per E-Mail an git.[at].john-livingston.fr gemeldet werden.
Our Pledge We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.
We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.
Our Standards Examples of behavior that contributes to a positive environment for our community include:
Demonstrating empathy and kindness toward other people Being respectful of differing opinions, viewpoints, and experiences Giving and gracefully accepting constructive feedback Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience Focusing on what is best not just for us as individuals, but for the overall community Examples of unacceptable behavior include:
The use of sexualized language or imagery, and sexual attention or advances of any kind Trolling, insulting or derogatory comments, and personal or political attacks Public or private harassment Publishing others’ private information, such as a physical or email address, without their explicit permission Other conduct which could reasonably be considered inappropriate in a professional setting Enforcement Responsibilities Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.
Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.
Scope This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces. Examples of representing our community include using an official e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.
Enforcement Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement by mail at git.[at].john-livingston.fr. All complaints will be reviewed and investigated promptly and fairly.
All community leaders are obligated to respect the privacy and security of the reporter of any incident.
Enforcement Guidelines Community leaders will follow these Community Impact Guidelines in determining the consequences for any action they deem in violation of this Code of Conduct:
1. Correction Community Impact: Use of inappropriate language or other behavior deemed unprofessional or unwelcome in the community.
Consequence: A private, written warning from community leaders, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested.
2. Warning Community Impact: A violation through a single incident or series of actions.
Consequence: A warning with consequences for continued behavior. No interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, for a specified period of time. This includes avoiding interactions in community spaces as well as external channels like social media. Violating these terms may lead to a temporary or permanent ban.
3. Temporary Ban Community Impact: A serious violation of community standards, including sustained inappropriate behavior.
Consequence: A temporary ban from any sort of interaction or public communication with the community for a specified period of time. No public or private interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, is allowed during this period. Violating these terms may lead to a permanent ban.
4. Permanent Ban Community Impact: Demonstrating a pattern of violation of community standards, including sustained inappropriate behavior, harassment of an individual, or aggression toward or disparagement of classes of individuals.
Consequence: A permanent ban from any sort of public interaction within the community.
Attribution This Code of Conduct is adapted from the Contributor Covenant, version 2.1, available at https://www.contributor-covenant.org/version/2/1/code_of_conduct.html.
Community Impact Guidelines were inspired by Mozilla’s code of conduct enforcement ladder.
For answers to common questions about this code of conduct, see the FAQ at https://www.contributor-covenant.org/faq. Translations are available at https://www.contributor-covenant.org/translations.`,description:"Vereinbarung über Verhaltenskodex für Mitwirkende",tags:[],title:"Verhaltenskodex",uri:"/peertube-plugin-livechat/de/contributing/codeofconduct/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Admin Dokumentation",content:`Benutzer, die nicht mit Ihrer Peertube-Instanz verbunden sind, treten dem Chat mit “anonymen Konten” bei (sie können einen Spitznamen frei wählen und bekommen einen zufälligen Avatar zugewiesen).
Sie können einige externe Authentifizierungsmethoden aktivieren, damit die Benutzer Chat-Konten erstellen können. In diesem Fall werden ihr Nickname und Avatar automatisch mit den Informationen des entfernten Kontos initialisiert.
Solche “Nutzer mit externen Konten” sind leichter zu moderieren als anonyme Konten.
Dies ermöglicht es den Nutzern auch, dem Chat beizutreten, ohne ein Peertube-Konto zu erstellen (z. B. wenn Ihre Instanz die Registrierung geschlossen hat, oder ohne auf die Genehmigung des Kontos zu warten).
Auf dieser Seite werden die verfügbaren Authentifizierungsmethoden beschrieben.
Für die Benutzerdokumentation, siehe Benutzerdokumentation
OpenID Connect Warnung Diese Funktion ist noch experimentell. Diese Funktion ist mit der Plugin-Version >= 9.0.0 verfügbar.
Sie können einen externen OpenID Connect kompatiblen Anbieter konfigurieren.
Auf diese Weise können Sie Ihre Website beispielsweise für Single Sign-On nutzen.
Gängige CMS-Software (Wordpess, …) bietet Plugins an, die OpenID Connect implementieren.
Um diese Funktion zu aktivieren, müssen Sie zunächst einen Client auf Ihrer Provider-Seite erstellen (lesen Sie die zugehörige Dokumentation zur Aktivierung von OpenID Connect). Gehen Sie dann zu den Plugin-Einstellungen, und aktivieren Sie “Verwenden eines OpenID Connect Anbieters”.
Hinweis: Wenn Sie zulässige Umleitungsurls auf der Anbieterseite einschränken möchten (beste Sicherheitspraxis), zeigt Ihnen das Plugin die zuzulassende Url an. Kopieren Sie sie einfach in die Konfiguration Ihrer OpenID Connect-Anwendung.
Sie müssen nun einige Einstellungen vornehmen.
Name für die Anmeldungsschaltfläche Diese Bezeichnung wird den Nutzern als Name der Schaltfläche zur Authentifizierung bei diesem OIDC-Anbieter angezeigt.
Dies ist die Beschriftung der Schaltfläche auf dem folgenden Bildschirmfoto:
Zurzeit ist es nicht möglich, diesen Text zu übersetzen.
Discovery URL Ihr OpenID Connect-Anbieter muss die discovery URL implementieren. Legen Sie hier einfach die Discovery Url fest, diese sollte ungefähr https://example.com/.well-known/openid-configuration sein.
Hinweis: Wenn Ihr Anbieter den Standardpfad /.well-known/openid-configuration verwendet, können Sie ihn weglassen. Zum Beispiel wird https://accounts.google.com funktionieren.
Client ID Ihre Anwendung Client ID.
Client secret Ihr Anwendungs Client secret.
Google, Facebook, … Darüber hinaus können Sie auch einen oder mehrere “Standard”-Open ID Connect-Anbieter (Google, Facebook, …) konfigurieren.
Bei diesen Anbietern sind die Discovery-Url und die Schaltflächenbeschriftung voreingestellt. Sie müssen lediglich eine OAuth2-Anwendung auf der Anbieterseite erstellen und Client ID und Client Secret konfigurieren.
Wenn Ihnen ein Standardanbieter einfällt, der noch nicht verfügbar ist, können Sie um die Implementierung bitten, indem Sie [eine neues Problem] (https://github.com/JohnXLivingston/peertube-plugin-livechat/issues) eröffnen.
Fehlerbehebung Wenn die Schaltfläche für Endbenutzer nicht angezeigt wird, liegt möglicherweise ein Konfigurationsproblem vor. Sie können das Diagnose-Tool ausprobieren, um weitere Informationen zu erhalten.
Hinweis: Wenn Sie mit Ihrem Peertube-Konto verbunden sind, wird die Schaltfläche nicht angezeigt. Verwenden Sie also ein privates Browserfenster zum Testen.
Wenn die Schaltfläche angezeigt wird, aber nicht funktioniert, überprüfen Sie Ihre Peertube-Protokolle. Es könnte daran liegen, dass der entfernte Dienst keine Standard-Scopes oder Attributnamen verwendet.
Weiteres folgt Andere Authentifizierungsmethoden werden in Zukunft implementiert werden.`,description:"Plugin Peertube Livechat Einstellungen - Externe Authentifizierung",tags:[],title:"Externe Authentifizierung",uri:"/peertube-plugin-livechat/de/documentation/admin/external_auth/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Installationsanleitung",content:`Das im Plugin enthaltene Prosody AppImage funktioniert nur mit x86_64 und arm64 CPU Architekturen. Es ist nicht kompatibel mit anderen CPU-Architekturen.
Um das Plugin zu verwenden, müssen Sie Prosody manuell auf Ihrem Server installieren (siehe unten).
Hinweis: Das Plugin erfordert Prosody >= 0.12.0. Wenn Sie eine ältere Version verwenden, könnte die Chat Federation nicht funktionieren und ein unerwartetes Verhalten zeigen.
Sobald dies geschehen ist, müssen Sie in den Plugin-Einstellungen das Häkchen bei Use system Prosody setzen.
Nicht-Docker Peertube installation Für die Standardinstallation müssen Sie nur das offizielle prosody-Paket für Ihre Linux-Distribution installieren.
Zum Beispiel, auf Debian/Ubuntu:
sudo apt install prosodySie können dann den Dienst deaktivieren, der automatisch startet, wenn Sie Prosody installieren (das Plugin startet einen Prosody-Prozess, der Dienst muss nicht dauerhaft laufen). Zum Beispiel unter Debian/Ubuntu (und anderen Systemd-basierten Linux-Distributionen):
sudo systemctl disable prosody && sudo systemctl stop prosodyAchtung: Deaktivieren Sie Prosody nicht, wenn es für einen anderen Dienst auf Ihrem Server verwendet wird, wie zum Beispiel Jitsi.
Docker Sie müssen ein Peertube-Image generieren, das Prosody in demselben Container enthält, der auch Peertube beinhaltet. Ich weiß, dass dies nicht der Standardweg ist, um dies mit Docker zu tun, aber bedenken Sie, dass eine vorübergehende Lösung ist.
Um ein solches Image zu erzeugen und zu verwenden, lesen Sie bitte die Docker-Dokumentation. Die Docker-Datei, um das Paket zu erzeugen, sollte wie folgt sein:
FROM chocobozzz/peertube:production-bullseye RUN apt -y update && apt install -y prosody && apt -y cleanYunohost Sie müssen metronome (der von Yunohost bereitgestellte XMPP-Server) deaktivieren, und prosody installieren.
Dies wird bereits von der Yunohost Peertube Anwendung gemacht, da es für das Plugin vor v6.0.0 erforderlich war.
Es kann aber sein, dass es in naher Zukunft entfernt wird (um die Nachteile dieser Methode zu vermeiden). Ich muss mit dem Yunohost Team diskutieren, um zu entscheiden, wie wir die Nachteile minimieren können, und die Kompatibilität zu maximieren.`,description:"Derzeit funktioniert das Plugin standartmäßig nur für x86_64 und arm64 CPU Architekturen. Hier sind einige Anleitungen für andere CPU Architekturen.",tags:[],title:"Bekannte Probleme: CPU Kompatibilität",uri:"/peertube-plugin-livechat/de/documentation/installation/cpu_compatibility/index.html"},{breadcrumb:"Peertube livechat > Dokumentation",content:` Info Bevor Sie auf eine Hauptversion aktualisieren, lesen Sie bitte die Versionshinweise und die Liste der wichtigsten Änderungen : CHANGELOG.
Tipp Um das Plugin zu installieren oder zu aktualisieren einfach das Peertube Web-Admin-Interface benutzen.
Hier sind weitere, spezifischere Anweisungen:
FehlerbehebungEinige klassische Fehler und Umgehungsmöglichkeiten.
Bekannte Probleme: CPU KompatibilitätDerzeit funktioniert das Plugin standartmäßig nur für x86_64 und arm64 CPU Architekturen. Hier sind einige Anleitungen für andere CPU Architekturen.
Aktualisieren von Versionen vor 6.0.0Wichtige Hinweise zum aktualisieren von älteren Versionen.`,description:"Plugin peertube-plugin-livechat Installationsanleitung",tags:[],title:"Installationsanleitung",uri:"/peertube-plugin-livechat/de/documentation/installation/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:` Warnung This page describes experimental features. These features are available with the plugin version >= 7.2.0.
Einführung Peertube is part of the Fediverse. So Peertube video can be watched from other Peertube instances, and from various other softwares:
from a Mastodon (or other fediverse application) instance, from a mobile app (Fedilab, Tusky, …), from desktop fediverse app, … This livechat plugin is using well known standards, so it is possible to join chat rooms even when not viewing the video on Peertube.
There are basically 2 ways to join the chat room associated to a video:
opening a web page (with an url like https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535), using a XMPP client (and joining a room like xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join) Warnung Joining the chat using a XMPP client is not always possible. It requires some DNS and server configuration. It will only be possible if instance’s admins have correctly setup the external XMPP clients connection feature.
Warnung Don’t try to gues these url and connection methods yourself. Please report to next chapters.
Chat discovery Using ActivityPub The livechat plugin adds some data in Video ActivityPub objects, so that the chat can be discovered.
Info This requires Peertube >= 5.1
This follows the FEP-1970 recommendations.
Warnung At the time of the writing, this FEP is in draft status, and the livechat plugin is a Proof-of-concept. Until the FEP is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
Basically, the chat will be declared as attachments on the Video object, using the discussion relation.
By default, here is an example of what you will get:
{ "@context": [ "https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1", { "RsaSignature2017": "https://w3id.org/security#RsaSignature2017" }, { // ... } ], "to": [ "https://www.w3.org/ns/activitystreams#Public" ], "cc": [ "https://yourinstance.tld/accounts/root/followers" ], "type": "Video", "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535", "name": "The video title", // ... "url": [ /* ... */ ], "attachment": [ { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" } ] }In case the instance has activated the external XMPP clients connection feature:
{ "@context": [ "https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1", { "RsaSignature2017": "https://w3id.org/security#RsaSignature2017" }, { // ... } ], "to": [ "https://www.w3.org/ns/activitystreams#Public" ], "cc": [ "https://yourinstance.tld/accounts/root/followers" ], "type": "Video", "id": "https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535", "name": "The video title", // ... "url": [ /* ... */ ], "attachment": [ { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" }, { "type": "Link", "name": "Chat for live stream: The video title", "rel": "discussion", "href": "xmpp://8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld?join" } ] }Algorithm If you want to display the chat in a web page or in an iframe, here is what you should do:
get the Video ActivityPub object, if there is no attachment key, stop. loop through the attachment values (if attachment is not an array, just iterate on this single value) search for an entry with rel === discussion, and with href using the https scheme (that begins with https://) if found, open this href If you want to open the chat room using the XMPP protocol:
get the Video ActivityPub object, if there is no attachment key, stop. loop through the attachment values (if attachment is not an array, just iterate on this single value) search for an entry with rel === discussion, and with href using the xmpp scheme (that begins with xmpp://) if found, open this xmpp uri with your client, or connect to the XMPP room at that address Additional notes In the ActivityPub object, there is also a peertubeLiveChat entry. Don’t use the content of this entry. This is specific to the livechat plugin, and can be changed or removed in a near future. It is currently required for some endpoint discovery.
Using Podcast RSS feed The livechat plugin adds some data in Podcast RSS feeds under the <podcast:liveItem>, so that the chat can be discovered for live streams.
Info This requires Peertube >= 5.2
Info The <podcast:chat> element is currently only supported for live streams.
This follows the <podcast:chat> proposal.
Warnung At the time of the writing, this proposal is in draft status, and the livechat plugin is a Proof-of-concept. Until the proposal is adopted, the specification can change, and the livechat plugin will be adapted accordingly.
Basically, the chat will be declared as tag under on the <podcast:liveItem> element.
By default, here is an example of what you will get:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>In case the instance has activated the external XMPP clients connection feature:
<podcast:liveItem status="live" start="2023-07-06T18:00:00.000Z"> <title>The video title</title> <guid isPermaLink="false">e32b4890-983b-4ce5-8b46-f2d6bc1d8819_2023-07-06T18:00:00.000Z</guid> <link>https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535</link> <podcast:socialInteract uri="https://yourinstance.tld/videos/watch/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" protocol="activitypub" accountUrl="https://yourinstance.tld/a/youraccount" /> <enclosure url="https://yourinstance.tld/path/to/video/master.m3u8" type="application/x-mpegURL" /> <podcast:alternateEnclosure type="application/x-mpegURL" lang="en" title="HLS" default="true"> <podcast:source uri="https://yourinstance.tld/path/to/video/master.m3u8" /> </podcast:alternateEnclosure> <itunes:image href="https://yourinstance.tld/lazy-static/previews/8df24108-6e70-4fc8-b1cc-f2db7fcdd535.jpg" /> <podcast:chat server="yourinstance.tld" protocol="xmpp" space="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.yourinstance.tld" embedUrl="https://yourinstance.tld/plugins/livechat/router/webchat/room/8df24108-6e70-4fc8-b1cc-f2db7fcdd535" /> </podcast:liveItem>Algorithm If you want to display the chat in a web page or in an iframe, here is what you should do:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub if there is no <podcast:chat> element under the <podcast:liveItem>, stop. loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and an embedUrl attribute if found, open this embedUrl If you want to open the chat room using the XMPP protocol:
get the Podcast RSS feed for the channel, if there is no <podcast:liveItem> element under the <channel>, stop. find the <podcast:liveItem> you are looking for <podcast:socialInteract> can be used to cross-reference the items with ActivityPub loop through the <podcast:chat> values (if <podcast:chat> is not an array, just iterate on this single value) there should only be one, but you should expect to handle several just in case search for the first entry protocol === xmpp and a space attribute space should be an XMPP JID for a MUC if found, open this XMPP JID with your client after converting it to a join URI, or connect to the XMPP room at that address `,description:"Displaying the livechat with 3rd party software.",tags:[],title:"Third party",uri:"/peertube-plugin-livechat/de/technical/thirdparty/index.html"},{breadcrumb:"Peertube livechat > Beitragen",content:`Sie können zur Übersetzung dieses Plugins beitragen. Die Übersetzungen werden mit der Software Weblate unter Verwendung der Framasoft Weblate Instanz bearbeitet.
Warnung Ändern Sie niemals direkt Dateien im Ordner languages, dies könnte zu Konflikten führen.
Wie funktioniert es Erstellen Sie ein Konto: https://weblate.framasoft.org/accounts/register/ Bestätigen Sie Ihre E-Mail und folgen Sie dem zugesandten Link Erstellen Sie Ihr Passwort und richten Sie Ihr Konto ein Rufen Sie die Projektseite des Plugins auf: https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/ Wählen Sie die Sprache, die Sie übersetzen möchten Übersetzen Sie einfach die fehlenden Sätze, oder korrigieren Sie die Sätze, die Ihnen falsch erscheinen. Warnung Es könnte einige «sehr technische» Zeichenfolgen geben. Wenn Sie sich der Bedeutung oder Ihrer Übersetzung nicht 100%ig sicher sind, sollten Sie sie besser nicht übersetzen, damit sie in Englisch angezeigt werden.
ConverseJS Übersetzungen Dieses Plugin verlässt sich auf ConverseJS für das Chat-Frontend. ConverseJS hat seine eigenen Übersetzungen, in seiner eigenen Weblateinstanz. Sie können auch direkt im Code-Repository übersetzen. Weitere Informationen finden Sie in der ConverseJS Übersetzungsdokumentation.
Eine neues Sprachgebiet hinzufügen Wenn Sie glauben, dass eine Sprache fehlt, prüfen Sie bitte zuerst, ob sie von Peertube unterstützt wird. Wenn ja, können Sie ein Problem erstellen, um danach zu fragen.
Hinzufügen neuer Zeichenfolgen / Verwendung von Übersetzungen im Code Wenn Sie an neuen Funktionen arbeiten und neue Zeichenketten benötigen, können Sie diese direkt in Weblate erstellen. Die englische Version ist obligatorisch. Beginnen Sie mit ihr.
Jede Zeichenfolge ist mit einem Schlüssel verknüpft (z. B. use_chat). Wählen Sie einen expliziten Schlüssel in Englisch und nutzen Sie nur Kleinbuchstaben.
Wenn Sie neue Zeichenketten testen müssen, ohne auf einen Weblate-Zusammenschluss zu warten, können Sie die Dateien languages/*.yml ändern, aber vermeiden Sie es, diese Änderungen zu übertragen (um das Konfliktrisiko zu minimieren).
Übersetzungen im Front-End-Code verwenden Bevor Sie eine Zeichenkette im Frontend verwenden, müssen Sie eine neue Konstante in client/@types/global.d.ts deklarieren. Der Name der Konstante muss:
mit dem Präfix “LOC_” beginnen den Zeichenketten Schlüssel in Großbuchstaben verwenden Sie müssen nur den Typ angeben, nicht den Wert Um zum Beispiel “use_chat” zu verwenden, müssen Sie deklarieren:
declare const LOC_USE_CHAT: stringDas Skript build-client.js liest die client/@types/global.d.ts, sucht nach solchen Konstanten und lädt deren Werte aus den Sprachdateien.
Jetzt können Sie einfach peertubeHelpers.translate(LOC_USE_CHAT) in Ihrem Code aufrufen.
Übersetzungen im Backend-Code verwenden Theoretisch sind die einzigen Teile des Backend-Codes, für die eine Lokalisierung erforderlich ist, die Deklaration der Einstellungen und standardisierte Daten (ActivityPub, RSS, …). Hier müssen wir englische Zeichenketten aus dem Übersetzungsschlüssel holen.
Hinweis: Sie sollten nie eine weitere Sprachübersetzung vom Backend-Code benötigen. Die Lokalisierung muss im Frontend erfolgen.
Es gibt ein lib/loc.ts Modul, das eine loc() Funktion bereitstellt. Übergeben Sie ihr einfach den Schlüssel, um die englische Zeichenkette zu erhalten: loc('diagnostic')'.
Übersätzungs-Dokumentation Die Übersetzung der Dokumentation erfolgt mit Hilfe der entsprechenden Weblate-Komponente.
Es gibt einen speziellen “Hugo Shortcode”, den Sie verwenden können, um eine Anwendungszeichenkette anzuzeigen. Wenn Sie beispielsweise den Namen der Schaltfläche “open_chat_new_window” anzeigen möchten, können Sie dies in der Markdown-Datei der Dokumentation verwenden:
{{% livechat_label open_chat_new_window %}}Sie können auch verhindern, dass eine ganze Seite übersetzt wird, indem Sie livechatnotranslation: true in der Yaml Font Matter Sektion hinzufügen:
--- title: "Drittanbieter" description: "Anzeige des Livechats mit Software von Drittanbietern." weight: 20 chapter: false livechatnotranslation: true ---Übersetze niemals eine Zeichenkette in der Datei livechat.en.pot, sie würde ignoriert werden. Bearbeiten Sie stattdessen direkt die Markdown-Dateien.
Wenn eine Zeichenfolge einen Link enthält, können Sie ihn in den richtigen Link in der übersetzten Sprache ändern. Zum Beispiel können Sie für einen Link zu dieser Dokumentation den Sprachcode in die URL einfügen.
Einige Zeichenfolgen sind Code-Blöcke. Übersetzen Sie den Code nicht. Aber Sie können Kommentare oder Parameter übersetzen, wenn sie relevant sind.
Wenn Sie sich nicht sicher sind, übersetzen Sie einfach nicht und fragen Sie, was zu tun ist.
Das Tool, mit dem ich die Übersetzungen für die Dokumentation bearbeite, verhält sich manchmal seltsam. Wenn ich Sätze hinzufüge, die anderen bestehenden Sätzen ähneln, kopiert es manchmal bestehende Übersetzungen. Wenn Sie also Übersetzungen als “zu prüfen” markiert haben, stellen Sie bitte sicher, dass es vor der Validierung keine Zeichenfolge kopiert, die nichts mit der englischen zu tun hat.
Wenn Sie sich nun über den Kontext einer Zeichenkette sicher sind, können Sie die Position der Zeichenkette im rechten Fensterbereich von weblate überprüfen und die entsprechende Dokumentationsseite öffnen. Für eine Zeichenfolge in der Datei support/documentation/content/de/documentation/user/streamers.md lautet die entsprechende URL beispielsweise https://livingston.frama.io/peertube-plugin-livechat/de/documentation/user/streamers/.
Allgemeine Empfehlungen Bitte formulieren Sie umfassend und beachten Sie den Verhaltenskodex.`,description:"Das Plugin übersetzen",tags:[],title:"Übersätzen",uri:"/peertube-plugin-livechat/de/contributing/translate/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer > Chatbot",content:`Sie können einige Wörter konfigurieren, die vom Chatbot automatisch moderiert werden (Nachrichten, die solche Wörter enthalten, werden sofort gelöscht). Sie können auch einen optionalen Grund hinzufügen, der an der Stelle der gelöschten Nachrichten angezeigt wird. Mehrere Beispiele finden Sie auf der Dokumentationsseite.
Sie können mehrere “Verbotene Wörter oder Ausdrücke”-Felder ausfüllen. Wenn ein Benutzer eine Nachricht sendet, die den konfigurierten Kriterien entspricht, wird die Nachricht automatisch gelöscht.
Verbotene Wörter oder Ausdrücke In diesem Feld können Sie mehrere Wörter, Wortgruppen oder “reguläre Ausdrücke” (regex) eingeben.
Ein Wort oder Ausdruck pro Zeile. Wenn Sie mehrere Wörter in eine Zeile schreiben, werden nur Nachrichten gefunden, die die gesamte Sequenz enthalten.
Jedes Mal, wenn ein Benutzer eine Nachricht sendet, werden diese Wörter getestet. Wenn die Nachricht eines dieser Wörter enthält, wird die Nachricht gelöscht.
Sie können dieses Feld zum Beispiel mit einer Liste von Schimpfwörtern füllen.
Einige Beispiele finden Sie in den Vorschlägen für verbotene Wörter.
Wenn Sie einige nützliche Wörterlisten haben, können Sie die gerne zu dieser Vorschlagsseite beitragen. Sie befinden sich im Ordner support/forbidden_words des Livechat-Quellcodes. Siehe die Beitragen Seite für weitere Informationen.
Tipp Bei diesen Wörtern wird die Groß- und Kleinschreibung nicht berücksichtigt.
Tipp Sie können eine kurze Moderationsverzögerung (z.B. 1 Sekunde) mit dem Moderations-Chatbot kombinieren, um Nachrichten mit Schimpfwörtern zu löschen, bevor ein Nicht-Moderator sie sieht.
Warnung Diese Funktion ist noch experimentell. Es könnte einige Probleme mit nicht-lateinischen Alphabeten geben. Sie können ein Problem öffnen, um Ihre Probleme zu melden.
Als reguläre Ausdrücke (regex) betrachten Wenn Sie diese Option aktivieren, wird jede Zeile des Feldes “Verbotene Wörter oder Ausdrücke” als regulärer Ausdruck betrachtet.
Auch Nachrichten von Moderatoren moderieren By default, moderator messages will not be affected by this feature. By checking this option, messages from moderators will also be deleted.
Grund Anzuzeigender Grund anstelle der gelöschen Nachricht
Kommentare Sie können hier einige Kommentare zu dieser Regel hinzufügen, um sich daran zu erinnern, wie und warum Sie sie erstellt haben. Diese Kommentare sind rein indikativ und haben keinen Einfluss auf das Verhalten des Chatbots.`,description:"Der Chatbot kann automatisch Nachrichten moderieren, die verbotene Wörter enthalten.",tags:[],title:"Verbotene Wörter",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/bot/forbidden_words/index.html"},{breadcrumb:"Peertube livechat > Dokumentation",content:` EinstellungenPlugin Peertube Livechat Einstellungen
Externe AuthentifizierungPlugin Peertube Livechat Einstellungen - Externe Authentifizierung
Prosody mod_firewallErweiterte Firewall-Regeln für den Prosody-Server
Fortgeschrittene NutzungEinige erweiterte Funktionen
XMPP-ClientsVerbindungen über XMPP-Clients zulassen
Matterbridge benutzenMatterbridge als Brücke zu anderen Chats nutzen`,description:"Plugin Peertube Livechat Administation",tags:[],title:"Admin Dokumentation",uri:"/peertube-plugin-livechat/de/documentation/admin/index.html"},{breadcrumb:"Peertube livechat > Beitragen",content:"Sie müssen keine Programmierkenntnisse haben, um zu diesem Plugin beizutragen! Andere Beiträge sind auch sehr wertvoll, darunter: Sie können die Software testen und Fehler melden, Sie können Feedback geben, Funktionen die Sie interessieren, Benutzeroberfläche, Design, …",description:"Geben Sie Ihr Feedback",tags:[],title:"Geben Sie Ihr Feedback",uri:"/peertube-plugin-livechat/de/contributing/feedback/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Admin Dokumentation",content:` Info Diese Funktion wird mit dem Livechatplugin Version 11.0.0 verfügbar sein.
Sie können mod_firewall auf Ihrem Prosody-Server aktivieren.
Auf diese Weise können Peertube-Administratoren erweiterte Firewall-Regeln definieren.
Warnung Diese Regeln könnten verwendet werden, um beliebigen Code auf dem Server auszuführen. Wenn Sie ein Hosting-Anbieter sind und Peertube-Administratoren nicht erlauben wollen, solche Regeln zu schreiben, können Sie die Online-Bearbeitung deaktivieren, indem Sie eine disable_mod_firewall_editing-Datei im Plugin-Verzeichnis erstellen (plugins/data/peertube-plugin-livechat/disable_mod_firewall_editing). Dies ist ein Opt-Out, da Peertube-Administratoren bereits beliebigen Code ausführen können, indem sie ein beliebiges Plugin installieren. Sie können mod_firewall immer noch verwenden, indem Sie Dateien direkt auf dem Server bearbeiten.
Regeln bearbeiten Zuerst müssen Sie die Funktion in den Plugin-Einstellungen aktivieren.
Direkt unter den Einstellungen finden Sie die Schaltfläche “Configure mod_firewall”. Mit dieser Schaltfläche wird eine Konfigurationsseite geöffnet.
Hier können Sie mehrere Konfigurationsdateien hinzufügen.
Sie können jede Datei aktivieren/deaktivieren.
Die Dateien werden in alphabetischer Reihenfolge geladen. Sie können eine Zahl als Präfix verwenden, um die Reihenfolge einfach zu wählen.
Info Sie können diese Firewall-Regeln auch direkt auf dem Server im Verzeichnis plugins/data/peertube-plugin-livechat/prosody/mod_firewall_config/ bearbeiten. Die Dateinamen dürfen nur alphanumerische Zeichen, Unterstriche und Bindestriche enthalten. Die Erweiterung muss .pfw sein, oder .pfw.disabled, wenn Sie eine Datei deaktivieren wollen. Vergewissern Sie sich, dass der Peertube-Systembenutzer Schreibrechte für diese Dateien hat, sonst schlägt die Bearbeitung über die Webschnittstelle fehl. Nachdem Sie diese Dateien bearbeitet haben, müssen Sie prosody neu laden. Dies kann durch Speichern der Plugin-Einstellungen, durch Speichern der mod_firewall-Konfiguration im Web-Interface oder durch einen Neustart von Peertube geschehen.
Wenn Sie die Konfiguration speichern, wird der Server sie automatisch neu laden, und Ihre Regeln werden sofort angewendet. Sie können im Prosody-Fehlerprotokoll überprüfen, ob ein Parsing-Fehler aufgetreten ist. Dazu können Sie die Datei plugins/data/peertube-plugin-livechat/prosody/prosody.err lesen oder das Diagnose-Tool verwenden, das die letzten Prosody-Fehler anzeigt.
Beispiele Zögern Sie nicht, Ihre Regeln zu teilen. Um dies zu tun, können Sie zum Beispiel diese Seite bearbeiten.`,description:"Erweiterte Firewall-Regeln für den Prosody-Server",tags:[],title:"Prosody mod_firewall",uri:"/peertube-plugin-livechat/de/documentation/admin/mod_firewall/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer > Chatbot",content:`Sie können mehrere voraufgezeichnete Nachrichten (Timer) konfigurieren, die in regelmäßigen Abständen gesendet werden. Diese Nachrichten werden vom Chatbot alle X Minuten gesendet. Sie können beispielsweise festlegen, dass der Bot alle 5 Minuten eine Sponsor-Information sendet.
Tipp Wenn sich kein Benutzer im Chatraum befindet, sendet der Chatbot keine Nachricht.
Timer Sie können mehrere voraufgezeichnete Nachrichten (Timer) konfigurieren, die in regelmäßigen Abständen gesendet werden. Diese Nachrichten werden vom Chatbot alle X Minuten gesendet. Sie können beispielsweise festlegen, dass der Bot alle 5 Minuten eine Sponsor-Information sendet.
Eine Nachricht pro Zeile. Wenn mehrere Nachrichten vorhanden sind, wird alle X Minuten eine zufällig ausgewählt.
Alle X Minuten senden Der Chatbot wird die Nachricht alle X Minuten veröffentlichen.`,description:"Der Chatbot kann in regelmäßigen Abständen einige Nachrichten senden.",tags:[],title:"Timer",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/bot/quotes/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Admin Dokumentation > Fortgeschrittene Nutzung",content:`Dieses Chatmodul basiert auf dem XMPP-Protokoll, das auch als Jabber bekannt ist. Es ist daher möglich, sich mit Hilfe von XMPP-Client-Software mit den Chats zu verbinden. Dies kann zum Beispiel nützlich sein, um Moderationsvorgänge zu erleichtern.
Die Benutzerdokumentation zu diesen Funktionen finden Sie auf der Seite Benutzerdokumentation.
Info Die Aktivierung dieser Funktionen erfordert Konfigurationsänderungen auf dem Server und in den DNS-Einträgen. Es ist nicht möglich, dies nur über die Peertube-Schnittstelle zu konfigurieren, und es erfordert einige grundlegende Systemadministrationskenntnisse.
Melden Sie sich bei Ihrem Peertube-Konto an Warnung Diese Funktion ist noch nicht verfügbar und wird in einer zukünftigen Version des Plugins enthalten sein.
Verbindung über ein externes XMPP-Konto Um diese Funktion zu aktivieren, müssen Sie Ihren Server und Ihre DNS-Einträge so einrichten, dass XMPP-Clients den Prosody-Server finden und erreichen können, den dieses Plugin intern verwendet.
Plugin Einstellungen Beginne mit den Einstellungen des Livechat-Plugins deiner Instanz und aktiviere die Einstellung “Verbindung zum Raum über externe XMPP-Konten aktivieren”. Wenn Sie diese Einstellung aktivieren, erscheinen unterhalb neue Einstellungen.
Zunächst einmal das Feld “Prosody-Server-zu-Server-Port”. Dieses Feld ist standardmäßig auf 5269 voreingestellt, dem Standardport für diesen Dienst. Sie können jedoch einen anderen Port wählen, wenn dieser bereits auf Ihrem Server verwendet wird.
Anschließend können Sie im Feld “Netzwerkschnittstellen zwischen Server und Server” angeben, welche Netzwerkschnittstellen der Server abhören soll. Der Standardwert “*, ::” bedeutet, dass alle IP-Adressen abgehört werden sollen. Sie können diese Werte ändern, wenn Sie nur bestimmte IP-Adressen abhören möchten. Die Syntax wird neben der Einstellung erklärt.
Die Einstellung “Zertifikatsordner” können Sie leer lassen. In diesem Fall wird das Plugin automatisch selbstsignierte Zertifikate erzeugen. Einige XMPP-Server verweigern je nach ihrer Konfiguration möglicherweise die Verbindung. In diesem Fall können Sie hier einen Pfad auf dem Server angeben, in dem Sie die vom Modul zu verwendenden Zertifikate ablegen müssen. Es liegt an Ihnen, diese zu erzeugen und zu erneuern. Für weitere Informationen siehe unten.
Firewall Sie müssen den konfigurierten Port (standardmäßig 5269) in Ihrer Firewall öffnen.
Wenn Sie Docker für Ihren Peertube verwenden, müssen Sie die Datei docker-compose.yml ändern, um Port 5269 des Peertube-Containers zu öffnen, damit sich die Außenwelt mit ihm verbinden kann.
DNS Sie müssen DNS-Einträge hinzufügen, die es entfernten Servern ermöglicht, die Komponenten “room.your_instance.tld” und “external.your_instance.tld” zu finden.
Am einfachsten ist es, SRV-Einträge für die Subdomänen “room” und “external” hinzuzufügen:
record name: _xmpp-server._tcp.room.ihre_instanz.tld. (ersetzen Sie «ihre_instanz.tld» mit ihrer Instanz Uri)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
Port: 5269 (anpassen, wenn Sie den Standardport geändert haben)
Ziel: ihre_instanz.tld. (durch Ihre Instanz-URI ersetzen)
record name: _xmpp-server._tcp.external.ihre_instanz.tld. (ersetzen Sie «ihre_instanz.tld» mit ihrer Instanz Uri)
TTL: 3600
class: IN
SRV: 0
priority: 0
weight: 5
Port: 5269 (anpassen, wenn Sie den Standardport geändert haben)
Ziel: ihre_instanz.tld. (durch Ihre Instanz-URI ersetzen)
Achten Sie darauf, dass der Punkt nach “ihre_instanz.tld” erhalten bleibt.
Wenn Sie den Befehl dig verwenden, um Ihren Datensätze zu überprüfen, sollten Sie ein ähnliches Ergebnis wie dieses erhalten:
$ dig +short _xmpp-server._tcp.room.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr. $ dig +short _xmpp-server._tcp.external.videos.john-livingston.fr. SRV 0 5 5269 videos.john-livingston.fr.Wenn Sie nicht den Standardport 5269 verwenden, müssen Sie auch einen SRV-Eintrag für _xmpp-server._tcp.ihre_instanz.tld. hinzufügen (wie oben, nur ohne das Präfix room.). Natürlich können Sie diesen Eintrag auch hinzufügen, wenn Sie den Standard-Port verwenden. Das wird auch funktionieren.
Verwendung vertrauenswürdiger Zertifikate Die selbstsignierten Zertifikate, die dieses Plugin standardmäßig verwendet, können von einigen XMPP-Servern aus Sicherheitsgründen abgelehnt werden.
Es ist möglich, von einer Zertifizierungsstelle validierte Zertifikate zu verwenden. Dies erfordert jedoch fortgeschrittene Kenntnisse in der Systemverwaltung. Aufgrund der Vielzahl möglicher Anwendungsfälle ist es in der Tat unmöglich, hier alle Situationen zu dokumentieren. Diese Dokumentation wird daher nur das zu erreichende Ziel erläutern und ein Beispiel geben, das nur für eine “einfache” Situation geeignet ist (manuelle Installation von Peertube unter Verwendung von letsencrypt). Wenn Sie sich in einer anderen Situation befinden (Docker-Installation, von einer anderen Autorität signierte Zertifikate, etc…), müssen Sie diesen Ansatz selbst anpassen.
Grundlegendes Prinzip Es liegt an Ihnen, gültige Zertifikate für die Domänen ihre_instanz.tld und room.ihre_instanz.tld zu erzeugen. Sie können jede von Prosody unterstützte Methode verwenden.
Sie müssen diese Zertifikate dann in einem Ordner ablegen, auf den der peertube-Benutzer zugreifen kann, und diesen Ordner in der Plugin Einstellung “Certificate folder” angeben.
Tipp Wenn Sie das Programm ProsodyCtl verwenden möchten, um Zertifikate zu importieren, ist es (sobald Peertube gestartet ist) mit folgendem Befehl verfügbar (passen Sie den Pfad zu Ihrem Peertube-Datenordner an und ersetzen Sie “xxx” durch die Argumente, die Sie an prosodyctl übergeben wollen): sudo -u peertube /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua xxx
Das Plugin prüft einmal am Tag, ob Dateien in diesem Ordner geändert wurden, und lädt Prosody gegebenenfalls neu.
Methode für den einfachen Fall Wir gehen hier davon aus, dass Ihre Peertube Installation “klassisch” ist (keine Verwendung von Docker) und dass die Zertifikate von letsencrypt mit dem Werkzeug certbot erzeugt werden.
Als erstes müssen wir ein Zertifikat für die Subdomain room.ihre_instanz.tld erstellen: dies ist die Uri der MUC (XMPP chat rooms) Komponente. Auch wenn die Verbindungen über ihre_instanz.tld hergestellt werden, benötigen wir ein gültiges Zertifikat für diese Subdomain.
Beginnen Sie also damit, einen DNS-Eintrag für room.ihre_instanz.tld einzurichten, der auf Ihren Server verweist. Sie können einen CNAME-Eintrag verwenden (oder einen A-Eintrag und einen AAAA-Eintrag).
Als Nächstes verwenden wir nginx (bereits für Ihr Peertube installiert), um das certbot-Zertifikat zu erzeugen. Wir werden eine neue Website erstellen. In der Datei /etc/nginx/site-available/room.peertube fügen Sie hinzu:
server { listen 80; listen [::]:80; server_name room.ihre_instanz.tld; location /.well-known/acme-challenge/ { default_type "text/plain"; root /var/www/certbot; } location / { return 301 https://ihre_instanz.tld; } }Aktivieren Sie dann die Website:
ln -s /etc/nginx/sites-available/room.peertube /etc/nginx/sites-enabled/ systemc reload nginxDann bereiten wir den Ordner vor, in den wir später die Zertifikate importieren werden. Wir gehen hier davon aus, dass Sie das Plugin bereits aktiv haben. Wir erstellen den folgenden Ordner (falls er noch nicht existiert), mit dem Benutzer peertube, um sicherzustellen, dass es keine Probleme mit den Berechtigungen gibt:
sudo -u peertube mkdir /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/certsNun müssen Sie diesen Ordner in den Plugin-Einstellungen für den Parameter “Zertifikatsordner” konfigurieren. Es ist wichtig, dies jetzt zu tun, da sonst das Skript für den Zertifikatsimport die Zertifikate in den falschen Ordner legt.
Wir werden certbot so konfigurieren, dass die generierten Zertifikate in den Prosody Ordner importiert werden. Wir können das Programm ProsodyCtl verwenden, das im Plugin enthalten ist.
Hinweis: Damit es verfügbar ist, muss das Plugin mindestens einmal gestartet worden sein.
Wir werden eine Datei /etc/letsencrypt/renewal-hooks/deploy/prosody.sh erstellen, die Folgendes enthält:
#!/bin/sh /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun prosodyctl \\ --root \\ --config /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ cert import \\ room.your_instance.tld your_instance.tld /etc/letsencrypt/liveDann bitten wir um die Erstellung des Zertifikats:
certbot -d room.videos.john-livingston.frWenn certbot Ihnen mehrere Methoden zur Erstellung des Zertifikats anbietet, wählen Sie “nginx”.
Normalerweise sollten Sie die Zertifikate nun in dem konfigurierten Ordner finden.
Hinweis: Wenn Sie dies zum ersten Mal tun, müssen Sie Prosody neu laden. Der einfachste Weg, dies zu tun, ist, Peertube neu zu starten.
Methode für das Docker-Verfahren Diese Methode funktioniert mit dem offiziell unterstützten Docker Guide von PeerTube.
Stellen Sie zunächst sicher, dass Sie einen DNS-Eintrag für “room.ihre_instanz.tld” erstellen, der auf Ihren Server verweist. Sie können einen CNAME-Eintrag (oder einen A-Eintrag und einen AAAA-Eintrag) verwenden. Dies ist erforderlich, damit Let’s Encrypt die Domäne für die Zertifikatserstellung validieren kann.
Geben Sie das Verzeichnis an, in dem sich Ihre Datei docker-compose.yml befindet.
Öffnen Sie eine Befehlszeile im certbot Container:
docker exec -it certbot /bin/shStarten Sie certbot:
certbotEs wird eine Reihe von Eingabeaufforderungen angezeigt. Geben Sie 2 für den Authentifizierungstyp ein:
How would you like to authenticate with the ACME CA? Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2Geben Sie den Domänennamen “room.ihre_instanz.tld” ein:
Please enter the domain name(s) you would like on your certificate (comma and/or space separated) (Enter 'c' to cancel): room.your_instance.tldGeben Sie das Verzeichnis an, in dem der PeerTube-Webserver Anfragen für Let’s Encrypt bedient, /var/www/certbot:
Input the webroot for <room.your_instance.tld>: (Enter 'c' to cancel): /var/www/certbotSie sollten eine Ausgabe wie die folgende sehen:
Successfully received certificate. Certificate is saved at: /etc/letsencrypt/live/room.your_instance.tld/fullchain.pem Key is saved at: /etc/letsencrypt/live/room.your_instance.tld/privkey.pemFühren Sie den folgenden Befehl innerhalb des certbot-Containers aus, um der peertube-Gruppe Lesezugriff auf die neuen Zertifikate und privaten Schlüssel zu geben. Hinweis: Dadurch werden die Dateien auch für die Gruppe mit der ID 999 auf dem Host-System lesbar. Überprüfen Sie die Gruppen auf Ihrem System, um dieses Risiko einzuschätzen, bevor Sie diesen Befehl ausführen.
chown -R root:999 /etc/letsencrypt/live; \\ chmod 750 /etc/letsencrypt/live; \\ chown -R root:999 /etc/letsencrypt/archive; \\ chmod 750 /etc/letsencrypt/archive; \\ find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} \\;Verlassen Sie den certbot-Container:
exitÄndern Sie Ihre Datei docker-compose.yml, indem Sie die Zeile entrypoint unter dem Dienst certbot wie folgt ändern. Dies ist das Gleiche wie oben, soll aber automatisch nach jeder Zertifikatserneuerung ausgeführt werden.
entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot; chown -R root:999 /etc/letsencrypt/live; chmod 750 /etc/letsencrypt/live; chown -R root:999 /etc/letsencrypt/archive; chmod 750 /etc/letsencrypt/archive; find /etc/letsencrypt/ -name 'privkey*' -exec chmod 0640 {} +; sleep 12h & wait $\${!}; done;"Fahren Sie mit der Änderung der Datei docker-compose.yml fort und fügen Sie das certbot-Zertifikatsvolumen in den Peertube-Container ein. Es sollte in etwa so aussehen:
volumes: - ./docker-volume/certbot/conf:/etc/letsencryptDen Dienst neustarten:
docker-compose down; docker-comopse up -dSetzen Sie in den Livechat-Plugin-Einstellungen in den PeerTube-Administrationseinstellungen den Zertifikatsordner auf den folgenden Wert:
/etc/letsencrypt/liveSpeichern Sie die Plugin Einstellungen und überprüfen Sie, ob Prosody die Zertifikate erkennen kann:
docker-compose exec -u peertube \\ peertube \\ /data/plugins/data/peertube-plugin-livechat/prosodyAppImage/squashfs-root/AppRun \\ prosodyctl \\ --config /data/plugins/data/peertube-plugin-livechat/prosody/prosody.cfg.lua \\ check certsFehlerbehebung Wenn Sie es nicht hinbekommen, können Sie das Diagnosetool verwenden (es gibt eine Schaltfläche oben auf der Seite mit den Plugin-Einstellungen) und sich den Abschnitt «Prosody check» genau ansehen.`,description:"Verbindungen über XMPP-Clients zulassen",tags:[],title:"XMPP-Clients",uri:"/peertube-plugin-livechat/de/documentation/admin/advanced/xmpp_clients/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer > Chatbot",content:`Sie können den Chatbot so konfigurieren, dass er auf Befehle reagiert. Ein Befehl ist eine Nachricht, die mit einem “!” beginnt, wie zum Beispiel “!help” den Befehl “help” aufruft.
Sie können mehrere Befehle einrichten.
Befehl Den Befehl, ohne das beginnende “!” eintragen. Zum Beispiel “help”, “sponsor”, …
Nachricht Die zu sendende Nachricht.`,description:"Der Chatbot kann auf verschiedene Befehle reagieren.",tags:[],title:"Befehle",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/bot/commands/index.html"},{breadcrumb:"Peertube livechat > Beitragen",content:`Sprechen Sie immer über die Funktionen, die Sie entwickeln wollen, indem Sie das Issue, das Ihr Problem behandelt, erstellen/finden und kommentieren bevor Sie mit der Arbeit daran beginnen und informieren Sie die Gemeinschaft darüber, dass Sie mit der Programmierung beginnen, indem Sie das Thema für sich beanspruchen.
Bitte benutzen Sie den main Zweig.
Anmerkung Bis März 2023 wurden die Beiträge auf dem develop Zweig erstellt. Dieses Verfahren ist nun veraltet.
Voraussetzung für die Erstellung dieses Plugins Es wird dringend empfohlen, mit den folgenden Konzepten vertraut zu sein:
Git NodeJS NPM Typescript Um das Plugin zu erstellen, benötigen Sie die folgenden Pakete:
git npm (>=8.x) nodejs (>=14.x) build-essential coreutils wget reuse Bitte beachten Sie, dass dieses Plugin ein AppImage für den Prosody XMPP Server benötigt. Dieses AppImage wird vom Prosody AppImage Seitenprojekt bereitgestellt. Das Skript build-prosody.sh lädt Binärdateien herunter, die an dieses entfernte Repository angehängt sind, und überprüft, ob ihre sha256-Hashsumme korrekt ist.
Entwickeln Klonen Sie das Repository, bauen Sie das Plugin, und erstellen Sie Ihren Feature-Zweig:
# Kopieren Sie das Repository. Vergessen Sie nicht die Option --recursive, um Submodule mit zu kopieren. git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git --recursive cd peertube-plugin-livechat # Installieren Sie die NPM-Abhängigkeiten und erstellen Sie das Modul zum ersten Mal: npm install # Erstellen des Plugins nach einer Änderung: npm run build # Wenn Sie einen Fork aus dem Repository haben, fügen Sie ihn als Remote hinzu (Beispiel): git remote add me git@github.com:MY_GITHUB_ACCOUNT/peertube-plugin-livechat.git # Erstellen Sie einen lokalen Zweig für Ihre Entwicklungen und testen Sie ihn aus (Beispiel): git checkout my_development # Hinweis: Wenn ein Github Problem damit verbunden ist, verwenden Sie fix_1234 als Zweigname (wobei 1234 die Nummer des Problems ist). # Um Ihre Änderungen vorzuschlagen, schieben Sie Ihren Zweig in Ihr Repository (Beispiel): git push --set-upstream me my_development # Gehen Sie dann mit Ihrem Webbrowser zu Ihrem Github-Repository, um den Pull Request vorzuschlagen (siehe zusätzliche Anweisungen unten)Sobald Sie bereit sind, Ihren Code zu zeigen und um Feedback zu bitten, reichen Sie einen Entwurf für einen Pull Request ein. Sobald Sie bereit für eine Codeüberprüfung vor der Zusammenführung sind, reichen Sie einen Pull Request ein. In jedem Fall sollten Sie Ihren PR mit dem Problem, die er behebt, verlinken, indem Sie die GitHub-Syntax verwenden: “fixes #issue_number”.
Der Front-End-Code befindet sich im Ordner client, der Back-End-Code im Ordner server. Es gibt einige gemeinsam genutzte Codes im shared Ordner.
Für allgemeine Anweisungen (Entwicklung von Plugins, Erstellung, Installation, …), lesen Sie bitte die Peertube Dokumentation.
Sie können das Plugin mit zusätzlichen Debug-Funktionen bauen, indem Sie es einfach benutzen:
NODE_ENV=dev npm run buildDieses Plugin ist REUSE konform: Es verwendet SPDX-Header, um die Lizenzinformationen seines Quellcodes zu identifizieren. Weitere Informationen finden Sie auf der REUSE Website. Sie können das reuse Kommandozeilenwerkzeug verwenden, um die Header zu aktualisieren. Der Befehl npm run lint verwendet den Befehl reuse, um die Einhaltung zu überprüfen. Vergessen Sie nicht, Ihre Copyright-Informationen in die SPDX-Header einzufügen, wenn Sie Code ändern.
ESBuild vs Typescript Dieses Plugin verwendet ESBuild für die Generierung von Frontend-Code, wie das offizielle peertube-plugin-quickstart Plugin. ESBuild kann mit Typescript umgehen, prüft aber keine Typen (siehe ESBuild-Dokumentation). Deshalb kompilieren wir Typescript zuerst mit der Option -noEmit, nur um die Typen zu überprüfen (check:client:ts in der package.json Datei). Dann, wenn alles in Ordnung ist, führen wir ESBuild aus, um das kompilierte Javascript zu erzeugen.
Debug Modus Es gibt einen Debug Modus für dieses Plugin, der einige Verzögerungen verkürzt. Zum Beispiel werden einige Protokolldateien alle zwei Minuten erneuert, anstatt einmal pro Tag. Dies ermöglicht es, bestimmte Aktionen, für die man normalerweise Stunden oder Tage warten müsste, leichter zu testen.
Um diesen Modus zu aktivieren, müssen Sie lediglich die Datei /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/debug_mode erstellen (ersetzen Sie /var/www/peertube/storage/ durch den richtigen Pfad Ihrer Installation).
Das einfache Vorhandensein dieser Datei reicht aus, um den Debug Modus zu aktivieren. Um sicherzustellen, dass sie berücksichtigt wird, können Sie Ihre Peertube Instanz neu starten.
Diese Datei kann einige JSON enthalten, um erweiterte Optionen zu ermöglichen. Eine Liste der vorhandenen Parameter finden Sie in server/lib/debug.ts. Starten Sie Peertube nach jeder Änderung des Inhalts neu.
Warnung Aktivieren Sie diesen Modus nicht auf einem Produktionsserver und auch nicht auf einem öffentlichen Server. Dies könnte Sicherheitsprobleme verursachen.
Prosody neustarten Wenn der Debug Modus aktiviert ist, können Sie Prosody mit diesem API-Aufruf neu starten: http://your_instance.tld/plugins/livechat/router/api/restart_prosody. Für diesen Aufruf ist keine Authentifizierung erforderlich. Er kann von einer Befehlszeile aus erfolgen, zum Beispiel mit curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody.
Prosody Debugger Es ist möglich, das Prosody AppImage mit Hilfe von MobDebug mit einem externen Debugger zu verbinden.
Dazu müssen Sie MobDebug in einem Ordner einrichten, auf den der Benutzer peertube zugreifen kann. Dann fügen Sie dies in der Datei debub_mode hinzu:
{ "debug_prosody": { "debugger_path": "/der_pfad_zu_mobdebug/src", "host": "localhost", "port": "8172" } }host und port sind optional. debugger_path muss auf den Ordner zeigen, in dem sich die MobDebug .lua Datei befindet.
Peertube neustarten.
Starten Sie Ihren Debugger-Server.
Damit Prosody eine Verbindung mit dem Debugger herstellen kann, rufen Sie die API http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true auf. Dieser Aufruf erfordert keine Authentifizierung. Er kann von einer Kommandozeile aus erfolgen, zum Beispiel mit curl http://your_instance.tld/plugins/livechat/router/api/restart_prosody?debugger=true. Sie können sogar Ihren Debug Server so konfigurieren, dass er diese Anfrage automatisch startet.
Prosody startet dann neu und verbindet sich mit dem Debugger.
Schnelle Entwicklungsumgebung mit Docker Es gibt eine Anleitung in französischer Sprache auf dem le Peertube forum das erklärt, wie man schnell eine Entwicklungsumgebung mit Docker erstellt.
Es wurde ein Repo daraus gemacht, siehe pt-plugin-dev.
Hinweis: Aus einem unbekannten Grund kann Prosody die DNS-Adresse von Containern nicht auflösen, wenn die lua-unbound-Bibliothek verwendet wird. Es gibt einen unsaubere Lösung dafür im Plugin: Erstellen Sie einfach eine /data/plugins/data/peertube-plugin-livechat/no_lua_unbound Datei in deinen docker-volumes, dann starten Sie die Container neu.
Schnelles Neuerstellen und Installieren des Plugins Wenn Sie Änderungen vornehmen, müssen Sie nicht immer das gesamte Projekt neu erstellen und das Plugin in Ihrer Entwicklungsumgebung neu installieren. Sie können nur den geänderten Teil bauen (zum Beispiel, wenn Sie nur die Client-Dateien geändert haben: npm run build:client). Prüfen Sie die package.json Dateien auf verfügbare Build-Skripte.
Wenn das Plugin bereits auf Ihrer Entwicklungsinstanz installiert ist und Sie keine Abhängigkeiten geändert haben, können Sie Ihre Arbeit schnell installieren, indem Sie diese Schritte ausführen:
die notwendigen Teile des Plugins (Client, Stile, …) neu zu erstellen, den Inhalt von data/plugins/node_modules/peertube-plugin-livechat/dist/ Ihrer Dev-Instanz mit dem Inhalt des dist-Ordners des Plugins überschreiben, rekursiv die Besitzerrechte der plugins/node_modules/peertube-plugin-livechat/dist/ Dateien auf Ihren peertube Benutzer ändern, Ihre Instanz neustarten. Leistungstests Das livechat-perf-test Repository enthält einige Werkzeuge zur Durchführung von Leistungstests. Sie können verwendet werden, um Code-Verbesserungen zu bewerten oder Engpässe zu finden.`,description:"Entwickeln",tags:[],title:"Entwickeln",uri:"/peertube-plugin-livechat/de/contributing/develop/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Admin Dokumentation",content:` XMPP-ClientsVerbindungen über XMPP-Clients zulassen
Matterbridge benutzenMatterbridge als Brücke zu anderen Chats nutzen`,description:"Einige erweiterte Funktionen",tags:[],title:"Fortgeschrittene Nutzung",uri:"/peertube-plugin-livechat/de/documentation/admin/advanced/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation",content:`OBS ist eine beliebte kostenlose and quellcodeoffene Streaming Software, mit erweiterten Funktionen für Ihre Live-Streams. Auf dieser Seite finden Sie einige Ratschläge, wie Sie Ihre Live-Chats mit OBS verwalten können.
OBS Overlay Sie können den Chat ganz einfach in Ihren Videostream integrieren.
Sie können die Funktion “Chat Link teilen” verwenden, um eine URL zu Ihrem Chat zu generieren. Diese Schaltfläche sollte sich in der Nähe des Chats befinden, wenn Sie der Videoeigentümer sind (es sei denn, sie wurde von Ihren Serveradministratoren deaktiviert).
Aktivieren Sie das Kontrollkästchen “Nur-Lesen” im Fenster.
Verwenden Sie dann diesen Link als “Webbrowser-Quelle” in OBS.
Sie können die “Transpatenter Hintergrund (zum Beispiel für die Streamintegration mit OBS)” Option verwenden, um einen transparenten Hintergrund in OBS zu erhalten. Wenn Sie die Hintergrundtransparenz anpassen möchten, können Sie dieses CSS in den Einstellungen Ihrer OBS-Browserquelle hinzufügen:
:root { --livechat-transparent: rgba(255 255 255 / 90%) !important; } Im vorherigen CSS-Schnipsel können Sie natürlich die Farbe oder die Transparenz ändern, indem Sie die Farbwerte anpassen.
Hinweis: Sie können vollständig die Chat-Farben anpassen. Dies ist noch nicht dokumentiert, aber Sie können dies versuchen: Aktivieren Sie im Fenster die Option “Aktuelle Themenfarben verwenden”, und versuchen Sie dann, die Farbwerte in der URL manuell zu ändern. Sie müssen gültige CSS-Farbwerte verwenden, und diese müssen in der URL korrekt kodiert sein.
OBS Dock Info Diese Funktion wird mit dem Livechatplugin Version 10.1.0 verfügbar sein.
Warnung Diese Funktion kann von den Administratoren der Instanz deaktiviert werden.
Sie können OBS “Benutzerdefinierte Browser-Docks” verwenden, um den Chat in OBS zu integrieren, während Sie streamen. Das Livechat-Plugin bietet eine Möglichkeit, ein langfristiges Token zu erstellen, das Sie automatisch identifiziert, um dem Chat beizutreten, so dass Sie Ihr Passwort nicht in OBS eingeben müssen.
Verwenden Sie dazu einfach die “Chat Link teilen” Funktion, und öffnen Sie die Registerkarte “Dock”. Von dort aus können Sie mit der Schaltfläche “+” ein neuen Token erstellen.
Kopieren Sie dann die URL und verwenden Sie das Menü “Docks / Benutzerdefinierte Browser-Docks” in Ihrem OBS, um ein Dock mit dieser URL hinzuzufügen.
Danach haben Sie ein neues Dock, das mit dem Chat und Ihrem Konto verbunden ist.
Tipp Die Token sind für die Teilnahme an jedem Chatraum gültig. Sie müssen nicht für jeden Ihrer Räume ein eigenes Token erstellen. Sie können auch den Spitznamen, der verwendet wird, anpassen, indem Sie den Parameter n in der URL ändern.
Geben Sie diese Links nicht weiter, da sie es anderen Personen ermöglichen würden, eine Verbindung mit Ihrem Konto herzustellen.
Wenn ein Token kompromittiert ist oder nicht mehr benötigt wird, können Sie ihn widerrufen.
Info Diese Token können für andere Zwecke verwendet werden, z. B. für die Verbindung mit XMPP-Bots oder -Clients zu Ihrem Konto. Diese Funktion ist noch nicht dokumentiert und wird offiziell nicht unterstützt. Verwenden Sie sie also mit Vorsicht.
Mischen mehrerer Chats in Ihrem Live-Stream Sie können die social_stream Browsererweiterung verwenden, um mehrere Chat-Quellen (von Peertube, Twitch, Youtube, Facebook, …) zu mischen und deren Inhalte in Ihren Live-Stream einzubinden. Die Kompatibilität mit diesem Plugin wurde in den letzten Versionen hinzugefügt.`,description:"Dokumentation zum Streamen des Chat-Inhalts mit OBS.",tags:[],title:"OBS",uri:"/peertube-plugin-livechat/de/documentation/user/obs/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Installationsanleitung",content:`WICHTIGER HINWEIS Seit Version v6.0.0 benötigt dieses Plugin keine andere Prosody-Installation.
Falls Sie dieses Plugin vor dieser Version benutzt haben und Sie Prosody manuell installiert haben, können Sie Prosody sicher deinstallieren.
Falls Sie ein eigenes Peertube Docker Paket genutzt haben, welches Prosody eingebettet hatte, können Sie zu den offiziellen Peertube Paketen zurück wechseln.`,description:"Wichtige Hinweise zum aktualisieren von älteren Versionen.",tags:[],title:"Aktualisieren von Versionen vor 6.0.0",uri:"/peertube-plugin-livechat/de/documentation/installation/upgrade_before_6.0.0/index.html"},{breadcrumb:"Peertube livechat > Beitragen",content:`Allgemeine Informationen Informieren Sie die Community immer vor der Arbeit (indem Sie ein neues Problem erstellen oder ein bestehendes kommentieren). Damit soll vermieden werden, dass zwei Personen an der gleichen Sache arbeiten, und Konflikte zu verhindern.
Bitte benutzen Sie den main-Zweig.
Der Quellcode der Dokumentation befindet sich im Ordner support/documentation/content.
Die Dokumentation wird mit Hugo erstellt. Sie müssen es auf Ihrem Computer installieren, wenn Sie eine Vorschau Ihrer Arbeit sehen wollen.
Die erforderliche Mindestversion für Hugo ist 0.121.0. Es wurde mit Version 0.132.2 getestet.
Das verwendete Thema ist hugo-theme-learn. Sie sollten dessen Dokumentation lesen, bevor Sie mit der Bearbeitung der Dokumentation beginnen.
Wenn eine neue Pluginversion veröffentlicht oder die Dokumentation aktualisiert wird, führen die Plugin Verwalter den main-Zweig mit dem documentation-Zweig zusammen. Dadurch werden Github- und Gitlab-Pipelines ausgelöst und die veröffentlichte Dokumentation aktualisiert.
Übersätzungen Die Hauptsprache ist Englisch (Code en).
Der Ordner support/documentation/content/en enthält nur englische Dokumentationsdateien.
Die Dokumentation wird mit Weblate übersetzt (siehe die Übersetzungsdokumentation). Um dies zu tun, verwenden wir das po4a tool, wie wir später auf dieser Seite sehen werden.
Eine neue Sprache hinzufügen Kopieren und ändern Sie den Abschnitt [Languages.fr] in der Datei support/documentation/config.toml.
Wenn die Übersetzungen nicht vollständig sind, macht das nichts, die fehlenden Zeichenfolgen werden auf Englisch angezeigt.
Vorschau Um eine Vorschau Ihrer Änderungen zu sehen, führen Sie einfach diesen Befehl aus:
hugo serve -s support/documentation/Öffnen Sie dann Ihren Browser und gehen Sie auf die Adresse http://localhost:1313/peertube-plugin-livechat/. Diese Seite wird bei jeder Änderung automatisch aktualisiert.
Aktualisierung von Lokalisierungsdateien und Erstellung von Dokumentationsübersetzungen Im Moment haben Sie nur die englische Version. Um die Dokumentationszeichenketten zu aktualisieren und Übersetzungen zu erstellen, müssen Sie das Skript doc-translate.sh ausführen.
Stellen Sie dazu sicher, dass Sie po4a (Version >= 0.69) auf Ihrem Computer installiert haben.
Warnung Einige Linux-Distributionen (wie Debian Bullseye zum Beispiel) haben eine zu alte Version von po4a. Bitte stellen Sie sicher, dass Sie eine kompatible Version installieren. Wenn Sie zum Beispiel Debian Bullseye benutzen, können Sie die Bookworm po4a.deb Datei von https://packages.debian.org herunterladen und manuell installieren.
Um Übersetzungen zu bearbeiten, machen Sie einfach dies:
npm run doc:translateSie können dann eine Vorschau des Ergebnisses mit hugo serve -s support/documentation/ und unter Verwendung der Sprachauswahl anzeigen.
Dokumentation schreiben Bearbeiten Sie einfach die englischen Dateien in support/documentation/content/en.
Führen Sie dann vor dem Commit immer npm run doc:translate aus, so dass Änderungen in den englischen Dateien in die Datei support/documentation/po/livechat.en.pot übertragen werden können.
Du kannst den Shortcode livechat_label verwenden, um Anwendungsstrings zu verwenden. Siehe hier: Dokumentation übersetzen.
Es ist möglich zu verhindern, dass eine Datei übersetzt wird, indem man livechatnotranslation: true in der Yaml Font Matter Sektion benutzt. Siehe hier: Dokumentation übersetzen.
Bitte verwenden Sie die Option livechatnotranslation für technische Dokumentation. Wir möchten nicht, dass die technische Dokumentation übersetzt wird, um Probleme aufgrund einer falschen Übersetzung zu vermeiden.
Um den Übersetzern die Arbeit zu erleichtern, sollten Sie zu lange Absätze vermeiden.
Im Moment ist es nicht möglich, Markdown-Tabellen zu verwenden: Die Übersetzungswerkzeuge würden sie nicht korrekt darstellen.
Warnung Möglicherweise gibt es Links zur Dokumentation an anderer Stelle im Web. Versuchen Sie nicht, die URLs der Dokumentationsseiten zu ändern. Oder setzen Sie zumindest Links zum neuen Ort auf die vorherige URL.
Was ist, wenn ich hugo und/oder po4a nicht verwenden kann? Bearbeiten Sie einfach die englischen Markdown-Dateien und geben Sie an, dass Sie keine Übersetzungen erstellen können, wenn Sie Ihren Pull Request stellen.
Veröffentlichung Die Veröffentlichung der Dokumentation erfolgt automatisch, sobald die Änderungen in den documentation Zweig eingefügt wurden.`,description:"Dokumentieren Sie das Plugin, oder übersetzen Sie die Dokumentation.",tags:[],title:"Dokumentation",uri:"/peertube-plugin-livechat/de/contributing/document/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Admin Dokumentation > Fortgeschrittene Nutzung",content:`Das Folgende basiert auf einem Tutorial zur Verwendung von Matterbridge mit dem Plugin: Matterbridge + Peertube
Anforderungen PeerTube plugin livechat Version 3.2.0 oder höher. Matterbridge Version 1.22.4 oder höher. Am einfachsten ist es, wenn die PeerTube-Instanz und Matterbridge auf demselben Server laufen.
Nur interne Verbindungen (EInfach) Sie müssen Aktivieren von Client-Server-Verbindungen in den Einstellungen des Livechat-Plugins aktivieren.
Dadurch können XMPP-Clients von localhost eine Verbindung zum Prosody XMPP-Server herstellen.
Möglicherweise müssen Sie eine Zeile in Ihre Datei /etc/hosts hinzufügen:
127.0.0.1 anon.example.org raum.example.org Ersetzen Sie example.org durch den Namen Ihrer tatsächlichen Instanzdomäne. Danach können Sie mit der Matterbridge-Konfiguration fortfahren.
Externe Verbindungen zulassen (Fortgeschritten) Standardmäßig lauscht der interne Prosody XMPP-Server nur auf localhost (127.0.0.1).
Dem Livechat Plugin Versionen >= 10.1.0 wurde eine neue Option Client zu Server Netzwerkschnittstellen hinzugefügt, um dies zu ändern.
Es ermöglicht das Hinzufügen einer Liste von IPs, die abgehört werden sollen, durch Kommata getrennt (Leerzeichen werden entfernt).
Sie können auch * verwenden, um an allen IPv4-Schnittstellen zu lauschen, und :: für alle IPv6-Schnittstellen. Dadurch wird der externe Zugriff auf die Schnittstelle zwischen Client und Server ermöglicht.
Dann müssen Sie den C2S-Port (standardmäßig 52822, aber überprüfen Sie die Plugin-Einstellungen, um den aktuellen Wert zu erhalten) in Ihrer Firewall öffnen, damit er vom Internet aus erreicht werden kann. Wenn Sie C2S-Verbindungen nur für Ihren Matterbridge-Dienst verwenden möchten, sollten Sie den Zugriff auf diesen Port auf die IP Ihres Matterbridge-Servers beschränken.
Sie müssen auch DNS-Einträge (A und AAAA) für anon.example.org und room.example.org hinzufügen (ersetzen Sie example.org durch Ihren tatsächlichen Domänennamen).
Falls Sie einen anderen Port als 5222 (XMPP-Standardport) verwenden, müssen Sie auch den xmpp-client SRV record auf den richtigen Port setzen.
Matterbridge konfigurieren In der Version 1.22.4 hat Matterbridge Unterstützung für anonyme XMPP-Verbindungen hinzugefügt, die für die Verbindung mit der eingebauten Prosody benötigt werden.
Setzen Sie also in die TOML-Konfigurationsdatei:
[xmpp.mypeertube] Anonymous=true Server="anon.example.org:52822" Muc="raum.example.org" Nick="Matterbridge" RemoteNickFormat="[{PROTOCOL}] <{NICK}> " NoTLS=true Ersetzen Sie example.org durch den Namen Ihrer tatsächlichen Instanzdomäne. Ersetzen Sie “52822” durch den tatsächlichen Port, wenn Sie ihn geändert haben. mypeertube kann durch einen anderen Namen ersetzt werden. Die Verwendung von peertube als Nick stellt ein PeerTube-Symbol für Overlay-Nachrichten zur Verfügung, kann aber auch mit einer Overlay-Konfigurationsänderung durchgeführt werden. Die Einstellung NoTLS=true ermöglicht die Verbindung zu einem Server mit selbstsignierten Zertifikaten. Jetzt können Sie dieses Konto zu Gateways hinzufügen und bestimmte Live-Übertragungskanäle weiterleiten.
Info In dieser Dokumentation wird ein anonymes Konto verwendet, um die Brücke mit dem Chat zu verbinden. Aber seit dem Livechat v10.1.0 gibt es eine neue Möglichkeit, ein langfristiges Authentifizierungs-Token zu generieren, das es erlaubt, sich mit dem eigenen Konto zu verbinden. Dies wird für OBS docks verwendet. Die Verwendung dieser Funktion für andere Zwecke ist nicht dokumentiert und wird noch nicht offiziell unterstützt. Wenn Sie es trotzdem benutzen wollen, können Sie ein Token anfordern, indem Sie den Endpunkt /plugins/livechat/router/api/auth/tokens aufrufen. Um die benötigten Header und den Request Body zu erhalten, prüfe einfach, was passiert, wenn du ein neues Token für OBS Docks generierst.`,description:"Matterbridge als Brücke zu anderen Chats nutzen",tags:[],title:"Matterbridge benutzen",uri:"/peertube-plugin-livechat/de/documentation/admin/advanced/matterbridge/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin stores some data on the server, in the /var/www/peertube/storage/plugins/data/peertube-plugin-livechat/ folder. This page describes these data.
prosody The prosody folder is used by the Prosody XMPP server to store its data and logs.
prosodyAppImage This plugin uses the Prosoxy XMPP server in background. This server code is embedded as an AppImage.
When the plugin starts, it deflate this AppImage in the prosodyAppImage folder.
serverInfos To handle federation between Peertube instances, the plugin needs to store some information concerning remote instances (available protocols, …).
The plugin stores these data in the serverInfos/instance_uri folder (where instance_uri is replaced by the instance uri).
In each instance’s folder, there can be these files:
last-update: json file containing the timestamp of the last information update. So we can avoid refreshing too often. ws-s2s: if the server allows XMPP S2S Websocket connections, here are the endpoint information s2s: if the server allows direct XMPP S2S connections, here are the port and url information videoInfos To handle federation the plugin needs to store some information about remote videos.
So, each time we open a new remote chat, a file videoInfos/remote/instance_uri/video_uuid.json is created (where instance_uri is the origin instance uri, and video_uuid is the video uuid).
This JSON files contain some data about the remote chat (is it enabled, are anonymous users authorized, which protocol can we use, …). These data can then be read by the Prosody server to connect to the remote chat.
Moreover, when the current instance builds such data for local videos, it stores it in videoInfos/local/video_uuid.json (where video_uuid is the video uuid).
channelConfigurationOptions The channelConfigurationOptions folder contains JSON files describing channels advanced configuration. Filenames are like 1.json where 1 is the channel id. The content of the files are similar to the content sent by the front-end when saving these configuration.
room-channel/muc_domain.json Some parts of the plugin need a quick way to get the channel id from the room Jabber ID, or the all room Jabber ID from a channel id. We won’t use SQL queries, because we only want such information for video that have a chatroom.
So we will store in the room-channel/muc_domain.json file (where muc_domain is the current MUC domain, something like room.instance.tld) a JSON object representing these relations).
In the JSON object, keys are the channel ID (as string), values are arrays of strings representing the rooms JIDs local part (without the MUC domain).
When a chatroom is created, the corresponding entry will be added.
Here is a sample file:
{ "1": [ "8df24108-6e70-4fc8-b1cc-f2db7fcdd535" ] }This file is loaded at the plugin startup into an object that can manipulate these data.
So we can easily list all rooms for a given channel id or get the channel id for a room JID (Jabber ID).
Note: we include the MUC domain (room.instance.tld) in the filename in case the instance domain changes. In such case, existing rooms could get lost, and we want a way to ignore them to avoid gettings errors.
Note: there could be some inconsistencies, when video or rooms are deleted. The code must take this into account, and always double check room or channel existence. There will be some cleaning batch, to delete deprecated files.
bot/muc_domain The bot/muc_domain (where muc_domain is the current MUC domain) folder contains configuration files that are read by the moderation bot. This bot uses the xmppjs-chat-bot package.
Note: we include the MUC domain (room.instance.tld) in the dirname in case the instance domain changes. In such case, existing rooms could get lost, and we want a way to ignore them to avoid gettings errors.
bot/muc_domain/moderation.json The bot/muc_domain/moderation.json file contains the moderation bot global configuration. This bot uses the xmppjs-chat-bot package, see it’s README file for more information.
Note: this includes the bot username and password. Don’t let it leak.
bot/muc_domain/rooms The bot/muc_domain/rooms folder contains room configuration files. See the xmppjs-chat-bot package help for more information.
emojis/channel The emojis/channel folder contains custom emojis definitions for channels.
For example, the channel 1 will contain:
emojis/channel/1/definition.json: the JSON file containing the emojis definitions emojis/channel/1/files/42.png: N image files (png, jpg, …), using numbers as filenames. tokens The tokens folder contains long term token to connect to the chat. See the LivechatProsodyAuth class for more information.`,description:"Data files and folders used on the server",tags:[],title:"Plugin storage",uri:"/peertube-plugin-livechat/de/technical/data/index.html"},{breadcrumb:"Peertube livechat",content:`Interessiert beizutragen? Super!
VerhaltenskodexVereinbarung über Verhaltenskodex für Mitwirkende
ÜbersätzenDas Plugin übersetzen
Geben Sie Ihr FeedbackGeben Sie Ihr Feedback
EntwickelnEntwickeln
DokumentationDokumentieren Sie das Plugin, oder übersetzen Sie die Dokumentation.`,description:"Beitragen",tags:[],title:"Beitragen",uri:"/peertube-plugin-livechat/de/contributing/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a “slow mode” feature, to rate limit the number of messages that a user can send to a given MUC room. At time of writing, there were no XEP to describe such feature. Please find below a XEP draft, that will be submitted for review.
Warnung Work In Progress, this page is not done yet. For an updated version of this document, you can check the draft XEP XMP file.
XEP: MUC Slow Mode Abstract: This specification describes a way to rate limit messages a single user can send to a MUC room, from the room configuration to the server and client handling of such a feature.
Author: John Livingston
1. Introduction There are some contexts in which you want to be able to rate limit MUC messages. This could have multiple motivations: avoid flooding, garantee a better readability of the room when there are hundreds of active users, …
This specification propose a new option to MUC rooms, allowing room owners to fix a duration that users MUST wait between two messages. We will also specify how the server MUST reject messages send too quickly, and how clients SHOULD handle this feature (by preventing users to send messages without waiting the delay to be over).
2. Terminology Clients: the client software used by end-users to join MUC rooms.
Moderator: A room role that is usually associated with room admins but that can be granted to non-admins.
MUC: The multi-user chat protocol for text-based conferencing.
Participant: An occupant who does not have admin status; in a moderated room, a participant is further defined as having voice (in contrast to a visitor). A participant has a role of “participant”.
Role: A temporary position or privilege level within a room, distinct from a user’s long-lived affiliation with the room; the possible roles are “moderator”, “participant”, and “visitor” (it is also possible to have no defined role). A role lasts only for the duration of an occupant’s visit to a room. See XEP-0045.
Room administrator: A user empowered by the room owner to perform administrative functions such as banning users; however, a room administrator is not allowed to change the room configuration or to destroy the room. An admin has an affiliation of “admin”. See XEP-0045.
Room owner: users that have special access to a room, and that can edit room configuration. See XEP-0045 - Owner Use Cases.
Service Discovery Extensions: XEP-0128: Service Discovery Extensions.
Slow Mode: feature allowing to rate limit user messages in a MUC room.
Slow Mode duration: when the Slow Mode feature is active, specifies the duration, in seconds, users must wait between two text messages.
3. Requirements This document addresses the following requirements:
How to allow room owners to enable and configure the feature by editing the MUC room discovery information. How to enable and configure the feature without allowing room owners to change the configuration. How the server MUST reject messages that does not respect the parameters. How clients SHOULD handle rooms with such feature enabled. 4. MUC configuration 4.1 Activating Slow Mode in the MUC Room configuration Your implementation MAY allow the Slow Mode feature to be set room by room, by its owners.
If room owners can configure the Slow Mode feature, the server MUST add a muc#roomconfig_slow_mode_duration field in the room configuration form.
This field MUST have its type equal to text-single.
This field SHOULD use Data Forms Validation, having its datatype equal to xs:integer.
The value of the field MUST be a positive integer, so you MUST add a range validation, as described in RFC-0122.
0 value means that the slow mode is disabled for this room. Any positive value is the duration, in seconds, users must wait between two messages.
Here is an example of response the server could send when a client is querying room configuration form:
<iq from='coven@chat.shakespeare.lit' id='config1' to='crone1@shakespeare.lit/desktop' type='result'> <query xmlns='http://jabber.org/protocol/muc#owner'> <x xmlns='jabber:x:data' type='form'> <title>Configuration for "coven" Room</title> <instructions> Complete this form to modify the configuration of your room. </instructions> <field type='hidden' var='FORM_TYPE'> <value>http://jabber.org/protocol/muc#roomconfig</value> </field> <field var='muc#roomconfig_slow_mode_duration' type='text-single' label='Slow Mode (0=disabled, any positive integer= users can send a message every X seconds.)' > <validate xmlns='http://jabber.org/protocol/xdata-validate' datatype='xs:integer'> <range min='0'/> </validate> <value>20</value> </field> <!-- and any other field... --> </x> </query> </iq>If the configuration is changed, the server SHOULD send a status code 104, as specified in XEP-0045 - Notification of configuration changes.
4.2 Client discovering The feature can be enabled on a room:
by the room owner, if your implementation allow them to set this option by a server-wide parameter In other words: you can enable this feature, without adding the field in the room configuration form. This allows for example server admins to apply a rate limit server-wide, or to set the slow mode programmatically on any wanted criteria (number of users in the room, current server load, room context, …).
In any case, to allow clients to discover that the feature is active, the server MUST respond on room information queries by adding a muc#roominfo_slow_mode_duration field. This field type MUST be text-single, and its value MUST be a positive integer.
0 value means that the slow mode is disabled for this room. Any positive value is the duration, in seconds, users must wait between two messages. Any invalid (non-positive integer) value sent by the server MUST be considered as equal to 0 (in case of a bad implementation).
Here is an example of response the server could send when a client is querying room information:
<iq from='coven@chat.shakespeare.lit' id='ik3vs715' to='hag66@shakespeare.lit/pda' type='result'> <query xmlns='http://jabber.org/protocol/disco#info'> <identity category='conference' name='The place to be' type='text'/> <feature var='http://jabber.org/protocol/muc'/> <x xmlns='jabber:x:data' type='result'> <field var='FORM_TYPE' type='hidden'> <value>http://jabber.org/protocol/muc#roominfo</value> </field> <field var='muc#roominfo_slow_mode_duration' type='text-single'> <value>2</value> </field> <!-- and any other field... --> </x> </query> </iq>If the slow mode duration has changed (either because the room configuration was modified, or because a server parameter has changed), the server SHOULD send a status code 104, as specified in XEP-0045 - Notification of configuration changes.
5. Server-side rate limiting When the Slow Mode is enabled, server MUST NOT accept two consecutive messages from the same user, to the same room, until the slow mode duration has elapsed. Only messages containing at least one <body/> element must be taking into account (to avoid counting chatstate messages for example).
Room administrators and owners MUST NOT be rate limited.
If a user bypass the limit, the server MUST reply an error stanza, that respects RFC 6120, especially:
error_type MUST be wait, as described in RFC 6120 - Stanzas error - Syntax, error_condition MUST be policy-violation, as described in RFC 6120 - Stanzas error - Defined Stream Error Conditions, the stanza SHOULD contain a <text> element explaining why the message was rejected, and this message SHOULD mention the slow mode duration so that user can understand why they can’t post their message. Here is an example or error stanza:
<message xmlns="jabber:client" type="error" to="crone1@shakespeare.lit/desktop" id="528df978-aa6b-422a-b987-056a810c4733" from="coven@chat.shakespeare.lit" > <error type="wait"> <policy-violation xmlns="urn:ietf:params:xml:ns:xmpp-stanzas" /> <text xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"> You have exceeded the limit imposed by the slow mode in this room. You have to wait 2 seconds between messages. Please try again later </text> </error> </message>6. Client handling When a participant joins a room, the client SHOULD request room information as described in section “4.2 Client discovering”, and look for the muc#roominfo_slow_mode_duration field.
If this field is present, and contains a valid strictly positive integer value, the client SHOULD display an information somewhere, to tell users that there is a slow mode limitation that applies to this room. This information MAY also be displayed to users for which the rate limit does not apply (administrators, owners, …).
Moreover, each time a participant sends a text message, the client SHOULD prevent the user to send another message before the timeout is passed. This MAY be done either by disabling the input field, or the submit button. If the user has at least the administrator acces level, the client SHOULD NOT disable the input field or the submit button.
To avoid some frustrating behaviour, in case there is some lag on the server for example, the client MAY start counting time after receiving the message echo. Indeed, if the first message is processed with some delay by the server, it could consider that the duration is not passed yet when receiving the next one.
7. Security Considerations As a same user can join a room with multiple sessions and/or nicknames, the server MUST use the appropriate key to identify the account, and apply the same limits to all user’s sessions.
Appendices Appendix A: Document information TO BE DONE
Appendix B: Author Information John Livingston
Website: https://www.john-livingston.fr
Appendix C: Legal Notices TO BE DONE
Appendix D: Relation to XMPP The Extensible Messaging and Presence Protocol (XMPP) is defined in the XMPP Core (RFC 6120) and XMPP IM (RFC 6121) specifications contributed by the XMPP Standards Foundation to the Internet Standards Process, which is managed by the Internet Engineering Task Force in accordance with RFC 2026. Any protocol defined in this document has been developed outside the Internet Standards Process and is to be understood as an extension to XMPP rather than as an evolution, development, or modification of XMPP itself.
Appendix E: Discussion Venue TO BE DONE
Appendix F: Requirements Conformance The following requirements keywords as used in this document are to be interpreted as described in RFC 2119: “MUST”, “SHALL”, “REQUIRED”; “MUST NOT”, “SHALL NOT”; “SHOULD”, “RECOMMENDED”; “SHOULD NOT”, “NOT RECOMMENDED”; “MAY”, “OPTIONAL”.`,description:"MUC Slow mode XEP",tags:[],title:"MUC Slow mode",uri:"/peertube-plugin-livechat/de/technical/slow_mode/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation",content:`Dieses Chat-Plugin basiert auf dem XMPP-Protokoll (auch bekannt als Jabber). Es ist daher möglich, eine Verbindung zu den Chats herzustellen mit XMPP-Client-Software. Dies kann zum Beispiel nützlich sein, um Moderationsvorgänge zu erleichtern.
Info Die auf dieser Seite beschriebenen Funktionen müssen von den Administratoren Ihrer Peertube-Instanz aktiviert und konfiguriert werden. Sie haben daher möglicherweise keinen Zugriff auf sie.
Melden Sie sich bei Ihrem Peertube-Konto an Warnung Diese Funktion ist noch nicht verfügbar und wird in einer zukünftigen Version des Plugins enthalten sein.
Verbindung über ein externes XMPP-Konto Wenn diese Funktion in Ihrer Instanz aktiviert ist, können Sie mit jedem XMPP-Konto eine Verbindung zu Peertube Chats über ein beliebiges XMPP-Konto verbinden.
Um die Adresse des Raums, dem Sie beitreten möchten, zu erhalten, können Sie die Schaltfläche “Chat teilen” verwenden die sich über dem Chat befindet:
Info Standardmäßig ist die Schaltfläche “Freigeben” nur für den Eigentümer des Videos und die Admins/Moderatoren der Instanz. Administratoren können jedoch festlegen, dass diese Schaltfläche für alle angezeigt wird.
Wählen Sie dann “Mit XMPP verbinden”:
Dann müssen Sie nur noch auf “Öffnen” klicken oder die Adresse des Chatraums in Ihren XMPP-Client kopieren/einfügen (mit der Funktion “einem Raum beitreten”).`,description:"Verbindung zum Chat über einen XMPP-Client",tags:[],title:"XMPP Clients",uri:"/peertube-plugin-livechat/de/documentation/user/xmpp_clients/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`You can set terms & conditions on the instance level (called “global terms”), or at the streamers’ channels level (called “muc terms”, as it is related to muc rooms).
Backend The mod_muc_peertubelivechat_terms prosody modules handles the terms configuration.
It has a configuration option for the global terms. It also adds muc terms in the room data.
When a new occupant session is opened, this modules sends them messages containing the global and muc terms (if set).
Here is an example of sent messages:
<message xmlns="jabber:client" id="_iRSEs061gi5GBjF7zGh7f-M" type="groupchat" to="root@p1.localhost/QH1H89H1" from="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost/Peertube"> <body>The global terms.</body> <x-livechat-terms type="global" /> <delay xmlns="urn:xmpp:delay" stamp="2024-06-25T11:02:25Z" /> <stanza-id by="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost" xmlns="urn:xmpp:sid:0" id="InoL5fonvOoR8X9gOlAYsz_N" /> <no-copy xmlns='urn:xmpp:hints'/> <no-store xmlns='urn:xmpp:hints'/> <no-permanent-store xmlns='urn:xmpp:hints'/> </message> <message xmlns="jabber:client" id="_iRSEs061gi5GBjF7zGh7f-M" type="groupchat" to="root@p1.localhost/QH1H89H1" from="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost/Peertube"> <body>The muc terms.</body> <x-livechat-terms type="muc" /> <delay xmlns="urn:xmpp:delay" stamp="2024-06-25T11:02:25Z" /> <stanza-id by="8df24108-6e70-4fc8-b1cc-f2db7fcdd535@room.p1.localhost" xmlns="urn:xmpp:sid:0" id="InoL5fonvOoR8X9gOlAYsz_N" /> <no-copy xmlns='urn:xmpp:hints'/> <no-store xmlns='urn:xmpp:hints'/> <no-permanent-store xmlns='urn:xmpp:hints'/> </message>Notice the x-livechat-terms tag.
Standard XMPP clients will show these messages as standard message.
Message are sent from a “service nickname”: this occupant does not exist. The service nickname is an option of the module (livechat use “Peertube”, hard coded for now). This nickname is reserved, no-one can spoof it (the module will bounce any request to use this nickname). We must do so, because without nickname, some XMPP clients won’t show the messages (tested with Gajim).
We also add a delay tag, to trick the moderation bot (see comments in code). This also ensure clients will not drop the message because there is no occupant with this name.
We also add some urn:xmpp:hints to avoid storing or copying these messages.
When muc terms are updated, the new terms will be broadcasted.
To avoid anyone spoofing terms & conditions, incoming message stanza are filtered, and any x-livechat-terms tag will be removed.
Message history is disabled for message containing the x-livechat-terms, so that messages broadcasted when the terms change are not stored by muc_mam modume (“Message Archiving Management”).
Frontend For standard XMPP clients, terms will be shown as delayed messages.
For the livechat frontend, there is a livechat-converse-terms Converse plugin that will intercept these messages, and prevent them to be shown in the chat history.
It will also create infobox at the top of the chat to display the terms content. If muc terms are updated, the new terms will be shown.
Users can hide the terms. To remember that a user has already hidden the terms, we store the content in localStorage. We will only show terms again if the content in this localStorage changes. We do so for both global terms and muc terms, in two separate localStorage keys. The keys in localstorage does not depends on the room JID or the origin peertube instance. This means that message will be shown again:
if terms are modified if the user switch to another channel if the user switch to a video from a different peertube instance `,description:"Terms&Conditions implementation",tags:[],title:"Terms&Conditions",uri:"/peertube-plugin-livechat/de/technical/terms/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The poll system relies on two thinks:
mod_muc_polls Prosody module on the backend polls Converse plugin on the frontend Backend mod_muc_polls is a Prosody modules that implements polls in MUC. This module could be used on any Prosody server, and has no code specific to the livechat plugin.
The way this module works could be standardized one day, by writing a XEP.
Poll creation This module adds the http://jabber.org/protocol/muc#x-poll disco features on muc-disco#info.
Room’s owner and admin can retrieve a http://jabber.org/protocol/muc#x-poll form by sending the relevant iq query. This forms contains relevant fields (the poll question, the duration, choices, …). Once the form submitted, a new poll is created. Any previous existing poll will end (if not already ended).
The current poll is stored in room._data.current_poll.
For now, any ended poll is not kept.
Poll starts When a poll is started, a groupchat message is broadcasted in the MUC room. This message is sent in the name of the poll creator (same from, same occupant-id). This message contains the question, the different choices, and some instructions (in english).
This message also contains some specific XML tags. These tags could be use by any compatible client to display the poll as they want.
Here an Example of this start message:
<message id='25Plgjj2TdemFuomNuKZ9bxRQFLbiVHwc8_4' to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client' from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root' type='groupchat'> <body>The poll question 1: Choice 1 label 2: Choice 2 label Send a message with an exclamation mark followed by your choice number to vote. Example: !1 </body> <occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/> <x-poll id='_eZQ4j4YLHTK' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177157' votes='0'> <x-poll-question>The poll question</x-poll-question> <x-poll-choice choice='1' votes='0'>Choice 1 label</x-poll-choice> <x-poll-choice choice='2' votes='0'>Choice 2 label</x-poll-choice> </x-poll> <stanza-id xmlns='urn:xmpp:sid:0' id='dOASuopT9kW5OgAKvhZo0Irm' by='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost'/> </message>Note: the end attribute is the poll end date timestamp. The votes attributes are the number of votes (total on x-poll and per choice on each x-poll-choice tag). The choice attribute is the key to use to vote for this choice (choice='1' can by voted by sending !1).
Poll votes Users can then vote by sending messages in the room, using the format “!1”.
These groupchat messages will be intercepted by the module, and counted as votes.
If the “anonymous votes” feature is enabled, vote will be taken into account, but the message will be bounced with an error saying: “Your vote is taken into account. Votes are anonymous, they will not be shown to other participants.”
This means that you can vote with any XMPP clients!
If an occupant votes multiple times, their vote will be updated.
If an occupant is muted (has visitor role), votes won’t be counted.
When there are new votes, messages are broadcated so that compatible clients can update the current vote progress. These messages are debounced: the module waits 5 seconds after a vote to send the update message, and only send one for all votes that were done in those 5 seconds. These messages are groupchat message without body, and with some specific urn:xmpp:hints. They contains the x-poll tag with same meta data as above. The message is also sent as the poll creator (from and occupant-id).
Here is an example:
<message id='jm9dsXD73eXxlAP2M4dOhay7oXBlQb91LVBf' to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client' from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root' type='groupchat'> <occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/> <no-copy xmlns='urn:xmpp:hints'/> <no-store xmlns='urn:xmpp:hints'/> <no-permanent-store xmlns='urn:xmpp:hints'/> <x-poll id='06yCKW_hoZSx' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177925' votes='1'> <x-poll-question>The poll question</x-poll-question> <x-poll-choice choice='1' votes='1'>Choice 1 label</x-poll-choice> <x-poll-choice choice='2' votes='0'>Choice 2 label</x-poll-choice> </x-poll> </message>Note: Standards XMPP clients won’t be able to show the progress.
When a user joins the MUC, a similar message will be sent to this user (and this user only, to the new occupant session to be more specific). This is done so that any compatible client can immediatly show the poll.
Note: clients should ignored x-poll data from archived messages, and only consider data coming from unarchived messages. Otherwise they could show some outdated data.
Poll end When the poll ends, a new groupchat message is broadcasted in the room.
Here is an example:
<message id='GVqv1YcwI0GZb0myKhmtEqRa9fvWlCbDdF7R' to='root@p1.localhost/converse.js-117702469' xmlns='jabber:client' from='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost/Root' type='groupchat'> <body>The poll question This poll is now over. 1: Choice 1 label 2: Choice 2 label </body> <occupant-id id='yoXY0/DaHd03MpGsc+ayjEFZ5UIWt6JmrxC+6HPz4qM=' xmlns='urn:xmpp:occupant-id:0'/> <x-poll id='_eZQ4j4YLHTK' votes='5' xmlns='http://jabber.org/protocol/muc#x-poll-message' end='1720177157' over='' > <x-poll-question>The poll question</x-poll-question> <x-poll-choice choice='1' votes='3'>Choice 1 label</x-poll-choice> <x-poll-choice choice='2' votes='2'>Choice 2 label</x-poll-choice> </x-poll> <stanza-id xmlns='urn:xmpp:sid:0' id='CwiijSxawB8QOP4NN-Li6jP0' by='5dd144b2-3c24-4cbc-a34e-143e951ecf50@room.p1.localhost'/> </message>Please note the over attributes that indicated that the poll is over.
If users are voting just after the poll ends (less than 30 seconds after the poll end), and the vote is anonymous, their votes will be bounced, to avoid leaking votes for late users.
Security Following tags will be stripped of any incoming groupchat message: x-poll, x-poll-question, x-poll-choice. This is to avoid any poll spoofing.
Fronted The poll Converse plugin does multiple things.
It checks for the http://jabber.org/protocol/muc#x-poll disco feature to show the “create poll” button.
It uses standards XMPP forms to get the poll creation form and submit it.
It uses the parseMUCMessage hook to check if messages have x-poll data.
If so, and if message are not archived, it creates or updates the poll banner.
When clicking on a choice in the banner, it just sends a message in the chat ("!1" for example).
As the backend does no localization, it also translate on the fly the english sentences coming from the backend (in the form definition, in poll start/end message, and in bounce/error messages).`,description:"Polls technical documentation",tags:[],title:"Umfragen",uri:"/peertube-plugin-livechat/de/technical/polls/index.html"},{breadcrumb:"Peertube livechat",content:`Wenn Sie neue Funktionswünsche, Fehler (Bugs) oder Schwierigkeiten bei der Einrichtung des Plugins haben, können Sie den Github issue tracker verwenden.
Einen Einblick in die Roadmap für kommende Funktionen finden Sie hier:
Github Project. Meilensteine auf Github. Wenn Sie ein Webdesigner oder ein ConverseJS/Prosody/XMPP-Experte sind und helfen wollen, dieses Plugin zu verbessern, sind Sie gerne willkommen.`,description:"Fehler (Bugs) / Neue Funktionsanfragen",tags:[],title:"Fehlerverfolgung (Bug tracking) und neue Funktionen",uri:"/peertube-plugin-livechat/de/issues/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a Task Application. The present document describes how this is implemented.
Basics This features relies on XEP-0060: Publish-Subscribe. This XEP provide a way to store and retrieve items, and to receive push notifications when an item is created/deleted/modified.
There is a Prosody Module, mod_pubsub_peertubelivechat, to implement some specific use of the pubsub mechanism.
This module is also used for Moderator Notes.
We use the JID+NodeID addressing to specify some nodes related to each MUC room. The JID is the MUC room JID, the NodeID is functionnality we want to address.
This modules implement the “livechat-tasks” node, to handle tasks and task lists.
The “livechat-tasks” node contains two type of objects: Task and TaskList (XML Namespaces: urn:peertube-plugin-livechat:tasklist and urn:peertube-plugin-livechat:task). Tasks have an attribute containing their task list id.
On the front-end, we have the livechat-converse-tasks plugin for ConverseJS.
Workflow Here is the basic workflow used to subscribe to tasks/task-lists, and receive existing items.
the browsers connect to the chat, and ConverseJS uses the XMPP discovery to get the room features. mod_pubsub_peertubelivechat declares two features: urn:peertube-plugin-livechat:tasklist and urn:peertube-plugin-livechat:task. the browsers detect these feature, and checks that the user has admin or owner affiliation on the MUC component. if not, won’t display the Task Application, and stops here. if yes, we will continue: display the Task Application. Create a new PubSubManager object, that will subscribe to the pubsub node. The backend receives the subscription request, test user rights (must be owner/admin on the MUC), and adds the user to the subscribers. Note: a user with multiple browsers tabs will send multiple subscription requests, but this is not an issue. If the node did not exist, the backend automatically created it, and use the MUC name to create a first task-list with that name. Once subscribed, the frontend will request all current entries. The backend tests rights, and send all node entries. On the frontend, the PubSubManager handles the response by dispatching received items to the correct frontend component. Note: on the backend side, we subscribe all users with the “publisher” affiliation level. This allows them to publish items, but not change the node configuration.
Here is the worflow to create/modify/delete items:
the frontend send a publish request. backend checks rights. backend sends notifications to all subscribers, including the current users. On the front-end PubSubManager receives the notification, and dispatch it to the relevant component. Unsubscribing When users leaves a MUC room, they are automatically unsubscribed from the “livechat-tasks” node related to this room.
When users lose the owner/admin affiliation, they are removed from the “livechat-tasks” node subscriptions.
Items Here we describes the content of node items.
Aufgabenlisten Item tag: tasklist XML Namespace: urn:peertube-plugin-livechat:tasklist item childs: name: the text content is the task list name Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="45cf7543-67bf-4d03-bb5d-a55038a0512a:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <tasklist xmlns="urn:peertube-plugin-livechat:tasklist"> <name>Task List Name</name> </tasklist> </item> </publish> </pubsub> </iq>Aufgaben Item tag: task XML Namespace: urn:peertube-plugin-livechat:task item attributes: done: if present and equal to “true”, means that the task is done list: the list id order: the order of the task in the task list item childs: name: the text content is the task name description: the text content is the task description Example: here is an example of IQ stanza to create a task-list item.
<iq from="user@example.com" id="9fd9a162-1b6c-4b38-a2a1-2485b34f0d8d:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client" > <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-tasks"> <item> <task list="8302c024-c16e-4fbd-aca7-c94cdb2025de" order="0" done="true" xmlns="urn:peertube-plugin-livechat:task" > <name>The task name</name> <description>here is the description</description> </task> </item> </publish> </pubsub> </iq>Note: in the above example, we added done="true" just for the example. Don’t add the attribute if you want not the task to be marked as done (or if you want to undone the task).`,description:"Task Application technical overview",tags:[],title:"Tasks overview",uri:"/peertube-plugin-livechat/de/technical/tasks/index.html"},{breadcrumb:"Peertube livechat > Technical documentation",content:`The livechat plugin includes a Moderation Notes Application. The present document describes how this is implemented.
Basics This features relies on XEP-0060: Publish-Subscribe. This XEP provide a way to store and retrieve items, and to receive push notifications when an item is created/deleted/modified.
There is a Prosody Module, mod_pubsub_peertubelivechat, to implement some specific use of the pubsub mechanism.
This module is also used for Tasks.
We use the JID+NodeID addressing to specify some nodes related to each MUC room. The JID is the MUC room JID, the NodeID is functionnality we want to address.
This modules implement the “livechat-notes” node, to handle moderator notes.
The “livechat-notes” node contains one type of objects: Note (XML Namespaces: urn:peertube-plugin-livechat:note).
On the front-end, we have the livechat-converse-notes plugin for ConverseJS.
Workflow / Unsubscribing This is basically the same as for Tasks.
Items Here we describes the content of note items.
Item tag: note XML Namespace: urn:peertube-plugin-livechat:note item attributes: order: the order of the note in the note list item childs: description: the text content of the note note-about: an optional tag, if the note is associated to a participant The note-about tag, if present, has following structure:
Item tag: note-about XML Namespace: none item attributes: jid: the JID of the occupant nick the nick of the occupant, at time of note creation item childs: occupant-id: see XEP-0421. Example:
<iq from="user@example.com" id="64da7e38-4dd5-4f55-b46f-297232232971:sendIQ" to="035fcc4b-072f-4827-b296-6998b04e3456@room.example.com" type="set" xmlns="jabber:client"> <pubsub xmlns="http://jabber.org/protocol/pubsub"> <publish node="livechat-notes"> <item id="8ab78df9-a7b9-4315-943d-c340935482af"> <note order="11" xmlns="urn:peertube-plugin-livechat:note" > <description>Some text.</description> <note-about jid="khkecy3nkddwxdllgzdub-dv@anon.p1.localhost" nick="Mickey" > <occupant-id id="ga4mR2IKEvRKuzN1gJYVafCTbY1gNvgNvNReqdVKexI=" xmlns="urn:xmpp:occupant-id:0" /> </note-about> </note> </item> </publish> </pubsub> </iq>`,description:"Moderator Notes Application technical overview",tags:[],title:"Moderator notes overview",uri:"/peertube-plugin-livechat/de/technical/moderation_notes/index.html"},{breadcrumb:"Peertube livechat",content:` Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
Terms&ConditionsTerms&Conditions implementation
UmfragenPolls technical documentation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview`,description:"Technical documentation",tags:[],title:"Technical documentation",uri:"/peertube-plugin-livechat/de/technical/index.html"},{breadcrumb:"Peertube livechat",content:`Wenn Sie eine Frage haben oder über dieses Plugin sprechen möchten, können Sie diesem XMPP-Raum mit einem beliebigen Jabber-Client beitreten: plugin-livechat-support@room.im.yiny.org.
Wenn Sie das Projekt finanziell unterstützen möchten, können Sie mich per E-Mail unter git.[at].john-livingston.fr kontaktieren oder mein Liberapay-Profil ansehen.`,description:"Den Autor kontaktieren",tags:[],title:"Kontaktieren Sie mich",uri:"/peertube-plugin-livechat/de/contact/index.html"},{breadcrumb:"Peertube livechat",content:`package.json, COPYRIGHT and LICENSE Dateien beinhalten die Lizenzinformationen für dieses Programm und seiner Abhängigkeiten.
Das Plugin wird von John Livingston betrieben.
Vielen Dank an David Revoy für seine Arbeit am Peertube-Maskottchen, [Sepia] (https://www.davidrevoy.com/index.php?tag/peertube). Das Charakterdesign steht unter CC-By-Lizenz, und die SVG-Dateien, die zur Erstellung einiger Logos und Avatare in diesem Plugin verwendet wurden, stehen unter GPLv3.0. Die PNG-Dateien stehen unter CC-By-Lizenzen und stammen aus dem online Sepia Avatar Generator.
Vielen Dank an Framasoftfür die Ermöglichung von Peertube, für die finanzielle Unterstützung, und für das Weblate.
Vielen Dank an ritimo für die finanzielle Unterstützung.
Vielen Dank an Code Lutin und Rétribution Copie Publique für die finanzielle Unterstützung.
Vielen Dank an NlNet und die NGI0 Entrust fund für die finanzielle Unterstützung.
Vielen Dank an Octopuce für die finanzielle Unterstützung.
Und vielen Dank an alle Einzelspender, die über meine [Liberapay Seite] (https://liberapay.com/JohnLivingston/) gespendet haben.`,description:"Impressum des Plugins",tags:[],title:"Impressum",uri:"/peertube-plugin-livechat/de/credits/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:`Aktivieren Sie den Chat für Ihre Live-Streams Warnung Instanzadministratoren können den Chat in bestimmten Fällen deaktivieren oder aktivieren. Die Informationen in diesem Abschnitt gelten nur für den Standardfall.
Wenn Sie eine Peertube Live-Stream erstellen oder ändern, gibt es eine Registerkarte “Plugin-Einstellungen”:
![Screenshot des Peertube-Formulars für die Live-Übertragung (/peertube-plugin-livechat/images/new_live.png?classes=shadow,border&height=200px “Neuer Livestream”)
Auf der Registerkarte “Plugin-Einstellungen” gibt es ein Kontrollkästchen “Chat nutzen”. Aktivieren oder deaktivieren Sie es einfach, um den mit Ihrem Video verbundenen Chat zu aktivieren oder zu deaktivieren.
Tipp Je nachdem, welche Plugins auf Ihrer Peertube-Instanz installiert sind, können sich auf dieser Registerkarte weitere Einstellungen befinden.
Chat pro Kanal Auf der Instanz-Ebene können die Peertube-Administratoren wählen, ob die Chat-Räume pro Video einzigartig sind, oder ob es einen einzigartigen Chat-Raum pro Kanal gibt. Bitte kontaktieren Sie die Administratoren Ihrer Instanz für weitere Informationen zur Konfiguration des Livechat-Plugins.
Teilen Sie den Chat Oben auf dem Chat gibt es eine Schaltfläche “Chat Link teilen”.
Diese Schaltfläche öffnet ein Popup-Fenster, in dem Sie eine URL erhalten, mit der Sie dem Chat beitreten können. Diese Url kann weitergegeben werden.
Auf der Registerkarte “Einbetten” finden Sie einige Links zum Einbetten des Chats in Websites oder in Ihre Livestream.
Sie können einige Optionen individuell anpassen:
Nur-Lesen: Sie können den Chat nur lesen, nicht schreiben. Dies ist nützlich, um den Inhalt des Chats in Ihren Live-Stream einzubinden (siehe die OBS Dokumentation). Die derzeitigen Themenfarben nutzen: wenn diese Option aktiviert ist, werden die Farben des aktuellen Themas zur URL hinzugefügt, so dass jeder Benutzer, der den Link öffnet, dieselbe Farbe erhält. IFrame-Element erstellen, um den Chat in eine Webseite zu integrieren: Anstelle einer URL erhalten Sie ein HTML-Snippet, das Sie in Ihre Website einfügen können, um den Chat einzubetten. Weitere Informationen über die Registerkarte “Dock” finden Sie in der OBS-Dokumentation.
Auf der Registerkarte “Web” öffnet die angegebene URL den Chat in der Peertube-Oberfläche. Sie können diesen Link an andere Benutzer weitergeben, um sie zum Chat einzuladen.
![Screenshot des “Chat Link teilen”-Dialogs auf der Registerkarte “Web”. Es gibt eine Url, die Sie kopieren können](/peertube-plugin-livechat/images/share_web.png?classes=shadow,border&height=200px Link teilen popup - Web Registerkarte")
Das “Chat Link teilen” Popup-Fenster kann auch einen “Mit XMPP verbinden” Reiter enthalten. Dieser ist nur verfügbar, wenn die Administratoren Ihrer Instanz diese Option aktiviert und korrekt konfiguriert haben. Mit dieser Option können Sie einen Link bereitstellen, um dem Chat mit einer beliebigen XMPP-Client-Software beizutreten. Die Verwendung solcher Software kann zum Beispiel Moderationsmaßnahmen erleichtern.
Moderation Bitte lesen Sie die Moderationsdokumentation.
Einbindung des Chats in den Videostream Bitte lesen Sie die OBS-Dokumentation.
Chat Dauerhaftigkeit Standardmäßig ist der Chat dauerhaft. Das bedeutet, dass der Inhalt des Raums eine Zeit lang erhalten bleibt. Benutzer, die dem Raum beitreten, sehen Nachrichten, die vor ihrer Ankunft gesendet wurden.
Sie können das Dauerhaftigkeitsverhalten ändern. Öffnen Sie das Chat Dropdownmenü, und klicken Sie auf “Konfigurieren”.
Es gibt mehrere Optionen, die geändert werden können.
Sie können z. B. die Standard- und Höchstzahl der zurückzusendenden Nachrichten auf 0 setzen, so dass neue Empfänger keine zuvor gesendeten Nachrichten sehen.
Sie können auch die Option “Archivierung aktivieren” deaktivieren: Wenn diese Option nicht aktiviert ist, werden die Nachrichten beim Neustart des Servers gelöscht.
Wenn Sie das Häkchen bei “Dauerhaft” entfernen, wird der Raum gelöscht, wenn es keinen Teilnehmer mehr gibt.
Löschen des Chat Inhalts Wenn Sie den Inhalt des Chats löschen möchten, öffnen Sie deas Dropdown Menü des Chats und klicken Sie auf “Löschen”. Es öffnet sich ein Popup-Fenster, das eine Bestätigung verlangt.
Der Chat wird automatisch neu erstellt, wenn jemand versucht, ihm beizutreten, solange das Video existiert und die Funktion “Chat nutzen” aktiviert ist.`,description:"Einige grundlegende Informationen zur Einrichtung und Nutzung des Chats für Ihren Livestream",tags:[],title:"Einige Grundlagen",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/basics/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation",content:` Einige GrundlagenEinige grundlegende Informationen zur Einrichtung und Nutzung des Chats für Ihren Livestream
KanalkonfigurationPeertube Kanal Chaträume Konfiguration
ModerationPlugin peertube-plugin-livechat Erweiterte Moderationsfunktionen
NutzungsbedingungenKonfigurieren Sie die Chat-Nutzungsbedingungen für den Kanal
Langsamer ModusPlugin peertube-plugin-livechat Langsamer Modus
ModerationsverzögerungPlugin peertube-plugin-livechat Moderationsverzögerung
Benutzerdefinierte EmojisPlugin peertube-plugin-livechat benutzerdefinierte Emojis
Nur Emojis-ModusPlugin peertube-plugin-livechat nur Emojis Modus
UmfragenSie können Umfragen erstellen, um die Zuschauer nach ihrer Meinung zu fragen
Aufgaben / To-do-ListenSie können Aufgaben und Aufgabenlisten mit Ihrem Moderationsteam bearbeiten.
ModerationsnotizenPlugin peertube-plugin-livechat Moderationnotizen
ChatbotChatbot Einrichtung
Special charactersThe bot can automatically moderate messages containing too many special characters.
Verbotene WörterDer Chatbot kann automatisch Nachrichten moderieren, die verbotene Wörter enthalten.
TimerDer Chatbot kann in regelmäßigen Abständen einige Nachrichten senden.
BefehleDer Chatbot kann auf verschiedene Befehle reagieren.`,description:"So richten Sie den Chat für Ihren Live-Stream ein",tags:[],title:"Für Streamer",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 8.0.0 geliefert und kann von den Administratoren Ihrer Instanz deaktiviert werden.
Im linken Menü von Peertube gibt es einen Eintrag “Chaträume”:
Dieser “Chaträume” Link führt Sie zu einer Liste Ihrer Kanäle. Wenn Sie auf einen Kanal klicken, können Sie einige Optionen für Ihre Kanäle einrichten:
Hier können Sie konfigurieren:
Chat Nutzungsbedingungen und Konditionen des Kanals Anonyme Benutzer stummschalten Standardwert Der langsame Modus Den Chatbot Benutzerdefinierte Emojis Weitere Funktionen werden folgen… `,description:"Peertube Kanal Chaträume Konfiguration",tags:[],title:"Kanalkonfiguration",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/channel/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Warnung Dieser Abschnitt ist noch unvollständig.
Warnung Diese Seite beschreibt das Verhalten von Livechat-Versionen >= 10.0.0. Es gab einige Änderungen in der Art und Weise, wie wir die Zugriffsrechte für Peertube-Administratoren und -Moderatoren verwalten.
Der Chatbot Sie können einen Chatbot verwenden, der Sie bei der Moderation unterstützt. Weitere Informationen finden Sie in der Chatbot Dokumentation.
Zugang zu den Moderationswerkzeugen Über das Chat Dropdown Menü am oberen Rand des Chats haben Sie Zugriff auf die Raumeinstellungen und Moderationswerkzeuge.
Tipp Der Videobesitzer ist der Besitzer des Chatraums. Das bedeutet, er kann den Raum konfigurieren, löschen, andere Benutzer als Administratoren befördern, …
Tipp Ab livechat v10.0.0 haben Admins und Moderatoren der Peertube-Instanz standardmäßig keine besonderen Rechte für Räume. Sie haben jedoch einen speziellen Button oben im Chat zur Verfügung: “Moderator werden”. Wenn sie auf diese Schaltfläche klicken, erhalten sie Besitzerrechte für den Raum.
Sie können ConverseJS Moderationsbefehle verwenden, um den Raum zu moderieren. Wenn Sie den Chat-Raum im Vollbildmodus öffnen, finden Sie oben rechts ein Menü mit speziellen Befehlen.
Anonyme Benutzer stummschalten Info Diese Funktion wird mit dem Livechatplugin Version 10.2.0 verfügbar sein.
Sie können anonyme Benutzer daran hindern, Nachrichten zu senden. In diesem Fall können nur registrierte Benutzer im Chat schreiben.
Um diese Funktion zu aktivieren oder zu deaktivieren, verwenden Sie das Chat-Dropdown-Menü, öffnen Sie das Menü “Konfigurieren”. In dem Formular finden Sie eine Checkbox “Anonyme Benutzer stummschalten”.
Anonyme Benutzer haben das Nachrichtenfeld nicht und sehen folgende Aufforderung: “Nur registrierte Benutzer können Nachrichten versenden.”
Wenn diese Funktion aktiviert ist, wird anonymen Benutzern die Rolle “Besucher” zugewiesen. Sie können deren Rolle in “Teilnehmer” ändern, wenn Sie einigen von ihnen erlauben wollen, zu schreiben.
Wenn Sie die Raumkonfiguration ändern, werden alle anonymen Benutzer stummgeschaltet oder die Stummschaltung aufgehoben.
Sie können diese Funktion für neue Chaträume auf der Kanal-Konfigurationsseite aktivieren oder deaktivieren.
Rollen und Zugehörigkeiten Es gibt verschiedene Rollen, die Benutzern in Chaträumen zugewiesen werden können: Eigentümer, Moderatoren, Mitglieder, …
Warnung Dieser Abschnitt ist noch unvollständig.
Sie können Benutzer zu Moderatoren befördern, wenn Sie Hilfe benötigen.
Moderationsaktionen anonymisieren Info Diese Funktion wird mit dem Livechatplugin Version 11.0.0 verfügbar sein.
Es ist möglich, Moderationsaktionen zu anonymisieren, um zu vermeiden, dass bekannt wird, wer Teilnehmer bannt/verweist/…
Um diese Funktion zu aktivieren oder zu deaktivieren, verwenden Sie das Chat-Dropdown-Menü, öffnen Sie das Menü “Konfigurieren”. In dem Formular finden Sie eine Checkbox “Moderationsaktionen anonymisieren”.
Sie können diese Funktion für neue Chaträume auf der Kanal-Konfigurationsseite aktivieren oder deaktivieren.
Im Nachrichtenverlauf eines Teilnehmers suchen Info Diese Funktion wird mit dem Livechatplugin Version 11.0.0 verfügbar sein.
Als Raumadministrator oder -besitzer können Sie alle von einem bestimmten Teilnehmer gesendeten Nachrichten durchsuchen.
Dazu haben Sie mehrere Möglichkeiten:
die Aktion “Alle Nachrichten suchen” im Dropdown-Menü neben den Teilnehmern in der Seitenleiste verwenden die Aktion “Alle Nachrichten suchen” im Dropdown-Menü neben den Chat-Nachrichten verwenden Tipp Um mehr Platz und eine bessere Lesbarkeit zu erhalten, öffnen Sie den Chat im neuen Fenster.
In den Suchergebnissen werden rechts neben dem Spitznamen des Teilnehmers verschiedene Informationen angezeigt:
wenn der aktuelle Nickname nicht mit dem Nicknamen übereinstimmt, unter dem der Teilnehmer die Nachricht gesendet hat, wird der ursprüngliche Nickname angezeigt sehen Sie die JID (Jabber ID) des Teilnehmers Sie sehen auch die occupant-id des Teilnehmers Das Suchergebnis enthält auch alle Nachrichten, die sich auf Teilnehmer beziehen, die denselben Spitznamen hatten. Sie können sie unterscheiden, indem Sie JID und occupant-id vergleichen.
Rauminhalt löschen Sie können alte Räume löschen: Treten Sie dem Raum bei, und verwenden Sie das Menü oben, um den Raum zu löschen.
Instanz-Moderation Als Moderator oder Administrator einer Peertube-Instanz müssen Sie wahrscheinlich überprüfen, dass sich Ihre Benutzer nicht schlecht benehmen.
Sie können alle bestehenden Chaträume auflisten: in den Einstellungen des Plugins gibt es eine Schaltfläche «Räume auflisten».
Von dort aus kannst du dich auch als Moderator des Raums bewerben, indem du die Schaltfläche “Moderator werden” auf der rechten Seite benutzt.`,description:"Plugin peertube-plugin-livechat Erweiterte Moderationsfunktionen",tags:[],title:"Moderation",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/moderation/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 10.2.0 verfügbar sein.
Konfiguration Sie können Ihrem Kanal Nutzungsbedingungen hinzufügen. Diese Nutzungsbedingungen werden allen Benutzern angezeigt, die den Chat betreten.
Um die Nutzungsbedingungen zu konfigurieren, gehen Sie auf die Kanal-Konfigurationsseite:
Die URL in der Nachricht wird anklickbar sein. Sie können die Nachricht auch etwas gestalten: Message Styling.
Zuschauer Wenn Sie dem Chat beitreten, sehen die Zuschauer die Bedingungen:
Info Der Administrator der Peertube-Instanz kann auch globale Nutzungsbedingungen festlegen. Wenn dies der Fall ist, werden diese Bedingungen über den Bedingungen Ihres Kanals angezeigt.
Info Anonyme Nutzer sehen die Nutzungsbedingungen erst, wenn sie ihren Nickname gewählt haben (mit anderen Worten: wenn sie schreiben können).
Sie können den Inhalt der Nutzungsbedingungen jederzeit ändern, er wird dann sofort für alle Betrachter aktualisiert.
Benutzer können die Nutzungsbedingungen ausblenden. Wenn Sie dies tun, werden die Bedingungen nicht mehr angezeigt, es sei denn, Sie ändern den Inhalt.
Info Wenn Ihre Peertube-Instanz die Teilnahme am Chat mit [XMPP-Clients] (https://livingston.frama.io/peertube-plugin-livechat/de/documentation/admin/advanced/xmpp_clients/) erlaubt, sehen die Benutzer, die solche Clients verwenden, die Bedingungen als Chat-Nachrichten, die von einem “Peertube”-Konto kommen. Wenn Sie die Bedingungen aktualisieren, erhalten sie eine neue Nachricht mit dem Inhalt der aktualisierten Bedingungen.`,description:"Konfigurieren Sie die Chat-Nutzungsbedingungen für den Kanal",tags:[],title:"Nutzungsbedingungen",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/terms/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 8.3.0 verfügbar sein.
Einführung Als Streamer haben Sie die Möglichkeit, die Anzahl der Nachrichten Ihrer Zuschauer im Chat zeitlich zu begrenzen.
Dies kann sehr nützlich sein, um:
eine Nachrichtenüberflutung zu vermeiden einen unleserlichen Chat vermeiden, wenn viele Zuschauer schreiben Sie können eine Anzahl von Sekunden festlegen, die die Benutzer nach dem Senden einer Nachricht warten müssen, bevor sie eine weitere senden können.
Diese Einschränkung gilt nicht für Moderatoren.
Langsamer Modus Option Auf der Kanal Konfigurations Seite können Sie den langsamen Modus einstellen:
Dieser Wert gilt als Standardwert für alle Chaträume deines Kanals.
Wird der Wert auf “0” gesetzt, wird die Funktion deaktiviert.
Wenn Sie den Wert auf eine positive ganze Zahl setzen, wird der Zeitraum festgelegt, in dem die Benutzer keine weiteren Nachrichten senden können.
Um den Wert für einen bereits existierenden Raum zu ändern, öffnen Sie einfach das Raum-Konfigurationsmenü (oben im Chatfenster) und ändern Sie den Wert für den langsamen Modus im Konfigurationsformular.
Für Zuschauer Wenn der langsame Modus aktiviert ist, wird der Benutzer durch eine Nachricht informiert.
Wenn sie eine Nachricht senden, wird das Eingabefeld für X Sekunden deaktiviert (wobei X die Dauer des langsamen Modus ist).
Diese Einschränkung gilt nicht für Moderatoren.`,description:"Plugin peertube-plugin-livechat Langsamer Modus",tags:[],title:"Langsamer Modus",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/slow_mode/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 10.3.0 verfügbar sein.
Einführung Als Streamer können Sie Nachrichten im Chat verzögern, um Moderatoren etwas Zeit zu geben, Nachrichten zu löschen, bevor sie von anderen Teilnehmern gelesen werden können.
Wenn diese Funktion aktiviert ist, sehen die Moderatoren alle Nachrichten ohne Verzögerung. Die Chat-Teilnehmer sehen nicht, dass ihre eigenen Nachrichten verzögert sind.
Bitte beachten Sie, dass Nachrichten, die von Moderatoren gesendet werden, ebenfalls verzögert werden, um zu vermeiden, dass sie auf Nachrichten antworten, die für andere Teilnehmer gar nicht sichtbar sind.
Moderationverzögerungs-Optionen Auf der Kanal Konfigurationsseite können Sie die Option “Moderationsverzögerung” einstellen:
Dieser Wert gilt als Standardwert für alle Chaträume deines Kanals.
Wird der Wert auf “0” gesetzt, wird die Funktion deaktiviert.
Wenn Sie den Wert auf eine positive ganze Zahl setzen, wird die Verzögerung in Sekunden festgelegt, die für die Nachrichten gelten soll. Der Wert sollte nicht zu hoch angesetzt werden. Idealerweise sollte er nicht mehr als ein paar Sekunden betragen (z. B. 4 oder 5 Sekunden).
Um den Wert für einen bereits bestehenden Raum zu ändern, öffnen Sie einfach das Raum-Konfigurationsmenü (oben im Chat-Fenster) und ändern Sie den Wert für die Moderationsverzögerung im Konfigurationsformular.
Warnung Derzeit gibt es bei dieser Funktion einen bekannten Fehler: Benutzer, die dem Chat beitreten, erhalten alle Nachrichten, auch solche, die noch für andere Teilnehmer ausstehen. Allerdings werden Nachrichten, die nach dem Beitritt gesendet werden, korrekt verzögert.
Tipp Sie können eine kurze Moderationsverzögerung (z.B. 1 Sekunde) mit dem Moderations-Chatbot kombinieren, um Nachrichten mit Schimpfwörtern zu löschen, bevor ein Nicht-Moderator sie sieht.
Im Chat Als Moderator sehen Sie neben dem Datum der Nachricht auch die verbleibende Zeit (in Sekunden), bevor die Nachricht veröffentlicht wird.`,description:"Plugin peertube-plugin-livechat Moderationsverzögerung",tags:[],title:"Moderationsverzögerung",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/moderation_delay/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 10.1.0 verfügbar sein.
Kanal-Emojis Streamer können benutzerdefinierte Emojis zu ihren Kanälen hinzufügen.
Öffnen Sie auf der Kanal Konfigurationsseite die Registerkarte “Kanal-Emojis”:
Sie können benutzerdefinierte Emojis für Ihren Kanal konfigurieren. Diese Emojis werden in der Emoji-Auswahl verfügbar sein. Benutzer können sie auch mit ihrem Kurznamen verwenden (z. B. indem sie “:Kurzname:” schreiben).
Sie können Emojis im Chat mit “:Kurzname:” verwenden. Der Kurzname kann mit einem Doppelpunkt (:) beginnen und/oder enden und darf nur alphanumerische Zeichen, Unterstriche und Bindestriche enthalten. Es wird dringend empfohlen, sie mit einem Doppelpunkt zu beginnen, damit die Benutzer die automatische Vervollständigung nutzen können (indem sie “:” eingeben und dann TAB drücken).
Importieren / Exportieren Auf der Kanalkonfigurationsseite gibt es eine “Importieren”- und eine “Exportieren”-Schaltfläche. Die “Exportieren”-Schaltfläche generiert eine Datei, die in einen anderen Kanal importiert werden kann.
Sie können auch eine Datei generieren, die Sie aus einer anderen Quelle importieren (z. B. können Sie Ihre benutzerdefinierten Twitch-Emojis importieren). Bei der Datei muss es sich um eine gültige JSON-Datei handeln, die das folgende Format hat:
[ { "sn": ":short_name:", "url": "https://example.com/image.png" } ] Das Attribut sn ist der Kurznamencode. Das Attribut “url” kann eine beliebige Bild-URL sein, auf die Ihr Browser zugreifen kann, oder eine [Daten-URL] (https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs), die die zu importierende Datei darstellt.`,description:"Plugin peertube-plugin-livechat benutzerdefinierte Emojis",tags:[],title:"Benutzerdefinierte Emojis",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/emojis/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 11.1.0 verfügbar sein.
Nur Emojis-Modus Sie können in Ihren Chaträumen einen “Nur-Emoji-Modus” aktivieren. Wenn dieser Modus aktiviert ist, können die Teilnehmer nur Emojis (Standard- oder kanalangepasste Emojis) senden. Moderatoren sind von dieser Einschränkung nicht betroffen.
Dieser Modus kann sehr nützlich sein, um beispielsweise:
Um Spam oder beleidigende Nachrichten zu vermeiden, wenn Sie nicht hier sind, um zu moderieren. Wenn zu viele Teilnehmer schreiben und Sie nicht mehr richtig moderieren können. Um diese Funktion zu aktivieren oder zu deaktivieren, verwenden Sie das Chat-Dropdown-Menü, öffnen Sie das Menü “Konfigurieren”. In dem Formular finden Sie eine Checkbox “Nur Emojis-Modus”.
Wenn Sie es für alle Ihre Chaträume auf einmal aktivieren möchten, öffnen Sie die Kanal Emojis Konfigurationsseite, und benutzen Sie die “Aktiviere den Modus “Nur Emoji” in allen Chaträumen des Kanals” Schaltfläche.`,description:"Plugin peertube-plugin-livechat nur Emojis Modus",tags:[],title:"Nur Emojis-Modus",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/emojis_only/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 10.2.0 verfügbar sein.
Eine Umfrage erstellen Sie können eine neue Umfrage erstellen, indem Sie die Aktion “Eine neue Umfrage erstellen” im oberen Menü des Chats verwenden:
Warnung Diese Abstimmungsfunktion sollte nicht als zuverlässiges Abstimmungssystem betrachtet werden. Es ist leicht zu betrügen. Es gibt keinen Mechanismus, der anonyme Benutzer daran hindert, mehrfach abzustimmen, indem sie einfach den Chat neu laden. Abstimmungen sind nie vollständig anonym, jemand mit Zugang zum Server könnte sehen, wer für welche Wahl gestimmt hat.
Umfrageformular Füllen Sie die Formularfelder aus:
“Frage”: die Frage, die den Zuschauern gestellt werden soll “Umfragezeit (in Minuten)”: die Dauer, in der die Zuschauer abstimmen können “Anonyme Ergebnisse”: wenn ausgewählt, werden Abstimmungen im Chat nicht öffentlich sichtbar sein “Auswahl N”: Auswahlmöglichkeiten, die den Zuschauern präsentiert werden Sie müssen mindestens die ersten beiden Auswahlfelder ausfüllen.
Sobald Sie das Formular abschicken, wird die Umfrage sofort gestartet.
Wenn es eine vorherige, noch nicht beendete Umfrage gab, wird diese beendet und ihr Ergebnis angezeigt.
Zugriffsrechte Die Administratoren eines jeden Raums können eine neue Umfrage erstellen.
Wenn Sie jemanden zum Raumadministrator oder -besitzer befördern, erhält er sofortigen Zugriff auf die Aktion “Eine neue Umfrage erstellen”.
Wenn Sie jemandem die Administrator- oder Eigentümerrechte entziehen, kann er keine neue Umfrage mehr erstellen. Bestehende Umfragen werden jedoch fortgesetzt, bis sie beendet werden.
Jeder Benutzer, der nicht stummgeschaltet ist, kann abstimmen. Das bedeutet, dass Sie anonyme Benutzer an der Abstimmung hindern können, indem Sie die Funktion “Anonyme Benutzer stummschalten” verwenden.
Umfrageablauf Wenn die Umfrage beginnt, wird eine erste Nachricht im Chat vom Konto des Benutzers, der die Umfrage erstellt, gesendet.
Außerdem wird ein Banner erscheinen, das die Umfrage anzeigt und regelmäßig mit den aktuellen Stimmen aktualisiert wird.
Die Zuschauer können dann abstimmen, indem sie auf ihre Wahl klicken oder eine Nachricht wie “!1” in den Chat schicken.
Die Anzahl der Stimmen wird regelmäßig im Banner aktualisiert.
Die Zuschauer können ihre Wahl jederzeit ändern, indem sie einfach eine neue Wahl treffen. Die vorherige Wahl wird dann durch die neue ersetzt.
Tipp Anonyme Nutzer können nur abstimmen, wenn sie ihren Nicknamen gewählt haben.
Wenn “Anonyme Ergebnisse” aktiviert ist, werden die Stimmen anderen Benutzern nicht angezeigt. Wenn diese Option nicht aktiviert ist, sind die Abstimmungen öffentlich sichtbar, da Ihnen Meldungen wie “!1” im Chat angezeigt werden.
Info Für Nutzer, die XMPP-Clients oder veraltete Livechat-Plugin-Versionen verwenden, wird das Banner nicht sichtbar sein. Sie sehen jedoch die Nachricht im Chat und können ihre Stimme abgeben, indem sie Nachrichten mit ihrer Wahl senden.
Wenn die Umfrage beendet ist, wird im Chat eine neue Nachricht mit den Ergebnissen gesendet.
Info Die einzige Möglichkeit, alte Umfrageergebnisse zu erhalten, ist die Suche nach der Nachricht über das Ende der Umfrage im Chat. Im Moment werden die Umfrageergebnisse nicht auf andere Weise gespeichert. Vergessen Sie also nicht, die Umfrageergebnisse zu notieren, wenn Sie sie behalten wollen.`,description:"Sie können Umfragen erstellen, um die Zuschauer nach ihrer Meinung zu fragen",tags:[],title:"Umfragen",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/polls/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 10.0.0 verfügbar sein.
Einführung Das Livechat Plugin enthält eine Aufgabenanwendung: eine Art “To-Do-Liste”, mit der Sie Aufgabenlisten erstellen und Aufgaben zu ihnen hinzufügen können. Die Administratoren eines jeden Raums haben Zugriff auf diese Aufgaben, sodass Sie sie gemeinsam bearbeiten können.
Sie können die Aufgabenanwendung zum Beispiel verwenden, um:
eine Liste der Themen vorzubereiten, die Sie während Ihres Livestreams besprechen möchten, damit Sie nichts vergessen Fragen Ihrer Zuschauer markieren, damit Sie später darauf zurückkommen können, ohne zu vergessen, sie zu beantworten … Aufgabenanwendung nutzen Aufgabenanwendung öffnen Um die Aufgabenanwendung zu öffnen, gibt es eine Schaltfläche "" im oberen Chatmenü:
Wenn Sie auf diese Schaltfläche klicken, wird die Anzeige der Aufgabenanwendung umgeschaltet:
Tipp Um mehr Platz und eine bessere Lesbarkeit zu erhalten, öffnen Sie den Chat im neuen Fenster.
Zugriffsrechte Die Administratoren eines jeden Raums haben Zugriff auf die Aufgabenanwendung (Lese- und Schreibzugriff).
Wenn Sie jemanden zum Raumadministrator oder -besitzer befördern, erhält dieser sofortigen Zugriff auf die Aufgabenanwendung. Wenn Sie jemandem die Admin- oder Eigentümerrechte entziehen, verliert er sofort den Zugang zur Aufgabenanwendung.
Aufgabenlisten Standardmäßig gibt es eine Aufgabenliste, die denselben Namen wie Ihr Livestream hat.
Mit dem Formular am unteren Rand können Sie eine neue Aufgabenliste erstellen. Sie können auch bestehende Aufgabenlisten über die Schaltfläche bearbeiten oder eine Aufgabenliste löschen. Wenn Sie eine Aufgabenliste löschen, werden auch alle dazugehörigen Aufgaben gelöscht.
Die Aufgabenlisten sind alphabetisch sortiert.
Tipp Alle Änderungen sind sofort in allen Registerkarten Ihres Browsers und für alle Raumadministratoren sichtbar.
Aufgaben Aufgaben erstellen Sie können eine Aufgabe über die Schaltfläche rechts neben der Aufgabenliste erstellen. Es öffnet sich ein Formular mit zwei Feldern: einem obligatorischen Aufgabennamen und einer optionalen Beschreibung.
Aufgaben bearbeiten Aufgaben können über die Schaltfläche “Bearbeiten” auf der rechten Seite bearbeitet werden.
Aufgaben können durch direktes Anklicken des Kontrollkästchens in der Liste als erledigt (oder nicht erledigt) markiert werden.
Aufgaben sortieren / Aufgabenliste ändern Sie können Aufgaben sortieren oder von einer Liste in eine andere verschieben, indem Sie sie einfach per Drag & Drop ziehen.
Erstellen einer Aufgabe aus einer Chat-Nachricht Sie können eine Aufgabe aus einer Nachricht in einem Chat erstellen, indem Sie die Schaltfläche “Eine neue Aufgabe erstellen” im Dropdown-Menü rechts neben der Nachricht verwenden. Daraufhin öffnet sich ein Dialogfeld, in dem Sie auswählen können, in welche Aufgabenliste Sie die Aufgabe aufnehmen möchten. Der Aufgabenname ist der Spitzname des Benutzers und die Aufgabenbeschreibung der Inhalt der Nachricht.
Mit dieser Funktion können Sie z. B. Ihre Moderatoren bitten, alle Chat-Fragen zu markieren, damit Sie sie während Ihres Livestreams auf einen Blick sehen und als beantwortet markieren können.`,description:"Sie können Aufgaben und Aufgabenlisten mit Ihrem Moderationsteam bearbeiten.",tags:[],title:"Aufgaben / To-do-Listen",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/tasks/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 11.0.0 verfügbar sein.
Einführung Das Livechat Plugin enthält eine Anwendung für Moderator-Notizen: Sie können einige Notizen schreiben, die den Chat-Teilnehmern zugeordnet werden können. Die Administratoren jedes Raums haben Zugriff auf diese Notizen, so dass sie diese gemeinsam bearbeiten können.
Sie können diese Anwendung zum Beispiel verwenden, um:
einige Notizen zwischen Moderatoren austauschen Notizen über Teilnehmer machen, die aus dem Chat geworfen wurden oder Probleme verursachten … Verwendung der Anwendung Moderationsnotizen Öffnen der Anwendung Moderationsnotizen Um die Anwendung Moderationsnotizen zu öffnen, gibt es eine Schaltfläche “Moderationsnotizen” im oberen Chatmenü:
Wenn Sie auf diese Schaltfläche klicken, wird die Anzeige der Anwendung umgeschaltet:
Tipp Um mehr Platz und eine bessere Lesbarkeit zu erhalten, öffnen Sie den Chat im neuen Fenster.
Zugriffsrechte Die Administratoren jedes Raums haben Zugriff auf diese Anwendung (Lese- und Schreibzugriff).
Wenn Sie jemanden zum Raumadministrator oder -besitzer befördern, erhält er sofortigen Zugang zu dieser Anwendung. Wenn Sie jemandem die Admin- oder Eigentümerrechte entziehen, verliert er sofort den Zugang zu dieser Anwendung.
Umfang Notizen sind nur in dem Raum verfügbar, in dem Sie sie erstellt haben.
Chaträume können einem Video oder einem Kanal zugeordnet werden. Wenn Sie Notizen von einem Video zum anderen aufbewahren möchten, sollten Sie Räume verwenden, die mit Kanälen verbunden sind.
Warnung Derzeit ist die Einstellung Video vs. Kanalräume eine instanzweite Einstellung. Nur Peertube-Administratoren können diese Einstellung ändern, und sie gilt für alle Chaträume. In der Zukunft wird diese Wahl in den Optionen Ihres Channels hinzugefügt werden.
Hinweise Notizen erstellen/bearbeiten Mit der Plus-Schaltfläche am oberen Rand können Sie eine neue Notiz erstellen. Sie können auch bestehende Notizen mit der Schaltfläche “Bearbeiten” bearbeiten oder jede Notiz löschen.
Tipp Alle Änderungen sind sofort in allen Registerkarten Ihres Browsers und für alle Raumadministratoren sichtbar.
Sie können eine Notiz zu einem Teilnehmer auf verschiedene Weise erstellen:
die Aktion “Eine neue Notiz erstellen” im Dropdown-Menü neben den Teilnehmern in der Seitenleiste verwenden Verwendung der Aktion “Eine neue Notiz erstellen” im Dropdown-Menü neben den Chat-Nachrichten Wenn eine Notiz mit einem Teilnehmer verknüpft ist, sehen Sie dessen Spitznamen und Avatar oben in der Notiz.
Notizen filtern Sie können die Notizen filtern, um alle Notizen zu einem bestimmten Teilnehmer zu finden, und haben dabei mehrere Möglichkeiten:
Klicken Sie auf die Schaltfläche “Notizen suchen”, die auf den Notizen verfügbar ist, um alle Notizen zu finden, die sich auf denselben Teilnehmer beziehen auf die Schaltfläche “Notizen suchen” im Dropdown-Menü neben den Teilnehmern in der Seitenleiste klicken Klicken Sie auf die Schaltfläche “Notizen suchen” im Dropdown-Menü neben den Chat-Nachrichten Sie können den Filter entfernen, indem Sie auf die Schaltfläche “Schließen” klicken.
Wenn Sie Notizen zu einem Teilnehmer filtern, werden rechts neben dem Spitznamen des Teilnehmers verschiedene Informationen angezeigt:
wenn der aktuelle Spitzname nicht mit dem Spitznamen übereinstimmt, unter dem Sie die Notiz erstellt haben, wird der ursprüngliche Spitzname angezeigt sehen Sie die JID (Jabber ID) des Teilnehmers Sie sehen auch die occupant-id des Teilnehmers Das Suchergebnis enthält auch alle Notizen zu Teilnehmern, die denselben Spitznamen hatten. Sie können also auch anonyme Benutzer (die keine einheitliche JID oder occupant-id haben) notieren. Sie können sie durch den Vergleich von JID und occupant-id unterscheiden.
Notizen sortieren Sie können Notizen einfach per Drag & Drop sortieren.`,description:"Plugin peertube-plugin-livechat Moderationnotizen",tags:[],title:"Moderationsnotizen",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/moderation_notes/index.html"},{breadcrumb:"Peertube livechat > Dokumentation > Benutzer Dokumentation > Für Streamer",content:` Info Diese Funktion wird mit dem Livechatplugin Version 8.0.0 geliefert und kann von den Administratoren Ihrer Instanz deaktiviert werden.
Sie können einen Chatbot für Ihre Chaträume aktivieren. Die Chatbotkonfiguration wird für jeden Kanal vorgenommen und gilt für alle Chaträume der zugehörigen Videos.
Um auf diese Seite zuzugreifen, sehen Sie sich die Kanal Konfigurations Dokumentation an.
Dort können Sie den Chatbot aktivieren und verschiedene Optionen einstellen:
Special charactersThe bot can automatically moderate messages containing too many special characters.
Verbotene WörterDer Chatbot kann automatisch Nachrichten moderieren, die verbotene Wörter enthalten.
TimerDer Chatbot kann in regelmäßigen Abständen einige Nachrichten senden.
BefehleDer Chatbot kann auf verschiedene Befehle reagieren.
Der Chatbot wird sofort neu geladen, wenn Sie die Seite speichern.`,description:"Chatbot Einrichtung",tags:[],title:"Chatbot",uri:"/peertube-plugin-livechat/de/documentation/user/streamers/bot/index.html"},{breadcrumb:"Peertube livechat",content:"",description:"",tags:[],title:"Kategorien",uri:"/peertube-plugin-livechat/de/categories/index.html"},{breadcrumb:"",content:` Tipp Sie können die Sprachauswahl im linken Menü verwenden, um diese Dokumentation in verschiedenen Sprachen anzuzeigen. Einige Übersetzungen fehlen oder sind unvollständig. In diesem Fall sehen Sie die englische Version des Textes.
Willkommen in der Peertube Livechat Plugin Dokumentation.
Peertube ist eine dezentrale Streaming-Plattform, die sowohl Live-Streaming als auch VOD (Video On Demand) anbieten kann. Das vorliegende Plugin fügt Ihrer Peertube-Installation Chat-Funktionen hinzu, die es den Zuschauern ermöglichen, sich mit den Streamern auszutauschen.
Um einen Einblick in die Fähigkeiten dieses Plugins zu bekommen, schauen Sie sich die Einführung an. Für genauere Informationen, finden Sie unten die Zusammenfassung dieser Dokumentation.
Tipp Sie können das Suchfeld im linken Menü verwenden, um bestimmte Teile der Dokumentation schnell zu finden.
Info Bevor Sie auf eine Hauptversion aktualisieren, lesen Sie bitte die Versionshinweise und die Liste der wichtigsten Änderungen : CHANGELOG.
EinführungEinführung
DokumentationPlugin Dokumentation
Benutzer DokumentationPlugin peertube-plugin-livechat Benutzer Dokumentation
Für ZuschauerWie man chattet für Live-Stream Zuschauer
OBSDokumentation zum Streamen des Chat-Inhalts mit OBS.
XMPP ClientsVerbindung zum Chat über einen XMPP-Client
Für StreamerSo richten Sie den Chat für Ihren Live-Stream ein
Einige GrundlagenEinige grundlegende Informationen zur Einrichtung und Nutzung des Chats für Ihren Livestream
KanalkonfigurationPeertube Kanal Chaträume Konfiguration
ModerationPlugin peertube-plugin-livechat Erweiterte Moderationsfunktionen
NutzungsbedingungenKonfigurieren Sie die Chat-Nutzungsbedingungen für den Kanal
Langsamer ModusPlugin peertube-plugin-livechat Langsamer Modus
ModerationsverzögerungPlugin peertube-plugin-livechat Moderationsverzögerung
Benutzerdefinierte EmojisPlugin peertube-plugin-livechat benutzerdefinierte Emojis
Nur Emojis-ModusPlugin peertube-plugin-livechat nur Emojis Modus
UmfragenSie können Umfragen erstellen, um die Zuschauer nach ihrer Meinung zu fragen
Aufgaben / To-do-ListenSie können Aufgaben und Aufgabenlisten mit Ihrem Moderationsteam bearbeiten.
ModerationsnotizenPlugin peertube-plugin-livechat Moderationnotizen
ChatbotChatbot Einrichtung
InstallationsanleitungPlugin peertube-plugin-livechat Installationsanleitung
FehlerbehebungEinige klassische Fehler und Umgehungsmöglichkeiten.
Bekannte Probleme: CPU KompatibilitätDerzeit funktioniert das Plugin standartmäßig nur für x86_64 und arm64 CPU Architekturen. Hier sind einige Anleitungen für andere CPU Architekturen.
Aktualisieren von Versionen vor 6.0.0Wichtige Hinweise zum aktualisieren von älteren Versionen.
Admin DokumentationPlugin Peertube Livechat Administation
EinstellungenPlugin Peertube Livechat Einstellungen
Externe AuthentifizierungPlugin Peertube Livechat Einstellungen - Externe Authentifizierung
Prosody mod_firewallErweiterte Firewall-Regeln für den Prosody-Server
Fortgeschrittene NutzungEinige erweiterte Funktionen
XMPP-ClientsVerbindungen über XMPP-Clients zulassen
Matterbridge benutzenMatterbridge als Brücke zu anderen Chats nutzen
BeitragenBeitragen
VerhaltenskodexVereinbarung über Verhaltenskodex für Mitwirkende
ÜbersätzenDas Plugin übersetzen
Geben Sie Ihr FeedbackGeben Sie Ihr Feedback
EntwickelnEntwickeln
DokumentationDokumentieren Sie das Plugin, oder übersetzen Sie die Dokumentation.
Fehlerverfolgung (Bug tracking) und neue FunktionenFehler (Bugs) / Neue Funktionsanfragen
Technical documentationTechnical documentation
Source codeSource code organization
Third partyDisplaying the livechat with 3rd party software.
Plugin storageData files and folders used on the server
MUC Slow modeMUC Slow mode XEP
Terms&ConditionsTerms&Conditions implementation
UmfragenPolls technical documentation
Tasks overviewTask Application technical overview
Moderator notes overviewModerator Notes Application technical overview
Kontaktieren Sie michDen Autor kontaktieren
ImpressumImpressum des Plugins`,description:"Peertube Plugin Livechat Dokumentation",tags:[],title:"Peertube livechat",uri:"/peertube-plugin-livechat/de/index.html"},{breadcrumb:"Peertube livechat",content:"",description:"",tags:[],title:"Stichworte",uri:"/peertube-plugin-livechat/de/tags/index.html"}]