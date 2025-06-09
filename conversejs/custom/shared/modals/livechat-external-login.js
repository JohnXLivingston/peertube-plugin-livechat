// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { __ } from 'i18n'
import BaseModal from 'plugins/modal/modal.js'
import { api } from '@converse/headless'
import { html } from 'lit'
import 'livechat-external-login-content.js'

class ExternalLoginModal extends BaseModal {
  remotePeertubeError = ''

  renderModal () {
    return html`<converse-livechat-external-login-content></converse-livechat-external-login-content>`
  }

  getModalTitle () {
    // eslint-disable-next-line no-undef
    return __(LOC_login_using_external_account)
  }

  close () {
    super.close()
    // kill the externalAuthGetResult handler if still there
    try {
      if (window.externalAuthGetResult) { window.externalAuthGetResult() }
    } catch (err) {
      console.error(err)
    }
  }
}

api.elements.define('converse-livechat-external-login', ExternalLoginModal)
