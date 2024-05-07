import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless/core'
import tplMucTaskLists from './templates/muc-task-lists'
import { __ } from 'i18n'

import './styles/muc-task-lists.scss'

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

  _isATaskEl (target) {
    return target.nodeName?.toLowerCase() === 'livechat-converse-muc-task'
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
    if (!this._isATaskEl(ev.target)) { return }
    console.log('Starting to drag a task...')
    this.currentDraggedTask = ev.target
    this._resetDropOver()
  }

  _handleDragOver (ev) {
    if (!this.currentDraggedTask) { return }
    const taskEl = this._getParentTaskEl(ev.target)
    if (!taskEl) { return }

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event says we should preventDefault
    ev.preventDefault()

    // Are we on the top or bottom part of the taskEl?
    const topHalf = this._isOnTopHalf(ev, taskEl)
    taskEl.classList.add(topHalf ? 'livechat-drag-top-half' : 'livechat-drag-bottom-half')
    taskEl.classList.remove(topHalf ? 'livechat-drag-bottom-half' : 'livechat-drag-top-half')
  }

  _handleDragLeave (ev) {
    if (!this.currentDraggedTask) { return }
    const taskEl = this._getParentTaskEl(ev.target)
    if (!taskEl) { return }
    taskEl.classList.remove('livechat-drag-bottom-half', 'livechat-drag-top-half')
  }

  _handleDragEnd (_ev) {
    this.currentDraggedTask = null
    this._resetDropOver()
  }

  _handleDrop (_ev) {
    if (!this.currentDraggedTask) { return }

    const draggedEl = document.querySelector('.livechat-drag-bottom-half, .livechat-drag-top-half')
    const taskEl = this._getParentTaskEl(draggedEl)
    if (!taskEl) { return }

    console.log('Task dropped...')

    const task = this.currentDraggedTask.model
    const droppedOnTask = taskEl.model

    if (task === droppedOnTask) {
      console.log('Task dropped on itself, nothing to do')
      return
    }

    if (task.get('list') !== droppedOnTask.get('list')) {
      console.log('Changing task list...')
      task.set('list', droppedOnTask.get('list'))
    }

    const topHalf = draggedEl.classList.contains('livechat-drag-top-half')
    let newOrder = droppedOnTask.get('order') ?? 0
    if (!topHalf) { Math.max(0, newOrder++) }
    console.log('Task new order will be ' + newOrder)

    const targetTasklist = this.model.get(droppedOnTask.get('list'))

    console.log('Reordering tasks...')
    let currentOrder = newOrder + 1
    for (const t of targetTasklist.getTasks()) {
      const order = t.get('order') ?? 0
      if (t === task) {
        console.log('Skipping the currently moved task')
        continue
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

    console.log('Setting new order on the moved task')
    task.set('order', newOrder)
    task.saveItem() // TODO: handle errors?

    this._resetDropOver()
  }
}

api.elements.define('livechat-converse-muc-task-lists', MUCTaskListsView)
