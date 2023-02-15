+++
title="OBS"
description="Documentation to stream the chat content using OBS."
weight=10
chapter=false
+++

## OBS Overlay

Falls Sie OBS zum Streaming verwenden, können Sie den Chat ganz einfach in Ihren Stream integrieren.

Sie können die Funktion «Chat Link teilen» verwenden, um einen Link zu Ihrem Chat zu erstellen.
Die Schaltfläche sollte sich in der Nähe des Chats befinden, wenn Sie der Eigentümer des Videos sind (es sei denn, sie wurde von der Server-Administration deaktiviert).

Aktivieren Sie das Feld «schreibgeschützt» in dem Dialogfenster.
Verwenden Sie dann diesen Link als «Browser Quelle» in OBS.

Sie können die Option «Transparenter Hintergrund» verwenden, um einen transparenten Hintergrund in OBS zu erhalten.
Wenn Sie die Hintergrundtransparenz anpassen möchten, können Sie diesen CSS-Code in den Einstellungen Ihrer OBS-Browserquelle hinzufügen:

```css
:root {
  --livechat-transparent: rgba(255 255 255 / 90%) !important;
}
```

Hinweis: Sie können die Farben anpassen. Dies ist noch nicht dokumentiert, aber Sie können dies versuchen:
Aktivieren Sie im Dialogfenster die Option «Aktuelle Themenfarben verwenden», und versuchen Sie dann, die Farbwerte in dem Link manuell zu ändern.
Sie müssen gültige CSS-Farbwerte verwenden, und diese müssen in dem Link korrekt kodiert sein.

## Mehrere Chats in Ihrem Live-Stream kombinieren

Sie können die [social_stream browser extension](https://github.com/steveseguin/social_stream#readme) verwenden, um mehrere Chat-Quellen (von Peertube, Twitch, Youtube, Facebook, ...) zu mischen und deren Inhalte in Ihren Live-Stream zu integrieren.
Die Kompatibilität mit diesem Plugin wurde in den letzten Versionen hinzugefügt.