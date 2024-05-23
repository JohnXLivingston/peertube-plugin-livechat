// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '@converse/headless/core'
import tplMUCChatarea from '../../src/plugins/muc-views/templates/muc-chatarea.js'
import { html } from 'lit'

export default (o) => {
  return html`
    ${
      o?.model && api.settings.get('livechat_task_app_enabled')
        ? html`<livechat-converse-muc-task-app .model=${o.model}></livechat-converse-muc-task-app>`
        : ''
    }
    ${tplMUCChatarea(o)}`
}
