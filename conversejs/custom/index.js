// SPDX-FileCopyrightText: 2013-2018 JC Brand <https://github.com/conversejs/converse.js/>
// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: MPL-2.0
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * @description This files will override the original ConverseJS index.js file.
 */

import './i18n/index.js'
import 'shared/registry.js'
import { CustomElement } from 'shared/components/element'
import { VIEW_PLUGINS } from './shared/constants.js'
import { _converse, converse } from '@converse/headless'

import 'shared/styles/index.scss'

/* START: Removable plugins
 * ------------------------
 * Any of the following plugin imports may be removed if the plugin is not needed
 *
 * Comments line were removed for the peertube-plugin-livechat.
 */
import './plugins/modal/index.js'
import './plugins/adhoc-views/index.js' // Views for XEP-0050 Ad-Hoc commands
import './plugins/bookmark-views/index.js' // Views for XEP-0048 Bookmarks
import './plugins/chatview/index.js' // Renders standalone chat boxes for single user chat
import './plugins/controlbox/index.js' // The control box
import './plugins/headlines-view/index.js'
import './plugins/mam-views/index.js'
import './plugins/muc-views/index.js' // Views related to MUC
// import './plugins/minimize/index.js'       // Allows chat boxes to be minimized
// import './plugins/notifications/index.js'
// import './plugins/profile/index.js'
// import './plugins/omemo/index.js'
// import './plugins/push/index.js'           // XEP-0357 Push Notifications
import './plugins/register/index.js' // XEP-0077 In-band registration
// import './plugins/roomslist/index.js'      // Show currently open chat rooms
import './plugins/rootview/index.js'
import './plugins/rosterview/index.js'
import './plugins/singleton/index.js'
// import './plugins/dragresize/index.js'     // Allows chat boxes to be resized by dragging them
import './plugins/fullscreen/index.js'

import '../custom/plugins/size/index.js'
import '../custom/plugins/notes/index.js'
import '../custom/plugins/tasks/index.js'
import '../custom/plugins/terms/index.js'
import '../custom/plugins/poll/index.js'
/* END: Removable components */

// Running some specific livechat patches:
import '../custom/livechat-patch-vcard.js'

import { CORE_PLUGINS } from './headless/shared/constants.js'
import { ROOM_FEATURES } from './headless/plugins/muc/constants.js'
// We must add our custom plugins to CORE_PLUGINS (so it is white listed):
CORE_PLUGINS.push('livechat-converse-size')
CORE_PLUGINS.push('livechat-converse-tasks')
CORE_PLUGINS.push('livechat-converse-terms')
CORE_PLUGINS.push('livechat-converse-poll')
CORE_PLUGINS.push('livechat-converse-notes')
// We must also add our custom ROOM_FEATURES, so that they correctly resets
// (see headless/plugins/muc, getDiscoInfoFeatures, which loops on this const)
ROOM_FEATURES.push('x_peertubelivechat_mute_anonymous')

_converse.exports.CustomElement = CustomElement

const initialize = converse.initialize

converse.initialize = function (settings, callback) {
  if (Array.isArray(settings.whitelisted_plugins)) {
    settings.whitelisted_plugins = settings.whitelisted_plugins.concat(VIEW_PLUGINS)
  } else {
    settings.whitelisted_plugins = VIEW_PLUGINS
  }
  return initialize(settings, callback)
}

export default converse
