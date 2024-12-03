// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { helpButtonSVG } from '../../videowatch/buttons'
import { Task } from '@lit/task'
import { localizedHelpUrl } from '../../../utils/help'
import { ptTr } from '../directives/translation'
import type { DirectiveResult } from 'lit/directive'
import { LivechatElement } from './livechat'

@customElement('livechat-help-button')
export class HelpButtonElement extends LivechatElement {
  @property({ attribute: false })
  public buttonTitle: string | DirectiveResult = ptTr(LOC_ONLINE_HELP)

  @property({ attribute: false })
  public page = ''

  @state()
  public url: URL = new URL('https://lmddgtfy.net/')

  private readonly _asyncTaskRender = new Task(this, {
    task: async () => {
      this.url = new URL(
        await localizedHelpUrl(this.ptOptions, { page: this.page })
      )
    },
    args: () => []
  })

  protected override render = (): unknown => {
    return this._asyncTaskRender.render({
      complete: () => html`<a
        href="${this.url.href}"
        target=_blank
        title="${this.buttonTitle}"
        class="primary-button orange-button peertube-button-link"
      >${unsafeHTML(helpButtonSVG())}</a>`
    })
  }
}
