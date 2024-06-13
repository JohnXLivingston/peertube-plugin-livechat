// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChannelEmojisConfiguration } from 'shared/lib/types'
import { LivechatElement } from '../../lib/elements/livechat'
import { ChannelDetailsService } from '../services/channel-details'
import { channelDetailsServiceContext } from '../contexts/channel'
import { ValidationError } from '../../lib/models/validation'
import { tplChannelEmojis } from './templates/channel-emojis'
import { Task } from '@lit/task'
import { customElement, property, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import { html } from 'lit'

/**
 * Channel emojis configuration page.
 */
@customElement('livechat-channel-emojis')
export class ChannelEmojisElement extends LivechatElement {
  @property({ attribute: false })
  public channelId?: number

  public channelEmojisConfiguration?: ChannelEmojisConfiguration

  @provide({ context: channelDetailsServiceContext })
  private _channelDetailsService?: ChannelDetailsService

  @state()
  public validationError?: ValidationError

  @state()
  public actionDisabled: boolean = false

  private _asyncTaskRender: Task

  constructor () {
    super()
    this._asyncTaskRender = this._initTask()
  }

  protected override render = (): unknown => {
    return this._asyncTaskRender.render({
      pending: () => html`<livechat-spinner></livechat-spinner>`,
      error: () => html`<livechat-error></livechat-error>`,
      complete: () => tplChannelEmojis(this)
    })
  }

  protected _initTask (): Task {
    return new Task(this, {
      task: async () => {
        if (!this.channelId) {
          throw new Error('Missing channelId')
        }
        this._channelDetailsService = new ChannelDetailsService(this.ptOptions)
        this.channelEmojisConfiguration = await this._channelDetailsService.fetchEmojisConfiguration(this.channelId)
        this.actionDisabled = false // in case of reset
      },
      args: () => []
    })
  }

  /**
   * Resets the page, by reloading data from backend.
   */
  public async reset (ev?: Event): Promise<void> {
    ev?.preventDefault()
    this.actionDisabled = true
    this._asyncTaskRender = this._initTask()
    this.requestUpdate()
  }

  /**
   * Resets the validation errors.
   * @param ev the vent
   */
  public resetValidation (_ev?: Event): void {
    if (this.validationError) {
      this.validationError = undefined
      this.requestUpdate('_validationError')
    }
  }

  /**
   * Saves the emojis form.
   * @param ev event
   */
  public async saveEmojis (ev?: Event): Promise<void> {
    ev?.preventDefault()

    if (!this._channelDetailsService || !this.channelEmojisConfiguration || !this.channelId) {
      this.ptNotifier.error(await this.ptTranslate(LOC_ERROR))
      return
    }

    try {
      this.actionDisabled = true
      await this._channelDetailsService.saveEmojisConfiguration(this.channelId, this.channelEmojisConfiguration.emojis)
      this.validationError = undefined
      this.ptNotifier.info(await this.ptTranslate(LOC_SUCCESSFULLY_SAVED))
      this.requestUpdate('_validationError')
    } catch (error) {
      this.validationError = undefined
      let msg: string
      if ((error instanceof ValidationError)) {
        this.validationError = error
        if (error.message) {
          msg = error.message
        }
      }
      msg ??= await this.ptTranslate(LOC_ERROR)
      this.ptNotifier.error(msg)
      this.requestUpdate('_validationError')
    } finally {
      this.actionDisabled = false
    }
  }

  /**
   * Import emojis action.
   */
  public async importEmojis (ev: Event): Promise<void> {
    ev.preventDefault()
    this.actionDisabled = true
    try {
      // download a json file:
      const file = await new Promise<File>((resolve, reject) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'application/json')
        input.onchange = (e) => {
          e.preventDefault()
          e.stopImmediatePropagation()
          const file = (e.target as HTMLInputElement).files?.[0]
          if (!file) {
            reject(new Error('Missing file'))
            return
          }
          resolve(file)
        }
        input.click()
        input.remove()
      })

      const content = await new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onerror = reject
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
        fileReader.readAsText(file)
      })

      const json = JSON.parse(content)
      if (!Array.isArray(json)) {
        throw new Error('Invalid data, an array was expected')
      }
      for (const entry of json) {
        if (typeof entry !== 'object') {
          throw new Error('Invalid data')
        }
        if (!entry.sn || !entry.url || (typeof entry.sn !== 'string') || (typeof entry.url !== 'string')) {
          throw new Error('Invalid data')
        }

        const url = await this._convertImageToDataUrl(entry.url)
        let sn = entry.sn as string
        if (!sn.startsWith(':')) { sn = ':' + sn }
        if (!sn.endsWith(':')) { sn += ':' }

        const item: ChannelEmojisConfiguration['emojis']['customEmojis'][0] = {
          sn,
          url
        }
        if (entry.isCategoryEmoji === true) {
          item.isCategoryEmoji = true
        }
        this.channelEmojisConfiguration?.emojis.customEmojis.push(item)
      }

      this.requestUpdate('channelEmojisConfiguration')

      this.ptNotifier.info(
        await this.ptTranslate(LOC_ACTION_IMPORT_EMOJIS_INFO)
      )
    } catch (err: any) {
      this.ptNotifier.error(err.toString(), await this.ptTranslate(LOC_ERROR))
    } finally {
      this.actionDisabled = false
    }
  }

  /**
   * Export emojis action.
   */
  public async exportEmojis (ev: Event): Promise<void> {
    ev.preventDefault()
    this.actionDisabled = true
    try {
      const result: ChannelEmojisConfiguration['emojis']['customEmojis'] = []
      for (const ed of this.channelEmojisConfiguration?.emojis?.customEmojis ?? []) {
        if (!ed.sn || !ed.url) { continue }
        // Here url can be:
        // * the dataUrl representation of a newly uploaded file
        // * or the url of an already saved image file
        // In both cases, we want to export a dataUrl version.
        const url = await this._convertImageToDataUrl(ed.url)

        const item: typeof result[0] = {
          sn: ed.sn,
          url
        }
        if (ed.isCategoryEmoji === true) { item.isCategoryEmoji = ed.isCategoryEmoji }
        result.push(item)
      }

      // Make the browser download the JSON file:
      const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result))
      const a = document.createElement('a')
      a.setAttribute('href', dataUrl)
      a.setAttribute('download', 'emojis.json')
      a.click()
      a.remove()
    } catch (err: any) {
      console.error(err)
      this.ptNotifier.error(err.toString())
    } finally {
      this.actionDisabled = false
    }
  }

  /**
   * Takes an url (or dataUrl), download the image, and converts to dataUrl.
   * @param url the url
   * @returns A dataUrl representation of the image.
   */
  private async _convertImageToDataUrl (url: string): Promise<string> {
    if (url.startsWith('data:')) { return url }
    // There is a trick to convert img to dataUrl: using a canvas.
    // But we can't use it here... as it won't work with animated GIF.
    // So we just fetch each url, and do the work.
    const blob = await (await fetch(url)).blob()
    const base64 = await new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader()
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
      fileReader.readAsDataURL(blob)
    })
    return base64
  }
}
