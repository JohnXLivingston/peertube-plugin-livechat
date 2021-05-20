# Roadmap

## May 2021

This roadmap is given as an indication. It will be updated as we go along according to the constraints encountered.

| Done | Needs Peertube 3.2 | Component | Feature | Released in version
---|---|---|---|---
[x] | [ ] | Builtin Prosody | Check room creation permission, and set some metadata. | v2.1.0
[x] | [ ] | Builtin Prosody | User authentication: if the user is logged in Peertube, use his nickname. | v2.1.0
[x] | [ ] | Builtin Prosody | Grant moderation rights to instance admins and video owner. Activate moderations commands in ConverseJS. | v2.1.0
[x] | [x] | Common | Chat should not be displayed in playlists | v2.2.0
[x] | [x] | Builtin Prosody | Do not use a temp folder, use the one provided by Peertube>=3.2.0. | Not Released Yet
[x] | [ ] | Builtin Prosody | Use Peertube log level for prosody. | Not Released Yet
[ ] | [x] | Builtin Prosody | Rotate prosody logs. | Not Released Yet
[x] | [x] | Builtin Prosody | Data Persistence | Not Released Yet
[ ] | [x] | Common | Add a checkbox per video to activate livechat. Only on lives.
[ ] | [x] | Builtin Prosody | Docker: check how to install and use Prosody on docker installations. Do the documentation.
[ ] | [ ] | Builtin Prosody | Check with yunohost how to integrate.
[ ] | [ ] | Documentation | Rewrite documentation for more clarity. Add screenshots. Separate user and admin documentation.
[ ] | [ ] | ConverseJS | UI: make custom templates, for a better UI/UX. Autoshow muc participants depending on the chat window width.
[x] | [ ] | Builtin Prosody | Allow moderators to delete messages (mod_muc_moderation). | Not Released Yet
[ ] | [ ] | ConverseJS | For anonymous user, automatically log in with a random nickname (and allow to change afterward)
[ ] | [x] | JS | Modernise code to use new placeholders provided by Peertube 3.2.0 (with or without backward compatibility)
[ ] | [x] | Settings | Restore default values for some checkbox to true (see [this bug](https://github.com/Chocobozzz/PeerTube/issues/4106))
[ ] | [x] | Settings | Replace some checkbox by a select (for the webchat mode). Migrate old checkbox values.
[ ] | [x] | Settings | Dynamic settings screen. Inline help/documentation. | First changes in v2.2.0

## Later / low priority modifications

| Done | Needs Peertube 3.2 | Component | Feature
---|---|---|---
[ ] | [ ] | Common | There should be a settings to add terms & conditions in the Peertube's about page (for example if the webchat is hosted anywhere else).
[ ] | [ ] | Builtin Prosody | Add a page with a non-singleton ConverseJS, to browser chat rooms for admins. Maybe allow direct chating between admins, and room creation?
[ ] | [ ] | Builtin Prosody | Add a settings to enable the server to be accessed with XMPP clients.
