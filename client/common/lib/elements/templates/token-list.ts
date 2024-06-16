// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

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
          <th scope="col">${ptTr(LOC_TOKEN_JID)}</th>
          <th scope="col">${ptTr(LOC_TOKEN_PASSWORD)}</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        ${
          repeat(el.tokenList ?? [], (token) => token.id, (token) => {
            html`<tr>
              <td>${
                el.mode === 'select'
                ? html`<input
                  type="radio"
                  ?selected=${el.currentSelectedToken?.id === token.id}
                  @click=${el.selectToken}
                />`
                : ''
              }</td>
              <td>${token.label}</td>
              <td>${token.jid}</td>
              <td>${token.password}</td>
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
