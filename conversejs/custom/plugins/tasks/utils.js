import { converse, _converse, api } from '../../../src/headless/core.js'
import { __ } from 'i18n'
const { Strophe, $iq } = converse.env

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
  if (mucModel.tasklists) {
    // already initiliazed
    return
  }

  mucModel.tasklists = new _converse.ChatRoomTaskLists(undefined, { chatroom: mucModel })
  mucModel.tasks = new _converse.ChatRoomTasks(undefined, { chatroom: mucModel })

  // Requesting all items.
  const stanza = $iq({
    type: 'get',
    from: _converse.bare_jid,
    to: mucModel.get('jid')
  }).c('pubsub', { xmlns: Strophe.NS.PUBSUB })
    .c('items', { node: 'livechat-tasks' })

  api.sendIQ(stanza).then(
    (iq) => {
      console.debug('task lists: ', iq)
    },
    (iq) => {
      if (iq === null || !iq?.querySelector) {
        console.error('Failed to retrieve tasks', iq)
        return
      }
      if (!iq.querySelector('error[type="cancel"] item-not-found')) {
        console.error('Failed to retrieve tasks:', iq)
        return
      }
      // This is totally normal when you open an empty task list.
      console.log('Not livechat-tasks node for now')
    }
  )
}

function _destroyChatRoomTaskLists (mucModel) {
  if (!mucModel.tasklists) { return }

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
