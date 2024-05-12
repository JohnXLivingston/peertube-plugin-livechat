import { _converse, converse } from '../../../src/headless/core.js'
import { ChatRoomTaskLists } from './task-lists.js'
import { ChatRoomTaskList } from './task-list.js'
import { ChatRoomTasks } from './tasks.js'
import { getHeadingButtons, initOrDestroyChatRoomTaskLists } from './utils.js'
import { XMLNS_TASK, XMLNS_TASKLIST } from './constants.js'
import './components/muc-task-view.js' // FIXME: here or in another file?
import './components/muc-task-list-view.js' // FIXME: here or in another file?
import './components/muc-task-lists-view.js' // FIXME: here or in another file?
import './components/muc-task-app-view.js' // FIXME: here or in another file?

converse.plugins.add('livechat-converse-tasks', {
  dependencies: ['converse-muc', 'converse-disco', 'converse-pubsub'],

  initialize () {
    _converse.ChatRoomTaskLists = ChatRoomTaskLists
    _converse.ChatRoomTaskList = ChatRoomTaskList
    _converse.ChatRoomTasks = ChatRoomTasks

    _converse.api.settings.extend({
      livechat_task_list_enabled: false
    })

    _converse.api.listen.on('chatRoomInitialized', muc => {
      muc.session.on('change:connection_status', _session => {
        // When joining a room, initializing the TaskLists object (if user has access),
        // When disconnected from a room, destroying the Tasklists object:
        initOrDestroyChatRoomTaskLists(muc)
      })

      // When the current user affiliation changes, we must also delete or initialize the TaskLists object:
      muc.occupants.on('change:affiliation', occupant => {
        if (occupant.get('jid') !== _converse.bare_jid) { // only for myself
          return
        }
        initOrDestroyChatRoomTaskLists(muc)
      })

      // To be sure that everything works in any case, we also must listen for addition in muc.features.
      muc.features.on('change:' + XMLNS_TASK, () => {
        initOrDestroyChatRoomTaskLists(muc)
      })
      muc.features.on('change:' + XMLNS_TASKLIST, () => {
        initOrDestroyChatRoomTaskLists(muc)
      })
    })

    // adding the "Tasks" button in the MUC heading buttons:
    _converse.api.listen.on('getHeadingButtons', getHeadingButtons)
  }
})
