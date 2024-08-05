// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { __ } from 'i18n'

export function tplMucTask (el, task) {
  const done = task.get('done')
  // eslint-disable-next-line no-undef
  const i18nDelete = __(LOC_task_delete)

  const doneId = 'livechat-task-done-id-' + task.get('id')
  return !el.edit
    ? html`
      <div draggable="true" class="task-line draggables-line" ?task-is-done=${done}>
        <div class="form-check">
          <input
            id="${doneId}"
            type="checkbox"
            class="form-check-input"
            .checked=${done === true}
            @click=${(_ev) => {
              task.set('done', !done)
              task.saveItem()
            }}
          />
          <label class="form-check-label task-name" for="${doneId}">
            ${task.get('name')}
          </label>
        </div>
        <div class="task-description">${task.get('description') ?? ''}</div>
        <button class="task-action" title="${__('Edit')}"
          @click=${el.toggleEdit}
        >
          <converse-icon class="fa fa-edit" size="1em"></converse-icon>
        </button>
        <button class="task-action" title="${i18nDelete}"
          @click=${el.deleteTask}
        >
          <converse-icon class="fa fa-trash-alt" size="1em"></converse-icon>
        </button>
      </div>`
    : html`
      <div class="task-line draggables-line">
        <form class="converse-form" @submit=${el.saveTask}>
          ${_tplTaskForm(task)}
          <fieldset>
            <input type="submit" class="btn btn-primary" value="${__('Ok')}" />
            <input type="button" class="btn btn-secondary button-cancel"
              value="${__('Cancel')}" @click=${el.toggleEdit}
            />
          </fieldset>
        </form>
      </div>`
}

function _tplTaskForm (task) {
  // eslint-disable-next-line no-undef
  const i18nTaskName = __(LOC_task_name)
  // eslint-disable-next-line no-undef
  const i18nTaskDesc = __(LOC_task_description)

  return html`<fieldset>
      <input type="text" name="name"
        class="form-control" value="${task ? task.get('name') : ''}"
        placeholder="${i18nTaskName}"
      />
      <textarea
        class="form-control" name="description"
        placeholder="${i18nTaskDesc}"
      >${task ? task.get('description') : ''}</textarea>
    </fieldset>`
}

export function tplMucAddTaskForm (tasklistEl, _tasklist) {
  const i18nOk = __('Ok')
  const i18nCancel = __('Cancel')

  return html`
    <form class="task-list-add-task converse-form" @submit=${tasklistEl.submitAddTask}>
      ${_tplTaskForm(undefined)}
      <fieldset>
        <input type="submit" class="btn btn-primary" value="${i18nOk}" />
        <input type="button" class="btn btn-secondary button-cancel"
          value="${i18nCancel}" @click=${tasklistEl.closeAddTaskForm}
        />
      </fieldset>
    </form>`
}
