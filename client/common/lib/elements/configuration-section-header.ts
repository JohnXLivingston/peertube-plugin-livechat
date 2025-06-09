// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { ptTr } from '../directives/translation'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from './livechat'

@customElement('livechat-configuration-section-header')
export class ConfigurationSectionHeaderElement extends LivechatElement {
  @property({ attribute: false })
  public label: string | ReturnType<typeof ptTr> = '???'

  @property({ attribute: false })
  public description?: string | ReturnType<typeof ptTr>

  @property({ attribute: false })
  public helpPage?: string

  protected override render = (): unknown => {
    return html`
      <h2>
        ${this.label}
        ${
          this.helpPage === undefined
            ? ''
            : html`<livechat-help-button .page=${this.helpPage}></livechat-help-button>`
        }
      </h2>
      ${
        this.description === undefined
          ? ''
          : html`<p>${this.description}</p>`
      }`
  }
}
