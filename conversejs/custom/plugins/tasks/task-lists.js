import { Collection } from '@converse/skeletor/src/collection.js'
import { ChatRoomTaskList } from './task-list'
import { initStorage } from '@converse/headless/utils/storage.js'
import { getUniqueId } from '@converse/headless/utils/core.js'

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

    this.fetchTasksLists().catch(console.error)
  }

  comparator (tasklist1, tasklist2) {
    // Case insensitive on task list name.
    const name1 = tasklist1.get('name').toLowerCase()
    const name2 = tasklist2.get('name').toLowerCase()
    return name1 < name2 ? -1 : name1 > name2 ? 1 : 0
  }

  create (attrs, options) {
    if (attrs instanceof ChatRoomTaskList) {
      return super.create(attrs, options)
    }
    attrs.id ??= getUniqueId()
    return super.create(attrs, options)
  }

  /**
   * Requires Task lists from the server.
   */
  async fetchTasksLists () {
    // TODO: remove these test lines, and subscribe to pubsub.
    const taskListsData = [
      {
        id: 'task-list-1',
        name: 'Task List 1'
      },
      {
        id: 'task-list-2',
        name: 'Task List 2'
      }
    ]

    for (const item of taskListsData) {
      let id = item.id

      const tasklist = id ? this.get(id) : undefined
      if (tasklist) {
        tasklist.save({
          name: item.name
        })
        return
      }

      id ??= getUniqueId()

      this.create({
        id,
        name: item.name
      })
    }
  }
}

export {
  ChatRoomTaskLists
}
