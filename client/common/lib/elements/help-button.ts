// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { helpButtonSVG } from '../../../videowatch/buttons'
import { consume } from '@lit/context'
import { registerClientOptionsContext } from '../contexts/peertube'
import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { Task } from '@lit/task'
import { localizedHelpUrl } from '../../../utils/help'
import { ptTr } from '../directives/translation'
import { DirectiveResult } from 'lit/directive'
import { LivechatElement } from './livechat'

@customElement('livechat-help-button')
export class HelpButtonElement extends LivechatElement {

  @consume({ context: registerClientOptionsContext, subscribe: true })
  public registerClientOptions: RegisterClientOptions | undefined

  @property({ attribute: false })
  public buttonTitle: string | DirectiveResult = ptTr(LOC_ONLINE_HELP)

  @property({ attribute: false })
  public page: string = ''

  @state()
  public url: URL = new URL('https://lmddgtfy.net/')

  private _asyncTaskRender = new Task(this, {
    task: async ([registerClientOptions], {signal}) => {
      this.url = new URL(registerClientOptions ? await localizedHelpUrl(registerClientOptions, { page: this.page }) : '')
    },
    args: () => [this.registerClientOptions]
  });

  render() {
    return this._asyncTaskRender.render({
      complete: () => html`<a
        href="${this.url.href}"
        target=_blank
        title="${this.buttonTitle}"
        class="orange-button peertube-button-link"
      >${unsafeHTML(helpButtonSVG())}</a>`
    })
  }
}
