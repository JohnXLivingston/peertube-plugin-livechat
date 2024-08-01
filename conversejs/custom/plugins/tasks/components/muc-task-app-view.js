// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '@converse/headless'
import { MUCApp } from '../../../shared/components/muc-app/index.js'
import { tplMUCTaskApp } from '../templates/muc-task-app.js'

/**
 * Custom Element to display the Task Application.
 */
export default class MUCTaskApp extends MUCApp {
  restoreSettingName = 'livechat_task_app_restore'
  sessionStorageRestoreKey = 'livechat-converse-task-app-show'

  render () {
    return tplMUCTaskApp(this, this.model)
  }
}

api.elements.define('livechat-converse-muc-task-app', MUCTaskApp)
