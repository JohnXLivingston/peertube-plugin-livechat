// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { DirectiveResult } from 'lit/directive'
import { html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LivechatElement } from './livechat'
import { ptTr } from '../directives/translation'

@customElement('livechat-error')
export class ErrorElement extends LivechatElement {
  @property({ attribute: false })
  public msg: string | DirectiveResult = ptTr(LOC_LOADING_ERROR)

  protected override render = (): TemplateResult => {
    return html`${this.msg}`
  }
}
