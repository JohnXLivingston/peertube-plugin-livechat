import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

export default function tplMucTaskList (el, tasklist) {
  const tasks = tasklist.getTasks()
  // eslint-disable-next-line no-undef
  const i18nDelete = __(LOC_task_list_delete)
  return html`
    <div class="">
      Tasklist: ${tasklist.get('name')}
      <a class="" title="${i18nDelete}"
        @click=${el.deleteTaskList}
      >
        <converse-icon class="fa fa-trash-alt" size="1em"></converse-icon>
      </a>
    </div>
    <div class="">
      ${
        repeat(tasks, (task) => task.get('id'), (task) => {
          return html`<livechat-converse-muc-task .model=${task}></livechat-converse-muc-task>`
        })
      }
    </div>`
}
