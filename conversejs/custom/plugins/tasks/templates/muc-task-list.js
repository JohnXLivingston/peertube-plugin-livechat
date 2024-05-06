import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

export default function tplMucTaskList (el, tasklist) {
  const tasks = tasklist.getTasks()
  // eslint-disable-next-line no-undef
  const i18nDelete = __(LOC_task_list_delete)
  return html`
    <div class="task-list-description">
      ${el.collapsed
        ? html`
          <button @click=${el.toggleTasks}>
            <converse-icon
              color="var(--muc-toolbar-btn-color)"
              class="fa fa-angle-double-up"
              size="1em"></converse-icon>
          </button>`
        : html`
          <button @click=${el.toggleTasks}>
            <converse-icon
              color="var(--muc-toolbar-btn-color)"
              class="fa fa-angle-double-down"
              size="1em"></converse-icon>
          </button>`
      }
      ${!el.edit
        ? html`
          <div class="task-list-name">
            ${tasklist.get('name')}
          </div>
          <a title="${__('Edit')}"
            @click=${el.toggleEdit}
          >
            <converse-icon class="fa fa-edit" size="1em"></converse-icon>
          </a>
          <a title="${i18nDelete}"
            @click=${el.deleteTaskList}
          >
            <converse-icon class="fa fa-trash-alt" size="1em"></converse-icon>
          </a>`
        : html`
          <div class="task-list-name">
            <form @submit=${el.saveTaskList}>
              <input type="text" name="name" autofocus value=${tasklist.get('name')} />
              <input type="submit" class="btn btn-primary" value="${__('Ok')}" />
              <input type="reset" class="btn btn-secondary" value="${__('Cancel')}" @click=${el.toggleEdit} />
            </form>
          </div>`
      }
    </div>
    <div class="task-list-tasks">
      ${el.collapsed
        ? ''
        : repeat(tasks, (task) => task.get('id'), (task) => {
          return html`<livechat-converse-muc-task .model=${task}></livechat-converse-muc-task>`
        })
      }
    </div>`
}
