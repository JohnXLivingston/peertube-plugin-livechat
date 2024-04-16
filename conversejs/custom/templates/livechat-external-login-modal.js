import { api } from '@converse/headless/core'
import { __ } from 'i18n'
import { html } from 'lit'

export const tplExternalLoginModal = (el, o) => {
  // eslint-disable-next-line no-undef
  const i18nRemotePeertube = __(LOC_login_remote_peertube)
  // eslint-disable-next-line no-undef
  const i18nRemotePeertubeUrl = __(LOC_login_remote_peertube_url)
  const i18nRemotePeertubeOpen = __('OK')
  const externalAuthOIDCButtonLabel = api.settings.get('livechat_external_auth_oidc_button_label')
  return html`<div class="modal-body livechat-external-login-modal">
    ${!externalAuthOIDCButtonLabel
      ? ''
      : html`
        <div class="livechat-external-login-modal-external-auth-oidc">
          <button
            class="btn btn-primary"
            @click=${() => console.log('ok, go')}
          >
            ${externalAuthOIDCButtonLabel}
          </button>
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
          @keyup=${el.onKeyUp}
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
        : html`<div class="invalid-feedback d-block">${o.remote_peertube_alert_message}</div>`
      }
      ${!o.remote_peertube_try_anyway_url
        ? ''
        : html`<div class="form-text">
          ${
            // eslint-disable-next-line no-undef
            __(LOC_login_remote_peertube_video_not_found_try_anyway)
          }
          <button class="btn btn-primary" onclick="window.location.href='${o.remote_peertube_try_anyway_url}'">${
            // eslint-disable-next-line no-undef
            __(LOC_login_remote_peertube_video_not_found_try_anyway_button)
          }</button>
        </div>`
      }
    </form>
  </div>`
}
