// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '@converse/headless/core'
import { CustomElement } from 'shared/components/element.js'
import { tplMUCTaskApp } from '../templates/muc-task-app.js'

import '../styles/muc-task-app.scss'

/**
 * Custom Element to display the Task Application.
 */
export default class MUCTaskApp extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true }, // mucModel
      show: { type: Boolean, attribute: false }
    }
  }

  async initialize () {
    this.show = api.settings.get('livechat_task_app_restore') &&
      (window.sessionStorage?.getItem?.('livechat-converse-task-app-show') === '1')
  }

  render () {
    return tplMUCTaskApp(this, this.model)
  }

  toggleApp () {
    this.show = !this.show
    window.sessionStorage?.setItem?.('livechat-converse-task-app-show', this.show ? '1' : '')
  }
}

api.elements.define('livechat-converse-muc-task-app', MUCTaskApp)
