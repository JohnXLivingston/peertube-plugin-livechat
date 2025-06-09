// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { CustomElement } from 'shared/components/element.js'
import { api } from '@converse/headless'
import { html } from 'lit'
import { __ } from 'i18n'

import '../styles/muc-terms.scss'

export default class MUCTermsView extends CustomElement {
  static get properties () {
    return {
      model: { type: Object, attribute: true },
      termstype: { type: String, attribute: true }
    }
  }

  async initialize () {
    if (!this.model) {
      return
    }
    this.listenTo(this.model, 'change:x_livechat_terms_' + this.termstype, () => this.requestUpdate())
  }

  render () {
    const terms = this.model?.get('x_livechat_terms_' + this.termstype)
    return html`
      ${terms && terms.body && !this._hideInfoBox(terms.body)
        ? html`
          <div>
            <converse-rich-text text=${terms.body} render_styling></converse-rich-text>
            <i class="livechat-hide-terms-info-box" @click=${this.closeInfoBox} title=${__('Close')}>
              <converse-icon class="fa fa-times" size="1em"></converse-icon>
            </i>
          </div>`
        : ''
      }`
  }

  closeInfoBox (ev) {
    ev.preventDefault()
    const terms = this.model?.get('x_livechat_terms_' + this.termstype)
    if (terms) {
      localStorage?.setItem('x_livechat_terms_' + this.termstype + '_hidden', terms.body)
    }
    this.requestUpdate()
  }

  _hideInfoBox (body) {
    // When hiding the infobox, we store in localStorage the current body, so we will show it again if message change.
    // Note: for termstype=global we don't store the MUC server, so if user join chat from different instances,
    // it will show terms again
    // Note: same for termstype=muc, we don't store the MUC JID, so if user changes channel,
    // it will probably show terms again
    const lsHideInfoBox = localStorage?.getItem('x_livechat_terms_' + this.termstype + '_hidden')
    return lsHideInfoBox === body
  }
}

api.elements.define('livechat-converse-muc-terms', MUCTermsView)
