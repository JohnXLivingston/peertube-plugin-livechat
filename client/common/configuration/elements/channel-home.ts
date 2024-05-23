import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ptTr } from '../directives/translation'
import './help-button'
import { Task } from '@lit/task';
import type { ChannelLiveChatInfos } from 'shared/lib/types'
import { ChannelDetailsService } from '../services/channel-details'
import { provide } from '@lit/context'
import { getGlobalStyleSheets } from '../../global-styles'
import { channelDetailsServiceContext, registerClientOptionsContext } from '../contexts/channel'

@customElement('channel-home')
export class ChannelHomeElement extends LitElement {

  @provide({ context: registerClientOptionsContext })
  @property({ attribute: false })
  public registerClientOptions: RegisterClientOptions | undefined

  @state()
  public _channels: ChannelLiveChatInfos[] | undefined

  @provide({ context: channelDetailsServiceContext })
  private _channelDetailsService: ChannelDetailsService | undefined

  static styles = [
    ...getGlobalStyleSheets()
  ];

  @state()
  public _formStatus: boolean | any = undefined

  private _asyncTaskRender = new Task(this, {

    task: async ([registerClientOptions], {signal}) => {
      // Getting the current username in localStorage. Don't know any cleaner way to do.
      const username = window.localStorage.getItem('username')
      if (!username) {
        throw new Error('Can\'t get the current username.')
      }

      if (this.registerClientOptions) {
        this._channelDetailsService = new ChannelDetailsService(this.registerClientOptions)
        this._channels = await this._channelDetailsService.fetchUserChannels(username)
      }
    },

    args: () => [this.registerClientOptions]

  });

  render = () => {
    return this._asyncTaskRender.render({
      complete: () => html`
      <div class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-home">
        <h1>
          ${ptTr(LOC_LIVECHAT_CONFIGURATION_TITLE)}
            <help-button .page="documentation/user/streamers/channel">
            </help-button>
        </h1>
        <p>${ptTr(LOC_LIVECHAT_CONFIGURATION_DESC)}</p>
        <p>${ptTr(LOC_LIVECHAT_CONFIGURATION_PLEASE_SELECT)}</p>
        <ul class="peertube-plugin-livechat-configuration-home-channels">
        ${this._channels?.map((channel) => html`
          <li>
            <a href="${channel.livechatConfigurationUri}">
              ${channel.avatar ?
                html`<img class="avatar channel" src="${channel.avatar.path}">`
                       :
                html`<div class="avatar channel initial gray"></div>`
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
