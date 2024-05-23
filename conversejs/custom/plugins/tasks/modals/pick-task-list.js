// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import BaseModal from 'plugins/modal/modal.js'
import tplPickTaskList from './templates/pick-task-list.js'
import { api } from '@converse/headless/core'
import { __ } from 'i18n'

export default class PickTaskListModal extends BaseModal {
  constructor (options) {
    super(options)
    this.muc = options.muc
    this.message = options.message
  }

  initialize () {
    super.initialize(...arguments)
    this.addEventListener('shown.bs.modal', () => {
      this.querySelector('select[name="tasklist"]').focus()
    })
  }

  getModalTitle () {
    // eslint-disable-next-line no-undef
    return __(LOC_task_list_pick_title)
  }

  renderModal () {
    return tplPickTaskList(this)
  }

  onPick (ev) {
    ev.preventDefault()
    const tlId = ev.target?.tasklist?.value
    if (!tlId) { return }

    const tasklists = this.muc.tasklists
    if (!tasklists) { return }

    const tasklist = tasklists.get(tlId)
    if (!tasklist) { return }

    const message = this.message
    tasklist.createTask({
      name: message.get('nick'),
      description: message.get('body')
    }).then(
      () => this.modal.hide(),
      console.error
    )
  }
}

api.elements.define('livechat-converse-pick-task-list-modal', PickTaskListModal)
