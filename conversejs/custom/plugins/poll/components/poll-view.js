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
      model: { type: Object, attribute: true },
      collapsed: { type: Boolean, attribute: false },
      buttonDisabled: { type: Boolean, attribute: false }
    }
  }

  async initialize () {
    this.collapsed = false
    this.buttonDisabled = false
    if (!this.model) {
      return
    }
    this.listenTo(this.model, 'change:current_poll', () => {
      this.buttonDisabled = false
      this.requestUpdate()
    })
  }

  render () {
    const currentPoll = this.model?.get('current_poll')
    return tplPoll(this, currentPoll)
  }

  toggle () {
    this.collapsed = !this.collapsed
  }

  voteFor (choice) {
    if (this.buttonDisabled) { return }

    const currentPoll = this.model?.get('current_poll')
    if (!currentPoll) { return }
    if (currentPoll.over) { return }

    console.info('User has voted for choice: ', choice)
    // We disable vote buttons until next refresh:
    this.buttonDisabled = true
    this.requestUpdate()

    this.model.sendMessage({
      body: '!' + choice.choice
    })
  }

  closePoll (ev) {
    ev.preventDefault()
    this.model.set('current_poll', undefined)
  }
}

api.elements.define('livechat-converse-muc-poll', MUCPollView)
