// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import { LivechatElement } from './livechat'

@customElement('livechat-spinner')
export class SpinnerElement extends LivechatElement {
  protected override render = (): TemplateResult => {
    return html`<div></div>` // CSS does the trick.
  }
}
