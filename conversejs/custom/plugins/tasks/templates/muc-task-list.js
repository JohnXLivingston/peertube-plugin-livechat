import { html } from 'lit'

export default function tplMucTaskList (tasklist) {
  return html`<div class="">
      Tasklist: ${tasklist.get('name')}
    </div>`
}
