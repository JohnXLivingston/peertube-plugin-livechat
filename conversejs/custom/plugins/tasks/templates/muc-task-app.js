// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { converseLocalizedHelpUrl } from '../../../shared/lib/help'
import { tplMUCApp } from '../../../shared/components/muc-app/templates/muc-app.js'
import { html } from 'lit'
import { __ } from 'i18n'

export function tplMUCTaskApp (el, mucModel) {
  if (!mucModel) {
    // should not happen
    return html``
  }
  if (!mucModel.tasklists) {
    // too soon, not initialized yet (this will happen)
    return html``
  }

  if (!el.show) {
    return html``
  }

  // eslint-disable-next-line no-undef
  const i18nTasks = __(LOC_tasks)
  // eslint-disable-next-line no-undef
  const i18nHelp = __(LOC_online_help)
  const helpUrl = converseLocalizedHelpUrl({
    page: 'documentation/user/streamers/tasks'
  })

  return tplMUCApp(
    el,
    i18nTasks,
    helpUrl,
    i18nHelp,
    html`<livechat-converse-muc-task-lists .model=${mucModel.tasklists}></livechat-converse-muc-task-lists>`
  )
}
