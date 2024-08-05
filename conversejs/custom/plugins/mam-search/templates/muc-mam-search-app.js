// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { converseLocalizedHelpUrl } from '../../../shared/lib/help'
import { tplMUCApp } from '../../../shared/components/muc-app/templates/muc-app.js'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

function tplContent (el, mucModel, occupantModel) {
  return html`
    ${
      occupantModel
        ? html`
          <livechat-converse-muc-mam-search-occupant
            .model=${occupantModel}
          ></livechat-converse-muc-mam-search-occupant>
        `
        : ''
    }
    <hr>
    ${
      el.results
        ? repeat(el.results, (message) => message.id, message => {
            return html`<livechat-converse-muc-mam-search-message
              .message=${message} .mucModel=${mucModel} .searchOccupantModel=${occupantModel}
            ></livechat-converse-muc-mam-search-message>`
          })
        : html`<livechat-spinner></livechat-spinner>`
    }
  `
}

export function tplMamSearchApp (el, mucModel, occupantModel) {
  if (!mucModel) {
    // should not happen
    return html``
  }

  if (!el.show) {
    return html``
  }

  // eslint-disable-next-line no-undef
  const i18nSearch = __(LOC_message_search)
  // eslint-disable-next-line no-undef
  const i18nHelp = __(LOC_online_help)
  const helpUrl = converseLocalizedHelpUrl({
    page: 'documentation/user/streamers/moderation'
  })

  return tplMUCApp(
    el,
    i18nSearch,
    helpUrl,
    i18nHelp,
    tplContent(el, mucModel, occupantModel)
  )
}
