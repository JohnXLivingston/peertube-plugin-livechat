import tplMucTaskList from './muc-task-list'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

export default function tplMucTaskLists (tasklists) {
  if (!tasklists) { // if user losed rights
    return html`` // FIXME: add a message like "you dont have access"?
  }

  const i18nAdd = __('Add')
  // eslint-disable-next-line no-undef
  const i18nCreateTaskList = __(LOC_task_list_create)
  // eslint-disable-next-line no-undef
  const i18nTaskListName = __(LOC_task_list_name)

  return html`
    <form class="converse-form" @submit=${(ev) => {
        ev.preventDefault()
        const name = ev.target.name.value.trim()
        if ((name ?? '') === '') { return }

        ev.target.name.value = ''

        tasklists.create({
          name
        })
      }}
    >
      <div class="form-group">
        <label>
          ${i18nCreateTaskList}
          <input type="text" value="" name="name" placeholder="${i18nTaskListName}" />
        </label>
        <input type="submit" value="${i18nAdd}" class="btn btn-primary" />
      </div>
    </form>
    <div class="">
      ${
        repeat(tasklists, (tasklist) => tasklist.get('id'), (tasklist) => tplMucTaskList(tasklist))
      }
    </div>`
}
