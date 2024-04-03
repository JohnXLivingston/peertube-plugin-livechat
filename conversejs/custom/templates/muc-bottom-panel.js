import { __ } from 'i18n'
import { _converse, api } from '@converse/headless/core'
import { html } from 'lit'
import tplMucBottomPanel from '../../src/plugins/muc-views/templates/muc-bottom-panel.js'
import { CustomElement } from 'shared/components/element.js'

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
        'Slow mode is enabled, users can send a message every %1$s seconds.',
        this.model.config.get('slow_mode_duration')
      )}
      <i class="livechat-hide-slow-mode-info-box" @click=${this.closeSlowModeInfoBox}>
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
  return html`<livechat-slow-mode jid=${o.model.get('jid')}>`
}

export default (o) => {
  if (api.settings.get('livechat_enable_viewer_mode')) {
    const model = o.model
    const i18nNickname = __('Nickname')
    const i18nJoin = __('Enter groupchat')
    const i18nHeading = __('Choose a nickname to enter')
    return html`
    <div class="livechat-viewer-mode-nick chatroom-form-container"
            @submit=${ev => setNickname(ev, model)}>
        <form class="converse-form chatroom-form">
            <label>${i18nHeading}</label>
            <fieldset class="form-group">
              <input type="text"
                  required="required"
                  name="nick"
                  value=""
                  class="form-control"
                  placeholder="${i18nNickname}"/>
            </fieldset>
            <fieldset class="form-group">
                <input type="submit" class="btn btn-primary" name="join" value="${i18nJoin}"/>
            </fieldset>
        </form>
    </div>
    ${tplSlowMode(o)}
    ${tplMucBottomPanel(o)}`
  }

  return html`
    ${tplSlowMode(o)}
    ${tplMucBottomPanel(o)}`
}
