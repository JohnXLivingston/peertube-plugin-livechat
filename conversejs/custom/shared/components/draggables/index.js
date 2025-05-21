// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
// SPDX-FileCopyrightText: 2025 Nicolas Chesnais <https://autre.space>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'

import './styles/draggables.scss'

/**
 * This is the base class for custom elements that contains draggable items.
 */
export class DraggablesCustomElement extends CustomElement {
  currentDragged = null
  droppableEl = null

  /**
   * The tag name for draggable elements.
   * Example: livechat-converse-muc-note.
   * Must be set in derived class.
   */
  draggableTagName = 'invalid-tag-name'

  /**
   * The tag names on which we can drop the element.
   * Examples: livechat-converse-muc-note, livechat-converse-muc-task, livechat-converse-muc-task-list.
   * Must be set in derived class.
   */
  droppableTagNames = []

  /**
   * Tag names for which we will always drop to bottom (for example: task lists)
   */
  droppableAlwaysBottomTagNames = []

  initialize () {
    this._handleDragStartBinded = this._handleDragStart.bind(this)
    this._handleDragOverBinded = this._handleDragOver.bind(this)
    this._handleDragLeaveBinded = this._handleDragLeave.bind(this)
    this._handleDragEndBinded = this._handleDragEnd.bind(this)
    this._handleDropBinded = this._handleDrop.bind(this)
    this._handleTouchStartBinded = this._handleTouchStart.bind(this)
    this._handleTouchMoveBinded = this._handleTouchMove.bind(this)
    this._handleTouchEndBinded = this._handleTouchEnd.bind(this)

    return super.initialize()
  }

  connectedCallback () {
    super.connectedCallback()
    this.currentDragged = null
    this.droppableEl = null
    this.addEventListener('dragstart', this._handleDragStartBinded)
    this.addEventListener('dragover', this._handleDragOverBinded)
    this.addEventListener('dragleave', this._handleDragLeaveBinded)
    this.addEventListener('dragend', this._handleDragEndBinded)
    this.addEventListener('drop', this._handleDropBinded)
    this.addEventListener('touchstart', this._handleTouchStartBinded)
    this.addEventListener('touchmove', this._handleTouchMoveBinded)
    this.addEventListener('touchend', this._handleTouchEndBinded)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.currentDragged = null
    this.droppableEl = null
    this.removeEventListener('dragstart', this._handleDragStartBinded)
    this.removeEventListener('dragover', this._handleDragOverBinded)
    this.removeEventListener('dragleave', this._handleDragLeaveBinded)
    this.removeEventListener('dragend', this._handleDragEndBinded)
    this.removeEventListener('drop', this._handleDropBinded)
    this.removeEventListener('touchstart', this._handleTouchStartBinded)
    this.removeEventListener('touchmove', this._handleTouchMoveBinded)
    this.removeEventListener('touchend', this._handleTouchEndBinded)
  }

  _isADraggableEl (target) {
    return target.nodeName?.toLowerCase() === this.draggableTagName
  }

  _getParentDroppableEl (target) {
    return target.closest?.(this.droppableTagNames.join(','))
  }

  _isOnTopHalf (y, el) {
    const bounding = el.getBoundingClientRect()
    return (y <= bounding.y + (bounding.height / 2))
  }

  _resetDropOver () {
    document.querySelectorAll('.livechat-drag-bottom-half, .livechat-drag-top-half').forEach(
      el => el.classList.remove('livechat-drag-bottom-half', 'livechat-drag-top-half')
    )
  }

  _setCurrentDragged (draggedEl) {
    console.log('[livechat drag&drop] Starting to drag a ' + this.draggableTagName + '...')
    this.currentDragged = draggedEl
    this._resetDropOver()
  }

  _setDroppableClasses (droppableEl, y) {
    // Are we on the top or bottom part of the droppableEl?
    let topHalf = false
    if (!this.droppableAlwaysBottomTagNames.includes(droppableEl.nodeName.toLowerCase())) {
      topHalf = this._isOnTopHalf(y, droppableEl)
    }
    droppableEl.classList.add(topHalf ? 'livechat-drag-top-half' : 'livechat-drag-bottom-half')
    droppableEl.classList.remove(topHalf ? 'livechat-drag-bottom-half' : 'livechat-drag-top-half')
  }

