// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelEmojisConfiguration } from 'shared/lib/types'
import type { DynamicFormHeader, DynamicFormSchema } from '../../lib/elements/dynamic-table-form'
import { LivechatElement } from '../../lib/elements/livechat'
import { registerClientOptionsContext } from '../../lib/contexts/peertube'
import { ChannelDetailsService } from '../services/channel-details'
import { channelDetailsServiceContext } from '../contexts/channel'
import { maxEmojisPerChannel } from 'shared/lib/emojis'
import { ptTr } from '../../lib/directives/translation'
import { ValidationError } from '../../lib/models/validation'
import { Task } from '@lit/task'
import { customElement, property, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import { html } from 'lit'

/**
 * Channel emojis configuration page.
 */
@customElement('livechat-channel-emojis')
export class ChannelEmojisElement extends LivechatElement {
  @provide({ context: registerClientOptionsContext })
  @property({ attribute: false })
  public registerClientOptions?: RegisterClientOptions

  @property({ attribute: false })
  public channelId?: number

  private _channelEmojisConfiguration?: ChannelEmojisConfiguration

  @provide({ context: channelDetailsServiceContext })
  private _channelDetailsService?: ChannelDetailsService

  @state()
  private _validationError?: ValidationError

  @state()
  private _actionDisabled: boolean = false

  private _asyncTaskRender: Task

  constructor () {
    super()
    this._asyncTaskRender = this._initTask()
  }

  protected override render = (): unknown => {
    const tableHeaderList: DynamicFormHeader = {
      sn: {
        colName: ptTr(LOC_LIVECHAT_EMOJIS_SHORTNAME),
        description: ptTr(LOC_LIVECHAT_EMOJIS_SHORTNAME_DESC)
      },
      url: {
        colName: ptTr(LOC_LIVECHAT_EMOJIS_FILE),
        description: ptTr(LOC_LIVECHAT_EMOJIS_FILE_DESC),
        headerClassList: ['peertube-livechat-emojis-col-file']
      }
    }
    const tableSchema: DynamicFormSchema = {
      sn: {
        inputType: 'text',
        default: ''
      },
      url: {
        inputType: 'image-file',
        default: '',
        colClassList: ['peertube-livechat-emojis-col-file']
      }
    }
    return this._asyncTaskRender.render({
      pending: () => {},
      complete: () => html`
        <div
          class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-channel"
        >
          <h1>
            <span class="peertube-plugin-livechat-configuration-channel-info">
              <span>${this._channelEmojisConfiguration?.channel.displayName}</span>
              <span>${this._channelEmojisConfiguration?.channel.name}</span>
            </span>
          </h1>

          <livechat-channel-tabs .active=${'emojis'} .channelId=${this.channelId}></livechat-channel-tabs>

          <p>
            ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_EMOJIS_DESC)}
            <livechat-help-button .page=${'documentation/user/streamers/emojis'}>
            </livechat-help-button>
          </p>

          <div class="peertube-plugin-livechat-configuration-actions">
            ${
              this._channelEmojisConfiguration?.emojis?.customEmojis?.length
                ? html`
                <button
                  @click=${this._exportEmojis}
                  ?disabled=${this._actionDisabled}
                >
                  ${ptTr(LOC_ACTION_EXPORT)}
                </button>`
                : ''
            }
            ${
              (this._channelEmojisConfiguration?.emojis?.customEmojis?.length ?? 0) < maxEmojisPerChannel
                ? html`
                <button
                  @click=${this._importEmojis}
                  ?disabled=${this._actionDisabled}
                >
                  ${ptTr(LOC_ACTION_IMPORT)}
                </button>`
                : ''
            }
          </div>

          <form role="form" @submit=${this._saveEmojis}>
            <div class="row mt-5">
              <livechat-dynamic-table-form
                .header=${tableHeaderList}
                .schema=${tableSchema}
                .maxLines=${maxEmojisPerChannel}
                .validation=${this._validationError?.properties}
                .validationPrefix=${'emojis'}
                .rows=${this._channelEmojisConfiguration?.emojis.customEmojis}
                @update=${(e: CustomEvent) => {
                    if (this._channelEmojisConfiguration) {
                      this._channelEmojisConfiguration.emojis.customEmojis = e.detail
                      // Fixing missing ':' for shortnames:
                      for (const desc of this._channelEmojisConfiguration.emojis.customEmojis) {
                        if (desc.sn === '') { continue }
                        if (!desc.sn.startsWith(':')) { desc.sn = ':' + desc.sn }
                        if (!desc.sn.endsWith(':')) { desc.sn += ':' }
                      }
                      this.requestUpdate('_channelEmojisConfiguration')
                    }
                  }
                }
              ></livechat-dynamic-table-form>
            </div>
            <div class="form-group mt-5">
              <button type="reset" @click=${this._reset} ?disabled=${this._actionDisabled}>
                ${ptTr(LOC_CANCEL)}
              </button>
              <button type="submit" ?disabled=${this._actionDisabled}>
                ${ptTr(LOC_SAVE)}
              </button>
            </div>
          </form>
        </div>
      `,
      error: (err: any) => {
        this.registerClientOptions?.peertubeHelpers.notifier.error(err.toString())
      }
    })
  }

  protected _initTask (): Task {
    return new Task(this, {
      task: async () => {
        if (!this.registerClientOptions) {
          throw new Error('Missing client options')
        }
        if (!this.channelId) {
          throw new Error('Missing channelId')
        }
        this._channelDetailsService = new ChannelDetailsService(this.registerClientOptions)
        this._channelEmojisConfiguration = await this._channelDetailsService.fetchEmojisConfiguration(this.channelId)
        this._actionDisabled = false // in case of reset
      },
      args: () => []
    })
  }

  private async _reset (ev?: Event): Promise<void> {
    ev?.preventDefault()
    this._actionDisabled = true
    this._asyncTaskRender = this._initTask()
    this.requestUpdate()
  }

  private async _saveEmojis (ev?: Event): Promise<void> {
    ev?.preventDefault()
    const peertubeHelpers = this.registerClientOptions?.peertubeHelpers
    if (!peertubeHelpers) { return } // Should not happen

    if (!this._channelDetailsService || !this._channelEmojisConfiguration || !this.channelId) {
      peertubeHelpers.notifier.error(await peertubeHelpers.translate(LOC_ERROR))
      return
    }

    try {
      this._actionDisabled = true
      await this._channelDetailsService.saveEmojisConfiguration(this.channelId, this._channelEmojisConfiguration.emojis)
      this._validationError = undefined
      peertubeHelpers.notifier.info(await peertubeHelpers.translate(LOC_SUCCESSFULLY_SAVED))
      this.requestUpdate('_validationError')
    } catch (error) {
      this._validationError = undefined
      let msg: string
      if ((error instanceof ValidationError)) {
        this._validationError = error
        if (error.message) {
          msg = error.message
        }
      }
      msg ??= await peertubeHelpers.translate(LOC_ERROR)
      peertubeHelpers.notifier.error(msg)
      this.requestUpdate('_validationError')
    } finally {
      this._actionDisabled = false
    }
  }

  private async _importEmojis (ev: Event): Promise<void> {
    ev.preventDefault()
    this._actionDisabled = true
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
        this._channelEmojisConfiguration?.emojis.customEmojis.push(item)
      }

      this.requestUpdate('_channelEmojisConfiguration')

      this.registerClientOptions?.peertubeHelpers.notifier.info(
        await this.registerClientOptions?.peertubeHelpers.translate(LOC_ACTION_IMPORT_EMOJIS_INFO)
      )
    } catch (err: any) {
      this.registerClientOptions?.peertubeHelpers.notifier.error(err.toString())
    } finally {
      this._actionDisabled = false
    }
  }

  private async _exportEmojis (ev: Event): Promise<void> {
    ev.preventDefault()
    this._actionDisabled = true
    try {
      const result: ChannelEmojisConfiguration['emojis']['customEmojis'] = []
      for (const ed of this._channelEmojisConfiguration?.emojis?.customEmojis ?? []) {
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
      this.registerClientOptions?.peertubeHelpers.notifier.error(err.toString())
    } finally {
      this._actionDisabled = false
    }
  }

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
