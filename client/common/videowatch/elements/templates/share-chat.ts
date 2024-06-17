// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ShareChatElement } from '../share-chat'
import { html, TemplateResult } from 'lit'
import { ptTr } from '../../../lib/directives/translation'
import { classMap } from 'lit/directives/class-map.js'

export function tplShareChatCopy (el: ShareChatElement): TemplateResult {
  const computedUrl = el.computeUrl()
  return html`<div class="livechat-shareurl-copy">
    <input
      type="text"
      readonly autocomplete="off" placeholder=""
      class="form-control readonly"
      value=${computedUrl.shareString}
      @click=${(ev: Event) => {
        const input = ev.target as HTMLInputElement
        // Select the whole value when entering the input.
        input.select()
        input.setSelectionRange(0, 99999) /* For mobile devices */
      }}
    />
    <button
      type="button" class="btn btn-outline-secondary text-uppercase"
      @click=${el.copyUrl}
      ?disabled=${!computedUrl.shareString}
    >
      ${ptTr(LOC_COPY)}
    </button>
    <button
      type="button" class="btn btn-outline-secondary text-uppercase"
      @click=${el.openUrl}
      ?disabled=${computedUrl.openUrl === undefined}
    >
      ${ptTr(LOC_OPEN)}
    </button>
    <livechat-help-button .page=${'documentation/user/streamers'}></livechat-help-button>
  </div>`
}

function _tplShareChatTab (
  el: ShareChatElement,
  tabName: ShareChatElement['currentTab'],
  label: string
): TemplateResult {
  return html`
    <a
      class=${classMap({
        'sub-menu-entry': true,
        active: el.currentTab === tabName
      })}
      @click=${(ev: Event) => {
        ev.preventDefault()
        el.switchTab(tabName)
      }}
    >
      ${ptTr(label)}
    </a>`
}

export function tplShareChatTabs (el: ShareChatElement): TemplateResult {
  return html`
  ${_tplShareChatTab(el, 'peertube', LOC_WEB)}
    ${_tplShareChatTab(el, 'embed', LOC_SHARE_CHAT_EMBED)}
    ${
      el.dockEnabled
        ? _tplShareChatTab(el, 'dock', LOC_SHARE_CHAT_DOCK)
        : ''
    }
    ${
      el.xmppUriEnabled
        ? _tplShareChatTab(el, 'xmpp', LOC_CONNECT_USING_XMPP)
        : ''
    }
  `
}

export function tplShareChatTips (el: ShareChatElement): TemplateResult {
  let label: string | undefined
  let tips: TemplateResult | undefined
  switch (el.currentTab) {
    case 'peertube':
      label = LOC_SHARE_CHAT_PEERTUBE_TIPS
      break
    case 'embed':
      label = LOC_TIPS_FOR_STREAMERS
      tips = html`<livechat-help-button .page=${'documentation/user/obs'}></livechat-help-button>`
      break
    case 'dock':
      label = LOC_SHARE_CHAT_DOCK_TIPS
      tips = html`<livechat-help-button .page=${'documentation/user/obs'}></livechat-help-button>`
      break
    case 'xmpp':
      label = LOC_CONNECT_USING_XMPP_HELP
      break
  }
  if (!label) {
    return html``
  }
  return html`<div class="livechat-shareurl-tips">${ptTr(label)}${tips}</div>`
}

function _tplShareChatPeertubeOptions (_el: ShareChatElement): TemplateResult {
  return html``
}

function _tplShareChatEmbedOptions (el: ShareChatElement): TemplateResult {
  return html`
    <label>
      <input
        type="checkbox"
        ?checked=${el.embedIFrame}
        @click=${() => { el.embedIFrame = !el.embedIFrame }}
      />
      ${ptTr(LOC_GENERATE_IFRAME)}
    </label>

    <label>
      <input
        type="checkbox"
        ?checked=${el.embedReadOnly}
        @click=${() => { el.embedReadOnly = !el.embedReadOnly }}
      />
      ${ptTr(LOC_READ_ONLY)}
    </label>
    <div
      class=${classMap({
        'livechat-shareurl-suboptions': true,
        'livechat-shareurl-suboptions-disabled': !el.embedReadOnly
      })}
    >
      <label>
        <input
          type="checkbox"
          ?checked=${el.embedReadOnlyScrollbar}
          ?disabled=${!el.embedReadOnly}
          @click=${() => { el.embedReadOnlyScrollbar = !el.embedReadOnlyScrollbar }}
        />
        ${ptTr(LOC_SHOW_SCROLLBARR)}
      </label>
      <label>
        <input
          type="checkbox"
          ?checked=${el.embedReadOnlyTransparentBackground}
          ?disabled=${!el.embedReadOnly}
          @click=${() => { el.embedReadOnlyTransparentBackground = !el.embedReadOnlyTransparentBackground }}
        />
        ${ptTr(LOC_TRANSPARENT_BACKGROUND)}
      </label>
    </div>

    ${
      el.autocolorsAvailable
        ? html`
          <label>
            <input
              type="checkbox"
              ?checked=${el.embedAutocolors}
              @click=${() => { el.embedAutocolors = !el.embedAutocolors }}
            />
            ${ptTr(LOC_USE_CURRENT_THEME_COLOR)}
          </label>`
        : ''
    }
  `
}

function _tplShareChatDockOptions (el: ShareChatElement): TemplateResult {
  return html`<livechat-token-list
    mode="select"
    @update=${(_e: CustomEvent) => {
      el.requestUpdate()
    }}
  ></livechat-token-list>`
}

function _tplShareChatXMPPOptions (_el: ShareChatElement): TemplateResult {
  return html``
}

export function tplShareChatOptions (el: ShareChatElement): TemplateResult {
  let tpl: TemplateResult
  switch (el.currentTab) {
    case 'peertube':
      tpl = _tplShareChatPeertubeOptions(el)
      break
    case 'embed':
      tpl = _tplShareChatEmbedOptions(el)
      break
    case 'dock':
      tpl = _tplShareChatDockOptions(el)
      break
    case 'xmpp':
      tpl = _tplShareChatXMPPOptions(el)
      break
    default:
      tpl = html``
  }
  return html`<div class="livechat-shareurl-options">${tpl}</div>`
}
