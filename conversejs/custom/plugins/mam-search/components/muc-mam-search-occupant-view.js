// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { tplMucMamSearchOccupant } from '../templates/muc-mam-search-occupant'
import { api } from '@converse/headless'

import '../styles/muc-mam-search-occupant.scss'

export default class MUCMamSearchOccupantView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      message: { type: Object, attribute: true } // optional message.
    }
  }

  async initialize () {
    this.listenTo(this.model, 'change', () => this.requestUpdate())
  }

  render () {
    return tplMucMamSearchOccupant(this, this.model, this.message)
  }
}

api.elements.define('livechat-converse-muc-mam-search-occupant', MUCMamSearchOccupantView)
