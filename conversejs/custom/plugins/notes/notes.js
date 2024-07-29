// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Collection } from '@converse/skeletor/src/collection.js'
import { ChatRoomNote } from './note'
import { initStorage } from '@converse/headless/utils/storage.js'

/**
 * A list of {@link _converse.exports.ChatRoomNote} instances, representing notes associated to a MUC.
 * @class
 * @namespace _converse.exports.ChatRoomNotes
 * @memberOf _converse
 */
class ChatRoomNotes extends Collection {
  model = ChatRoomNote
  comparator = 'order'

  initialize (models, options) {
    this.model = ChatRoomNote // don't know why, must do it again here
    super.initialize(arguments)
    this.chatroom = options.chatroom

    const id = `converse-livechat-notes-${this.chatroom.get('jid')}`
    initStorage(this, id, 'session')

    this.on('change:order', () => this.sort())
  }

  async createNote (data) {
    data = Object.assign({}, data)

    if (!data.order) {
      data.order = 0 + Math.max(
        0,
        ...(this.map(n => n.get('order') ?? 0).filter(o => !isNaN(o)))
      )
    }

    console.log('Creating note...')
    await this.chatroom.noteManager.createItem(this, data)
    console.log('Note created.')
  }
}

export {
  ChatRoomNotes
}
