import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'

export default function tplMucTaskList (tasklist) {
  const tasks = tasklist.getTasks()
  return html`
    <div class="">
      Tasklist: ${tasklist.get('name')}
    </div>
    <div class="">
      ${
        repeat(tasks, (task) => task.get('id'), (task) => {
          return html`<livechat-converse-muc-task .model=${task}></livechat-converse-muc-task>`
        })
      }
    </div>`
}
