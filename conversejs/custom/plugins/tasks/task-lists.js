// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Collection } from '@converse/skeletor/src/collection.js'
import { ChatRoomTaskList } from './task-list'
import { initStorage } from '@converse/headless/utils/storage.js'

/**
 * A list of {@link _converse.exports.ChatRoomTaskList} instances, representing task lists associated to a MUC.
 * @class
 * @namespace _converse.exports.ChatRoomTaskLists
 * @memberOf _converse
 */
class ChatRoomTaskLists extends Collection {
  model = ChatRoomTaskList

  initialize (models, options) {
    this.model = ChatRoomTaskList // don't know why, must do it again here
    super.initialize(arguments)
    this.chatroom = options.chatroom

    const id = `converse-livechat-tasks-lists-${this.chatroom.get('jid')}`
    initStorage(this, id, 'session')

    this.on('change:name', () => this.sort())
  }

  comparator (tasklist1, tasklist2) {
    // Case insensitive on task list name.
    const name1 = tasklist1.get('name').toLowerCase()
    const name2 = tasklist2.get('name').toLowerCase()
    return name1 < name2 ? -1 : name1 > name2 ? 1 : 0
  }

  async createTaskList (data) {
    const name = data?.name
    if (!name) { throw new Error('Missing name') }

    console.log('Creating task list ' + name + '...')
    await this.chatroom.taskManager.createItem(this, { name })
    console.log('Task list ' + name + ' created.')
  }
}

export {
  ChatRoomTaskLists
}
