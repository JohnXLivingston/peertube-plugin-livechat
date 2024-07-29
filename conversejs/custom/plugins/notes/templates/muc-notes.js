// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'
import { tplMucCreateNoteForm } from './muc-note'

export default function tplMucNotes (el, notes) {
  if (!notes) { // if user loses rights
    return html`` // FIXME: add a message like "you dont have access"?
  }

  return html`
    ${
      el.create_note_opened ? tplMucCreateNoteForm(el) : tplCreateButton(el)
    }
    ${
      repeat(notes, (note) => note.get('id'), (note) => {
        return html`<livechat-converse-muc-note .model=${note}></livechat-converse-muc-note>`
      })
    }`
}

function tplCreateButton (el) {
  // eslint-disable-next-line no-undef
  const i18nCreateNote = __(LOC_moderator_note_create)
  return html`
    <div class="notes-actions">
      <button class="notes-action" title="${i18nCreateNote}" @click=${el.openCreateNoteForm}>
        <converse-icon class="fa fa-plus" size="1em"></converse-icon>
      </button>
    </div>`
}
