// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { tplPoll } from '../templates/poll.js'
import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import '../styles/poll.scss'

export default class MUCPollView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true }
    }
  }

  async initialize () {
    if (!this.model) {
      return
    }
    this.listenTo(this.model, 'change:current_poll', () => this.requestUpdate())
  }

  render () {
    const currentPoll = this.model?.get('current_poll')
    return tplPoll(this, currentPoll)
  }
}

api.elements.define('livechat-converse-muc-poll', MUCPollView)
