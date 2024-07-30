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

  initialize (models, options) {
    this.model = ChatRoomNote // don't know why, must do it again here
    super.initialize(arguments)
    this.chatroom = options.chatroom

    const id = `converse-livechat-notes-${this.chatroom.get('jid')}`
    initStorage(this, id, 'session')

    this.on('change:order', () => this.sort())
  }

  comparator (n1, n2) {
    // must reverse order
    const o1 = n1.get('order') ?? 0
    const o2 = n2.get('order') ?? 0
    return o1 < o2 ? 1 : o1 > o2 ? -1 : 0
  }

  async createNote (data) {
    data = Object.assign({}, data)

    if (!data.order) {
      data.order = 1 + Math.max(
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
