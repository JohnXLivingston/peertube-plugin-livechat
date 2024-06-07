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

  protected override render = (): unknown => {
    const tableHeaderList: DynamicFormHeader = {
      sn: {
        colName: ptTr(LOC_LIVECHAT_EMOJIS_SHORTNAME),
        description: ptTr(LOC_LIVECHAT_EMOJIS_SHORTNAME_DESC)
      },
      url: {
        colName: ptTr(LOC_LIVECHAT_EMOJIS_FILE),
        description: ptTr(LOC_LIVECHAT_EMOJIS_FILE_DESC),
        headerClassList: ['peertube-livechat-emojis-thead-file']
      }
    }
    const tableSchema: DynamicFormSchema = {
      sn: {
        inputType: 'text',
        default: ''
      },
      url: {
        inputType: 'image-file',
        default: ''
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
              <button type="submit" class="peertube-button-link orange-button">
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

  private readonly _asyncTaskRender = new Task(this, {
    task: async () => {
      if (!this.registerClientOptions) {
        throw new Error('Missing client options')
      }
      if (!this.channelId) {
        throw new Error('Missing channelId')
      }
      this._channelDetailsService = new ChannelDetailsService(this.registerClientOptions)
      this._channelEmojisConfiguration = await this._channelDetailsService.fetchEmojisConfiguration(this.channelId)
    },
    args: () => []
  })

  private async _saveEmojis (ev?: Event): Promise<void> {
    ev?.preventDefault()
    const peertubeHelpers = this.registerClientOptions?.peertubeHelpers
    if (!peertubeHelpers) { return } // Should not happen

    if (!this._channelDetailsService || !this._channelEmojisConfiguration || !this.channelId) {
      peertubeHelpers.notifier.error(await peertubeHelpers.translate(LOC_ERROR))
      return
    }

    try {
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
    }
  }
}
