// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from './livechat'
import { ifDefined } from 'lit/directives/if-defined.js'

@customElement('livechat-tags-input')
export class TagsInputElement extends LivechatElement {
  @property({ attribute: false })
  public type?: string = 'text'

  @property({ attribute: false })
  public name?: string

  @property({ attribute: false })
  public min?: string

  @property({ attribute: false })
  public max?: string

  @property({ attribute: false })
  public maxlength?: string

  @property({ attribute: false })
  public minlength?: string

  public _inputValue?: string = ''

  @property({ attribute: false })
  public inputPlaceholder?: string = ''

  @property({ attribute: false })
  public datalist?: Array<string | number>

  @property({ reflect: true })
  public value: Array<string | number> = []

  @property({ attribute: false })
  public separators?: string[] = []

  protected override render = (): unknown => {
    return html`<ul id="tags">
          ${this.value.map((tag, index) => html`<li key=${index} class="tag">
              <span class='tag-name'>${tag}</span>
              <span class='tag-close'
                    @click=${() => this._removeTag(index)}>
                x
              </span>
            </li>`
          )}
        </ul>
        <input
        type=${ifDefined(this.type)}
        name=${ifDefined(this.name)}
        id="${this.id ?? 'tags-input'}-input"
        list="${this.id ?? 'tags-input'}-input-datalist"
        min=${ifDefined(this.min)}
        max=${ifDefined(this.max)}
        minlength=${ifDefined(this.minlength)}
        maxlength=${ifDefined(this.maxlength)}
        @paste=${(e: ClipboardEvent) => this._handlePaste(e)}
        @keydown=${(e: KeyboardEvent) => this._handleKeyboardEvent(e)}
        @input=${(e: InputEvent) => this._handleInputEvent(e)}
        @change=${(e: Event) => e.stopPropagation()}
        .value=${this._inputValue} .placeholder=${this.inputPlaceholder} />
        ${(this.datalist)
          ? html`<datalist id="${this.id ?? 'tags-input'}-datalist">
            ${(this.datalist ?? []).map((value) => html`<option value=${value}>`)}
          </datalist>`
          : ''
        }`
  }

  private readonly _handlePaste = (e: ClipboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    const pastedValue = `${target?.value ?? ''}${e.clipboardData?.getData('text/plain') ?? ''}`

    if (target) {
      e.preventDefault()
      let values = pastedValue.split(new RegExp(`/[${this.separators?.join('') ?? ''}]+/`))

      values = values.map(v => v.trim()).filter(v => v !== '')

      if (values.length > 0) {
        // Keep last value in input if paste doesn't finish with a separator
        if (!this.separators?.some(separator => target?.value.match(/\s+$/m)?.[0]?.includes(separator))) {
          target.value = values.pop() ?? ''
        } else {
          target.value = ''
        }
        // no duplicate
        this.value = [...new Set([...this.value, ...values])]

        console.log(`value: ${JSON.stringify(this.value)}`)

        this.requestUpdate('value')
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }))

        return false
      }
    }
    return true
  }

  private readonly _handleKeyboardEvent = (e: KeyboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      switch (e.key) {
        case 'Enter':
          if (target.value === '') {
            return true
          } else {
            e.preventDefault()
            this._handleNewTag(e)
            return false
          }
        case 'Backspace':
        case 'Delete':
          if (target.value === '') {
            this._removeTag(this.value.length - 1)
          }
          break
        default:
          break
      }
    }

    return true
  }

  private readonly _handleInputEvent = (e: InputEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      if (this.separators?.includes(target.value.slice(-1))) {
        e.preventDefault()
        target.value = target.value.slice(0, -1)
        this._handleNewTag(e)
        return false
      }
    }

    return true
  }

  private readonly _handleNewTag = (e: Event): void => {
    const target = e?.target as HTMLInputElement

    if (target) {
      this._addTag(target?.value)
      target.value = ''
    }
  }

  private readonly _addTag = (value: string | undefined): void => {
    if (value === undefined) {
      console.warn('Could not add tag : Target or value was undefined')
      return
    }

    value = value.trim()

    if (value) {
      this.value.push(value)
      // no duplicate
      this.value = [...new Set(this.value)]

      console.log(`value: ${JSON.stringify(this.value)}`)

      this.requestUpdate('value')
      this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
    }
  }

  private readonly _removeTag = (index: number): void => {
    if (index < 0 || index >= this.value.length) {
      console.warn('Could not remove tag : index out of range')
      return
    }

    this.value.splice(index, 1)

    console.log(`value: ${JSON.stringify(this.value)}`)

    this.requestUpdate('value')
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
  }
}
