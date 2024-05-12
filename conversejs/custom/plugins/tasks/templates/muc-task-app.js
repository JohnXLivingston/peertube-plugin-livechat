import { html } from 'lit'
import { __ } from 'i18n'

export function tplMUCTaskApp (el, mucModel) {
  if (!mucModel) {
    // should not happen
    el.classList.add('hidden') // we must do this, otherwise will have CSS side effects
    return html``
  }
  if (!mucModel.tasklists) {
    // too soon, not initialized yet (this will happen)
    el.classList.add('hidden') // we must do this, otherwise will have CSS side effects
    return html``
  }

  if (!el.show) {
    el.classList.add('hidden')
    return html``
  }

  el.classList.remove('hidden')

  // eslint-disable-next-line no-undef
  const i18nTasks = __(LOC_tasks)
  // eslint-disable-next-line no-undef
  const i18nHint = __(LOC_task_app_info)
  return html`
    <div class="livechat-converse-muc-app-header">
      <h5>${i18nTasks}</h5>
      <converse-icon
          class="fa fa-info-circle"
          size="1em"
          title="${i18nHint}"
      ></converse-icon>
      <button class="livechat-converse-muc-app-close" @click=${el.toggleApp} title="${__('Close')}">
          <converse-icon class="fa fa-times" size="1em"></converse-icon>
      </button>
    </div>
    <div class="livechat-converse-muc-app-body">
      <livechat-converse-muc-task-lists .model=${mucModel.tasklists}></livechat-converse-muc-task-lists>
    </div>`
}
