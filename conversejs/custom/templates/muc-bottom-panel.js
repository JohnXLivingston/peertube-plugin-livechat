import { __ } from 'i18n'
import { _converse, api } from '@converse/headless/core'
import { html } from 'lit'
import tplMucBottomPanel from '../../src/plugins/muc-views/templates/muc-bottom-panel.js'

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

export default (o) => {
  if (api.settings.get('livechat_viewer_mode')) {
    const model = o.model
    const i18nNickname = __('Nickname')
    const i18nJoin = __('Enter groupchat')
    return html`
    <div class="livechat-viewer-mode-nick chatroom-form-container"
            @submit=${ev => setNickname(ev, model)}>
        <form class="converse-form chatroom-form">
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
    ${tplMucBottomPanel(o)}`
  }
  return tplMucBottomPanel(o)
}