  _tryToDrop (droppedOnEl) {
    if (!droppedOnEl) return

    console.log('[livechat drag&drop] ' + this.draggableTagName + ' dropped...')
    try {
      this._dropDone(this.currentDragged, droppedOnEl, droppedOnEl.classList.contains('livechat-drag-top-half'))
    } catch (err) {
      console.error(err)
    }
    this._resetDropOver()
  }

  _handleDragStart (ev) {
    // The draggable=true is on a child bode
    const possibleEl = ev.target.parentElement
    if (!this._isADraggableEl(possibleEl)) { return }
    this._setCurrentDragged(possibleEl)
  }

  _handleDragOver (ev) {
    if (!this.currentDragged) { return }
    const droppableEl = this._getParentDroppableEl(ev.target)
    if (!droppableEl) { return }

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event says we should preventDefault
    ev.preventDefault()
    this._setDroppableClasses(droppableEl, ev.clientY)
  }

  _handleDragLeave (ev) {
    if (!this.currentDragged) { return }
    const el = this._getParentDroppableEl(ev.target)
    if (!el) { return }
    el.classList.remove('livechat-drag-bottom-half', 'livechat-drag-top-half')
  }

  _handleDragEnd (_ev) {
    this.currentDragged = null
    this._resetDropOver()
  }

  _handleDrop (_ev) {
    if (!this.currentDragged) { return }

    let droppedOnEl = document.querySelector('.livechat-drag-bottom-half, .livechat-drag-top-half')
    droppedOnEl = this._getParentDroppableEl(droppedOnEl)
    this._tryToDrop(droppedOnEl)
  }

  _handleTouchStart (ev) {
    const possibleEl = this._getParentDroppableEl(ev.target)
    if (!possibleEl) return
    this._setCurrentDragged(possibleEl)
  }

  _handleTouchMove (ev) {
    if (!this.currentDragged) return

    const { clientX, clientY } = ev.touches[0]
    const droppableEl = this._getParentDroppableEl(document.elementFromPoint(clientX, clientY))
    if (!droppableEl || droppableEl === this.droppableEl) return

    this.droppableEl = droppableEl
    this._resetDropOver()
    this._setDroppableClasses(droppableEl, clientY)
  }

  _handleTouchEnd (_ev) {
    if (!this.currentDragged || !this.droppableEl) return

    this._tryToDrop(this.droppableEl)
    this.currentDragged = null
    this.droppableEl = null
  }

  /**
   * The callback when a valid drop occurs.
   * Must be overloaded.
   */
  _dropDone (draggedEl, droppedOnEl, onTopHalf) {
    console.debug('[livechat drag&drop] Drop done:', draggedEl, droppedOnEl, onTopHalf)
  }

  /**
   * This method can be called from _dropDone to save the new objects orders.
   * For it to work, models must respect following constraints:
   * * be a Model
   * * have the order attribute
   * * have an id attribute (for logging)
   * * have get, set and saveItem methods
   */
  _saveOrders (models, currentModel, newOrder) {
    if (typeof newOrder !== 'number' || isNaN(newOrder)) {
      console.error('[livechat drag&drop] Computed new order is not a number, aborting.')
      return
    }

    console.log('[livechat drag&drop] Reordering models... Model new order will be ' + newOrder)
    let currentOrder = newOrder + 1
    for (const m of models) {
      if (m === currentModel) {
        console.log('[livechat drag&drop] Skipping the currently moved model')
        continue
      }

      let order = m.get('order') ?? 0
      if (typeof order !== 'number' || isNaN(order)) {
        console.error('[livechat drag&drop] Found a model with an invalid order, fixing it.')
        order = currentOrder // this will cause the code bellow to increment model order
      }
      if (order < newOrder) { continue }

      currentOrder++
      if (order > currentOrder) {
        console.log(
          `Object "${m.get('id')}" as already on order greater than ${currentOrder.toString()}, stoping.`
        )
        break
      }

      console.log(`Changing order of model "${m.get('id')}" to ${currentOrder}`)
      m.set('order', currentOrder)
      m.saveItem() // TODO: handle errors?
    }

    console.log('[livechat drag&drop] Setting new order on the moved model')
    currentModel.set('order', newOrder)
    currentModel.saveItem() // TODO: handle errors?
  }
}
