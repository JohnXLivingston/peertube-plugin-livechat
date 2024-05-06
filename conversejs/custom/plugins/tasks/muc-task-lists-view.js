import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskLists from './templates/muc-task-lists'
import { __ } from 'i18n'

import './styles/muc-task-lists.scss'

export default class MUCTaskListsView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      create_tasklist_error_message: { type: String, attribute: false }
    }
  }

  async initialize () {
    this.create_tasklist_error_message = ''

    if (!this.model) {
      return
    }

    // Adding or removing a new task list: we must update.
    this.listenTo(this.model, 'add', () => this.requestUpdate())
    this.listenTo(this.model, 'remove', () => this.requestUpdate())
  }

  render () {
    return tplMucTaskLists(this, this.model)
  }

  async submitCreateTaskList (ev) {
    ev.preventDefault()

    const name = ev.target.name.value.trim()
    if (this.create_tasklist_error_message) {
      this.create_tasklist_error_message = ''
    }

    if ((name ?? '') === '') { return }

    try {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.setAttribute('disabled', true)
        el.classList.add('disabled')
      })

      await this.model.createTaskList({
        name
      })

      this.querySelector('input[name=name]').value = ''
    } catch (err) {
      console.error(err)
      // eslint-disable-next-line no-undef
      this.create_tasklist_error_message = __(LOC_task_list_create_error)
    } finally {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.removeAttribute('disabled')
        el.classList.remove('disabled')
      })
    }
  }
}

api.elements.define('livechat-converse-muc-task-lists', MUCTaskListsView)
