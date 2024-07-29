// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless'
import tplMucNotes from '../templates/muc-notes'
import { __ } from 'i18n'

import '../styles/muc-notes.scss'

export default class MUCNotesView extends CustomElement {
  currentDraggedNote = null

  static get properties () {
    return {
      model: { type: Object, attribute: true },
      create_note_error_message: { type: String, attribute: false },
      create_note_opened: { type: Boolean, attribute: false }
    }
  }

  async initialize () {
    this.create_note_error_message = ''

    if (!this.model) {
      return
    }

    // Adding or removing a new note: we must update.
    this.listenTo(this.model, 'add', () => this.requestUpdate())
    this.listenTo(this.model, 'remove', () => this.requestUpdate())
    this.listenTo(this.model, 'sort', () => this.requestUpdate())

    // this._handleDragStartBinded = this._handleDragStart.bind(this)
    // this._handleDragOverBinded = this._handleDragOver.bind(this)
    // this._handleDragLeaveBinded = this._handleDragLeave.bind(this)
    // this._handleDragEndBinded = this._handleDragEnd.bind(this)
    // this._handleDropBinded = this._handleDrop.bind(this)
  }

  render () {
    return tplMucNotes(this, this.model)
  }

  async openCreateNoteForm (ev) {
    ev?.preventDefault?.()
    this.create_note_opened = true
    await this.updateComplete
    const textarea = this.querySelector('.notes-create-note textarea[name="description"]')
    if (textarea) {
      textarea.focus()
    }
  }

  closeCreateNoteForm (ev) {
    ev?.preventDefault?.()
    this.create_note_opened = false
  }

  async submitCreateNote (ev) {
    ev.preventDefault()

    const description = ev.target.description.value
    if (this.create_note_error_message) {
      this.create_note_error_message = ''
    }

    if ((description ?? '') === '') { return }

    try {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.setAttribute('disabled', true)
        el.classList.add('disabled')
      })

      await this.model.createNote({
        description: description
      })

      this.closeCreateNoteForm()
    } catch (err) {
      console.error(err)
      // eslint-disable-next-line no-undef
      this.create_note_error_message = __(LOC_moderator_notes_create_error)
    } finally {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.removeAttribute('disabled')
        el.classList.remove('disabled')
      })
    }
  }
}

api.elements.define('livechat-converse-muc-notes', MUCNotesView)
