// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless'
import { tplMucTask } from '../templates/muc-task'
import { __ } from 'i18n'

import '../styles/muc-tasks.scss'

export default class MUCTaskView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      edit: { type: Boolean, attribute: false }
    }
  }

  async initialize () {
    this.edit = false
    if (!this.model) {
      return
    }

    this.listenTo(this.model, 'change', () => this.requestUpdate())
  }

  render () {
    return tplMucTask(this, this.model)
  }

  shouldUpdate (changedProperties) {
    if (!super.shouldUpdate(...arguments)) { return false }
    // When a task is currently edited, and another users change the order,
    // it could refresh losing the current form.
    // To avoid this, we cancel update here.
    // Note: of course, if 'edit' is part of the edited properties, we must update anyway
    // (it means we just leaved the form)
    if (this.edit && !changedProperties.has('edit')) {
      console.info('Canceling an update on task, because it is currently edited', this)
      return false
    }
    // FIXME: in some case this is not enough. Can't understand exactly why for now.
    //    probably because of some of the requestUpdate on the task-list or task-lists.
    return true
  }

  async saveTask (ev) {
    ev?.preventDefault?.()

    const name = ev.target.name.value.trim()

    if ((name ?? '') === '') { return }

    try {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.setAttribute('disabled', true)
        el.classList.add('disabled')
      })

      const task = this.model
      task.set('name', name)
      task.set('description', ev.target.description.value.trim())
      await task.saveItem()

      this.edit = false
      this.requestUpdate() // In case we cancel another update in shouldUpdate
    } catch (err) {
      console.error(err)
    } finally {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.removeAttribute('disabled')
        el.classList.remove('disabled')
      })
    }
  }

  async deleteTask (ev) {
    ev?.preventDefault?.()

    // eslint-disable-next-line no-undef
    const i18nConfirmDelete = __(LOC_task_delete_confirm)

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

  async toggleEdit () {
    this.edit = !this.edit
    if (this.edit) {
      await this.updateComplete
      const input = this.querySelector('.task-name input[name="name"]')
      if (input) {
        input.focus()
        // Placing cursor at the end:
        input.selectionStart = input.value.length
        input.selectionEnd = input.selectionStart
      }
    }
  }
}

api.elements.define('livechat-converse-muc-task', MUCTaskView)
