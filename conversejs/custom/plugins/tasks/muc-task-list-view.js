import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskList from './templates/muc-task-list'

export default class MUCTaskListView extends CustomElement {
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
    return tplMucTaskList(this.model)
  }
}

api.elements.define('livechat-converse-muc-task-list', MUCTaskListView)
