// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'
import { tplMucCreateNoteForm } from './muc-note'

function tplFilters (el) {
  const filterOccupant = el.occupant_filter
  if (!filterOccupant) { return '' }

  // eslint-disable-next-line no-undef
  const i18nSearch = __(LOC_moderator_note_filters)

  return html`
    <div class="notes-filters">
      <converse-icon class="fa fa-magnifying-glass" size="1em" title=${i18nSearch}></converse-icon>
      ${
        filterOccupant
          ? html`<livechat-converse-muc-note-occupant
              full_display=${true}
              .model=${filterOccupant}
            ></livechat-converse-muc-note-occupant>`
          : ''
      }
      <button type="button" class="notes-action" @click=${(ev) => {
        ev?.preventDefault()
        el.filterNotes({})
      }} title="${__('Close')}">
        <converse-icon class="fa fa-times" size="1em"></converse-icon>
      </button>
    </div>
    <hr/>
  `
}

function isFiltered (el, note) {
  const filterOccupant = el.occupant_filter
  if (!filterOccupant) { return false }

  const noteOccupant = note.getAboutOccupant()
  // there is an occupant filter, so if current note has no associated occupant, we can pass.
  if (!noteOccupant) { return true }

  if (noteOccupant === filterOccupant) {
    // Yes!
    return false
  }

  // We will also test for nickname, so that we can found anonymous users
  // (they can have multiple associated occupants)
  if (filterOccupant.get('nick') && filterOccupant.get('nick') === noteOccupant.get('nick')) {
    return false
  }

  return true
}

export default function tplMucNotes (el, notes) {
  if (!notes) { // if user loses rights
    return html`` // FIXME: add a message like "you dont have access"?
  }

  return html`
    ${
      el.create_note_opened ? tplMucCreateNoteForm(el, el.create_note_about_occupant) : tplCreateButton(el)
    }
    ${tplFilters(el)}
    ${
      repeat(notes, (note) => note.get('id'), (note) => {
        return isFiltered(el, note)
          ? ''
          : html`<livechat-converse-muc-note
            .model=${note}
            .is_ocupant_filter=${!!el.occupant_filter}
          ></livechat-converse-muc-note>`
      })
    }`
}

function tplCreateButton (el) {
  // eslint-disable-next-line no-undef
  const i18nCreateNote = __(LOC_moderator_note_create)
  return html`
    <div class="notes-actions">
      <button type="button" class="notes-action" title="${i18nCreateNote}" @click=${el.openCreateNoteForm}>
        <converse-icon class="fa fa-plus" size="1em"></converse-icon>
      </button>
    </div>`
}
