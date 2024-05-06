import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import { tplMucTask } from './templates/muc-task'

export default class MUCTaskView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true }
    }
  }

  async initialize () {
    if (!this.model) {
      return
    }

    this.listenTo(this.model, 'change', () => this.requestUpdate())
  }

  render () {
    return tplMucTask(this.model)
  }
}

api.elements.define('livechat-converse-muc-task', MUCTaskView)
