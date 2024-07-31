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
  _aboutOccupantCache = null
  _aboutOccupantCacheFor = null

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

    const nick = this.get('about_nick')
    const jid = this.get('about_jid')
    const occupantId = this.get('about_occupant_id')

    if (!nick && !jid && !occupantId) {
      this._aboutOccupantCache = null
      this._aboutOccupantCacheFor = null
      return undefined
    }

    // Keeping some cache, to avoid intensive search on each rendering.
    const cacheKey = `${occupantId ?? ''} ${jid ?? ''} ${nick ?? ''}`
    if (this._aboutOccupantCacheFor === cacheKey && this._aboutOccupantCache) {
      return this._aboutOccupantCache
    }

    this._aboutOccupantCacheFor = cacheKey

    if (occupantId) {
      const o = occupants.findOccupant({ occupant_id: occupantId })
      if (o) {
        this._aboutOccupantCache = o
        return o
      }
    }

    if (jid) {
      const o = occupants.findOccupant({
        jid,
        nick
      })
      if (o) {
        this._aboutOccupantCache = o
        return o
      }
    }

    // If we don't find it, maybe it is a user that has spoken a long time ago (or never spoked).
    // In such case, we must create a dummy occupant:
    this._aboutOccupantCache = occupants.create({
      nick,
      occupant_id: occupantId,
      jid
    })
    return this._aboutOccupantCache
  }
}

export {
  ChatRoomNote
}
