// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { api } from '@converse/headless/core'
import { until } from 'lit/directives/until.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { getStandaloneButtons, getDropdownButtons } from 'shared/chat/utils.js'
import tplMucHead from '../../src/plugins/muc-views/templates/muc-head.js'

/**
 * Clones the Peertube buttons, and add them in the template.
 */
function getPeertubeButtons () {
  // searching original buttons in the DOM, and if found:
  // - clone a button in ConverseJS, that triggers the original button click event.
  // Note: original buttons will be hidden behind ConverseJS, so no need to hide them.

  const buttonsContainer = document.querySelector(
    '.peertube-plugin-livechat-buttons.peertube-plugin-livechat-buttons-open'
  )
  if (!buttonsContainer) { return html`` }

  // We must remove this class, in case it is already here.
  // Otherwise, the trick with offsetParent (see the forEach loop) will not work.
  buttonsContainer.classList.remove('peertube-plugin-livechat-buttons-cloned')

  const buttons = []
  buttonsContainer.childNodes.forEach(button => {
    try {
      if (button.offsetParent === null) {
        // Trick to detect if element is hidden
        // (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.offsetParent)
        return
      }

      buttons.push(button)
    } catch (err) {
      console.error(err)
    }
  })

  if (!buttons.length) {
    return html``
  }

  // Hidding original buttons:
  console.log('[peertube-plugin-livechat] Adding class peertube-plugin-livechat-buttons-cloned')
  buttonsContainer.classList.add('peertube-plugin-livechat-buttons-cloned')

  return html`
    ${repeat(buttons, (node) => html`
      <a
        href="#"
        title="${node.getAttribute('title') ?? ''}"
        class="${
          // adding original classes
          node.className
        }"
        @click=${() => {
          // triggering the original button click
          node.click()
        }}
      >
        ${unsafeHTML(node.innerHTML)}
      </a>
    `)}
  `
}

export default (el) => {
  if (!api.settings.get('livechat_mini_muc_head')) {
    // original Template (this settings comes with livechatMiniMucHeadPlugin)
    return html`${tplMucHead(el)}`
  }

  // Custom template, with only the buttons.
  const subjectHidden = true
  const headingButtonsPromise = el.getHeadingButtons(subjectHidden)
  return html`
    <div class="livechat-mini-muc-bar-buttons">
      ${until(getStandaloneButtons(headingButtonsPromise), '')}
      ${until(getDropdownButtons(headingButtonsPromise), '')}
      ${getPeertubeButtons()}
    </div>
  `
}
