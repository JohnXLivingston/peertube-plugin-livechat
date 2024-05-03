import { Collection } from '@converse/skeletor/src/collection.js'
import { ChatRoomTaskList } from './task-list'
import { XMLNS_TASKLIST } from './constants'
import { initStorage } from '@converse/headless/utils/storage.js'
import { converse, api } from '@converse/headless/core'
const { $build } = converse.env

/**
 * A list of {@link _converse.ChatRoomTaskList} instances, representing task lists associated to a MUC.
 * @class
 * @namespace _converse.ChatRoomTaskLists
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
    const item = $build('item').c('tasklist', { xmlns: XMLNS_TASKLIST })
    item.c('name').t(name)
    await api.pubsub.publish(this.chatroom.get('jid'), 'livechat-tasks', item)
    console.log('Task list ' + name + ' created.')
  }
}

export {
  ChatRoomTaskLists
}
