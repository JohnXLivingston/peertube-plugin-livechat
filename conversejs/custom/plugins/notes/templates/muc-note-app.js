// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { converseLocalizedHelpUrl } from '../../../shared/lib/help'
import { tplMUCApp } from '../../../shared/components/muc-app/templates/muc-app.js'
import { html } from 'lit'
import { __ } from 'i18n'

export function tplMUCNoteApp (el, mucModel) {
  if (!mucModel) {
    // should not happen
    return html``
  }
  if (!mucModel.notes) {
    // too soon, not initialized yet (this will happen)
    return html``
  }

  if (!el.show) {
    return html``
  }

  // eslint-disable-next-line no-undef
  const i18nNotes = __(LOC_moderator_notes)
  // eslint-disable-next-line no-undef
  const i18nHelp = __(LOC_online_help)
  const helpUrl = converseLocalizedHelpUrl({
    page: 'documentation/user/streamers/moderation_notes'
  })

  return tplMUCApp(
    el,
    i18nNotes,
    helpUrl,
    i18nHelp,
    html`<livechat-converse-muc-notes .model=${mucModel.notes}></livechat-converse-muc-notes>`
  )
}
