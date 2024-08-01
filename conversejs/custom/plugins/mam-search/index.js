// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api, converse } from '../../../src/headless/index.js'
import { XMLNS_MAM_SEARCH } from './constants.js'
import mamSearchApi from './api.js'
import { __ } from 'i18n'

converse.plugins.add('livechat-converse-mam-search', {
  dependencies: ['converse-muc', 'converse-muc-views'],
  async initialize () {
    const _converse = this._converse

    Object.assign(api, {
      livechat_mam_search: mamSearchApi
    })

    // Adding buttons on message:
    _converse.api.listen.on('getMessageActionButtons', getMessageActionButtons)

    // FIXME: should we listen to any event (feature/affiliation change?, mam_enabled?) to refresh messageActionButtons?
  }
})

function getMessageActionButtons (messageActionsEl, buttons) {
  const messageModel = messageActionsEl.model
  if (messageModel.get('type') !== 'groupchat') {
    // only on groupchat message.
    return buttons
  }

  if (!messageModel.occupant) {
    return buttons
  }

  const muc = messageModel.collection?.chatbox
  if (!muc) {
    return buttons
  }

  if (!muc.features?.get?.(XMLNS_MAM_SEARCH)) {
    return buttons
  }

  const myself = muc.getOwnOccupant()
  if (!myself || !['admin', 'owner'].includes(myself.get('affiliation'))) {
    return buttons
  }

  // eslint-disable-next-line no-undef
  const i18nSearch = __(LOC_search_occupant_message)

  buttons.push({
    i18n_text: i18nSearch,
    handler: async (ev) => {
      ev.preventDefault()
      console.log(await api.livechat_mam_search.query({
        room: muc.get('jid'),
        // FIXME: shouldn't we escape the nick? cant see any code that escapes it in Converse.
        from: messageModel.occupant.get('from') || muc.get('jid') + '/' + (messageModel.occupant.get('nick') ?? ''),
        occupant_id: messageModel.occupant.get('occupant_id')
      }))
    },
    button_class: '',
    icon_class: 'fa fa-magnifying-glass',
    name: 'muc-mam-search'
  })

  return buttons
}
