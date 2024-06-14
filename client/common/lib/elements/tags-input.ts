// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { LivechatElement } from './livechat'
import { ptTr } from '../directives/translation'
import { html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { classMap } from 'lit/directives/class-map.js'
import { animate, fadeOut, fadeIn } from '@lit-labs/motion'
import { repeat } from 'lit/directives/repeat.js'

// FIXME: find a better way to store this image.
// This content comes from the file assets/images/copy.svg, after svgo cleaning.
// To get the formated content, you can do:
// xmllint dist/client/images/copy.svg --format
// Then replace the main color by «currentColor»
const copySVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233">
  <g style="stroke-width:1.00021;stroke-miterlimit:4;stroke-dasharray:none">` +
    // eslint-disable-next-line max-len
    '<path style="opacity:.998;fill:none;fill-opacity:1;stroke:currentColor;stroke-width:1.17052;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m4.084 4.046-.616.015-.645-.004a.942.942 0 0 1-.942-.942v-4.398a.94.94 0 0 1 .942-.943H7.22a.94.94 0 0 1 .942.943l-.006.334-.08.962" transform="matrix(.45208 0 0 .45208 -.528 1.295)"/>' +
    // eslint-disable-next-line max-len
    '<path style="opacity:.998;fill:none;fill-opacity:1;stroke:currentColor;stroke-width:1.17052;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M8.434 5.85c-.422.009-1.338.009-1.76.01-.733.004-2.199 0-2.199 0a.94.94 0 0 1-.942-.941V.52a.94.94 0 0 1 .942-.942h4.398a.94.94 0 0 1 .943.942s.004 1.466 0 2.2c-.003.418-.019 1.251-.006 1.67.024.812-.382 1.439-1.376 1.46z" transform="matrix(.45208 0 0 .45208 -.528 1.295)"/>' +
  `</g>
</svg>`

@customElement('livechat-tags-input')
export class TagsInputElement extends LivechatElement {
  @property({ attribute: false })
  public name?: string

  @property({ attribute: false })
  public min?: number

  @property({ attribute: false })
  public max?: number

  @property({ attribute: false })
  public maxlength?: number

  @property({ attribute: false })
  public minlength?: number

  @state()
  private _inputValue?: string = ''

  @property({ attribute: false })
  public inputPlaceholder?: string = ''

  @property({ attribute: false })
  public datalist?: string[]

  @property({ reflect: true, type: Array })
  public value: string[] = []

  @state()
  private _searchedTagsIndex: number[] = []

  @state()
  private readonly _isPressingKey: string[] = []

  @property({ attribute: false })
  public separator: string = '\n'

  @property({ attribute: false })
  public animDuration: number = 200

  /**
   * Overloading the standard focus method.
   */
  public override focus (): void {
    const input = this.querySelector('input[type=text]')
    if (input) {
      (input as HTMLInputElement).focus()
      return
    }
    // Never rendered, we will wait for the update to be complete, and then render.
    // This is not fully compliant, as it is not synchrone... But needed (see dynamic-table addRow)
    this.updateComplete.then(() => {
      const input = this.querySelector('input[type=text]')
      if (input) {
        (input as HTMLInputElement).focus()
      }
    }, () => {})
  }

  protected override render = (): unknown => {
    return html`
      <div class=${classMap({
            'livechat-empty': !this.value.length,
            'livechat-tags-container': true
          })}
      >
        <ul
          class=${classMap({
            'livechat-empty': !this.value.length,
            'livechat-unfocused': this._searchedTagsIndex.length,
            'livechat-tags': true
          })}>
            ${repeat(this.value, tag => tag,
              (tag, index) => html`<li key=${index} class="livechat-tag" title=${tag} ${animate({
                  keyframeOptions: {
                    duration: this.animDuration,
                    fill: 'both'
                  },
                  in: fadeIn,
                  out: fadeOut
                })}>
                <span class='livechat-tag-name'>${tag}</span>
                <span class='livechat-tag-close'
                      @click=${() => this._handleDeleteTag(index)}></span>
              </li>`
            )}
          </ul>
          ${
            this.value?.length === 0
              ? ''
              : html`<button
                type="button"
                class="peertube-plugin-livechat-tags-input-copy"
                title=${ptTr(LOC_COPY) as any}
                @click=${async (ev: Event) => {
                  ev.preventDefault()
                  await navigator.clipboard.writeText(this.value.join(this.separator))
                  this.ptNotifier.success(await this.ptTranslate(LOC_COPIED))
                }}
              >${unsafeHTML(copySVG)}</button>`
          }
      </div>
        <ul class=${classMap({
            'livechat-empty': !this._searchedTagsIndex.length,
            'livechat-tags-searched': true
          })}
        >
          ${repeat(this._searchedTagsIndex, index => index,
            (index) => html`<li key=${index} class="livechat-tag-searched" title=${this.value[index]} ${animate({
                keyframeOptions: {
                  duration: this.animDuration,
                  fill: 'both'
                },
                in: fadeIn,
                out: fadeOut
              })}>
              <span class='livechat-tag-name'>${this.value[index]}</span>
              <span class='livechat-tag-close'
                    @click=${() => this._handleDeleteTag(index)}>
              </span>
            </li>`
          )}
        </ul>
        <input
        type="text"
        name=${ifDefined(this.name)}
        id="${this.id ?? 'tags-input'}-input"
        list="${this.id ?? 'tags-input'}-input-datalist"
        min=${ifDefined(this.min)}
        max=${ifDefined(this.max)}
        minlength=${ifDefined(this.minlength)}
        maxlength=${ifDefined(this.maxlength)}
        @paste=${(e: ClipboardEvent) => this._handlePaste(e)}
        @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e)}
        @keyup=${(e: KeyboardEvent) => this._handleKeyUp(e)}
        @input=${(e: InputEvent) => this._handleInputEvent(e)}
        @change=${(e: Event) => e.stopPropagation()}
        .value=${this._inputValue ?? ''}
        placeholder=${ifDefined(this.inputPlaceholder)} />
        ${(this.datalist)
          ? html`<datalist id="${this.id ?? 'tags-input'}-datalist">
            ${(this.datalist ?? []).map((value) => html`<option value=${value}>`)}
          </datalist>`
          : ''
        }`
  }

  private readonly _handlePaste = (e: ClipboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      e.preventDefault()

      const newValue = `${
          target?.value?.slice(0, target.selectionStart ?? target?.value?.length ?? 0) ?? ''
        }${e.clipboardData?.getData('text/plain') ?? ''}${
          target?.value?.slice(target.selectionEnd ?? target?.value?.length ?? 0) ?? ''
        }`

      let values = newValue.split(this.separator)

      values = values.map(v => v.trim()).filter(v => v !== '')

      if (values.length > 0) {
        // 20240613: i disable this code, i think it is not a good idea.
        // // Keep last value in input if value doesn't finish with a separator
        // if (!newValue.match(/\s+$/m)?.[0]?.includes(this.separator)) {
        //   target.value = values.pop() ?? ''
        // } else {
        //   target.value = ''
        // }
        target.value = ''
        // no duplicate
        this.value = [...new Set([...this.value, ...values])]

        this._inputValue = target.value

        this._updateSearchedTags() // is that necessary ?

        this.requestUpdate('value')
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }))

        return false
      }
    }
    return true
  }

  private readonly _handleKeyDown = (e: KeyboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      switch (e.key) {
        case 'Enter':
          // Avoid bounce
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)
          } else {
            e.preventDefault()
            return false
          }

          if (target.value === '') {
            this._isPressingKey.push(e.key)
            return true
          } else {
            e.preventDefault()
            this._handleNewTag(e)
            return false
          }
          // break useless as all cases returns here
        case 'Backspace':
          // Avoid bounce delete
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)

            if ((target.selectionStart === target.selectionEnd) &&
                 target.selectionStart === 0) {
              this._handleDeleteTag((this._searchedTagsIndex.length)
                ? this._searchedTagsIndex.slice(-1)[0]
                : (this.value.length - 1))
            }
          }

          break
        case 'Delete':
          // Avoid bounce delete
          if (!this._isPressingKey.includes(e.key)) {
            this._isPressingKey.push(e.key)

            if ((target.selectionStart === target.selectionEnd) &&
                 target.selectionStart === target.value.length) {
              this._handleDeleteTag((this._searchedTagsIndex.length)
                ? this._searchedTagsIndex[0]
                : 0)
            }
          }
          break
        default:
          break
      }
    }

    return true
  }

  private readonly _handleKeyUp = (e: KeyboardEvent): boolean => {
    const target = e?.target as HTMLInputElement

    if (target) {
      switch (e.key) {
        case 'Enter':
        case 'Backspace':
        case 'Delete':
          if (this._isPressingKey.includes(e.key)) {
            this._isPressingKey.splice(this._isPressingKey.indexOf(e.key))
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
      this._inputValue = target.value
      if (this.separator === target.value.slice(-1)) {
        e.preventDefault()
        target.value = target.value.slice(0, -1)
        this._handleNewTag(e)
      } else {
        this._updateSearchedTags()
      }
    }

    return true
  }

  private readonly _handleNewTag = (e: Event): void => {
    const target = e?.target as HTMLInputElement

    if (target) {
      this._addTag(target.value)
      target.value = ''
      this._inputValue = ''

      this._updateSearchedTags()
    }
  }

  private readonly _handleDeleteTag = (index: number): void => {
    this._removeTag(index)

    this._updateSearchedTags()
  }

  private readonly _updateSearchedTags = (): void => {
    const searchedTags = []
    const inputValue = this._inputValue?.trim()

    if (inputValue?.length) {
      for (const [i, tag] of this.value.entries()) {
        if (tag.toLowerCase().includes(inputValue.toLowerCase())) {
          searchedTags.push(i)
        }
      }
    }

    this._searchedTagsIndex = searchedTags
    this.requestUpdate('_searchedTagsIndex')
  }

  private readonly _addTag = (value: string | undefined): void => {
    if (value === undefined) {
      this.logger.warn('Could not add tag : Target or value was undefined')
      return
    }

    value = value.trim()

    if (value) {
      this.value.push(value)
      // no duplicate
      this.value = [...new Set(this.value)]

      this.requestUpdate('value')
      this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
    }
  }

  private readonly _removeTag = (index: number): void => {
    if (index < 0 || index >= this.value.length) {
      this.logger.warn('Could not remove tag : index out of range')
      return
    }

    this.value.splice(index, 1)

    this.requestUpdate('value')
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
  }
}
