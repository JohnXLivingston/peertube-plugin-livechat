// SPDX-FileCopyrightText: 2013-2018 JC Brand <https://github.com/conversejs/converse.js/>
// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: MPL-2.0
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { api } from '@converse/headless/index.js'

export default () => html`
    <div class="inner-content converse-brand row">
        <div class="converse-brand__heading">
            <img src="${api.settings.get('assets_path')}/../../images/logo.svg">
        </div>
    </div>`
