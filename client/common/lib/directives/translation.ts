// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { TemplateResult } from 'lit'
import { PartInfo, directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { RegisterClientHelpers } from '@peertube/peertube-types/client'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { html } from 'lit'
import { getPtContext } from '../contexts/peertube'

export class TranslationDirective extends AsyncDirective {
  private readonly _peertubeHelpers: RegisterClientHelpers

  private _translatedValue = ''
  private _localizationId = ''

  private _allowUnsafeHTML = false

  constructor (partInfo: PartInfo) {
    super(partInfo)

    this._peertubeHelpers = getPtContext().ptOptions.peertubeHelpers
    this._asyncUpdateTranslation().then(() => {}, () => {})
  }

  public override render = (locId: string, allowHTML = false): TemplateResult | string => {
    this._localizationId = locId // TODO Check current component for context (to infer the prefix)

    this._allowUnsafeHTML = allowHTML

    if (this._translatedValue === '') {
      this._translatedValue = locId
    }

    this._asyncUpdateTranslation().then(() => {}, () => {})

    return this._internalRender()
  }

  private readonly _internalRender = (): TemplateResult | string => {
    return this._allowUnsafeHTML ? html`${unsafeHTML(this._translatedValue)}` : this._translatedValue
  }

  private readonly _asyncUpdateTranslation = async (): Promise<true> => {
    const newValue = await this._peertubeHelpers.translate(this._localizationId) ?? ''

    if (newValue !== '' && newValue !== this._translatedValue) {
      this._translatedValue = newValue
      this.setValue(this._internalRender())
    }

    return true
  }
}

export const ptTr = directive(TranslationDirective)
