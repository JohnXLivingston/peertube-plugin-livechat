// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { localizedHelpUrl } from '../../../utils/help'
import { helpButtonSVG } from '../../../videowatch/buttons'
import { TemplateResult, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { ptTr } from './TranslationDirective'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

interface HomeViewData {
  title: string
  description: string
  please_select: string
  channels: any[]
  helpButton: TemplateResult
}

/**
 * Renders the livechat configuration setup home page.
 * @param registerClientOptions Peertube client options
 * @returns The page content
 */
async function renderConfigurationHome (registerClientOptions: RegisterClientOptions): Promise<TemplateResult> {
  const { peertubeHelpers } = registerClientOptions

  try {
    // Getting the current username in localStorage. Don't know any cleaner way to do.
    const username = window.localStorage.getItem('username')
    if (!username) {
      throw new Error('Can\'t get the current username.')
    }

    // FIXME: if more than 100 channels, loop (or add a pagination)
    const channels = await (await fetch(
      '/api/v1/accounts/' + encodeURIComponent(username) + '/video-channels?start=0&count=100&sort=name',
      {
        method: 'GET',
        headers: peertubeHelpers.getAuthHeader()
      }
    )).json()
    if (!channels || !('data' in channels) || !Array.isArray(channels.data)) {
      throw new Error('Can\'t get the channel list.')
    }

    for (const channel of channels.data) {
      channel.livechatConfigurationUri = '/p/livechat/configuration/channel?channelId=' + encodeURIComponent(channel.id)

      // Note: since Peertube v6.0.0, channel.avatar is dropped, and we have to use channel.avatars.
      // So, if !channel.avatar, we will search a suitable one in channel.avatars, and fill channel.avatar.
      if (!channel.avatar && channel.avatars && Array.isArray(channel.avatars)) {
        for (const avatar of channel.avatars) {
          if (avatar.width === 120) {
            channel.avatar = avatar
            break
          }
        }
      }
    }

    const view : HomeViewData = {
      title: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_TITLE),
      description: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_DESC),
      please_select: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_PLEASE_SELECT),
      channels: channels.data,
      helpButton: await _fillViewHelpButtons(registerClientOptions)
    }


    return renderConfigurationHomeFromTemplate(view)
  } catch (err: any) {
    peertubeHelpers.notifier.error(err.toString())
    return html``
  }
}

async function _fillViewHelpButtons ( // TODO: refactor with the similar function in channel.ts
  registerClientOptions: RegisterClientOptions
): Promise<TemplateResult> {
  const title = await registerClientOptions.peertubeHelpers.translate(LOC_ONLINE_HELP)

  const button = async (page: string): Promise<TemplateResult> => {
    const helpUrl = await localizedHelpUrl(registerClientOptions, {
      page
    })
    const helpIcon = helpButtonSVG()
    return html`<a
        href="${helpUrl}"
        target=_blank
        title="${ptTr(LOC_ONLINE_HELP)}"
        class="orange-button peertube-button-link"
      >${unsafeHTML(helpIcon)}</a>`
  }

  return button('documentation/user/streamers/channel')
}

function renderConfigurationHomeFromTemplate(view: HomeViewData) {
  return html`
    <div class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-home">
      <h1>
        ${view.title}
        ${view.helpButton}
      </h1>
      <p>${view.description}</p>
      <p>${view.please_select}</p>
      <ul class="peertube-plugin-livechat-configuration-home-channels">
      ${view.channels.map((channel) => html`
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
}

export {
  renderConfigurationHome
}
