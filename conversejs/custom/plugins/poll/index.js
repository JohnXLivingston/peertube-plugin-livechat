// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { _converse, converse } from '../../../src/headless/core.js'
import { getHeadingButtons } from './utils.js'
// import { XMLNS_POLL } from './constants.js'

converse.plugins.add('livechat-converse-poll', {
  dependencies: ['converse-muc', 'converse-disco'],

  initialize () {
    // _converse.api.listen.on('chatRoomInitialized', muc => {
    //   muc.features.on('change:' + XMLNS_POLL, () => {
    //     // TODO: refresh headingbuttons?
    //   })
    // })
    // adding the poll actions in the MUC heading buttons:
    _converse.api.listen.on('getHeadingButtons', getHeadingButtons)
  }
})
