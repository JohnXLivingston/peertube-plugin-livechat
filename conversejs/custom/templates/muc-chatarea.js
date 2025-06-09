// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { api } from '@converse/headless'
import tplMUCChatarea from '../../src/plugins/muc-views/templates/muc-chatarea.js'
import { html } from 'lit'

export default (o) => {
  return html`
    ${
      o?.model && api.settings.get('livechat_task_app_enabled')
        ? html`<livechat-converse-muc-task-app .model=${o.model}></livechat-converse-muc-task-app>`
        : ''
    }
    ${
      o?.model && api.settings.get('livechat_note_app_enabled')
        ? html`<livechat-converse-muc-note-app .model=${o.model}></livechat-converse-muc-note-app>`
        : ''
    }
    ${
      o?.model && api.settings.get('livechat_mam_search_app_enabled')
        ? html`<livechat-converse-muc-mam-search-app .model=${o.model}></livechat-converse-muc-mam-search-app>`
        : ''
    }
    ${tplMUCChatarea(o)}`
}
