// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { html } from 'lit'
import { api } from '@converse/headless'
import { getAuthorStyle } from '../../../../src/utils/color.js'
import { __ } from 'i18n'

export function tplMucMamSearchOccupant (el, occupant, message) {
  const authorStyle = getAuthorStyle(occupant)
  const jid = occupant.get('jid')
  const occupantId = occupant.get('occupant_id')

  return html`
    <a @click=${(ev) => {
      api.modal.show('converse-muc-occupant-modal', { model: occupant }, ev)
    }}>
      <converse-avatar
        .model=${occupant}
        class="avatar chat-msg__avatar"
        name="${occupant.getDisplayName()}"
        nonce=${occupant.vcard?.get('vcard_updated')}
        height="30" width="30"></converse-avatar>

      <span style=${authorStyle}>${occupant.getDisplayName()}</span>
    </a>
    <ul aria-hidden="true">
      ${
        // user changed nick: display the original nick
        message && message.nick !== undefined && message.nick !== occupant.get('nick')
          // eslint-disable-next-line no-undef
          ? html`<li title=${__(LOC_message_search_original_nick)}>${message.nick}</li>`
          : ''
      }
      ${jid ? html`<li title=${__('XMPP Address')}>${jid}</li>` : ''}
      ${occupantId ? html`<li title=${__('Occupant Id')}>${occupantId}</li>` : ''}
    </ul>`
}
