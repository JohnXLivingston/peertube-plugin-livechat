import { html } from 'lit'
import { __ } from 'i18n'

export function tplMUCTaskApp (el, mucModel) {
  if (!mucModel) { return html`` } // should not happen
  if (!mucModel.tasklists) { return html`` } // too soon, not initialized.

  if (!el.show) {
    el.style.display = 'none'
    return html``
  }

  el.style.display = ''

  // eslint-disable-next-line no-undef
  const i18nTasks = __(LOC_tasks)
  return html`
    <div class="livechat-converse-muc-app-header">
      <h5>${i18nTasks}</h5>
      <button class="livechat-converse-muc-app-close" @click=${el.toggleApp}>
          <converse-icon class="fa fa-times" size="1em"></converse-icon>
      </button>
    </div>
    <div class="livechat-converse-muc-app-body">
      <livechat-converse-muc-task-lists .model=${mucModel.tasklists}></livechat-converse-muc-task-lists>
    </div>`
}
