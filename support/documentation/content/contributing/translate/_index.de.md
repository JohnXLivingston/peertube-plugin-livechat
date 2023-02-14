+++
title="Übersätzen"
description="Das Plugin übersätzen"
weight=20
chapter=false
+++

Sie können uns helfen, dieses PeerTube-Plugin zu übersetzen, indem Sie Übersetzungsdateien im Ordner `languages` erstellen oder ändern.

Bitte arbeiten Sie auf dem `develop` Zweig, und machen Sie Ihre Änderungen und Pull Requests auf diesem Zweig.

Wenn die Sprache, für die Sie sich interessieren, noch nicht existiert, erstellen Sie eine Datei `code.json` im Ordner `languages`, wobei `code` der Code der Sprache ist.
Der Sprachcode muss derselbe sein wie der Sprachcode von Peertube (siehe [Peertube-Dokumentation](https://github.com/Chocobozzz/PeerTube/blob/develop/support/doc/translation.md)).
Fügen Sie dann die Sprachdatei in der Datei `package.json` unter dem Schlüssel `translations` hinzu.

Die Übersetzungen werden wie folgt in der Sprachdatei festgelegt:

- die Dateien sind im [JSON Format](https://www.json.org)
- der JSON Schlüssel ist der englische Text (Siehe die bestehenden Schlüssel in der [französischen Übersätzungsdatei](languages/fr.json)).
- der JSON Wert ist der übersätzte Text
- Hinweis: Es gibt keine englische Übersätzungsdatei (So funktionieren Übersätzungen für Peertube Plugins)