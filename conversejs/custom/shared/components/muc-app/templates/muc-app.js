// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { __ } from 'i18n'

export function tplMUCApp (el, i18nTitle, helpUrl, i18nHelp, content) {
  return html`
    <div class="livechat-converse-muc-app-header">
      <h5>${i18nTitle}</h5>
      <a href="${helpUrl}" target="_blank"><converse-icon
          class="fa fa-circle-question"
          size="1em"
          title="${i18nHelp}"
      ></converse-icon></a>
      <button type="button" class="livechat-converse-muc-app-close" @click=${el.toggleApp} title="${__('Close')}">
          <converse-icon class="fa fa-times" size="1em"></converse-icon>
      </button>
    </div>
    <div class="livechat-converse-muc-app-body">
      ${content}
    </div>`
}
