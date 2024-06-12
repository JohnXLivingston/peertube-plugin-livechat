// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ptTr } from '../../lib/directives/translation'
import { Task } from '@lit/task'
import type { ChannelLiveChatInfos } from 'shared/lib/types'
import { ChannelDetailsService } from '../services/channel-details'
import { provide } from '@lit/context'
import { channelDetailsServiceContext } from '../contexts/channel'
import { LivechatElement } from '../../lib/elements/livechat'

@customElement('livechat-channel-home')
export class ChannelHomeElement extends LivechatElement {
  @state()
  public _channels?: ChannelLiveChatInfos[]

  @provide({ context: channelDetailsServiceContext })
  private _channelDetailsService?: ChannelDetailsService

  @state()
  public _formStatus: boolean | any = undefined

  private readonly _asyncTaskRender = new Task(this, {
    task: async () => {
      // Getting the current username in localStorage. Don't know any cleaner way to do.
      const username = window.localStorage.getItem('username')
      if (!username) {
        throw new Error('Can\'t get the current username.')
      }

      this._channelDetailsService = new ChannelDetailsService(this.ptOptions)
      this._channels = await this._channelDetailsService.fetchUserChannels(username)
    },
    args: () => []
  })

  protected override render = (): unknown => {
    return this._asyncTaskRender.render({
      pending: () => html`<livechat-spinner></livechat-spinner>`,
      error: () => html`<livechat-error></livechat-error>`,
      complete: () => html`
      <div class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-home">
        <h1>
          ${ptTr(LOC_LIVECHAT_CONFIGURATION_TITLE)}
            <livechat-help-button .page=${'documentation/user/streamers/channel'}>
            </livechat-help-button>
        </h1>
        <p>${ptTr(LOC_LIVECHAT_CONFIGURATION_DESC)}</p>
        <p>${ptTr(LOC_LIVECHAT_CONFIGURATION_PLEASE_SELECT)}</p>
        <ul class="peertube-plugin-livechat-configuration-home-channels">
        ${this._channels?.map((channel) => html`
          <li>
            <a href="${channel.livechatConfigurationUri}">
              ${channel.avatar
                ? html`<img class="avatar channel" src="${channel.avatar.path}">`
                : html`<div class="avatar channel initial gray"></div>`
              }
            </a>
            <div class="peertube-plugin-livechat-configuration-home-info">
              <a href="${channel.livechatConfigurationUri}">
                <div>${channel.displayName}</div>
                <div>${channel.name}</div>
              </a>
            </div>
          </li>
        `)}
        </ul>
      </div>
      `
    })
  }
}
