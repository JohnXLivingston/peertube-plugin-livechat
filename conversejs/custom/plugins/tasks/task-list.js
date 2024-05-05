import { Model } from '@converse/skeletor/src/model.js'

/**
 * A chat room task list.
 * @class
 * @namespace _converse.ChatRoomTaskList
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

  async deleteItem () {
    return this.collection.chatroom.taskManager.deleteItem(this)
  }
}

export {
  ChatRoomTaskList
}
