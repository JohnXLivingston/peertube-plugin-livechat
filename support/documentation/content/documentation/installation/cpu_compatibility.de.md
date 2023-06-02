+++
title="Bekannte Probleme: CPU Kompatibilität"
description="Derzeit funktioniert das Plugin standartmäßig nur für x86_64 CPU Architekturen. Hier sind einige Anleitungen für andere CPU Architekturen."
weight=10
chapter=false
+++

Das im Plugin enthaltene Prosody AppImage funktioniert nur mit x86_64 und arm64 CPU Architekturen.
Es ist nicht kompatibel mit anderen CPU-Architekturen.

Um das Plugin zu verwenden, müssen Sie Prosody manuell auf Ihrem Server installieren
(siehe unten).

Note: the plugin requires Prosody >= 0.12.0.
If you are using an older version, Chat Federation could be broken, and it could have some unexpected behaviour.

Sobald dies geschehen ist, müssen Sie in den Plugin-Einstellungen das Häkchen bei `Use system Prosody` setzen.

## Nicht-Docker Peertube installation

Für die Standardinstallation müssen Sie nur das offizielle `prosody`-Paket für Ihre Linux-Distribution installieren.

Zum Beispiel, auf Debian/Ubuntu:

```bash
sudo apt install prosody
```

Sie können dann den Dienst deaktivieren, der automatisch startet, wenn Sie Prosody installieren (das Plugin startet einen Prosody-Prozess, der Dienst muss nicht dauerhaft laufen).
Zum Beispiel unter Debian/Ubuntu (und anderen Systemd-basierten Linux-Distributionen):

```bash
sudo systemctl disable prosody && sudo systemctl stop prosody
```

Achtung: Deaktivieren Sie Prosody nicht, wenn es für einen anderen Dienst auf Ihrem Server verwendet wird, wie zum Beispiel Jitsi.

## Docker

Sie müssen ein Peertube-Image generieren, das Prosody in demselben
Container enthält, der auch Peertube beinhaltet.
Ich weiß, dass dies nicht der Standardweg ist, um dies mit Docker zu tun, aber bedenken Sie, dass eine vorübergehende Lösung ist.

Um ein solches Image zu erzeugen und zu verwenden, lesen Sie bitte die Docker-Dokumentation.
Die Docker-Datei, um das Paket zu erzeugen, sollte wie folgt sein:

```Docker
FROM chocobozzz/peertube:production-bullseye

RUN apt -y update && apt install -y prosody && apt -y clean
```

## Yunohost

Sie müssen `metronome` (der von Yunohost bereitgestellte XMPP-Server) deaktivieren, und `prosody` installieren.

Dies wird bereits von der Yunohost Peertube Anwendung gemacht, da es für das Plugin vor v6.0.0 erforderlich war.
Es kann aber sein, dass es in naher Zukunft entfernt wird (um die Nachteile dieser Methode zu vermeiden).
Ich muss mit dem Yunohost Team diskutieren, um zu entscheiden, wie wir die Nachteile minimieren können, und die Kompatibilität zu maximieren.