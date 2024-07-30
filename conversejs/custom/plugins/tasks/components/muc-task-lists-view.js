// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { api } from '@converse/headless'
import tplMucTaskLists from '../templates/muc-task-lists'
import { __ } from 'i18n'
import { DraggablesCustomElement } from '../../../shared/components/draggables/index.js'

import '../styles/muc-task-lists.scss'

export default class MUCTaskListsView extends DraggablesCustomElement {
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

    this.draggableTagName = 'livechat-converse-muc-task'
    this.droppableTagNames = ['livechat-converse-muc-task', 'livechat-converse-muc-task-list']
    this.droppableAlwaysBottomTagNames = ['livechat-converse-muc-task-list']

    // Adding or removing a new task list: we must update.
    this.listenTo(this.model, 'add', () => this.requestUpdate())
    this.listenTo(this.model, 'remove', () => this.requestUpdate())
    this.listenTo(this.model, 'sort', () => this.requestUpdate())

    return super.initialize()
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

  isATaskEl (target) {
    return target.nodeName?.toLowerCase() === 'livechat-converse-muc-task'
  }

  isATaskListEl (target) {
    return target.nodeName?.toLowerCase() === 'livechat-converse-muc-task-list'
  }

  _dropDone (draggedEl, droppedOnEl, onTopHalf) {
    super._dropDone(...arguments)
    console.log('[livechat task drag&drop] Task dropped...')

    const task = draggedEl.model

    let newOrder, targetTasklist
    if (this.isATaskListEl(droppedOnEl)) {
      // We dropped on a task list, we must add as first entry.
      newOrder = 0

      targetTasklist = droppedOnEl.model
      if (task.get('list') !== targetTasklist.get('id')) {
        console.log('[livechat task drag&drop] Changing task list...')
        task.set('list', targetTasklist.get('id'))
      } else if (task.get('order') === newOrder) {
        // Just to avoid doing some modifications for nothing...
        console.log('[livechat task drag&drop] Task dropped on tasklist, but already first item, nothing to do')
        return
      }
    } else if (this.isATaskEl(droppedOnEl)) {
      // We dropped on a task, we must get its order (+1 if !onTopHalf)
      const droppedOnTask = droppedOnEl.model
      if (task === droppedOnTask) {
        // But of course, if dropped on itself there is nothing to do.
        console.log('[livechat task drag&drop] Task dropped on itself, nothing to do')
        return
      }

      if (task.get('list') !== droppedOnTask.get('list')) {
        console.log('[livechat task drag&drop] Changing task list...')
        task.set('list', droppedOnTask.get('list'))
      }

      newOrder = droppedOnTask.get('order') ?? 0
      if (!onTopHalf) { newOrder = Math.max(0, newOrder + 1) }

      if (typeof newOrder !== 'number' || isNaN(newOrder)) {
        console.error(
          'Dropped on a task that has not valid order.  ' +
          'Setting order to 0, that will refresh all tasks order, but the user will not have the expected result.'
        )
        newOrder = 0
      }

      targetTasklist = this.model.get(droppedOnTask.get('list'))
    } else {
      console.error('[livechat task drag&drop] Dropped on something that is not valid, aborting')
      return
    }

    this._saveOrders(targetTasklist.getTasks(), task, newOrder)
  }
}

api.elements.define('livechat-converse-muc-task-lists', MUCTaskListsView)
