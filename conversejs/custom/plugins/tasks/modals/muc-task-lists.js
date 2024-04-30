import BaseModal from '../../../../src/plugins/modal/modal.js'
import { api } from '../../../../src/headless/core.js'
import { html } from 'lit'
import { __ } from 'i18n'

export default class mucTaskListsModal extends BaseModal {
  renderModal () {
    const muc = this.model
    return html`<livechat-converse-muc-task-lists jid="${muc.get('jid')}"></livechat-converse-muc-task-lists>`
  }

  getModalTitle () {
    // eslint-disable-next-line no-undef
    return __(LOC_tasks)
  }
}

api.elements.define('livechat-converse-muc-task-lists-modal', mucTaskListsModal)
