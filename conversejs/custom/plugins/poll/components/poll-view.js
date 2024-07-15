// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { tplPoll } from '../templates/poll.js'
import { CustomElement } from 'shared/components/element.js'
import { converse, _converse, api } from '@converse/headless'
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
    this.listenTo(this.model.occupants, 'change:role', occupant => {
      if (occupant.get('jid') !== _converse.bare_jid) { // only for myself
        return
      }
      // visitors cant vote. So we must refresh the polls results when current occupant role changes.
      this.requestUpdate()
    })
  }

  render () {
    const currentPoll = this.model?.get('current_poll')
    const entered = this.model.session.get('connection_status') === converse.ROOMSTATUS.ENTERED
    const canVote = entered && this.model.getOwnRole() !== 'visitor'
    return tplPoll(this, currentPoll, canVote)
  }

  toggle (ev) {
    ev.preventDefault()
    this.collapsed = !this.collapsed
  }

  async voteFor (choice) {
    if (this.buttonDisabled) { return }

    const currentPoll = this.model?.get('current_poll')
    if (!currentPoll) { return }
    if (currentPoll.over) { return }

    console.info('User has voted for choice: ', choice)
    // We disable vote buttons until next refresh:
    this.buttonDisabled = true
    this.requestUpdate()

    await this.model.sendMessage({
      body: '!' + choice.choice
    })

    // Dispatching an event.
    // When in Peertube interface, this will open a Peertube notifier with a message.
    // FIXME: we should only trigger this on the message echo or bounce,
    // but seems ConverseJs does not provide any promise for that.
    const event = new Event('livechat-poll-vote', {
      bubbles: true
    })
    this.dispatchEvent(event)
  }

  closePoll (ev) {
    ev.preventDefault()
    this.model.set('current_poll', undefined)
  }
}

api.elements.define('livechat-converse-muc-poll', MUCPollView)
