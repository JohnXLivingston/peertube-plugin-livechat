// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskList from '../templates/muc-task-list'
import { __ } from 'i18n'

export default class MUCTaskListView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      collapsed: { type: Boolean, attribute: false },
      edit: { type: Boolean, attribute: false },
      add_task_form_opened: { type: Boolean, attribute: false }
    }
  }

  async initialize () {
    this.collapsed = false
    this.edit = false
    this.add_task_form_opened = false
    if (!this.model) {
      return
    }

    this.listenTo(this.model, 'change', () => this.requestUpdate())

    // We must also listen for new tasks
    // FIXME: is there a way to only refresh if the task is part of this list?
    this.listenTo(this.model.collection.chatroom.tasks, 'add', () => this.requestUpdate())
    this.listenTo(this.model.collection.chatroom.tasks, 'remove', () => this.requestUpdate())
    this.listenTo(this.model.collection.chatroom.tasks, 'sort', () => this.requestUpdate())
    this.listenTo(this.model.collection.chatroom.tasks, 'change:list', () => this.requestUpdate())
  }

  render () {
    return tplMucTaskList(this, this.model)
  }

  async saveTaskList (ev) {
    ev?.preventDefault?.()

    const name = ev.target.name.value.trim()

    if ((name ?? '') === '') { return }

    try {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.setAttribute('disabled', true)
        el.classList.add('disabled')
      })

      const tasklist = this.model
      tasklist.set('name', name)
      await tasklist.saveItem()

      this.edit = false
    } catch (err) {
      console.error(err)
    } finally {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.removeAttribute('disabled')
        el.classList.remove('disabled')
      })
    }
  }

  async deleteTaskList (ev) {
    ev?.preventDefault?.()

    // eslint-disable-next-line no-undef
    const i18nConfirmDelete = __(LOC_task_list_delete_confirm)

    const result = await api.confirm(i18nConfirmDelete)
    if (!result) { return }

    try {
      await this.model.deleteItem()
    } catch (err) {
      api.alert(
        'error', __('Error'), [__('Error')]
      )
    }
  }

  toggleTasks () {
    this.collapsed = !this.collapsed
  }

  async toggleEdit () {
    this.edit = !this.edit
    if (this.edit) {
      await this.updateComplete
      const input = this.querySelector('.task-list-name input[name="name"]')
      if (input) {
        input.focus()
        // Placing cursor at the end:
        input.selectionStart = input.value.length
        input.selectionEnd = input.selectionStart
      }
    }
  }

  async openAddTaskForm () {
    this.add_task_form_opened = true
    await this.updateComplete
    const input = this.querySelector('.task-list-add-task input[name="name"]')
    if (input) {
      input.focus()
    }
  }

  closeAddTaskForm () {
    this.add_task_form_opened = false
  }

  async submitAddTask (ev) {
    ev.preventDefault()

    const name = ev.target.name.value.trim()
    if ((name ?? '') === '') { return }

    try {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.setAttribute('disabled', true)
        el.classList.add('disabled')
      })

      await this.model.createTask({
        name,
        description: ev.target.description.value.trim()
      })

      this.closeAddTaskForm()

      // If the task list is collapsed, we must open it.
      // Otherwise, the newly created task won't show up, and user could think that there is a bug.
      if (this.collapsed) { this.collapsed = false }
    } catch (err) {
      console.error(err)
    } finally {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.removeAttribute('disabled')
        el.classList.remove('disabled')
      })
    }
  }
}

api.elements.define('livechat-converse-muc-task-list', MUCTaskListView)
