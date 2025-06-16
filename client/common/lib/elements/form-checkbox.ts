import { html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from './livechat'

@customElement('livechat-form-checkbox')
export class FormCheckbox extends LivechatElement {
  @property({ type: String, attribute: false })
  public label?: string

  @property({ type: String, attribute: false })
  public description?: string

  @property({ type: Boolean, attribute: false })
  public value = false

  protected _onChange = (e: Event): void => {
    this.dispatchEvent(
      new CustomEvent('update', {
        detail: (e.target as HTMLInputElement).checked,
        composed: true
      })
    )
  }

  protected override render = (): unknown => {
    return html`
      <label>
        <input
          type="checkbox"
          name=${this.id}
          id=${this.id}
          value="1"
          @change=${this._onChange}
          ?checked=${this.value}
        />
        ${this.label}
      </label>
      ${this.description ? html`<small class="form-text text-muted">${this.description}</small>` : nothing}
    `
  }
}
