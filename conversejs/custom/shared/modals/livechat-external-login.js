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

  onHide () {
    super.onHide()
    // kill the oidcGetResult handler if still there
    try {
      if (window.oidcGetResult) { window.oidcGetResult() }
    } catch (err) {
      console.error(err)
    }
  }
}

api.elements.define('converse-livechat-external-login', ExternalLoginModal)
