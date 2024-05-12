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

  // Adding a "Open task list" button.
  buttons.unshift({
    // eslint-disable-next-line no-undef
    i18n_text: __(LOC_tasks),
    handler: async (ev) => {
      ev.preventDefault()
      // opening or closing the muc task app:
      const taskAppEl = ev.target.closest('converse-root').querySelector('livechat-converse-muc-task-app')
      taskAppEl.toggleApp()
    },
    a_class: '',
    icon_class: 'fa-list-check',
    name: 'muc-tasks'
  })

  return buttons
}

export function getMessageActionButtons (messageActionsEl, buttons) {
  const messageModel = messageActionsEl.model
  if (messageModel.get('type') !== 'groupchat') {
    // only on groupchat message.
    return buttons
  }

  const muc = messageModel.collection?.chatbox
  if (!muc?.tasklists) {
    return buttons
  }

  // eslint-disable-next-line no-undef
  const i18nCreate = __(LOC_task_create)

  buttons.push({
    i18n_text: i18nCreate,
    handler: async (ev) => {
      ev.preventDefault()
      api.modal.show('livechat-converse-pick-task-list-modal', {
        muc,
        message: messageModel
      }, ev)
    },
    button_class: '',
    icon_class: 'fa fa-list-check',
    name: 'muc-task-create-from-message'
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
          name: String,
          description: String
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

  // We must requestUpdate for all message actions, to add the "create task" button.
  // FIXME: this should not be done here (but it is simplier for now)
  document.querySelectorAll('converse-message-actions').forEach(el => el.requestUpdate())
}

function _destroyChatRoomTaskLists (mucModel) {
  if (!mucModel.taskManager) { return }

  mucModel.taskManager.stop().catch(err => console.log(err))
  mucModel.taskManager = undefined

  // mucModel.tasklists.unload() FIXME: add a method to unregister from the pubsub, and empty the tasklist.
  mucModel.tasklists = undefined
  mucModel.tasks = undefined

  // We must requestUpdate for all message actions, to remove the "create task" button.
  // FIXME: this should not be done here (but it is simplier for now)
  document.querySelectorAll('converse-message-actions').forEach(el => el.requestUpdate())
}

export function initOrDestroyChatRoomTaskLists (mucModel) {
  if (mucModel.get('type') !== _converse.CHATROOMS_TYPE) {
    // only on MUC.
    return _destroyChatRoomTaskLists(mucModel)
  }

  if (!api.settings.get('livechat_task_app_enabled')) {
    // Feature disabled, no need to handle tasks.
    return _destroyChatRoomTaskLists(mucModel)
  }

  if (mucModel.session.get('connection_status') !== converse.ROOMSTATUS.ENTERED) {
    return _destroyChatRoomTaskLists(mucModel)
  }

  // We must check disco features
  // (if the chat is remote, the server could use a livechat version that does not support this feature)
  if (!mucModel.features?.get?.(XMLNS_TASKLIST) || !mucModel.features?.get?.(XMLNS_TASK)) {
    return _destroyChatRoomTaskLists(mucModel)
  }

  const myself = mucModel.getOwnOccupant()
  if (!myself || !['admin', 'owner'].includes(myself.get('affiliation'))) {
    // User must be admin or owner
    return _destroyChatRoomTaskLists(mucModel)
  }

  return _initChatRoomTaskLists(mucModel)
}
