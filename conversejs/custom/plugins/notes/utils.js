// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { XMLNS_NOTE } from './constants.js'
import { PubSubManager } from '../../shared/lib/pubsub-manager.js'
import { converse, _converse, api } from '../../../src/headless/index.js'
import { __ } from 'i18n'

export function getHeadingButtons (view, buttons) {
  const muc = view.model
  if (muc.get('type') !== _converse.constants.CHATROOMS_TYPE) {
    // only on MUC.
    return buttons
  }

  if (!muc.notes) { // this is defined only if user has access (see initOrDestroyChatRoomNotes)
    return buttons
  }

  // Adding a "Open moderator noteds" button.
  buttons.unshift({
    // eslint-disable-next-line no-undef
    i18n_text: __(LOC_moderator_notes),
    handler: async (ev) => {
      ev.preventDefault()
      // opening or closing the muc notes:
      const NoteAppEl = ev.target.closest('converse-root').querySelector('livechat-converse-muc-note-app')
      NoteAppEl.toggleApp()
    },
    a_class: '',
    icon_class: 'fa-note-sticky',
    name: 'muc-notes'
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
  if (!muc?.notes) {
    return buttons
  }

  // TODO: button to create a note from a message.
  // // eslint-disable-next-line no-undef
  // const i18nCreate = __(LOC_task_create)

  // buttons.push({
  //   i18n_text: i18nCreate,
  //   handler: async (ev) => {
  //     ev.preventDefault()
  //     api.modal.show('livechat-converse-pick-task-list-modal', {
  //       muc,
  //       message: messageModel
  //     }, ev)
  //   },
  //   button_class: '',
  //   icon_class: 'fa fa-list-check',
  //   name: 'muc-task-create-from-message'
  // })

  return buttons
}

function _initChatRoomNotes (mucModel) {
  if (mucModel.noteManager) {
    // already initiliazed
    return
  }

  mucModel.notes = new _converse.exports.ChatRoomNotes(undefined, { chatroom: mucModel })

  mucModel.noteManager = new PubSubManager(
    mucModel.get('jid'),
    'livechat-notes', // the node name
    {
      note: {
        itemTag: 'note',
        xmlns: XMLNS_NOTE,
        collection: mucModel.notes,
        fields: {
          name: String,
          description: String
        },
        attributes: {
          order: Number
        }
      }
    }
  )
  mucModel.noteManager.start().catch(err => console.log(err))

  // We must requestUpdate for all message actions, to add the "create note" button.
  // FIXME: this should not be done here (but it is simplier for now)
  document.querySelectorAll('converse-message-actions').forEach(el => el.requestUpdate())
}

function _destroyChatRoomNotes (mucModel) {
  if (!mucModel.noteManager) { return }

  mucModel.noteManager.stop().catch(err => console.log(err))
  mucModel.noteManager = undefined

  mucModel.notes = undefined

  // We must requestUpdate for all message actions, to remove the "create note" button.
  // FIXME: this should not be done here (but it is simplier for now)
  document.querySelectorAll('converse-message-actions').forEach(el => el.requestUpdate())
}

export function initOrDestroyChatRoomNotes (mucModel) {
  if (mucModel.get('type') !== _converse.constants.CHATROOMS_TYPE) {
    // only on MUC.
    return _destroyChatRoomNotes(mucModel)
  }

  if (!api.settings.get('livechat_note_app_enabled')) {
    // Feature disabled, no need to handle notes.
    return _destroyChatRoomNotes(mucModel)
  }

  if (mucModel.session.get('connection_status') !== converse.ROOMSTATUS.ENTERED) {
    return _destroyChatRoomNotes(mucModel)
  }

  // We must check disco features
  // (if the chat is remote, the server could use a livechat version that does not support this feature)
  if (!mucModel.features?.get?.(XMLNS_NOTE)) {
    return _destroyChatRoomNotes(mucModel)
  }

  const myself = mucModel.getOwnOccupant()
  if (!myself || !['admin', 'owner'].includes(myself.get('affiliation'))) {
    // User must be admin or owner
    return _destroyChatRoomNotes(mucModel)
  }

  return _initChatRoomNotes(mucModel)
}
