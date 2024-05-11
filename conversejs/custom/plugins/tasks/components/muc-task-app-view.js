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
    this.show = false
  }

  render () {
    return tplMUCTaskApp(this, this.model)
  }

  toggleApp () {
    this.show = !this.show
  }
}

api.elements.define('livechat-converse-muc-task-app', MUCTaskApp)
