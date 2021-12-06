import { html } from 'lit-html'
import { api } from '@converse/headless/core.js'

export default () => html`
    <div class="inner-content converse-brand row">
        <div class="converse-brand__heading">
            <img src="${api.settings.get('assets_path')}/../../images/logo.svg">
        </div>
    </div>`
