// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
// SPDX-FileCopyrightText: 2025 Nicolas Chesnais <https://autre.space>
//
// SPDX-License-Identifier: AGPL-3.0-only

// FIXME: @stylistic/indent is buggy with strings literrals.
/* eslint-disable @stylistic/indent */

import { __ } from 'i18n'
import { _converse, api } from '@converse/headless'
import { html } from 'lit'
import tplMucBottomPanel from '../../src/plugins/muc-views/templates/muc-bottom-panel.js'
import { CustomElement } from 'shared/components/element.js'
import 'shared/modals/livechat-external-login.js'

async function setNicknameAndFocus (ev, model) {
  ev.preventDefault()
  const nick = ev.target.nick.value.trim()
  if (!nick) {
    return
  }
  await model.setNickname(nick)
  _converse.api.trigger('livechatViewerModeSetNickname', model, nick, {
    synchronous: true
  })
  document.querySelector('.chat-textarea')?.focus()
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
  if (!o.can_post) { return html`` }
  return html`<livechat-slow-mode jid=${o.model.get('jid')}>`
}

const tplEmojiOnly = (o) => {
  if (!o.can_post) { return html`` }
  if (!o.model.features?.get?.('x_peertubelivechat_emoji_only_mode')) {
    return ''
  }
  return html`<div class="livechat-emoji-only-info-box">
      <converse-icon class="fa fa-info-circle" size="1.2em"></converse-icon>
      ${
        // eslint-disable-next-line no-undef
        __(LOC_emoji_only_info)
      }
    </div>`
}

class BackToLastMsg extends CustomElement {
  static get properties () {
    return {
      jid: { type: String }
    }
  }

  show = false

  async connectedCallback () {
    super.connectedCallback()
    this.model = _converse.chatboxes.get(this.jid)
    await this.model.initialized

    let scrolled = this.model.ui.get('scrolled')
    let hasUnreadMsg = this.model.get('num_unread_general') > 0
    this.listenTo(this.model.ui, 'change:scrolled', () => {
      scrolled = this.model.ui.get('scrolled')
      this.show = scrolled && !hasUnreadMsg
      this.requestUpdate()
    })
    this.listenTo(this.model, 'change:num_unread_general', () => {
      hasUnreadMsg = this.model.get('num_unread_general') > 0
      // Do not show the element if there is new messages since there is another element for that
      this.show = scrolled && !hasUnreadMsg
      this.requestUpdate()
    })
  }

  onClick (ev) {
    ev?.preventDefault()
    const chatContainer = document.querySelector('converse-chat-content')
    chatContainer?.scrollTo({ top: chatContainer.scrollHeight })
  }

  render () {
    return this.show
      ? html`<div class="livechat-back-to-last-msg new-msgs-indicator" @click=${this.onClick}>
          ▼ ${
            // eslint-disable-next-line no-undef
            __(LOC_back_to_last_msg)
          } ▼
        </div>`
      : ''
  }
}
api.elements.define('livechat-back-to-last-msg', BackToLastMsg)

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
        <form class="converse-form chatroom-form" @submit=${ev => setNicknameAndFocus(ev, model)}>
            <label>${i18nHeading}</label>
            <fieldset>
              <input type="text"
                  required
                  name="nick"
                  value=""
                  class="form-control"
                  placeholder="${i18nNickname}"/>
            </fieldset>
            <fieldset>
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
                <button type="button" class="btn btn-primary" @click=${ev => {
                  ev.preventDefault()
                  api.modal.show('converse-livechat-external-login')
                }}>${i18nExternalLogin}</button>
              </div>
            `
        }
    </div>`
}

export default (o) => {
  let mutedAnonymousMessage
  if (
    !o.can_post &&
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
    ${tplEmojiOnly(o)}
    <livechat-back-to-last-msg jid=${o.model.get('jid')}></livechat-back-to-last-msg>
    ${
      mutedAnonymousMessage
        ? html`<span class="muc-bottom-panel muc-bottom-panel--muted">${mutedAnonymousMessage}</span>`
        : tplMucBottomPanel(o)
    }`
}
