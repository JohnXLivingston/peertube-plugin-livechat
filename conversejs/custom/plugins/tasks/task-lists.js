import { Collection } from '@converse/skeletor/src/collection.js'
import { ChatRoomTaskList } from './task-list'

/**
 * A list of {@link _converse.ChatRoomTaskList} instances, representing task lists associated to a MUC.
 * @class
 * @namespace _converse.ChatRoomTaskLists
 * @memberOf _converse
 */
class ChatRoomTaskLists extends Collection {
  model = ChatRoomTaskList
}

export {
  ChatRoomTaskLists
}
