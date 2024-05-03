import { XMLNS_TASKLIST, XMLNS_TASK } from './constants.js'
import { PubSubManager } from '../../shared/lib/pubsub-manager.js'
import { converse, _converse, api } from '../../../src/headless/core.js'
import { __ } from 'i18n'

export function getHeadingButtons (view, buttons) {
  const muc = view.model
  if (muc.get('type') !== _converse.CHATROOMS_TYPE) {
    // only on MUC.
    return buttons
  }

  if (!muc.tasklists) { // this is defined only if user has access (see initOrDestroyChatRoomTaskLists)
    return buttons
  }

  // TODO: use disco to discover the feature.
  // (if the chat is remote, the server could use a livechat version that does not support this feature)

  // Adding a "Open task list" button.
  buttons.unshift({
    // eslint-disable-next-line no-undef
    i18n_text: __(LOC_tasks),
    handler: async (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      // opening the muc task lists view:
      api.modal.show('livechat-converse-muc-task-lists-modal', { model: muc })
    },
    a_class: '',
    icon_class: 'fa-list', // FIXME
    name: 'muc-tasks'
  })

  return buttons
}

function _initChatRoomTaskLists (mucModel) {
  if (mucModel.taskManager) {
    // already initiliazed
    return
  }

  mucModel.tasklists = new _converse.ChatRoomTaskLists(undefined, { chatroom: mucModel })
  mucModel.tasks = new _converse.ChatRoomTasks(undefined, { chatroom: mucModel })

  mucModel.taskManager = new PubSubManager(
    mucModel.get('jid'),
    'livechat-tasks', // the node name
    {
      tasklist: {
        itemTag: 'tasklist',
        xmlns: XMLNS_TASKLIST,
        collection: mucModel.tasklists,
        fields: {
          name: String
        }
      },
      task: {
        itemTag: 'task',
        xmlns: XMLNS_TASK,
        collection: mucModel.tasks,
        fields: {
          name: String
        },
        attributes: {
          done: Boolean,
          list: String,
          order: Number
        }
      }
    }
  )
  mucModel.taskManager.start().catch(err => console.log(err))
}

function _destroyChatRoomTaskLists (mucModel) {
  if (!mucModel.taskManager) { return }

  mucModel.taskManager.stop().catch(err => console.log(err))
  mucModel.taskManager = undefined

  // mucModel.tasklists.unload() FIXME: add a method to unregister from the pubsub, and empty the tasklist.
  mucModel.tasklists = undefined
  mucModel.tasks = undefined
}

export function initOrDestroyChatRoomTaskLists (mucModel) {
  if (mucModel.get('type') !== _converse.CHATROOMS_TYPE) {
    // only on MUC.
    return _destroyChatRoomTaskLists(mucModel)
  }

  if (mucModel.session.get('connection_status') !== converse.ROOMSTATUS.ENTERED) {
    return _destroyChatRoomTaskLists(mucModel)
  }

  const myself = mucModel.getOwnOccupant()
  if (!myself || !myself.isModerator()) {
    // User must be moderator
    return _destroyChatRoomTaskLists(mucModel)
  }

  return _initChatRoomTaskLists(mucModel)
}
