// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { converseLocalizedHelpUrl } from '../../../shared/lib/help'
import { html } from 'lit'
import { __ } from 'i18n'

export function tplMUCNoteApp (el, mucModel) {
  if (!mucModel) {
    // should not happen
    el.classList.add('hidden') // we must do this, otherwise will have CSS side effects
    return html``
  }
  if (!mucModel.notes) {
    // too soon, not initialized yet (this will happen)
    el.classList.add('hidden') // we must do this, otherwise will have CSS side effects
    return html``
  }

  if (!el.show) {
    el.classList.add('hidden')
    return html``
  }

  el.classList.remove('hidden')

  // eslint-disable-next-line no-undef
  const i18nNotes = __(LOC_moderator_notes)
  // eslint-disable-next-line no-undef
  const i18nHelp = __(LOC_online_help)
  const helpUrl = converseLocalizedHelpUrl({
    page: 'documentation/user/streamers/notes'
  })

  return html`
    <div class="livechat-converse-muc-app-header">
      <h5>${i18nNotes}</h5>
      <a href="${helpUrl}" target="_blank"><converse-icon
          class="fa fa-circle-question"
          size="1em"
          title="${i18nHelp}"
      ></converse-icon></a>
      <button class="livechat-converse-muc-app-close" @click=${el.toggleApp} title="${__('Close')}">
          <converse-icon class="fa fa-times" size="1em"></converse-icon>
      </button>
    </div>
    <div class="livechat-converse-muc-app-body">
      <livechat-converse-muc-notes .model=${mucModel.notes}></livechat-converse-muc-notes>
    </div>`
}
