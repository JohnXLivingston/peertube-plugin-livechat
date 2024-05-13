import { PartInfo, directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { RegisterClientHelpers } from '@peertube/peertube-types/client';

export class TranslationDirective extends AsyncDirective {

    private _peertubeHelpers?: RegisterClientHelpers

    private _translatedValue : string = ''
    private _localizationId : string = ''

    constructor(partInfo: PartInfo) {
        super(partInfo);

        //_peertubeOptionsPromise.then((options) => this._peertubeHelpers = options.peertubeHelpers)
    }

    override render = (locId: string) => {
        this._localizationId = locId // TODO Check current component for context (to infer the prefix)

        if (this._translatedValue === '') {
            this._translatedValue = locId
        }

        this._asyncUpdateTranslation()

        return this._translatedValue
    }

    _asyncUpdateTranslation = async () => {
        let newValue = await this._peertubeHelpers?.translate(this._localizationId) ?? ''

        if (newValue !== '' && newValue !== this._translatedValue) {
            this._translatedValue = newValue
            this.setValue(newValue)
        }
    }
}

export const ptTr = directive(TranslationDirective)

