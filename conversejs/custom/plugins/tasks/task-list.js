// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Model } from '@converse/skeletor/src/model.js'

/**
 * A chat room task list.
 * @class
 * @namespace _converse.exports.ChatRoomTaskList
 * @memberof _converse
 */
class ChatRoomTaskList extends Model {
  idAttribute = 'id'

  getTasks () {
    const taskListId = this.get('id')
    return this.collection?.chatroom?.tasks?.filter({
      list: taskListId
    }) ?? []
  }

  async saveItem () {
    console.log('Saving task list ' + this.get('id') + '...')
    await this.collection.chatroom.taskManager.saveItem(this)
    console.log('Task list ' + this.get('id') + ' saved.')
  }

  async deleteItem () {
    const tasks = this.getTasks()
    return this.collection.chatroom.taskManager.deleteItems([...tasks, this])
  }

  async createTask (data) {
    // Cloning data to avoid side effects:
    data = Object.assign({}, data)

    const name = data?.name
    if (!name) { throw new Error('Missing name') }

    data.list = this.get('id')
    if (!data.order) {
      data.order = 0 + Math.max(
        0,
        ...(this.getTasks().map(t => t.get('order') ?? 0).filter(o => !isNaN(o)))
      )
    }

    console.log('Creating task ' + name + '...')
    const chatroom = this.collection.chatroom
    const tasksCollection = chatroom.tasks
    await chatroom.taskManager.createItem(tasksCollection, data)
    console.log('Task list ' + name + ' created.')
  }
}

export {
  ChatRoomTaskList
}
