import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskLists from './templates/muc-task-lists'
import { __ } from 'i18n'

import './styles/muc-task-lists.scss'
import './styles/muc-task-drag.scss'

export default class MUCTaskListsView extends CustomElement {
  currentDraggedTask = null

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
    this.listenTo(this.model, 'sort', () => this.requestUpdate())

    this._handleDragStartBinded = this._handleDragStart.bind(this)
    this._handleDragOverBinded = this._handleDragOver.bind(this)
    this._handleDragLeaveBinded = this._handleDragLeave.bind(this)
    this._handleDragEndBinded = this._handleDragEnd.bind(this)
    this._handleDropBinded = this._handleDrop.bind(this)
  }

  render () {
    return tplMucTaskLists(this, this.model)
  }

  connectedCallback () {
    super.connectedCallback()
    this.currentDraggedTask = null
    this.addEventListener('dragstart', this._handleDragStartBinded)
    this.addEventListener('dragover', this._handleDragOverBinded)
    this.addEventListener('dragleave', this._handleDragLeaveBinded)
    this.addEventListener('dragend', this._handleDragEndBinded)
    this.addEventListener('drop', this._handleDropBinded)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.currentDraggedTask = null
    this.removeEventListener('dragstart', this._handleDragStartBinded)
    this.removeEventListener('dragover', this._handleDragOverBinded)
    this.removeEventListener('dragleave', this._handleDragLeaveBinded)
    this.removeEventListener('dragend', this._handleDragEndBinded)
    this.removeEventListener('drop', this._handleDropBinded)
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

  _getParentTaskEl (target) {
    return target.closest?.('livechat-converse-muc-task')
  }

  _getParentTaskOrTaskListEl (target) {
    return target.closest?.('livechat-converse-muc-task, livechat-converse-muc-task-list')
  }

  _isATaskEl (target) {
    return target.nodeName?.toLowerCase() === 'livechat-converse-muc-task'
  }

  isATaskListEl (target) {
    return target.nodeName?.toLowerCase() === 'livechat-converse-muc-task-list'
  }

  _isOnTopHalf (ev, taskEl) {
    const y = ev.clientY
    const bounding = taskEl.getBoundingClientRect()
    return (y <= bounding.y + (bounding.height / 2))
  }

  _resetDropOver () {
    document.querySelectorAll('.livechat-drag-bottom-half, .livechat-drag-top-half').forEach(
      el => el.classList.remove('livechat-drag-bottom-half', 'livechat-drag-top-half')
    )
  }

  _handleDragStart (ev) {
    // The draggable=true is on a livechat-converse-muc-task child
    const possibleTaskEl = ev.target.parentElement
    if (!this._isATaskEl(possibleTaskEl)) { return }
    console.log('[livechat task drag&drop] Starting to drag a task...')
    this.currentDraggedTask = possibleTaskEl
    this._resetDropOver()
  }

  _handleDragOver (ev) {
    if (!this.currentDraggedTask) { return }
    const taskOrTaskListEl = this._getParentTaskOrTaskListEl(ev.target)
    if (!taskOrTaskListEl) { return }

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event says we should preventDefault
    ev.preventDefault()

    // Are we on the top or bottom part of the taskEl?
    // Note: for task list, we always add the task in the task list, so no need to test here.
    const topHalf = this._isATaskEl(taskOrTaskListEl) ? this._isOnTopHalf(ev, taskOrTaskListEl) : false
    taskOrTaskListEl.classList.add(topHalf ? 'livechat-drag-top-half' : 'livechat-drag-bottom-half')
    taskOrTaskListEl.classList.remove(topHalf ? 'livechat-drag-bottom-half' : 'livechat-drag-top-half')
  }

  _handleDragLeave (ev) {
    if (!this.currentDraggedTask) { return }
    const taskOrTaskListEl = this._getParentTaskOrTaskListEl(ev.target)
    if (!taskOrTaskListEl) { return }
    taskOrTaskListEl.classList.remove('livechat-drag-bottom-half', 'livechat-drag-top-half')
  }

  _handleDragEnd (_ev) {
    this.currentDraggedTask = null
    this._resetDropOver()
  }

  _handleDrop (_ev) {
    if (!this.currentDraggedTask) { return }

    const droppedOnEl = document.querySelector('.livechat-drag-bottom-half, .livechat-drag-top-half')
    const droppedOntaskOrTaskListEl = this._getParentTaskOrTaskListEl(droppedOnEl)
    if (!droppedOntaskOrTaskListEl) { return }

    console.log('[livechat task drag&drop] Task dropped...')

    const task = this.currentDraggedTask.model

    let newOrder, targetTasklist
    if (this.isATaskListEl(droppedOntaskOrTaskListEl)) {
      // We dropped on a task list, we must add as first entry.
      newOrder = 0

      targetTasklist = droppedOntaskOrTaskListEl.model
      if (task.get('list') !== targetTasklist.get('id')) {
        console.log('[livechat task drag&drop] Changing task list...')
        task.set('list', targetTasklist.get('id'))
      } else if (task.get('order') === newOrder) {
        // Just to avoid doing some modifications for nothing...
        console.log('[livechat task drag&drop] Task dropped on tasklist, but already first item, nothing to do')
        return
      }
    } else if (this._isATaskEl(droppedOntaskOrTaskListEl)) {
      // We dropped on a task, we must get its order (+1 if !onTopHalf)
      const droppedOnTask = droppedOntaskOrTaskListEl.model
      if (task === droppedOnTask) {
        // But of course, if dropped on itself there is nothing to do.
        console.log('[livechat task drag&drop] Task dropped on itself, nothing to do')
        return
      }

      if (task.get('list') !== droppedOnTask.get('list')) {
        console.log('[livechat task drag&drop] Changing task list...')
        task.set('list', droppedOnTask.get('list'))
      }

      const topHalf = droppedOnEl.classList.contains('livechat-drag-top-half')
      newOrder = droppedOnTask.get('order') ?? 0
      if (!topHalf) { newOrder = Math.max(0, newOrder + 1) }

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

    if (typeof newOrder !== 'number' || isNaN(newOrder)) {
      console.error('[livechat task drag&drop] Computed new order is not a number, aborting.')
      return
    }
    console.log('[livechat task drag&drop] Task new order will be ' + newOrder)

    console.log('[livechat task drag&drop] Reordering tasks...')
    let currentOrder = newOrder + 1
    for (const t of targetTasklist.getTasks()) {
      if (t === task) {
        console.log('[livechat task drag&drop] Skipping the currently moved task')
        continue
      }

      let order = t.get('order') ?? 0
      if (typeof order !== 'number' || isNaN(order)) {
        console.error('[livechat task drag&drop] Found a task with an invalid order, fixing it.')
        order = currentOrder // this will cause the code bellow to increment task order
      }
      if (order < newOrder) { continue }

      currentOrder++
      if (order > currentOrder) {
        console.log(
          `Task "${t.get('name')}" as already on order greater than ${currentOrder.toString()}, stoping.`
        )
        break
      }

      console.log(`Changing order of task "${t.get('name')}" to ${currentOrder}`)
      t.set('order', currentOrder)
      t.saveItem() // TODO: handle errors?
    }

    console.log('[livechat task drag&drop] Setting new order on the moved task')
    task.set('order', newOrder)
    task.saveItem() // TODO: handle errors?

    this._resetDropOver()
  }
}

api.elements.define('livechat-converse-muc-task-lists', MUCTaskListsView)
