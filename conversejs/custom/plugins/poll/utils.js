// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { XMLNS_POLL } from './constants.js'
import { converse, _converse, api } from '../../../src/headless/core.js'
import { __ } from 'i18n'
const $iq = converse.env.$iq

function _fetchPollForm (mucModel) {
  return api.sendIQ(
    $iq({
      to: mucModel.get('jid'),
      type: 'get'
    }).c('query', { xmlns: XMLNS_POLL })
  )
}

export function getHeadingButtons (view, buttons) {
  const muc = view.model
  if (muc.get('type') !== _converse.CHATROOMS_TYPE) {
    // only on MUC.
    return buttons
  }

  if (!muc.features?.get?.(XMLNS_POLL)) {
    // Poll feature not available (can happen if the chat is remote, and the plugin not up to date)
    return buttons
  }

  const myself = muc.getOwnOccupant()
  if (!myself || !['admin', 'owner'].includes(myself.get('affiliation'))) {
    return buttons
  }

  // Adding a "New poll" button.
  buttons.unshift({
    // eslint-disable-next-line no-undef
    i18n_text: __(LOC_new_poll),
    handler: async (ev) => {
      ev.preventDefault()
      const r = await _fetchPollForm(muc)
      // FIXME
      console.info('Received poll form', r)
    },
    a_class: '',
    icon_class: 'fa-list-check', // FIXME
    name: 'muc-create-poll'
  })

  return buttons
}
