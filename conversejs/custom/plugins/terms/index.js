// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { converse, api } from '../../../src/headless/index.js'
import './components/muc-terms.js'

const { sizzle } = converse.env

converse.plugins.add('livechat-converse-terms', {
  dependencies: ['converse-muc'],
  initialize () {
    api.listen.on('parseMUCMessage', (stanza, attrs) => {
      const livechatTerms = sizzle('x-livechat-terms', stanza)
      if (!livechatTerms.length) {
        return attrs
      }
      return Object.assign(
        attrs,
        {
          x_livechat_terms: livechatTerms[0].getAttribute('type')
        }
      )
    })
  },
  overrides: {
    ChatRoom: {
      onMessage: function onMessage (attrs) {
        if (!attrs.x_livechat_terms) {
          return this.__super__.onMessage(attrs)
        }
        // We received a x-livechat-terms message, we don't forward it to standard onMessage,
        // but we just update the room attribute.
        const type = attrs.x_livechat_terms
        if (type !== 'global' && type !== 'muc') {
          console.error('Invalid x-livechat-terms type: ', type)
          return
        }
        if (attrs.is_archived) {
          // This should not happen, as we add some no-store hints. But, just in case.
          console.info('Dropping an archived x-livechat-terms message')
          return
        }
        // console.info('Received a x-livechat-terms message', attrs)
        const options = {}
        options['x_livechat_terms_' + type] = attrs
        this.set(options)
        // this will be displayed by the livechat-converse-muc-terms custom element,
        // which is inserted in the DOM by the muc.js template overload.
      }
    }
  }
})
