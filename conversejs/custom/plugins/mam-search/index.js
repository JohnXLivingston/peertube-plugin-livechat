// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api, converse } from '../../../src/headless/index.js'
import { getMessageActionButtons, getOccupantActionButtons } from './utils.js'
import mamSearchApi from './api.js'

import './components/muc-mam-search-app-view.js'
import './components/muc-mam-search-occupant-view.js'
import './components/muc-mam-search-message-view.js'

converse.plugins.add('livechat-converse-mam-search', {
  dependencies: ['converse-muc', 'converse-muc-views'],
  async initialize () {
    const _converse = this._converse

    Object.assign(api, {
      livechat_mam_search: mamSearchApi
    })

    _converse.api.settings.extend({
      livechat_mam_search_app_enabled: false
    })

    // Adding buttons on messages:
    _converse.api.listen.on('getMessageActionButtons', getMessageActionButtons)
    // Adding buttons on occupants:
    _converse.api.listen.on('getOccupantActionButtons', getOccupantActionButtons)

    // FIXME: should we listen to any event (feature/affiliation change?, mam_enabled?) to refresh messageActionButtons?
  }
})
