// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { __ } from 'i18n'
import BaseModal from 'plugins/modal/modal.js'
import { api } from '@converse/headless/core'
import { modal_close_button as ModalCloseButton } from 'plugins/modal/templates/buttons.js'
import { html } from 'lit'
import 'livechat-external-login-content.js'

class PollFormModal extends BaseModal {
  initialize () {
    super.initialize()
  }

  renderModal () {
    return html`<livechat-converse-poll-form .model=${this.model} .modal=${this}></livechat-converse-poll-form>`
  }

  getModalTitle () {
    // eslint-disable-next-line no-undef
    return __(LOC_new_poll)
  }

  renderModalFooter () {
    return html`
      <div class="modal-footer">
        ${ModalCloseButton}
        <button
          type="submit"
          class="btn btn-primary"
          @click=${(ev) => {
            ev.preventDefault()
            this.querySelector('livechat-converse-poll-form form')?.requestSubmit()
          }}
        >
          ${__('Ok')}
        </button>
      </div>
    `
  }
}

api.elements.define('livechat-converse-poll-form-modal', PollFormModal)
