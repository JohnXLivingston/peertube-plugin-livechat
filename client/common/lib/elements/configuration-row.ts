// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from './livechat'

@customElement('livechat-configuration-row')
export class ConfigurationRowElement extends LivechatElement {
  @property({ attribute: false })
  public override title: string = 'title'

  @property({ attribute: false })
  public description: string = 'Here\'s a description'

  @property({ attribute: false })
  public helpPage: string = 'documentation'

  protected override render = (): unknown => {
    return html`
      <h2>
        ${this.title}
        <livechat-help-button .page=${this.helpPage}></livechat-help-button>
      </h2>
      <p>${this.description}</p>
      `
  }
}
