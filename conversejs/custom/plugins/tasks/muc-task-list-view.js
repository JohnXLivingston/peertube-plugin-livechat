import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskList from './templates/muc-task-list'
import { __ } from 'i18n'

export default class MUCTaskListView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      collapsed: { type: Boolean, attribute: false },
      edit: { type: Boolean, attribute: false }
    }
  }

  async initialize () {
    this.collapsed = false
    this.edit = false
    if (!this.model) {
      return
    }

    this.listenTo(this.model, 'change', () => this.requestUpdate())
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

    // FIXME: when tasks are in a modal, api.confirm replaces the modal. This is not ok.
    // const result = await api.confirm(i18nConfirmDelete)
    const result = confirm(i18nConfirmDelete)
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
      const input = this.querySelector('input[name="name"]')
      if (input) {
        input.focus()
        // Placing cursor at the end:
        input.selectionStart = input.value.length
        input.selectionEnd = input.selectionStart
      }
    }
  }
}

api.elements.define('livechat-converse-muc-task-list', MUCTaskListView)
