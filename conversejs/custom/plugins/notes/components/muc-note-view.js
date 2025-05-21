// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless'
import { tplMucNote } from '../templates/muc-note'
import { __ } from 'i18n'

import '../styles/muc-note.scss'

export default class MUCNoteView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      edit: { type: Boolean, attribute: false },
      is_occupant_filter: { type: Boolean, attribute: true }
    }
  }

  async initialize () {
    this.edit = false
    if (!this.model) {
      return
    }

    this.listenTo(this.model, 'change', () => this.requestUpdate())
  }

  render () {
    return tplMucNote(this, this.model)
  }

  shouldUpdate (changedProperties) {
    if (!super.shouldUpdate(...arguments)) { return false }
    // When a note is currently edited, and another users change the order,
    // it could refresh losing the current form.
    // To avoid this, we cancel update here.
    // Note: of course, if 'edit' is part of the edited properties, we must update anyway
    // (it means we just leaved the form)
    if (this.edit && !changedProperties.has('edit')) {
      console.info('Canceling an update on note, because it is currently edited', this)
      return false
    }
    return true
  }

  async saveNote (ev) {
    ev?.preventDefault?.()

    const description = ev.target.description.value

    if ((description ?? '') === '') { return }

    try {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.setAttribute('disabled', true)
        el.classList.add('disabled')
      })

      const note = this.model
      note.set('description', description)
      await note.saveItem()

      this.edit = false
      this.requestUpdate() // In case we cancel another update in shouldUpdate
    } catch (err) {
      console.error(err)
    } finally {
      this.querySelectorAll('input[type=submit]').forEach(el => {
        el.removeAttribute('disabled')
        el.classList.remove('disabled')
      })
    }
  }

  async deleteNote (ev) {
    ev?.preventDefault?.()

    // eslint-disable-next-line no-undef
    const i18nConfirmDelete = __(LOC_moderator_note_delete_confirm)

    const result = await api.confirm(i18nConfirmDelete)
    if (!result) { return }

    try {
      await this.model.deleteItem()
    } catch (err) {
      api.alert(
        'error', __('Error'), [__('Error')]
      )
    }
  }

  async toggleEdit () {
    this.edit = !this.edit
    if (this.edit) {
      await this.updateComplete
      const textarea = this.querySelector('textarea[name="description"]')
      if (textarea) {
        textarea.focus()
        // Placing cursor at the end:
        textarea.selectionStart = textarea.value.length
        textarea.selectionEnd = textarea.selectionStart
      }
    }
  }
}

api.elements.define('livechat-converse-muc-note', MUCNoteView)
