// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { LivechatElement } from './livechat'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'

/**
 * Special element to upload image files.
 * If no current value, displays an input type="file" field.
 * When there is already an image, it is displayed.
 * Clicking on the image triggers a new upload, that will replace the image.
 *
 * The value can be either:
 * * an url (when the image is already saved for example)
 * * a base64 representation (for image to upload for exemple)
 *
 * Doing so, we just have to set the img.src to the value to display the image.
 */
@customElement('livechat-image-file-input')
export class ImageFileInputElement extends LivechatElement {
  @property({ attribute: false })
  public name?: string

  @property({ reflect: true })
  public value: string | undefined

  protected override render = (): unknown => {
    // FIXME: limit file size in the upload field.
    return html`
      ${this.value
        ? html`<img src=${this.value} @click=${(ev: Event) => {
          ev.preventDefault()
          const upload: HTMLInputElement | null | undefined = this.parentElement?.querySelector('input[type="file"]')
          upload?.click()
        }} />`
        : ''
      }
      <input
        type="file"
        accept="image/jpg,image/png,image/gif"
        class="form-control"
        style=${this.value ? 'visibility: hidden;' : ''}
        @change=${async (ev: Event) => this._upload(ev)}
      />
      <input
        type="hidden"
        name=${ifDefined(this.name)}
        value=${this.value ?? ''}
      />
    `
  }

  private async _upload (ev: Event): Promise<void> {
    ev.preventDefault()
    const target = ev.target
    const file = (target as HTMLInputElement).files?.[0]
    if (!file) {
      this.value = ''
      return
    }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          if (fileReader.result === null) {
            reject(new Error('Empty result'))
            return
          }
          if (fileReader.result instanceof ArrayBuffer) {
            reject(new Error('Result is an ArrayBuffer, this was not intended'))
          } else {
            resolve(fileReader.result)
          }
        }
        fileReader.onerror = reject
      })

      this.value = base64
    } catch (err) {
      // FIXME: use peertube notifier?
      console.error(err)
    }
  }
}
