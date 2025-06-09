// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { LivechatElement } from '../../lib/elements/livechat'
import { ptTr } from '../../lib/directives/translation'
import { html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

@customElement('livechat-channel-tabs')
export class ChannelHomeElement extends LivechatElement {
  @property({ attribute: false })
  public channelId?: number

  @property({ attribute: false })
  public active?: string

  protected override render = (): TemplateResult => {
    return html`
      <a
        class=${classMap({
          'sub-menu-entry': true,
          active: this.active === 'configuration'
        })}
        href=${'/p/livechat/configuration/channel?channelId=' + encodeURIComponent(this.channelId ?? '')}
      >
        ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TITLE)}
      </a>
      <a
        class=${classMap({
          'sub-menu-entry': true,
          active: this.active === 'emojis'
        })}
        href=${'/p/livechat/configuration/emojis?channelId=' + encodeURIComponent(this.channelId ?? '')}
      >
        ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_EMOJIS_TITLE)}
      </a>
    `
  }
}
