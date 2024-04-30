import { Collection } from '@converse/skeletor/src/collection.js'
import { ChatRoomTask } from './task'
import { initStorage } from '@converse/headless/utils/storage.js'
import { getUniqueId } from '@converse/headless/utils/core.js'

/**
 * A list of {@link _converse.ChatRoomTask} instances, representing all tasks associated to a MUC.
 * @class
 * @namespace _converse.ChatRoomTasks
 * @memberOf _converse
 */
class ChatRoomTasks extends Collection {
  model = ChatRoomTask
  comparator = 'order'

  initialize (models, options) {
    this.model = ChatRoomTask // don't know why, must do it again here
    super.initialize(arguments)
    this.chatroom = options.chatroom

    const id = `converse-livechat-tasks-${this.chatroom.get('jid')}`
    initStorage(this, id, 'session')

    this.on('change:order', () => this.sort())

    this.fetchTasks().catch(console.error)
  }

  create (attrs, options) {
    if (attrs instanceof ChatRoomTask) {
      return super.create(attrs, options)
    }
    attrs.id ??= getUniqueId()
    return super.create(attrs, options)
  }

  /**
   * Requires Task lists from the server.
   */
  async fetchTasks () {
    // TODO: remove these test lines, and subscribe to pubsub.
    const tasksData = [
      {
        id: 'task-1',
        name: 'Task 1.1',
        list: 'task-list-1',
        order: 1,
        done: false
      },
      {
        id: 'task-2',
        name: 'Task 1.2',
        list: 'task-list-1',
        order: 2,
        done: true
      },
      {
        id: 'task-3',
        name: 'Task 2.1',
        list: 'task-list-2',
        order: 1,
        done: false
      }
    ]

    for (const item of tasksData) {
      let id = item.id

      const task = id ? this.get(id) : undefined
      if (task) {
        task.save({
          name: item.name,
          list: item.list,
          order: item.order,
          done: item.done
        })
        return
      }

      id ??= getUniqueId()

      this.create({
        id,
        name: item.name,
        list: item.list,
        order: item.order,
        done: item.done
      })
    }
  }
}

export {
  ChatRoomTasks
}
