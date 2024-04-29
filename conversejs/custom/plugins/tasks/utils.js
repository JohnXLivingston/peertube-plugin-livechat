import { _converse } from '../../../src/headless/core.js'
import { __ } from 'i18n'

export function getHeadingButtons (view, buttons) {
  const muc = view.model
  if (muc.get('type') !== _converse.CHATROOMS_TYPE) {
    // only on MUC.
    return buttons
  }

  const myself = muc.getOwnOccupant()
  if (!myself || !myself.isModerator()) {
    // User must be moderator
    return buttons
  }

  // Adding a "Open task list" button.
  buttons.unshift({
    i18n_text: __('Tasks'),
    handler: async (ev) => {
      ev.preventDefault()
      ev.stopPropagation()

      // TODO.
    },
    a_class: '',
    icon_class: 'fa-list', // FIXME
    name: 'muc-tasks'
  })

  return buttons
}
