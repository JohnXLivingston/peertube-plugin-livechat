// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { getPtContext, PtContext } from '../contexts/peertube'
import { LitElement } from 'lit'

/**
 * Base class for all Custom Elements.
 */
export class LivechatElement extends LitElement {
  public readonly ptContext: PtContext
  public readonly ptOptions: RegisterClientOptions
  public readonly ptTranslate: RegisterClientOptions['peertubeHelpers']['translate']
  public readonly ptNotifier: RegisterClientOptions['peertubeHelpers']['notifier']
  public readonly logger: ReturnType<PtContext['logger']['createLogger']>

  constructor () {
    super()
    this.ptContext = getPtContext()
    this.ptOptions = this.ptContext.ptOptions
    this.ptNotifier = this.ptOptions.peertubeHelpers.notifier
    this.ptTranslate = this.ptOptions.peertubeHelpers.translate
    this.logger = this.ptContext.logger.createLogger(this.tagName.toLowerCase())
  }

  protected override createRenderRoot = (): HTMLElement | DocumentFragment => {
    return this
  }
}
