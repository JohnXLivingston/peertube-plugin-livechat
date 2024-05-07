import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'
import { tplMucAddTaskForm } from './muc-task'

export default function tplMucTaskList (el, tasklist) {
  const tasks = tasklist.getTasks()
  // eslint-disable-next-line no-undef
  const i18nDelete = __(LOC_task_list_delete)
  // eslint-disable-next-line no-undef
  const i18nCreateTask = __(LOC_task_create)
  // eslint-disable-next-line no-undef
  const i18nTaskListName = __(LOC_task_list_name)
  return html`
    <div class="task-list-line">
      ${el.collapsed
        ? html`
          <button @click=${el.toggleTasks} class="task-list-toggle-tasks">
            <converse-icon
              color="var(--muc-toolbar-btn-color)"
              class="fa fa-angle-right"
              size="1em"></converse-icon>
          </button>`
        : html`
          <button @click=${el.toggleTasks} class="task-list-toggle-tasks">
            <converse-icon
              color="var(--muc-toolbar-btn-color)"
              class="fa fa-angle-down"
              size="1em"></converse-icon>
          </button>`
      }
      ${!el.edit
        ? html`
          <div class="task-list-name">
            <a @click=${el.toggleTasks}>${tasklist.get('name')}</a>
          </div>
          <button class="task-list-action" title="${i18nCreateTask}" @click=${el.openAddTaskForm}>
            <converse-icon class="fa fa-plus" size="1em"></converse-icon>
          </button>
          <button class="task-list-action" title="${__('Edit')}"
            @click=${el.toggleEdit}
          >
            <converse-icon class="fa fa-edit" size="1em"></converse-icon>
          </button>
          <button class="task-list-action" title="${i18nDelete}"
            @click=${el.deleteTaskList}
          >
            <converse-icon class="fa fa-trash-alt" size="1em"></converse-icon>
          </button>`
        : html`
          <div class="task-list-name">
            <form @submit=${el.saveTaskList} class="converse-form">
              <input type="text" name="name"
                placeholder="${__(i18nTaskListName)}"
                class="form-control"
                value="${tasklist.get('name')}"
              />
              <input type="submit" class="btn btn-primary" value="${__('Ok')}" />
              <input type="button" class="btn btn-secondary button-cancel"
                value="${__('Cancel')}" @click=${el.toggleEdit}
              />
            </form>
          </div>`
      }
    </div>
    <div class="task-list-tasks">
      ${el.collapsed
        ? ''
        : repeat(tasks, (task) => task.get('id'), (task) => {
          return html`<livechat-converse-muc-task .model=${task} draggable="true"></livechat-converse-muc-task>`
        })
      }
    </div>
    ${!el.add_task_form_opened
      ? ''
      : tplMucAddTaskForm(el, tasklist)
    }`
}
