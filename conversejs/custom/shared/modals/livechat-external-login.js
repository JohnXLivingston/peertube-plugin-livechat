import { __ } from 'i18n'
import BaseModal from 'plugins/modal/modal.js'
import { api } from '@converse/headless/core'
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
}

api.elements.define('converse-livechat-external-login', ExternalLoginModal)
