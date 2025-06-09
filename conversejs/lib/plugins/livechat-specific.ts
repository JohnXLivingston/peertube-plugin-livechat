// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { customizeHeading } from './livechat-specific/heading'
import { customizeToolbar } from './livechat-specific/toolbar'
import { initReconnectionStuff } from './livechat-specific/reconnection'
import { chatRoomOverrides } from './livechat-specific/chatroom'
import { chatRoomMessageOverrides } from './livechat-specific/chatroom-message'
import { customizeMessageAction } from './livechat-specific/message-action'
import { customizeProfileModal } from './livechat-specific/profile'
import { customizeMUCBottomPanel } from './livechat-specific/muc-bottom-panel'

export const livechatSpecificsPlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse

    _converse.api.settings.extend({
      // if user is authenticated with an external account (to add a logout button)
      livechat_specific_external_authent: false,
      // if user is anonymous
      livechat_specific_is_anonymous: false
    })

    customizeHeading(this)
    customizeToolbar(this)
    customizeMessageAction(this)
    customizeProfileModal(this)
    customizeMUCBottomPanel(this)

    _converse.api.listen.on('chatRoomViewInitialized', function (this: any, _model: any): void {
      // Remove the spinner if present...
      document.getElementById('livechat-loading-spinner')?.remove()
    })

    initReconnectionStuff(this)

    if (window.location.protocol === 'http:') {
      // We are probably on a dev instance, so we will add _converse in window:
      (window as any)._livechatConverse = _converse
    }
  },
  overrides: {
    ChatRoom: chatRoomOverrides(),
    ChatRoomMessage: chatRoomMessageOverrides()
  }
}
