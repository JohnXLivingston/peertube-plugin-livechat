// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { PartInfo, directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { RegisterClientHelpers } from '@peertube/peertube-types/client';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit';

export class TranslationDirective extends AsyncDirective {

    private _peertubeHelpers?: RegisterClientHelpers

    private _translatedValue : string = ''
    private _localizationId : string = ''

    private _allowUnsafeHTML = false

    constructor(partInfo: PartInfo) {
        super(partInfo);

        //_peertubeOptionsPromise.then((options) => this._peertubeHelpers = options.peertubeHelpers)
    }

    // update = (part: ElementPart) => {
    //     if (part) console.log(`Element : ${part?.element?.getAttributeNames?.().join(' ')}`);
    //     return this.render(this._localizationId);
    // }

    override render = (locId: string, allowHTML: boolean = false) => {
        this._localizationId = locId // TODO Check current component for context (to infer the prefix)

        this._allowUnsafeHTML = allowHTML

        if (this._translatedValue === '') {
            this._translatedValue = locId
        }

        this._asyncUpdateTranslation().then(() => {}, () => {})

        return this._internalRender()
    }

    _internalRender = () => {
        return this._allowUnsafeHTML ? html`${unsafeHTML(this._translatedValue)}` : this._translatedValue
    }

    _asyncUpdateTranslation = async () => {
        let newValue = await this._peertubeHelpers?.translate(this._localizationId) ?? ''

        if (newValue !== '' && newValue !== this._translatedValue) {
            this._translatedValue = newValue
            this.setValue(this._internalRender())
        }
    }
}

export const ptTr = directive(TranslationDirective)

