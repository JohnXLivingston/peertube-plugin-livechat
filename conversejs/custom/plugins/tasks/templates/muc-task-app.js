// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { converseLocalizedHelpUrl } from '../../../shared/lib/help'
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

  return html`
    <div class="livechat-converse-muc-app-header">
      <h5>${i18nTasks}</h5>
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
      <livechat-converse-muc-task-lists .model=${mucModel.tasklists}></livechat-converse-muc-task-lists>
    </div>`
}
