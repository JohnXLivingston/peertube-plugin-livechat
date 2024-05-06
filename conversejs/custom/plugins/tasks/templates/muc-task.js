import { html } from 'lit'
import { __ } from 'i18n'

export function tplMucTask (task) {
  const done = task.get('done')
  return html`
    <div class="">
      <input
        type="checkbox"
        class="form-check-input"
        .checked=${done === true}
        @click=${(_ev) => {
          task.save('done', !done)
        }}
      />
      ${task.get('name')}
    </div>`
}

export function tplMucAddTaskForm (tasklistEl, _tasklist) {
  const i18nOk = __('Ok')
  const i18nCancel = __('Cancel')
  // eslint-disable-next-line no-undef
  const i18nTaskName = __(LOC_task_name)
  // eslint-disable-next-line no-undef
  const i18nTaskDesc = __(LOC_task_description)

  return html`
    <form class="task-list-add-task converse-form" @submit=${tasklistEl.submitAddTask}>
      <fieldset class="form-group">
        <input type="text" name="name"
          class="form-control" value=""
          placeholder="${i18nTaskName}"
        />
        <textarea class="form-control" name="description" placeholder="${i18nTaskDesc}"></textarea>
      </fieldset>
      <fieldset class="form-group">
        <input type="submit" class="btn btn-primary" value="${i18nOk}" />
        <input type="button" class="btn btn-secondary button-cancel"
          value="${i18nCancel}" @click=${tasklistEl.closeAddTaskForm}
        />
      </fieldset>
    </form>`
}
