import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskList from './templates/muc-task-list'
import { __ } from 'i18n'

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
    return tplMucTaskList(this, this.model)
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
}

api.elements.define('livechat-converse-muc-task-list', MUCTaskListView)
