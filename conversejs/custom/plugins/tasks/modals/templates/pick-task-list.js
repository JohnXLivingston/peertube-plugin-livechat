import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { __ } from 'i18n'

export default function (el) {
  const muc = el.muc
  if (!muc?.tasklists?.length) {
    // eslint-disable-next-line no-undef
    const i18nEmpty = __(LOC_task_list_pick_empty)
    return html`<p class="error">${i18nEmpty}</p>`
  }

  // eslint-disable-next-line no-undef
  const i18nMessage = __(LOC_task_list_pick_message)

  return html`
    <form class="converse-form converse-form--modal confirm" action="#" @submit=${ev => el.onPick(ev)}>
        <div class="form-group">
            <select class="form-control" name="tasklist">
              ${
                repeat(muc.tasklists, (tasklist) => tasklist.get('id'), (tasklist) => {
                  return html`<option value="${tasklist.get('id')}">${tasklist.get('name')}</option>`
                })
              }
            </select>
            <small class="form-text text-muted">
              ${i18nMessage}
            </small>
        </div>

        <div class="form-group">
            <button type="submit" class="btn btn-primary">${__('OK')}</button>
            <input type="button" class="btn btn-secondary" data-dismiss="modal" value="${__('Cancel')}"/>
        </div>
    </form>`
}
