// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { LivechatElement } from '../../lib/elements/livechat'
import { registerClientOptionsContext } from '../../lib/contexts/peertube'
import { ChannelDetailsService } from '../services/channel-details'
import { channelDetailsServiceContext } from '../contexts/channel'
import { ChannelEmojis } from 'shared/lib/types'
// import { ptTr } from '../../lib/directives/translation'
import { Task } from '@lit/task'
import { customElement, property } from 'lit/decorators.js'
import { provide } from '@lit/context'

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

  private _channelEmojis?: ChannelEmojis

  @provide({ context: channelDetailsServiceContext })
  private _channelDetailsService?: ChannelDetailsService

  protected override render = (): void => {
    return this._asyncTaskRender.render({
      pending: () => {},
      complete: () => {},
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
      this._channelEmojis = await this._channelDetailsService.fetchEmojis(this.channelId)
    },
    args: () => []
  })
}
