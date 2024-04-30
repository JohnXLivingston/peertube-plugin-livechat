import { html } from 'lit'

export default function tplMucTask (task) {
  return html`
    <div class="">
      Task: ${task.get('name')}
    </div>`
}
