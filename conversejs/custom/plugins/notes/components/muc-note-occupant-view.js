// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { tplMucNoteOccupant } from '../templates/muc-note-occupant'
import { api } from '@converse/headless'

import '../styles/muc-note-occupant.scss'

export default class MUCNoteOccupantView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      note: { type: Object, attribute: true }, // optional associated note
      full_display: { type: Boolean, attribute: true }
    }
  }

  async initialize () {
    this.listenTo(this.model, 'change', () => this.requestUpdate())
  }

  render () {
    return tplMucNoteOccupant(this, this.model, this.note)
  }
}

api.elements.define('livechat-converse-muc-note-occupant', MUCNoteOccupantView)
