import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

export default function tplMucTaskLists (el, tasklists) {
  if (!tasklists) { // if user losed rights
    return html`` // FIXME: add a message like "you dont have access"?
  }

  const i18nAdd = __('Add')
  // eslint-disable-next-line no-undef
  const i18nCreateTaskList = __(LOC_task_list_create)
  // eslint-disable-next-line no-undef
  const i18nTaskListName = __(LOC_task_list_name)

  return html`
    ${
      repeat(tasklists, (tasklist) => tasklist.get('id'), (tasklist) => {
        return html`<livechat-converse-muc-task-list .model=${tasklist}></livechat-converse-muc-task-list>`
      })
    }
    <form class="converse-form" @submit=${el.submitCreateTaskList}>
      <div class="form-group">
        <label>
          ${i18nCreateTaskList}
          <input type="text" value="" name="name" placeholder="${i18nTaskListName}" />
        </label>
        <input type="submit" value="${i18nAdd}" class="btn btn-primary" />
        ${!el.create_tasklist_error_message
          ? ''
          : html`<div class="invalid-feedback d-block">${el.create_tasklist_error_message}</div>`
        }
      </div>
    </form>`
}
