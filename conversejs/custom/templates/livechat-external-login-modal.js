// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { _converse, api } from '@converse/headless'
import { __ } from 'i18n'
import { html } from 'lit'

function externalLoginClickHandler (ev, el, externalAuthOIDCUrl) {
  ev.preventDefault()

  el.clearAlert()

  const popup = window.open(
    externalAuthOIDCUrl,
    'livechat-external-auth',
    'popup'
  )

  window.externalAuthGetResult = (data) => {
    window.externalAuthGetResult = undefined

    if (!data) {
      // special case: when this modal is closed, used to close the popup
      if (popup) { popup.close() }
      return
    }

    console.log('Received an external authentication result...', data)
    if (!data.ok) {
      el.external_auth_oidc_alert_message =
        // eslint-disable-next-line no-undef
        __(LOC_login_external_auth_alert_message) +
        (data.message ? ` (${data.message})` : '')
      return
    }

    console.info('Got external account information', data)
    // Storing the token in sessionStorage.
    window.sessionStorage.setItem('peertube-plugin-livechat-external-auth-oidc-token', data.token)

    const reconnectMode = api.settings.get('livechat_external_auth_reconnect_mode')
    if (reconnectMode === 'button-close-open') {
      // Here, we click on the close button, then on the open button.
      // FIXME: there is maybe a better way to do this.
      try {
        // But first, close the modal.
        document.getElementsByClassName('livechat-external-login-modal')[0]
          .closest('.modal-dialog')
          .querySelector('button.close')
          .click()

        // As soon as disconnected, re-open:
        _converse.api.listen.once('disconnected', () => {
          document.getElementsByClassName('peertube-plugin-livechat-button-open')[0].click()
        })

        // And we close!
        document.getElementsByClassName('peertube-plugin-livechat-button-close')[0].click()
      } catch (err) {
        // fallback... reloading window :/
        console.error(err)
        window.location.reload()
      }
    } else { // reload and other use cases...
      window.location.reload()
    }
  }

  return false
}

export const tplExternalLoginModal = (el, o) => {
  // eslint-disable-next-line no-undef
  const i18nRemotePeertube = __(LOC_login_remote_peertube)
  // eslint-disable-next-line no-undef
  const i18nRemotePeertubeUrl = __(LOC_login_remote_peertube_url)
  const i18nRemotePeertubeOpen = __('OK')
  const buttonsDefinitions = api.settings.get('livechat_external_auth_oidc_buttons')

  const externalButtonsBlocks = []
  if (Array.isArray(buttonsDefinitions) && buttonsDefinitions.length) {
    // type=custom first, if present
    // and sorting on label alphabetically
    const customButtonsDefinitions = buttonsDefinitions.filter(b => b.type === 'custom')
      .sort((a, b) => a.buttonLabel > b.buttonLabel ? 1 : (a.buttonLabel < b.buttonLabel ? -1 : 0))

    const otherButtonsDefinition = buttonsDefinitions.filter(b => b.type !== 'custom')
      .sort((a, b) => a.buttonLabel > b.buttonLabel ? 1 : (a.buttonLabel < b.buttonLabel ? -1 : 0))

    for (const block of [customButtonsDefinitions, otherButtonsDefinition]) {
      if (!block.length) { continue }
      const externalButtons = []
      for (const buttonDef of block) {
        if (typeof buttonDef !== 'object') { continue }
        const type = buttonDef.type
        const label = buttonDef.buttonLabel
        const url = buttonDef.url
        if (!type || !type || !url) {
          continue
        }
        externalButtons.push({
          label,
          url,
          class: 'livechat-external-login-modal-external-auth-oidc-type-' + type
        })
      }
      externalButtonsBlocks.push(externalButtons)
    }
  }

  return html`<div class="modal-body livechat-external-login-modal">
    ${!externalButtonsBlocks.length || !window.sessionStorage
      ? ''
      : html`<div class="livechat-external-login-modal-external-auth-oidc">
          ${
            externalButtonsBlocks.map(externalButtons => html`
              <div class="livechat-external-login-modal-external-auth-oidc-block">
                ${
                  externalButtons.map(button => html`
                    <button type="button"
                      class="btn btn-primary ${button.class}"
                      @click=${
                        (ev) => {
                          externalLoginClickHandler(ev, el, button.url)
                        }
                      }
                    >
                      ${button.label}
                    </button>
                  `)
                }
              </div>
            `)
          }

          ${!o.external_auth_oidc_alert_message
            ? ''
            : html`<div class="invalid-feedback d-block">${o.external_auth_oidc_alert_message}</div>`
          }
        </div>
        <hr>
      `
    }
    <form class="converse-form chatroom-form" @submit=${(ev) => el.openRemotePeertube(ev)}>
      <label>
        ${i18nRemotePeertube}
        <input
          type="url"
          placeholder="${i18nRemotePeertubeUrl}"
          class="form-control ${o.remote_peertube_alert_message ? 'is-invalid' : ''}"
          name="peertube_url"
          @keyup=${el.onRemotePeertubeKeyUp}
          ?disabled=${o.remote_peertube_state === 'loading'}
        />
      </label>
      <input
        type="submit"
        class="btn btn-primary"
        value="${i18nRemotePeertubeOpen}"
        ?disabled=${o.remote_peertube_state === 'loading'}
      />
      ${
        o.remote_peertube_state !== 'loading'
          ? ''
          : html`<small class="form-text text-muted">${
            // eslint-disable-next-line no-undef
            __(LOC_login_remote_peertube_searching)
          }</small>`
      }
      ${!o.remote_peertube_alert_message
        ? ''
        : html`<div class="invalid-feedback d-block">
          ${o.remote_peertube_alert_message}
          ${
            !o.remote_peertube_open_failed_url
              ? ''
              : html`<a href="${o.remote_peertube_open_failed_url}" target="_top">
                ${o.remote_peertube_open_failed_url}
              </a>`
          }
        </div>`
      }
      ${!o.remote_peertube_try_anyway_url
        ? ''
        : html`<div>
          ${
            // eslint-disable-next-line no-undef
            __(LOC_login_remote_peertube_video_not_found_try_anyway)
          }
          <button type="button" class="btn btn-primary"
            @click=${() => el.openUrlTargetTop(o.remote_peertube_try_anyway_url)}
          >${
            // eslint-disable-next-line no-undef
            __(LOC_login_remote_peertube_video_not_found_try_anyway_button)
          }</button>
        </div>`
      }
    </form>
  </div>`
}
