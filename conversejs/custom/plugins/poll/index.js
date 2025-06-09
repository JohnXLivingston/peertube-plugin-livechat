// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { _converse, converse } from '../../../src/headless/index.js'
import { getHeadingButtons } from './utils.js'
import { POLL_MESSAGE_TAG, POLL_QUESTION_TAG, POLL_CHOICE_TAG } from './constants.js'
import { __ } from 'i18n'
import './modals/poll-form.js'
import './components/poll-view.js'
import './components/poll-form-view.js'

const { sizzle } = converse.env

const delayedTimeout = 2 // for delayed poll message, how long must the be considered as valid.

converse.plugins.add('livechat-converse-poll', {
  dependencies: ['converse-muc', 'converse-disco'],

  initialize () {
    // adding the poll actions in the MUC heading buttons:
    _converse.api.listen.on('getHeadingButtons', getHeadingButtons)

    _converse.api.listen.on('parseMUCMessage', (stanza, attrs) => {
      // Localizing specific error messages
      if (attrs.is_error) {
        // eslint-disable-next-line no-undef, camelcase
        if (attrs.error_text === LOC_poll_is_over) {
          // eslint-disable-next-line no-undef
          attrs.error_text = __(LOC_poll_is_over)
          // eslint-disable-next-line no-undef, camelcase
        } else if (attrs.error_text === LOC_poll_choice_invalid) {
          // eslint-disable-next-line no-undef
          attrs.error_text = __(LOC_poll_choice_invalid)
          // eslint-disable-next-line no-undef, camelcase
        } else if (attrs.error_text === LOC_poll_anonymous_vote_ok) {
          // eslint-disable-next-line no-undef
          attrs.error_text = __(LOC_poll_anonymous_vote_ok)
        }
      }

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

      // We will also translate some strings here.
      const body = (attrs.body ?? '')
        // eslint-disable-next-line no-undef
        .replace(LOC_poll_is_over, __(LOC_poll_is_over))
        // eslint-disable-next-line no-undef
        .replace(LOC_poll_vote_instructions_xmpp, __(LOC_poll_vote_instructions)) // changing instructions on the fly

      return Object.assign(
        attrs,
        {
          current_poll: currentPoll,
          body
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
        // We just drop archived messages, to not show the banner for finished polls.
        if (attrs.is_archived) {
          return this.__super__.onMessage(attrs)
        }
        if (attrs.is_delayed) {
          // When archiving is disabled, the "history" mechanism is still available:
          // Last X (20 by default) messages will be kept, and sent to users.
          // The only thing that differentiates such messages is that they are delayed.
          // We can't just ignore all delayed messages, because if one day we enable SMACKS
          // (to handle deconnections on poor network), there could be some legitimate delayed messages.
          // So we will only ignore the poll if it was sent more than X minutes ago.
          console.debug('Got a delayed poll message, checking if old or not')
          const d = new Date()
          d.setMinutes(d.getMinutes() - delayedTimeout)
          if (attrs.time < d.toISOString()) {
            console.debug(
              `Poll message was delayed fore more than ${delayedTimeout} minutes (${attrs.time} < ${d.toISOString()}).`
            )
            return this.__super__.onMessage(attrs)
          }
        }

        console.info('Got a poll message, setting it as the current_poll')
        // this will be displayed by the livechat-converse-muc-poll custom element,
        // which is inserted in the DOM by the muc.js template overload.
        this.set('current_poll', attrs.current_poll)

        return this.__super__.onMessage(attrs)
      }
    }
  }
})
