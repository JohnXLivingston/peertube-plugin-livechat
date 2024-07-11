// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { XMLNS_POLL } from './constants.js'
import { _converse, api } from '../../../src/headless/index.js'
import { __ } from 'i18n'

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
      api.modal.show('livechat-converse-poll-form-modal', { model: muc })
    },
    a_class: '',
    icon_class: 'fa-list-check', // FIXME
    name: 'muc-create-poll'
  })

  return buttons
}
