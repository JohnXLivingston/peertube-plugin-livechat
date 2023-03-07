+++
title="Dokumentation"
description="Dokumentieren Sie das Plugin, oder übersetzen Sie die Dokumentation."
weight=50
chapter=false
+++

## Allgemeine Informationen

Informieren Sie die Community immer vor der Arbeit (indem Sie ein neues Problem erstellen oder ein bestehendes kommentieren). Damit soll vermieden werden, dass zwei Personen
an der gleichen Sache arbeiten, und Konflikte zu verhindern.

Bitte benutzen Sie den `main`-Zweig.

Der Quellcode der Dokumentation befindet sich im Ordner `support/documentation/content`.

Die Dokumentation wird mit [Hugo](https://gohugo.io/) erstellt.
Sie müssen es auf Ihrem Computer installieren, wenn Sie eine Vorschau Ihrer Arbeit sehen wollen.

Das verwendete Thema ist [hugo-theme-learn](https://learn.netlify.app/).
Sie sollten dessen Dokumentation lesen, bevor Sie mit der Bearbeitung der Dokumentation beginnen.

When a new plugin version is released, or when documentation is updated,
plugin maintainers will merge the `main` branch to the `documentation` branche.
This will trigger github and gitlab pipelines, and update published documentation.

## Übersätzungen

Die Hauptsprache ist Englisch (Code `en`).

Die verschiedenen Übersetzungen der gleichen Datei stehen nebeneinander im Verzeichnis und sind durch einen Sprachcode in der Dateinamenerweiterung gekennzeichnet.
Beispiel: `_index.fr.md` ist die französische Übersetzung von `_index.en.md`.

Bitte beachten Sie, dass eine fehlende Übersetzungsdatei nicht in den Menüs der generierten Website erscheint.

**Stellen Sie sicher, dass Sie immer alle Dateien für die Sprachen erstellen**, auch wenn die Übersetzung noch nicht verfügbar ist.

Dafür gibt es ein Skript `doc-generate-missing-translations.sh` im Stammverzeichnis des Projektes. Wenn Sie eine neue Datei hinzufügen, müssen Sie nur die englische Version erstellen und dann dieses Skript ausführen. Es erstellt alle fehlenden Übersetzungen und fügt eine Beispielmeldung hinzu, die den Benutzer auffordert, die englische Version zu lesen.

## Eine neue Sprache hinzufügen

Kopieren und ändern Sie den Abschnitt `[Languages.fr]` in der Datei `support/documentation/config.toml`.

Führen Sie dann das Skript `doc-generate-missing-translations.sh` aus.
Es wird alle fehlenden Dateien erstellen.

Dann können Sie sie eine Datei nach der anderen übersetzen.
Wenn die Übersetzungen nicht vollständig sind, macht das nichts, die generierten Dateien zeigen eine Meldung an, die vorschlägt, die Sprache zu ändern.

## Vorschau

Um eine Vorschau Ihrer Änderungen zu sehen, führen Sie einfach diesen Befehl aus:

```bash
hugo serve -s support/documentation/
```

Öffnen Sie dann Ihren Browser und gehen Sie auf die Adresse
[http://localhost:1313/peertube-plugin-livechat/](http://localhost:1313/peertube-plugin-livechat/).
Diese Seite wird bei jeder Änderung automatisch aktualisiert.

## Veröffentlichung

Die Veröffentlichung der Dokumentation erfolgt automatisch, sobald die Änderungen in den `main` Zweig eingefügt wurden.
