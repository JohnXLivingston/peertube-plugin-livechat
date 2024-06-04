// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelEmojisConfiguration } from 'shared/lib/types'
import { LivechatElement } from '../../lib/elements/livechat'
import { registerClientOptionsContext } from '../../lib/contexts/peertube'
import { ChannelDetailsService } from '../services/channel-details'
import { channelDetailsServiceContext } from '../contexts/channel'
import { ptTr } from '../../lib/directives/translation'
import { Task } from '@lit/task'
import { customElement, property } from 'lit/decorators.js'
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

  protected override render = (): unknown => {
    return this._asyncTaskRender.render({
      pending: () => {},
      complete: () => html`
        <div
          class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-channel"
        >
          <h1>
            ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_EMOJIS_TITLE)}:
            <span class="peertube-plugin-livechat-configuration-channel-info">
              <span>${this._channelEmojisConfiguration?.channel.displayName}</span>
              <span>${this._channelEmojisConfiguration?.channel.name}</span>
            </span>
            <livechat-help-button .page=${'documentation/user/streamers/emojis'}>
            </livechat-help-button>
            FIXME: help url OK?
          </h1>
          <form role="form" @submit=${this._saveEmojis}>
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

  private readonly _saveEmojis = (ev?: Event): void => {
    ev?.preventDefault()
    // TODO
    this.registerClientOptions?.peertubeHelpers.notifier.error('TODO')
  }
}
