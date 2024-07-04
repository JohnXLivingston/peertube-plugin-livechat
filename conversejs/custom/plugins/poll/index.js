// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { _converse, converse } from '../../../src/headless/core.js'
import { getHeadingButtons } from './utils.js'
import { POLL_MESSAGE_TAG, POLL_QUESTION_TAG, POLL_CHOICE_TAG } from './constants.js'
import './modals/poll-form.js'
import './components/poll-view.js'
import './components/poll-form-view.js'

const { sizzle } = converse.env

converse.plugins.add('livechat-converse-poll', {
  dependencies: ['converse-muc', 'converse-disco'],

  initialize () {
    // _converse.api.listen.on('chatRoomInitialized', muc => {
    //   muc.features.on('change:' + XMLNS_POLL, () => {
    //     // TODO: refresh headingbuttons?
    //   })
    // })
    // adding the poll actions in the MUC heading buttons:
    _converse.api.listen.on('getHeadingButtons', getHeadingButtons)

    _converse.api.listen.on('parseMUCMessage', (stanza, attrs) => {
      // Checking if there is any poll data in the message.
      const poll = sizzle(POLL_MESSAGE_TAG, stanza)?.[0]
      if (!poll) {
        return attrs
      }
      const question = sizzle(POLL_QUESTION_TAG, poll)?.[0]
      const choices = sizzle(POLL_CHOICE_TAG, poll)
      if (!question || !choices.length) {
        return attrs
      }

      const endDate = poll.hasAttribute('end')
        ? new Date(1000 * parseInt(poll.getAttribute('end')))
        : null

      const currentPoll = {
        question: question.textContent,
        id: poll.getAttribute('id'),
        votes: parseInt(poll.getAttribute('votes') ?? 0),
        over: poll.hasAttribute('over'),
        endDate: endDate,
        time: attrs.time, // this is to be sure that we update the custom element (needed to re-enable buttons)
        choices: choices.map(c => {
          return {
            label: c.textContent,
            choice: c.getAttribute('choice'),
            votes: parseInt(c.getAttribute('votes') ?? 0)
          }
        })
      }

      return Object.assign(
        attrs,
        {
          current_poll: currentPoll
        }
      )
    })
  },

  overrides: {
    ChatRoom: {
      onMessage: function onMessage (attrs) {
        if (!attrs.current_poll) {
          return this.__super__.onMessage(attrs)
        }
        // We intercept poll messages, to show the banner.
        // Note: we also show the message in the chat.
        if (attrs.is_delayed || attrs.is_archived) {
          if (attrs.current_poll.over) {
            console.info('Got a delayed/archived poll message for an poll that is over, just displaying in the chat')
            return this.__super__.onMessage(attrs)
          }
          console.info('Got a delayed/archived poll message, just dropping')
          return
        }

        console.info('Got a poll message, setting it as the current_poll')
        // this will be displayed by the livechat-converse-muc-poll custom element,
        // which is inserted in the DOM by the muc.js template overload.
        this.set('current_poll', attrs.current_poll)

        if (attrs.current_poll.over) {
          console.info('The poll is over, displaying the message in the chat')
          return this.__super__.onMessage(attrs)
        }
        // Dropping the message.
      }
    }
  }
})
