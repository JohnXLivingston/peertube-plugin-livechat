import { CustomElement } from 'shared/components/element.js'
import { _converse, api } from '@converse/headless/core'
import tplMucTaskLists from './templates/muc-task-lists'

export default class MUCTaskListsView extends CustomElement {
  static get properties () {
    return {
      jid: { type: String, attribute: true }
    }
  }

  async initialize () {
    this.model = _converse.chatboxes.get(this.getAttribute('jid')).tasklists

    if (!this.model) {
      return
    }

    this.listenTo(this.model, 'add', () => this.requestUpdate())
    this.listenTo(this.model, 'change', () => this.requestUpdate())
  }

  render () {
    return tplMucTaskLists(this.model)
  }
}

api.elements.define('livechat-converse-muc-task-lists', MUCTaskListsView)
