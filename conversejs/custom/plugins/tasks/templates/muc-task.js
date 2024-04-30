import { html } from 'lit'

export default function tplMucTask (task) {
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
