// SPDX-FileCopyrightText: 2013-2024 JC Brand <https://github.com/conversejs/converse.js/>
// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: MPL-2.0
// SPDX-License-Identifier: AGPL-3.0-only

// Must import the original muc.js, because it imports some custom elements files.
import '../../src/plugins/muc-views/templates/muc.js'
import { getChatRoomBodyTemplate } from '../../src/plugins/muc-views/utils.js'
import { html } from 'lit'

// Overloading the original muc.js, to add some custom elements.
export default (o) => {
  return html`
      <div class="flyout box-flyout">
          <converse-dragresize></converse-dragresize>
          ${
            o.model
              ? html`
                <converse-muc-heading jid="${o.model.get('jid')}" class="chat-head chat-head-chatroom row no-gutters">
                </converse-muc-heading>
                <livechat-converse-muc-terms .model=${o.model} termstype="global"></livechat-converse-muc-terms>
                <livechat-converse-muc-terms .model=${o.model} termstype="muc"></livechat-converse-muc-terms>
                <livechat-converse-muc-poll .model=${o.model}></livechat-converse-muc-poll>
                <div class="chat-body chatroom-body row no-gutters">${getChatRoomBodyTemplate(o)}</div>`
              : ''}
      </div>`
}
