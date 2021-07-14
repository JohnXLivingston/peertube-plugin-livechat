# Changelog

## v3.2.0

### Features

* Builtin Prosody: new settings to enable local C2S. For example, can be used with Matterbridge (thanks https://github.com/tytan652)
* Builtin Prosody: list existing rooms in the settings page

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
* When using the builtin prosody, there is a button to list existing chatrooms in the settings screen.

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
* Fix: changing default value to false for every checkbox settings (Peertube bug in <=3.0.1: https://github.com/Chocobozzz/PeerTube/issues/3838).

## v1.0.4

### Features

* Translations for ca, eo, es and eu. Thanks to [Porrumentzio](https://github.com/Porrumentzio).
* UX improvments. Buttons are now icons, and placed on top of the chat container.

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
