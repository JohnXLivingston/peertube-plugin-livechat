// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { PartInfo, directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { RegisterClientHelpers } from '@peertube/peertube-types/client'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { html } from 'lit'
import { registerClientOptionsSubject$ } from '../contexts/peertube'
import { Subscription, filter, map } from 'rxjs'

export class TranslationDirective extends AsyncDirective {
  private _peertubeHelpers?: RegisterClientHelpers

  private _translatedValue: string = ''
  private _localizationId: string = ''

  private _allowUnsafeHTML = false

  private _subscriptionHandle: Subscription = new Subscription()

  constructor (partInfo: PartInfo) {
    super(partInfo)

    this.reconnected()
  }

  protected override disconnected = (): void => {
    this._subscriptionHandle.unsubscribe()
  }

  protected override reconnected = (): void => {
    this._subscriptionHandle.unsubscribe()
    this._subscriptionHandle = registerClientOptionsSubject$
      .pipe(filter(Boolean))
      .pipe(map(registerClientOptions => registerClientOptions.peertubeHelpers))
      .subscribe((registerClientHelpers: RegisterClientHelpers) => {
        this._peertubeHelpers = registerClientHelpers
        console.log(`we got PeertubeHelpers ! ${JSON.stringify(registerClientHelpers)}`)
        this._asyncUpdateTranslation().then(() => {}, () => {})
      })
  }

  public override render = (locId: string, allowHTML: boolean = false): unknown => {
    this._localizationId = locId // TODO Check current component for context (to infer the prefix)

    this._allowUnsafeHTML = allowHTML

    if (this._translatedValue === '') {
      this._translatedValue = locId
    }

    console.log('rendering')
    this._asyncUpdateTranslation().then(() => {}, () => {})

    return this._internalRender()
  }

  private readonly _internalRender = (): unknown => {
    console.log(`internalRender ${this._translatedValue}`)
    return this._allowUnsafeHTML ? html`${unsafeHTML(this._translatedValue)}` : this._translatedValue
  }

  private readonly _asyncUpdateTranslation = async (): Promise<true> => {
    const newValue = await this._peertubeHelpers?.translate(this._localizationId) ?? ''

    console.log(`asyncUpdateTranslation ${newValue}`)

    if (newValue !== '' && newValue !== this._translatedValue) {
      this._translatedValue = newValue
      this.setValue(this._internalRender())
    }

    return true
  }
}

export const ptTr = directive(TranslationDirective)
