// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { _converse, converse } from '../../../src/headless/index.js'
import { XMLNS_NOTE } from './constants.js'
import { ChatRoomNote } from './note.js'
import { ChatRoomNotes } from './notes.js'
import { initOrDestroyChatRoomNotes, getHeadingButtons, getMessageActionButtons } from './utils.js'

import './components/muc-note-app-view.js'
import './components/muc-notes-view.js'
import './components/muc-note-view.js'

converse.plugins.add('livechat-converse-notes', {
  dependencies: ['converse-muc', 'converse-disco', 'converse-pubsub'],

  initialize () {
    Object.assign(
      _converse.exports,
      {
        ChatRoomNotes,
        ChatRoomNote
      }
    )

    _converse.api.settings.extend({
      livechat_note_app_enabled: false,
      livechat_note_app_restore: false // should we open the app by default if it was previously oppened?
    })

    _converse.api.listen.on('chatRoomInitialized', muc => {
      muc.session.on('change:connection_status', _session => {
        // When joining a room, initializing the Notes object (if user has access),
        // When disconnected from a room, destroying the Notes object:
        initOrDestroyChatRoomNotes(muc)
      })

      // When the current user affiliation changes, we must also delete or initialize the TaskLists object:
      muc.occupants.on('change:affiliation', occupant => {
        if (occupant.get('jid') !== _converse.bare_jid) { // only for myself
          return
        }
        initOrDestroyChatRoomNotes(muc)
      })

      // To be sure that everything works in any case, we also must listen for addition in muc.features.
      muc.features.on('change:' + XMLNS_NOTE, () => {
        initOrDestroyChatRoomNotes(muc)
      })
    })

    // adding the "Notes" button in the MUC heading buttons:
    _converse.api.listen.on('getHeadingButtons', getHeadingButtons)

    // Adding buttons on message:
    _converse.api.listen.on('getMessageActionButtons', getMessageActionButtons)
  }
})
