// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '@converse/headless'
import { MUCApp } from '../../../shared/components/muc-app/index.js'
import { tplMUCNoteApp } from '../templates/muc-note-app.js'

/**
 * Custom Element to display the Notes Application.
 */
export default class MUCNoteApp extends MUCApp {
  enableSettingName = 'livechat_note_app_restore'
  sessionStorangeShowKey = 'livechat-converse-note-app-show'

  render () {
    return tplMUCNoteApp(this, this.model)
  }
}

api.elements.define('livechat-converse-muc-note-app', MUCNoteApp)
