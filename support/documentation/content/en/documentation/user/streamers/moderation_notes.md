---
title: "Moderation notes"
description: "Plugin peertube-plugin-livechat moderation notes"
weight: 355
chapter: false
---

{{% livechat_version_notice  11.0.0 %}}

## Introduction

The livechat plugin includes a Moderator Notes Application: you can write some notes, that could be associated to chat participants.
Every room's admins have access to these notes, so they can edit them collaboratively.

You can for example use this Application to:

* share some notes between moderators
* take notes about participants that were kicked or caused troubles
* ...

## Using the Moderator Notes Application

### Opening the Moderator Notes Application

To open the Moderator Notes Application, there is a "{{% livechat_label "moderator_notes" %}}" button in the top chat menu:

![Screenshot of a Peertube video, with the chat on the right. The chat top menu is open, with a "{{% livechat_label "moderator_notes" %}}" button.](/peertube-plugin-livechat/images/moderation_notes_open_app_video.png?classes=shadow,border&height=200px "Opening the Moderator Notes Application")

![Screenshot of a Peertube chat, fullscreen. The chat top menu open, with a "{{% livechat_label "moderator_notes" %}}" button.](/peertube-plugin-livechat/images/moderation_notes_open_app_fullpage.png?classes=shadow,border&height=200px "Opening the Moderator Notes Application")

Clicking this button will toggle the Application display:

![Screenshot of a Peertube video, with the chat on the right. The moderation notes application is open. There are several notes, some of them are associated to users.](/peertube-plugin-livechat/images/moderator_notes_app_video_1.png?classes=shadow,border&height=200px "Moderator Notes Application")

![Screenshot of a Peertube chat, fullscreen. The moderation notes application is open. There are several notes, some of them are associated to users.](/peertube-plugin-livechat/images/moderator_notes_app_fullpage_1.png?classes=shadow,border&height=200px "Moderator Notes Application")

{{% notice tip %}}
To have more space and better readability, open the chat in full-page mode.
{{% /notice %}}

### Access rights

Every room's admins have access to this Application (read and write access).

When you promote someone as room admin or owner, they gets instant access to this Application.
When you remove admin or owner rights to someone, they instantly lose access to this Application.

### Scope

Notes are only available in the room in which you have created them.

Chatrooms can be releated to video or channel.
If you want to keep notes from one video to another, please consider using rooms associated to channels.

{{% notice warning %}}
Currently the video vs channel rooms is an instance-wide settings.
Only Peertube admins can change it, and it applies to all chatrooms.
In the future, this choice will be added in your channel's options.
{{% /notice %}}

### Notes

#### Create/Edit Notes

You can use the plus button on the top to create a new note.
You can also edit existing notes using the edit button, or delate any note.

{{% notice tip %}}
All modification are instantly visible in all your browser tabs, and for all room's admins.
{{% /notice %}}

You can create a note associated to a participant in several ways:

* using the "{{% livechat_label moderator_note_create_for_participant %}}" action in the dropdown menu besides participants in the sidebar
* using the "{{% livechat_label moderator_note_create_for_participant %}}" action in the dropdown menu besides chat messages

When a note is associated to a participant, you will see their nickname and avatar on the top of the note.

#### Notes filtering

You can filter notes to find all notes related to a given participant in several ways:

* click on the "{{% livechat_label moderator_note_search_for_participant %}}" button that is available on notes to find all notes related to the same participant
* click on the "{{% livechat_label moderator_note_search_for_participant %}}" button in the dropdown menu besides participants in the sidebar
* click on the "{{% livechat_label moderator_note_search_for_participant %}}" button in the dropdown menu besides chat messages

You can remove the filter by clicking on the close button.

![Screenshot of the note application, with a filter enabled for user "Mike". The only notes that are shown are the notes for the Mike user.](/peertube-plugin-livechat/images/moderation_notes_filters.png?classes=shadow,border&height=200px "Moderator Notes Application - filtering")

When you filters notes on a participant, there are several informations that are shown at the right of the participant nickname:

* if the current nickname is different than the nickname when you created the note, the original nickname will be shown
* you will see the [JID (Jabber ID)](https://xmpp.org/extensions/xep-0029.html) of the participant
* you will also see the [occupant-id](https://xmpp.org/extensions/xep-0421.html) of the participant

The search result will also include all notes related to participants who had the same nickname.
So you can also take note for anonymous users (who don't have any consistent JID or occupant-id).
You can differenciate them by comparing JID and occupant-id.

#### Sorting notes

You can sort notes simply using drag & drop.
