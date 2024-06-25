// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { __ } from 'i18n'
import { _converse, api } from '@converse/headless/core'
import { html } from 'lit'
import tplMucBottomPanel from '../../src/plugins/muc-views/templates/muc-bottom-panel.js'
import { CustomElement } from 'shared/components/element.js'
import 'shared/modals/livechat-external-login.js'

async function setNickname (ev, model) {
  ev.preventDefault()
  const nick = ev.target.nick.value.trim()
  if (!nick) {
    return
  }
  await model.setNickname(nick)
  _converse.api.trigger('livechatViewerModeSetNickname', model, nick, {
    synchronous: true
  })
}

class SlowMode extends CustomElement {
  static get properties () {
    return {
      jid: { type: String }
    }
  }

  hideInfoBox = false

  async connectedCallback () {
    super.connectedCallback()
    this.model = _converse.chatboxes.get(this.jid)
    await this.model.initialized

    let previousDuration = this.model.config.get('slow_mode_duration')
    this.listenTo(this.model.config, 'change:slow_mode_duration', () => {
      if (this.hideInfoBox) {
        const duration = this.model.config.get('slow_mode_duration')
        if (duration !== previousDuration) {
          previousDuration = duration
          // Duration changed, opening the infobox again.
          this.hideInfoBox = false
        }
      }
      this.requestUpdate()
    })
  }

  render () {
    if (!(parseInt(this.model.config.get('slow_mode_duration')) > 0)) { // This includes NaN, for which ">0"===false
      return html``
    }
    if (this.hideInfoBox) {
      return html``
    }
    return html`<div class="livechat-slow-mode-info-box">
      <converse-icon class="fa fa-info-circle" size="1.2em"></converse-icon>
      ${__(
        // eslint-disable-next-line no-undef
        LOC_slow_mode_info,
        this.model.config.get('slow_mode_duration')
      )}
      <i class="livechat-hide-slow-mode-info-box" @click=${this.closeSlowModeInfoBox} title=${__('Close')}>
        <converse-icon class="fa fa-times" size="1em"></converse-icon>
      </i>
    </div>`
  }

  closeSlowModeInfoBox (ev) {
    ev?.preventDefault?.()
    ev?.stopPropagation?.()
    this.hideInfoBox = true
    this.requestUpdate()
  }
}
api.elements.define('livechat-slow-mode', SlowMode)

const tplSlowMode = (o) => {
  if (!o.can_edit) { return html`` }
  return html`<livechat-slow-mode jid=${o.model.get('jid')}>`
}

const tplViewerMode = (o) => {
  if (!api.settings.get('livechat_enable_viewer_mode')) {
    return html``
  }
  const model = o.model
  const i18nNickname = __('Nickname')
  const i18nJoin = __('Enter groupchat')
  const i18nHeading = __('Choose a nickname to enter')
  // eslint-disable-next-line no-undef
  const i18nExternalLogin = __(LOC_login_using_external_account)
  return html`
    <div class="livechat-viewer-mode-content chatroom-form-container">
        <form class="converse-form chatroom-form" @submit=${ev => setNickname(ev, model)}>
            <label>${i18nHeading}</label>
            <fieldset class="form-group">
              <input type="text"
                  required
                  name="nick"
                  value=""
                  class="form-control"
                  placeholder="${i18nNickname}"/>
            </fieldset>
            <fieldset class="form-group">
                <input type="submit" class="btn btn-primary" name="join" value="${i18nJoin}"/>
            </fieldset>
        </form>
        ${
          // If we open a room with forcetype, there is no current video... So just disabling external login
          // (in such case, we should be logged in as admin/moderator...)
          !api.settings.get('livechat_peertube_video_original_url')
            ? ''
            : html`
              <hr>
              <div class="livechat-viewer-mode-external-login">
                <button class="btn btn-primary" @click=${ev => {
                  ev.preventDefault()
                  api.modal.show('converse-livechat-external-login')
                }}>${i18nExternalLogin}</button>
              </div>
            `
        }
    </div>`
}

export default (o) => {
  // ConverseJS 10.x does not handle properly the visitor role in unmoderated rooms.
  // See https://github.com/conversejs/converse.js/issues/3428 for more info.
  // So we will do a dirty hack here to fix this case.
  // Note: ConverseJS 11.x has changed the code, and could be fixed more cleanly (or will be fixed if #3428 is fixed).
  if (o.can_edit && o.model.getOwnRole() === 'visitor') {
    o.can_edit = false
  }

  let mutedAnonymousMessage
  if (
    !o.can_edit &&
    o.model.features?.get?.('x_peertubelivechat_mute_anonymous') &&
    _converse.api.settings.get('livechat_specific_is_anonymous') === true
  ) {
    // If we are moderated because we are anonymous, we want to display a custom message.
    // FIXME: if x_peertubelivechat_mute_anonymous changes, user are first muted/voiced, and then only the
    //      status 104 is sent. But we don't listen to 'change:x_peertubelivechat_mute_anonymous'.
    //      So the custom message won't be correct. But this is not a big issue.
    // eslint-disable-next-line no-undef
    mutedAnonymousMessage = __(LOC_muted_anonymous_message)
  }

  return html`
    ${tplViewerMode(o)}
    ${tplSlowMode(o)}
    ${
      mutedAnonymousMessage
        ? html`<span class="muc-bottom-panel muc-bottom-panel--muted">${mutedAnonymousMessage}</span>`
        : tplMucBottomPanel(o)
    }`
}
