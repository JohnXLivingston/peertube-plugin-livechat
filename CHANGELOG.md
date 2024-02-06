# Changelog

## ??? (Not Released Yet)

### Minor changes and fixes

* Anonymous chat user: remember the chosen nickname in localStorage, to avoid entering it again too often. Nickname will expire after 12 hours.
* Fix: if an anonymous chat user enter spaces in the nickname choice, it allowed them to keep the random nickname.
* Authenticated users: if current user nickname is already used in the room, automatically add a suffix.
* UX: add a label ('Choose a nickname to enter') for the anonymous nickname prompt. Fix #287.
* Translation updates: Arabic, German, French, Swedish, Spanish.
* New Swedish translations.
* UI/UX improvements:
  * hide nickname changes when previous nickname was like "Anonymous 12345". Helps to improve performances when massive anonymous users are joining (#138), and prevent displaying unnecessary messages (#111).
  * display anonymous users at the end of the participants list (Fix #136)
  * don't group "followup" messages, and always display avatar/nickname/datetime besides messages, even when it is the same user as previous one (#305)
* Using patched ConverseJS for performance improvement (related to #96):
  * debounce MUC sidebar rendering in ConverseJS (Fix #138)
  * force history pruning, even if messages keep coming (Fix #140)
* Prosody: disabling message carbons for anonymous users (See #295)
* Peertube users avatars optimization (Fix #303):
  * avoid multiple parallel request to load same avatar from Peertube
  * send "item-not-found" stanza when no avatar, instead of a vCard without avatar

## 8.0.4

### Minor changes and fixes

* Updated spanish translations.
* ConverseJS: using `prune_messages_above` to purge old messages, keeping only last 100 (Fix #140).
* NPM packages security fixes.

## 8.0.3

### Minor changes and fixes

* Peertube v6.0.0 compatibility:
  * xmpp avatars: using account.avatars if account.avatar is not available (Fix #275).
  * chatrooms screen: using channel.avatars if channel.avatar is not available (Fix #276).
* Translation updates: German, Dutch, Japanese, Basque.
* Security fix for npm packages (only used for building, does not impact the produced package).

## 8.0.2

### Minor changes and fixes

* On some Ubuntu server, the self-signed certificates generation fails:
  * See [issue #268](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/268)
  * This prevents the bot to connect to the server
  * As a fallback, we directly call openssl to generate the certificates

## 8.0.1

### Minor changes and fixes

* Channel configuration:
  * Fix dark mode for buttons.
  * Fix buttons margin.
  * Don't validate hidden fields.
  * Fix disabling bot.
* Help button on top of the "channels" page.
* Renaming "pre-recorded message" to "timers".

## 8.0.0

### New features

* Moderation bot (experimental new feature):
  * New "chatrooms" menu, accessible to all users
  * In this menu, user's channels are listed
  * For each channel, there is a new screen where you can setup new channel's chatroom options
  * These options applies to all channel's video that have livechat activated
  * For now, there are options related to the new Moderation Bot:
    * you can make it auto-delete messages containing "forbidden words",
    * make it send pre-recorded messages every X minutes,
    * respond message to custom commands.
    * many other features will be available in future releases!
* New settings: "Ban anonymous user's IP when user is banned from a chatroom":
  * if enabled, every time a streamer bans an anonymous user, it will ban its IP on the chat server,
  * banned IPs are logged on disk, so server's admin can use them to feed fail2ban (for example),
  * option disabled by default, because could be used to create trapped-rooms on public servers

### Minor changes and fixes

* ConverseJS v10.1.6 (instead of v10.0.0).
* New polish translation (Thanks [ewm](https://weblate.framasoft.org/user/ewm/)).
* Links to documentation are now using the front-end language to point to the translated documentation page (except for some links generated from the backend, in the diagnostic tool for example).
* Some code refactoring.
* You can now configure on which network interfaces Prosody will listen for external components.
* Prosody: removing the BOSH module from the global scope (must only be present on relevant virtualhosts).

## 7.2.2

### Minor changes and fixes

* Some code refactoring.
* Bypassing Nginx for API call originated from Prosody (if Peertube >=5.1). Can also fix some Docker setup, which needed to set the prosody-peertube-uri settings.
* Translation updates.
* The Prosody AppImage is no more built in this plugin, but downloaded from [prosody-appimage](https://github.com/JohnXLivingston/prosody-appimage).

## 7.2.1

### Minor changes and fixes

* Fix link to documentation in french.
* Adding a help button in the share chat modal.

## 7.2.0

### New Features

* Adding a help button on top of the chat, that links to the online documentation on frama.io.
* Implementing the [FEP-1970](https://codeberg.org/fediverse/fep/src/branch/main/fep/1970/fep-1970.md) draft for ActivityPub chat declaration.
* Podcast RSS feed support (thanks to [Alecks Gates](https://github.com/agates)).

### Minor changes and fixes

* Translation updates.
* Documentation can now also be translated using [Weblate](https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/).
* Documentation can use hugo shortcode livechat_label to get application strings.
* Replaced github.io documentation links by frama.io documentation.
* Adding links to the documentation in the diagnostic tool.

## 7.1.0

### Minor changes and fixes

* Translations are now made using [Weblate](https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/). This requires some technical changes, but there is no functional differences.
* Translation updates.

## 7.0.2

* Fix: Letsencrypt certificate import procedure was not working on server that had never installed Prosody. Adding `prosody_user` in the Prosody configuration file to fix this. Updating the procedure: the `chown` is no more needed in `/etc/letsencrypt/renewal-hooks/deploy/prosody.sh`.

## 7.0.1

* Fix: trying to connect to a remote instance using direct s2s won't work if local instance has not the feature enabled, and if the remote instance does not know the local one. So using Websocket S2S in such case (that embed a discovery mecanism).

## 7.0.0

### Importante Notes

If you enabled external XMPP connection with plugin v6.3.0,
and are not using the standard 5269 port, you must add and additional DNS SRV record.
Check the [documentation](https://johnxlivingston.github.io/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/).

If you are using arm64 CPU, you no longer need to manually install Prosody on your server.
You can now uncheck the "use system prosody" option, and uninstall Prosody if you don't use it for anything else.

If you are using ["system Prosody"](https://johnxlivingston.github.io/peertube-plugin-livechat/documentation/admin/settings/#use-system-prosody),
please not that this version will only properly work with Prosody >= 0.12.0.
If you are using an older version, Chat Federation could be broken, and it could have some unexpected behaviour.

### New Features

* Chat Federation:
  * You can now connect to a remote chat with your local account.
  * This remote connection is done using a custom implementation of [XEP-0468: WebSocket S2S](https://xmpp.org/extensions/xep-0468.html), using some specific discovering method (so that it will work without any DNS configuration).
  * If the remote instance has configured external XMPP connections, it will use legacy S2S connection instead of Websocket S2S.
  * The discovering methods are experimental and temporary. They will be replaced by something that uses XMPP standards in a later release.
* ARM64 CPU support! The Prosody builtin AppImage is now compatible with ARM64 CPU.

### Minor changes and fixes

* Possibility to debug Prosody in development environments.
* Using process.spawn instead of process.exec to launch Prosody (safer, and more optimal).
* Prosody AppImage: fix path mapping: we only map necessary /etc/ subdir, so that the AppImage can access to /etc/resolv.conf, /etc/hosts, ...
* Prosody AppImage: hidden debug mode to disable lua-unbound, that seems broken in some docker dev environments.
* Debug Mode: can change some parameters.
* Fix use case where self-signed certificates are missing.
* Prosody recommended version is now 0.12.x.

## 6.3.0

### New Features

* Chat Federation !
  * This version of the plugin is the first that enables chat between Peertube instances.
  * This feature is a first beta release. It will be improved.
  * This feature requires Peertube >= 5.1.0. The plugin is still compatible with previous version, but the chat federation won't work.
  * By default, chat of video hosted on your instance will be shown on remote instances. You can disable this in the plugin settings.
  * By default, user from your instance will see remote chats. You can disable remote chats in the plugin settings.
  * When a user from your instance joins a remote chat, it will use your local ConverseJS, and will connect directly on the remote instance, as an anonymous XMPP user. If the user is logged-in on your instance, it will use his nickname by default (if available).
* XMPP clients: you can now allow connection to rooms using external XMPP accounts and XMPP clients. Please note that this feature might require some server configuration to be available. Please refer to the [documentation](https://johnxlivingston.github.io/peertube-plugin-livechat/documentation/admin/advanced/xmpp_clients/) for more informations.

### Minor changes and fixes

* Diagnostic tool: add the result of `prosodyctl check` in the debug section.
* New debug mode
* Fix room topic: due to a [bug in mod_muc_http_defaults](https://hg.prosody.im/prosody-modules/rev/6d99ddd99694), room topics were badly configured. The plugin will fix them at startup, and stops trying to set the subject.
* Fix Peertube crash when someone attemps to connect to Websocket endpoint during plugin initialization.

## 6.2.3

### Minor changes and fixes

* Fix italian translation.

## 6.2.2

### Minor changes and fixes

* Fix italian translation.

## 6.2.1

### Minor changes and fixes

* Italian settings page translation (thanks [lost-geographer](https://github.com/lost-geographer)).
* Various translation fixes in french and english (thanks [lost-geographer](https://github.com/lost-geographer)).
* Update npm dependencies with security fixes.

## 6.2.0

### New Features

* Settings page translations:
  * english,
  * french,
  * german (thanks [Gamemap](https://github.com/Gamemap))

### Minor changes and fixes

* Updating a link to the documentation in the settings page.
* Moving `public/images` dir to `assets/images`, because it conflicts with gitlab CI/CD for documentation. Moving `assets/styles.css` to `assets/styles/styles.css`.

## 6.1.0

### Important Notes

If you haven't upgraded to v6.0.0 yet, please read v6.0.0 changelog first.

### New Features

* Share chat link popup: add an option to generate an iframe. #110 #92

### Changes

* Minimum Peertube version is now v4.2.0.
* ConverseJS: Don't send state notifications. #134
* ConverseJS: Don't show join/leave messages. #134
* ConverseJS: remove browser notifications, and browser tab message count.
* ConverseJS: in readonly mode, don't show any info messages (except when disconnected).

### Minor changes and fixes

* Update @types/peertube to v4.2.2 (requiring Peertube v4.2.0).
* Using ESBuild for front-end packing, instead of webpack. Note: for now webpack is still used for ConverseJS.
* Updating NPM dependencies.

## 6.0.0

### Breaking changes

Following modes are removed:

* Connect to an existing XMPP server with ConverseJS
* Use an external web chat tool

The only remaining mode is the recommanded one: «Prosody server controlled by Peertube».

These modes were here for historical reasons (backward compatibility, etc.).
But they became difficult to maintain, and impossible to document (adding a lot of confusion).

Moreover, it seems that they weren't really used.

**Note:** If you were using one of the 2 removed modes, or if you disabled the plugin in the settings,
the server will try to use the new mode after updating the plugin.
If you don't want the chat server to be active, just uninstall the plugin
(settings won't be lost, you just have to download it again).

### Important Notes

This version of the plugin comes with a builtin Prosody AppImage.

If you were using this plugin before this version, and if you had installed Prosody manually,
you can safely uninstall Prosody.

If you were using the custom Peertube docker image that is embedding Prosody, you can switch back to the official
Peertube image.

#### Known issues

The Prosody AppImage will only work on x86_64 CPU.
It is not compatible with arm64 and other CPU architectures.

For now, I did not manage to make it work for other CPU architectures.
If you want te be notified when it will be possible, you can subscribe and comment this
[issue](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/124).

In the meantime, you can use the plugin by [manually installing Prosody](documentation/installation.md) on your server
(as for version priori to v6.0.0).

### New Features

* Removed deprecated modes, only keeping «Prosody server controlled by Peertube».
* BOSH proxy optimization + enabling websocket.
* Builtin Prosody 0.12.1 AppImage. No more manual installation required.

### Changes

* ConverseJS v10.0.0 (instead of v9.0.0).
* Prosody server: enabling mod_disco.
* Settings page re-ordered.
* Cleaning deprecated documentation.
* Removing the code of the Docker image, as it is no more needed.
* Japanese translations (thanks [fusengum](https://github.com/fusengum)).

### Minor changes and fixes

* Fix «autocolor» mecanism when no color provided (raised an error).
* Fix #73: deleted message are shown when loading history.
* Implements #37: diagnostic tools includes last lines from prosody error log files.

## 5.7.1

* Adding an easy way to customize background transparency in OBS and co.

## 5.7.0

### New features

* You can disable the chat for anonymous users (users that are not connected to your Peertube instance).
  * Note: this is a first version of this feature, released to quickly help some Peertube admins that are facing spam attacks.
  * The chat will not be visible at all for anonymous users.
  * In a future release, the chat will be replaced by a message saying «please log in to [...]».
  * If you are not using the «Prosody controlled by Peertube» mode, this settings is not a real security feature. An attacker could easily find the chat uri and join it.

## 5.6.0

### Important notes

Following modes are deprecated and will be soon removed (in version 6.0.0, scheduled for may or june 2022):

* Connect to an existing XMPP server with ConverseJS
* Use an external web chat tool

The only remaining mode will be the recommanded one: «Prosody server controlled by Peertube».

If you need one of the 2 deprecated mode, please open an issue ASAP to explain your use case.

These modes were here for historical reasons (backward compatibility, etc.).
But now there are hard to maintain, and impossible to document (adding a lot of confusion).
Moreover, they don't seem to be used much.

### Changes

* Adding a deprecation warning in the settings page when using one of the 2 deprecated mode.
* Adding German translations (thanks [Gamemap](https://github.com/Gamemap)).
* Updating dependencies.

## 5.5.0

### Features

* Builtin Prosody, Share chat url: option to have a transparent background (for streaming integration).

### Changes and fixes

* This plugin is now using types declarations from the official @peertube/peertube-types package.
* Builtin Prosody, Share chat url: fixed new day hidding when no scrollbar in readonly mode.
* Builtin Prosody: using ConverseJS clear_cache_on_logout=true and allow_user_trust_override=false parameters
* Update Basque, Spanish and Esperanto translations (thanks to [Porrumentzio](https://github.com/Porrumentzio))
* Update Occitan translations (thanks [Mejans](https://github.com/Mejans))

## 5.4.0

### Features

* Builtin Prosody: anonymous users connects automatically to the chat in a readonly mode. They must choose a nickname before they can chat.

### Minor changes and fixes

* Builtin Prosody: better random avatars quality.

## 5.3.0

### Features

* Builtin Prosody, Share chat url: ability to show/hide the scrollbar in readonly mode. Note: new messages and new day separators will also be hidden if scollbars are.
* Builtin Prosody: display Peertube users avatars.
* Builtin Prosody: display random avatars for anonymous users.

### Minor changes and fixes

* ConverseJS plugin livechatWindowTitlePlugin: Avoid errors when model is not initialized.
* Update prosody-modules (mod_muc_moderation, mod_auth_http)
* ConverseJS Peertube theme: hide avatars under 250px width instead of 576px.
* Revert v5.2.1, as it was not the bug.

## 5.2.4

### Fixes

* Fix Autocolors on chrome browser

## 5.2.3

### Fixes

* Fix ConverseJS: livechatWindowTitlePlugin was broken (window title won't be set to the room name)

## 5.2.1

### Fixes

* Trying to fix an OBS cache problem, where OBS can't connect to the chat after a plugin update.

## 5.2.0

### Features

* Using ConverseJS 9.0.0 (instead of 7.0.6).
  * NB: the «spoiler» function is disabled, as it is buggy in ConverseJS 9.0.0 (see <https://github.com/conversejs/converse.js/issues/2627>)

## 5.1.0

### Features

* Builtin Prosody:
  * Readonly mode. You can open the chat in readonly mode. Could be used to integrate in OBS for example.
  * Share chat url: modal for video owner (and instance's moderators) that allows to generate a link to the chat. So you can - for example - obtain the url to use for OBS integration.
* Builtin Prosody: you can now allow «external XMPP components» to connect. This can be used for exemple to connect bots or bridges. For now, only connections from localhost will be allowed.

### Minor changes and fixes

* Spanish translations (thanks [rnek0](https://github.com/rnek0)).
* Occitan translations (thanks [Mejans](https://github.com/Mejans))
* Hide secret keys in diagnostic tool.
* Builtin ConverseJS mode: fix advanced controls hiding.
* Builtin Prosody & Builtin ConverseJS: muc_mention_autocomplete_min_chars set to 2 (3 previously)

## v5.0.2

### Fixes

* Fix some cases where the chat immediatly close (Peertube events are not fired in the good order).

## v5.0.1

### Breaking changes

* If you have some CSS customization for the plugin, it may be broken.
* Auto color detection can have bad result for some Peertube themes. If so, you can disable it in the settings.
* Note: if updating the plugin to v5.0.1 fails with an error like `Cannot find module 'validate-color'`, try to restart peertube, then install/update the plugin. See <https://github.com/Chocobozzz/PeerTube/issues/4593>

### Features

* UI/UX improvements. Now using a custom ConverseJS build.
* Auto color detection: when using ConverseJS, the plugin tries to guess colors to apply to its theme.
* Builtin Prosody: new settings to choose how long the room's content is archived, and if it should be archived by default.

### Fixes

* Fix plugin register when Prosody enabled but not installed (again)

## v4.0.3

### Features

* Brand new documentation, in french and english. (Work in Progress)

### Minor changes and fixes

* Updating dependencies
* Message near the diagnostic button to suggest to refresh the page if not working.
* New pl translations. Thanks [mkljczk](https://github.com/mkljczk)

## v4.0.2

### Minor changes and fixes

* Updating dependencies
* Better package description

## v4.0.1

### Minor changes and fixes

* NPM dependencies update
* Fix plugin register when Prosody enabled but not installed

## v4.0.0

### Breaking changes

* Removed the settings «Chats are only available for local videos». From now on, webchat can only be activated for local videos. It will never be displayed on remote videos. This is because an incompatibility with a new feature (webchat per channel). Moreover this feature was very limited: the webchat was not shared with the remote instance (this will probably be achieved in a future release).

### Features

* Possibility to have webchat per channel (see [this request](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/58))
  * Builtin Prosody: instance's admins can choose if rooms are per video, or grouped by channel. Only one settings for the whole instance.
  * Builtin ConverseJS on external XMPP server: new placeholders for the room name: CHANNEL_ID, CHANNEL_NAME.
  * External webchat tool: new placeholder CHANNEL_ID in the webchat url.

### Fixes

* Builtin Prosody: Fix [#63](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/63). On some old Peertube installations, there can be usernames with upper-case letters. Adding a toLowerCase() for the XMPP jid.

## v3.2.0

### Features

* Builtin Prosody: list existing rooms in the settings page
* Builtin Prosody: new settings to enable local C2S. For example, can be used with Matterbridge (thanks [https://github.com/tytan652](https://github.com/tytan652))

### Fixes

* Fix broken API diagnostic.

## v3.1.0

### Features

* Builtin Prosody: optional settings to change the url for Prosody's API calls.
* Diagnostic tool: testing API communication from Peertube to Prosody.
* Diagnostic tool: testing API communication from Prosody to Peertube.
* Diagnostic tool: correctly parse Prosody nightly build versions.

## v3.0.0

### Important Notes

* This version requires at least Peertube version 3.2.0. It is no more compatible with previous Peertube versions.

### Features

* New simpler settings screen.
* New field in live video form, to activate the webchat per video. There is a setting for enabling this new feature.

### Changes

* Removed compatibility with Peertube previous to 3.2.0.
* Restoring default values for checkboxes in settings (there was a bug with Peertube previous to 3.2.0)
* New settings
* By default, the «activate chat for all lives» is disabled (now that we can enable the webchat per video)

## v2.3.1

### Features

* Added Dockerfile to use builtin prosody in Peertube docker installations.

### Fixes

* Fix typo: builtin prosody won't stop when desactivated.

## v2.3.0

### Features

* Builtin prosody use a working dir provided by Peertube (needs Peertube >= 3.2.0)
* Starting with Peertube 3.2.0, builtin prosody save room history on server. So when a user connects, he can get previously send messages.
* Starting with Peertube 3.2.0, builtin prosody also activate mod_muc_moderation, enabling moderators to moderate messages.
* Prosody log level will be the same as the Peertube's one.
* Prosody log rotation every 24 hour.
* ConverseJS is using sessionStorage rather than localStorage.

### Peertube 3.2.0

* Use peertubeHelpers.plugin methods when available. Backward compatibility is maintained.
* Use new DOM placeholder for webchat when available.

### Fixes

* Builtin Prosody: settings archive_expires_after was useless without mod_mam

## v2.2.1

### Fixes

* Revert «Better default values for settings», because of a [bug in Peertube](https://github.com/Chocobozzz/PeerTube/issues/4106)

## v2.2.0

### Features

* Don't display webchat when viewing a playlist (requires Peertube 3.2.0).
* Better default values for settings.
* Settings: hide unnecessary settings depending on webchat mode (requires Peertube 3.2.0).

### Fixes

* Fix: starting with Peertube 3.2.0, there is a header 'X-Frame-Options'. Removing it on the iframe route.
* Remove old Peertube 3.0.1 compatibility (default value for checkbox settings should be false)

## v2.1.3

* Fix: 2.1.0 was in fact correct... Did not work on my preprod env because of... a Livebox bug...
* Fix: if the video owner is already owner of the chatroom, he should not be downgraded to admin.

## v2.1.2

* Fix: revert 2.1.1, and revert using the real domain for prosody

## v2.1.1

* Fix bad proxy settings when not working on localhost

## v2.1.0

### Important Notes

* This version requires at least Peertube version 3.1.0. It is no more compatible with Peertube 3.0.1.

### Features

* Builtin Prosody: use mod_muc_http_defaults to set rooms properties and prevent unauthorized room creation.
* Builtin Prosody: use mod_auth_http to auto login peertube users
* Builtin Prosody: instance's admins and moderators are owner of all created room. Video's owner is admin of the room.

### Fixes

* Fix converseJS: show the participant list when not in iframe

## v2.0.3

* Fix Peertube server crash when prosody is not installed

## v2.0.2

* Trying to fix dependencies installation problems

## v2.0.1

* Trying to fix dependencies installation problems

## v2.0.0

* Code is now in Typescript
* Builtin Prosody server, for easy configuration
* Diagnostic tools for helping admins to find misconfigurations

## v1.0.8

* Fix: typo that can prevent settings chat-only-locals to work

## v1.0.7

* New tutorial to setup [Prosody on the Peertube server](documentation/tutorials/prosody.md)
* Add link to documentation in the settings page.

## v1.0.6

* New icons by [Porrumentzio](https://github.com/Porrumentzio)

## v1.0.5

* New buttons and logo.
* Fix: changing default value to false for every checkbox settings (Peertube bug in <=3.0.1: [https://github.com/Chocobozzz/PeerTube/issues/3838](https://github.com/Chocobozzz/PeerTube/issues/3838)).

## v1.0.4

### Features

* Translations for ca, eo, es and eu. Thanks to [Porrumentzio](https://github.com/Porrumentzio).
* UX improvements. Buttons are now icons, and placed on top of the chat container.

### Bug Fixes

* Fix buttons disappearing when lives started of finished.

## v1.0.3

### Various changes

* Using converseJS ^7.0.4
* Updating documentation

## v1.0.2

### Bug fixes

* Quick fix: add a min-height for the iframe, so that it is not too tiny when under the video.

## v1.0.1

### Bug fixes

* When installing the plugin from npm, the node_modules don't come with: copying converseJS to dist folder.

## v1.0.0

### Features

* Optional Builtin ConverseJS
* Option for enabling live only on local videos
* The «open in new window» button is optional

## v0.0.8

### Features

* The chat is displayed on the right of the video

## v0.0.7

### Bug Fixes

* Fix incomplete commit

## v0.0.6

### Features

* Use eslint to lint the code

### Bug fixes

* Fix dom positionning
* Chat should be displayed for waiting and ended lives
* Chat and chat buttons must be cleaned out of the dom on navigation

## v0.0.5

* Initial release
