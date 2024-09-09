// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { html } from 'lit'

/**
 * Renders the message as a search result.
 * @param el The message element
 * @param mucModel The MUC model
 * @param searchOccupantModel The model of the occupant for which we are searching
 * @param message The message (warning: this is not a model)
 * @returns TemplateResult (or equivalent)
 */
export function tplMucMamSearchMessage (el, mucModel, searchOccupantModel, message) {
  const occupant = el.getMessageOccupant()
  return html`
    ${
      occupant
        ? html`
          <livechat-converse-muc-mam-search-occupant
            .model=${occupant}
            .message=${message}
          ></livechat-converse-muc-mam-search-occupant>`
        : ''
    }
    <converse-rich-text
        render_styling
        text=${message.body}>
    </converse-rich-text>
    <div class="livechat-message-date">${el.getDateTime()}</div>`
}
