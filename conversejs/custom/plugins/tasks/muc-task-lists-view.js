import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskLists from './templates/muc-task-lists'

export default class MUCTaskListsView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true }
    }
  }

  async initialize () {
    if (!this.model) {
      return
    }

    // Adding or removing a new task list: we must update.
    this.listenTo(this.model, 'add', () => this.requestUpdate())
    this.listenTo(this.model, 'remove', () => this.requestUpdate())
  }

  render () {
    return tplMucTaskLists(this.model)
  }
}

api.elements.define('livechat-converse-muc-task-lists', MUCTaskListsView)
