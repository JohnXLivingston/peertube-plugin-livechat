# Roadmap

## May 2021

This roadmap is given as an indication. It will be updated as we go along according to the constraints encountered.

| Done | Needs Peertube 3.2 | Component | Feature | Released in version
---|---|---|---|---
[x] | [ ] | Builtin Prosody | Check room creation permission, and set some metadata. | v2.1.0
[x] | [ ] | Builtin Prosody | User authentication: if the user is logged in Peertube, use his nickname. | v2.1.0
[x] | [ ] | Builtin Prosody | Grant moderation rights to instance admins and video owner. Activate moderations commands in ConverseJS. | v2.1.0
[x] | [x] | Common | Chat should not be displayed in playlists | v2.2.0
[x] | [x] | Builtin Prosody | Do not use a temp folder, use the one provided by Peertube>=3.2.0. | v2.3.0
[x] | [ ] | Builtin Prosody | Use Peertube log level for prosody. | v2.3.0
[.] | [x] | Builtin Prosody | Rotate prosody logs. | v2.3.0 (WIP)
[x] | [x] | Builtin Prosody | Data Persistence | v2.3.0
[x] | [x] | Common | Add a checkbox per video to activate livechat. Only on lives. | Not Released Yet
[x] | [x] | Builtin Prosody | Docker: check how to install and use Prosody on docker installations. Do the documentation. | Not Released Yet
[x] | [ ] | Builtin Prosody | Allow moderators to delete messages (mod_muc_moderation). | v2.3.0
[x] | [x] | JS | Modernise code to use new placeholders provided by Peertube 3.2.0 (with or without backward compatibility) | v2.3.0
[x] | [x] | Settings | Restore default values for some checkbox to true (see [this bug](https://github.com/Chocobozzz/PeerTube/issues/4106)) | Not Released Yet
[x] | [x] | Settings | Replace some checkbox by a select (for the webchat mode). Migrate old checkbox values. | Not Released Yet
[x] | [x] | Settings | Dynamic settings screen. Inline help/documentation. | First changes in v2.2.0. Done in v3.0.0

## June 2021 and later

| Done | Component | Feature | Released in version
---|---|---|---
[x] | Documentation | Rewrite documentation for more clarity. | v3.0.0
[ ] | Documentation | Add screenshots.
[ ] | Documentation | User documentation.
[.] | Builtin Prosody | Room administration: add a button in the plugin settings to open a modal with existing rooms list. TODO: use a modal. | v3.2.0
[ ] | Builtin Prosody | Check with yunohost how to integrate.
[ ] | Settings | Translate settings page.
[ ] | ConverseJS | UI: make custom templates, for a better UI/UX. Autoshow muc participants depending on the chat window width.
[ ] | Builtin Prosody | Add a settings to enable the server to be accessed with XMPP clients.
[ ] | ConverseJS | For anonymous user, automatically log in with a random nickname (and allow to change afterward)
[ ] | Common | There should be a settings to add terms & conditions in the Peertube's about page (for example if the webchat is hosted anywhere else).
[ ] | Builtin Prosody | Add on option to limit webchat to registered users.
[ ] | Builtin Prosody (or all modes?) | Offer a way for users to have a webchat per channel. See [#59](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/58).
[ ] | Common | Handle federation: if video is remote, then try to check if the plugin is installed on the instance, and open it. | 