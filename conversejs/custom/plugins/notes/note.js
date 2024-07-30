// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Model } from '@converse/skeletor/src/model.js'

/**
 * A chat room note.
 * @class
 * @namespace _converse.exports.ChatRoomNote
 * @memberof _converse
 */
class ChatRoomNote extends Model {
  idAttribute = 'id'

  async saveItem () {
    console.log('Saving note ' + this.get('id') + '...')
    await this.collection.chatroom.noteManager.saveItem(this)
    console.log('Note ' + this.get('id') + ' saved.')
  }

  async deleteItem () {
    return this.collection.chatroom.noteManager.deleteItems([this])
  }

  getAboutOccupant () {
    const occupants = this.collection.chatroom?.occupants
    if (!occupants?.findOccupant) { return undefined }

    if (this.get('about_occupant_id')) {
      const o = occupants.findOccupant({ occupant_id: this.get('about_occupant_id') })
      if (o) { return o }
    }

    if (!this.get('about_nick') && !this.get('about_jid')) {
      return undefined
    }

    const o = occupants.findOccupant({
      nick: this.get('about_nick'),
      jid: this.get('about_jid')
    })
    if (o) { return o }

    return undefined
  }
}

export {
  ChatRoomNote
}
