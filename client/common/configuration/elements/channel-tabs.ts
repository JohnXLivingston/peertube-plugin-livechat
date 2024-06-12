// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { registerClientOptionsContext } from '../../lib/contexts/peertube'
import { LivechatElement } from '../../lib/elements/livechat'
import { ptTr } from '../../lib/directives/translation'
import { html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

@customElement('livechat-channel-tabs')
export class ChannelHomeElement extends LivechatElement {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  @consume({ context: registerClientOptionsContext, subscribe: true })
  private _registerClientOptions?: RegisterClientOptions

  @property({ attribute: false })
  public channelId?: number

  @property({ attribute: false })
  public active?: string

  protected override render = (): TemplateResult => {
    return html`
      <a
        class="sub-menu-entry ${this.active === 'configuration' ? 'active' : ''}"
        href=${'/p/livechat/configuration/channel?channelId=' + encodeURIComponent(this.channelId ?? '')}
      >
        ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TITLE)}
      </a>
      <a
        class="sub-menu-entry ${this.active === 'emojis' ? 'active' : ''}"
        href=${'/p/livechat/configuration/emojis?channelId=' + encodeURIComponent(this.channelId ?? '')}
      >
        ${ptTr(LOC_LIVECHAT_CONFIGURATION_CHANNEL_EMOJIS_TITLE)}
      </a>
    `
  }
}
