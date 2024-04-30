import { CustomElement } from 'shared/components/element.js'
import { _converse, api } from '@converse/headless/core'

export default class MUCTaskListsView extends CustomElement {
  static get properties () {
    return {
      jid: { type: String, attribute: true }
    }
  }

  async initialize () {
    this.model = _converse.chatboxes.get(this.getAttribute('jid'))
  }

  render () {
    return ''
  }
}

api.elements.define('livechat-converse-muc-task-lists', MUCTaskListsView)
