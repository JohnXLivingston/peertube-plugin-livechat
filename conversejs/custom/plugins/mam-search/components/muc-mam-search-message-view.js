// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { tplMucMamSearchMessage } from '../templates/muc-mam-search-message.js'
import { api } from '@converse/headless'

import '../styles/muc-mam-search-message.scss'

export default class MUCMamSearchMessageView extends CustomElement {
  static get properties () {
    return {
      message: { type: Object, attribute: true }, // /!\ this is not a model
      mucModel: { type: Object, attribute: true },
      searchOccupantModel: { type: Object, attribute: true }
    }
  }

  async initialize () {
    this.listenTo(this.mucModel, 'change', () => this.requestUpdate())
    this.listenTo(this.searchOccupantModel, 'change', () => this.requestUpdate())
  }

  render () {
    return tplMucMamSearchMessage(this, this.mucModel, this.searchOccupantModel, this.message)
  }

  getMessageOccupant () {
    const occupants = this.mucModel?.occupants
    if (!occupants?.findOccupant) { return undefined }

    const nick = this.message.nick
    const jid = this.message.from
    const occupantId = this.message.occupant_id

    if (!nick && !jid && !occupantId) {
      return undefined
    }

    if (occupantId) {
      const o = occupants.findOccupant({ occupant_id: occupantId })
      if (o) {
        return o
      }
    }

    if (jid) {
      const o = occupants.findOccupant({
        jid,
        nick
      })
      if (o) {
        return o
      }
    }

    // If we don't find it, maybe it is a user that has spoken a long time ago (or never spoked).
    // In such case, we must create a dummy occupant:
    const o = occupants.create({
      nick,
      occupant_id: occupantId,
      jid
    })
    return o
  }

  getDateTime () {
    if (!this.message.time) {
      return undefined
    }
    try {
      const d = new Date(this.message.time)
      return d.toLocaleDateString() + ' - ' + d.toLocaleTimeString()
    } catch (err) {
      console.log(err)
      return undefined
    }
  }
}

api.elements.define('livechat-converse-muc-mam-search-message', MUCMamSearchMessageView)
