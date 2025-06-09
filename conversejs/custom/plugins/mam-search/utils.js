// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '../../../src/headless/index.js'
import { XMLNS_MAM_SEARCH } from './constants.js'
import { __ } from 'i18n'

function getMessageActionButtons (messageActionsEl, buttons) {
  const messageModel = messageActionsEl.model
  if (!api.settings.get('livechat_mam_search_app_enabled')) {
    return buttons
  }

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
      api.livechat_mam_search.showMessagesFrom(messageModel.occupant)
    },
    button_class: '',
    icon_class: 'fa fa-magnifying-glass',
    name: 'muc-mam-search'
  })

  return buttons
}

function getOccupantActionButtons (occupant, buttons) {
  if (!api.settings.get('livechat_mam_search_app_enabled')) {
    return buttons
  }

  const muc = occupant.collection?.chatroom
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
      api.livechat_mam_search.showMessagesFrom(occupant)
    },
    button_class: '',
    icon_class: 'fa fa-magnifying-glass',
    name: 'muc-mam-search'
  })

  return buttons
}

export {
  getMessageActionButtons,
  getOccupantActionButtons
}
