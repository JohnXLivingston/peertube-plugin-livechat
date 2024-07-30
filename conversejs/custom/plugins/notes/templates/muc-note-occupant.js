// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { api } from '@converse/headless'
import { getAuthorStyle } from '../../../../src/utils/color.js'
import { __ } from 'i18n'

export function tplMucNoteOccupant (el, occupant) {
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
    ${
      el.full_display
        ? html`<ul>
            ${jid ? html`<li title=${__('XMPP Address')}>${jid}</li>` : ''}
            ${occupantId ? html`<li title=${__('Occupant Id')}>${occupantId}</li>` : ''}
          </ul>`
        : ''
    }
  `
}
