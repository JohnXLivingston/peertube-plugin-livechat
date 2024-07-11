// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

const MODERATION_DELAY_TAG = 'moderation-delay'

/**
 * Moderation delay plugin definition.
 * This module adds a time counter for moderators, so they now how many time remains before message is broadcasted.
 */
export const moderationDelayPlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  async initialize (this: any) {
    const _converse = this._converse

    _converse.api.listen.on('parseMUCMessage', (stanza: any, attrs: any) => {
      // Checking if there is any moderation delay in the message.
      const waiting = window.converse.env.sizzle(MODERATION_DELAY_TAG, stanza)?.[0]?.getAttribute('waiting')
      if (!waiting) { return attrs }
      return Object.assign(
        attrs,
        {
          moderation_delay_waiting: waiting
        }
      )
    })

    const Message = _converse.api.elements.registry['converse-chat-message']
    if (Message) {
      class MessageOverloaded extends Message {
        getDerivedMessageProps (): ReturnType<typeof Message.getDerivedMessageProps> {
          const r = super.getDerivedMessageProps()
          const waiting = this.model.get('moderation_delay_waiting')
          if (!waiting) {
            return r
          }
          const remains = waiting - (Date.now() / 1000)
          if (remains < 0) {
            // Message already broadcasted
            return r
          }

          // Ok... We will add some info about how many remains...
          r.pretty_time = window.converse.env.html`
            ${r.pretty_time}<span aria-hidden="true">&nbsp;-&nbsp;${Math.round(remains)}⏱</span>
          `
          // and we must update in 1 second...
          setTimeout(() => this.requestUpdate(), 1000)
          return r
        }
      }
      _converse.api.elements.define('converse-chat-message', MessageOverloaded)
    } else {
      console.error('Cannot find converse-chat-message custom elements, moderation delay will not be properly shown.')
    }
  },
  overrides: {
    ChatRoom: {
      getUpdatedMessageAttributes: function getUpdatedMessageAttributes (this: any, message: any, attrs: any) {
        const newAttrs = this.__super__.getUpdatedMessageAttributes(message, attrs)
        if (attrs.moderation_delay_waiting) {
          Object.assign(newAttrs, {
            moderation_delay_waiting: attrs.moderation_delay_waiting
          })
        }
        return newAttrs
      }
    }
  }
}
