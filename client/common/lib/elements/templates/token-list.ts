// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import type { LivechatTokenListElement } from '../token-list'
import { html, TemplateResult } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { repeat } from 'lit/directives/repeat.js'
import { ptTr } from '../../directives/translation'
import { AddSVG, RemoveSVG } from '../../buttons'

export function tplTokenList (el: LivechatTokenListElement): TemplateResult {
  return html`<div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">${ptTr(LOC_TOKEN_LABEL)}</th>
          <th scope="col">${ptTr(LOC_TOKEN_DATE)}</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        ${
          repeat(el.tokenList ?? [], (token) => token.id, (token) => {
            let dateStr = ''
            try {
              const date = new Date(token.date)
              dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
            } catch (_err) {}
            return html`<tr>
              <td>${
                el.mode === 'select'
                ? html`<input
                  type="radio"
                  name="livechat-token"
                  value=${token.id}
                  id=${`livechat-token-radio-${token.id}`}
                  ?checked=${el.currentSelectedToken?.id === token.id}
                  @click=${(ev: Event) => el.selectToken(ev, token)}
                />`
                : ''
              }</td>
              <td>
                <label for=${`livechat-token-radio-${token.id}`}>
                  ${token.label}
                </label>
              </td>
              <td>
                <label for=${`livechat-token-radio-${token.id}`}>
                  ${dateStr}
                </label>
              </td>
              <td>
                <button type="button"
                  class="livechat-revoke-token"
                  .title=${ptTr(LOC_TOKEN_ACTION_REVOKE) as any}
                  ?disabled=${el.actionDisabled}
                  @click=${() => {
                    el.revokeToken(token).then(() => {}, () => {})
                  }}
                >
                  ${unsafeHTML(RemoveSVG)}
                </button>
              </td>
            </tr>`
          })
        }
      </tbody>
      <tfoot>
        <tr>
          <td>
          <button type="button"
            class="livechat-create-token"
            .title=${ptTr(LOC_TOKEN_ACTION_CREATE) as any}
            ?disabled=${el.actionDisabled}
            @click=${() => {
              el.createToken().then(() => {}, () => {})
            }}
          >
            ${unsafeHTML(AddSVG)}
          </button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>`
}
