import { _converse, converse } from '../../../src/headless/core.js'
import { ChatRoomTaskLists } from './task-lists.js'
import { ChatRoomTaskList } from './task-list.js'
import { getHeadingButtons } from './utils.js'
import './muc-task-lists-view.js' // FIXME: here or in another file?
import './modals/muc-task-lists.js' // FIXME: here or in another file?

converse.plugins.add('livechat-converse-tasks', {
  dependencies: ['converse-muc', 'converse-disco'], // TODO: add converse-pubsub

  initialize () {
    _converse.ChatRoomTaskLists = ChatRoomTaskLists
    _converse.ChatRoomTaskList = ChatRoomTaskList

    // adding the "Tasks" button in the MUC heading buttons:
    _converse.api.listen.on('getHeadingButtons', getHeadingButtons)
  }
})
