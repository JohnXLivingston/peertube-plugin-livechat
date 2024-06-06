// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { LivechatElement } from './livechat'
import { registerClientOptionsContext } from '../contexts/peertube'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'
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
  @consume({ context: registerClientOptionsContext, subscribe: true })
  public registerClientOptions?: RegisterClientOptions

  @property({ attribute: false })
  public name?: string

  @property({ reflect: true })
  public value: string | undefined

  @property({ attribute: false })
  public maxSize?: number

  @property({ attribute: false })
  public accept: string[] = ['image/jpg', 'image/png', 'image/gif']

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
        accept="${this.accept.join(',')}"
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
    ev.stopImmediatePropagation() // we dont want to propage the change from the input field, only from the hidden field
    const target = ev.target
    const file = (target as HTMLInputElement).files?.[0]
    if (!file) {
      return
    }

    if (this.maxSize && file.size > this.maxSize) {
      let msg = await this.registerClientOptions?.peertubeHelpers.translate(LOC_INVALID_VALUE_FILE_TOO_BIG)
      if (msg) {
        // FIXME: better unit handling (here we force kb)
        msg = msg.replace('%s', Math.round(this.maxSize / 1024).toString() + 'k')
        this.registerClientOptions?.peertubeHelpers.notifier.error(msg)
      }
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
      const event = new Event('change')
      this.dispatchEvent(event)
    } catch (err) {
      // FIXME: use peertube notifier?
      console.error(err)
    }
  }
}
