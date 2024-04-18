import { randomNick, getPreviousAnonymousNick, setPreviousAnonymousNick } from '../nick'

export const livechatViewerModePlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse

    _converse.api.settings.extend({
      livechat_enable_viewer_mode: false,
      livechat_peertube_video_original_url: undefined,
      livechat_peertube_video_uuid: undefined,
      livechat_external_auth_oidc_button_label: undefined,
      livechat_external_auth_oidc_url: undefined,
      livechat_external_auth_reconnect_mode: undefined
    })

    const originalGetDefaultMUCNickname = _converse.getDefaultMUCNickname
    if (!originalGetDefaultMUCNickname) {
      console.error('[livechatViewerModePlugin] getDefaultMUCNickname is not initialized.')
    } else {
      Object.assign(_converse, {
        getDefaultMUCNickname: function (this: any): any {
          if (!_converse.api.settings.get('livechat_enable_viewer_mode')) {
            return originalGetDefaultMUCNickname.apply(this, arguments)
          }
          return originalGetDefaultMUCNickname.apply(this, arguments) ??
            getPreviousAnonymousNick() ??
            randomNick('Anonymous')
        }
      })
    }

    function refreshViewerMode (canChat: boolean): void {
      console.log('[livechatViewerModePlugin] refreshViewerMode: ' + (canChat ? 'off' : 'on'))
      if (canChat) {
        document.querySelector('body')?.setAttribute('livechat-viewer-mode', 'off')
      } else {
        document.querySelector('body')?.setAttribute('livechat-viewer-mode', 'on')
      }
    }

    _converse.api.listen.on('livechatViewerModeSetNickname', () => refreshViewerMode(true))

    _converse.ChatRoomOccupants.prototype.on('change:nick', (data: any, nick: string) => {
      try {
        if (!_converse.api.settings.get('livechat_enable_viewer_mode')) {
          return
        }
        // On nick change, if the user is_me, storing the new nickname
        if (nick && data?.attributes?.is_me === true) {
          console.log('Nickname change, storing to previousAnonymousNick')
          setPreviousAnonymousNick(nick)
          refreshViewerMode(!!nick && !/^Anonymous /.test(nick))
        }
      } catch (err) {
        console.error('Error on nick change handling...', err)
      }
    })

    _converse.api.listen.on('chatRoomInitialized', function (this: any, model: any): void {
      if (!_converse.api.settings.get('livechat_enable_viewer_mode')) {
        return
      }
      // When room is initialized, if user has chosen a nickname, set viewermode to off.
      // Note: when previousNickname is set, model.get('nick') has not the nick yet...
      // It will only come after receiving a presence stanza.
      // So we use previousNickname before trying to read the model.
      const nick = getPreviousAnonymousNick() ?? (model?.get ? model.get('nick') : '')
      refreshViewerMode(nick && !/^Anonymous /.test(nick))
    })
  }
}
