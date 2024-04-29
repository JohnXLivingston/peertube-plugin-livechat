import { _converse, converse } from '../../../src/headless/core.js'
import { ChatRoomTaskLists } from './task-lists.js'
import { ChatRoomTaskList } from './task-list.js'
import { getHeadingButtons } from './utils.js'

converse.plugins.add('livechat-converse-tasks', {
  dependencies: ['converse-muc', 'converse-disco'], // TODO: add converse-pubsub

  initialize () {
    _converse.ChatRoomTaskLists = ChatRoomTaskLists
    _converse.ChatRoomTaskList = ChatRoomTaskList

    _converse.api.listen.on('getHeadingButtons', getHeadingButtons)
  }
})
