import { randomNick, getPreviousAnonymousNick, setPreviousAnonymousNick } from '../nick'

export const livechatViewerModePlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse

    const previousNickname = getPreviousAnonymousNick()

    const getDefaultMUCNickname = _converse.getDefaultMUCNickname
    if (!getDefaultMUCNickname) {
      console.error('[livechatViewerModePlugin] getDefaultMUCNickname is not initialized.')
    } else {
      Object.assign(_converse, {
        getDefaultMUCNickname: function (this: any): any {
          return getDefaultMUCNickname.apply(this, arguments) ?? previousNickname ?? randomNick('Anonymous')
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

    if (previousNickname === null) {
      _converse.api.settings.update({
        livechat_viewer_mode: true
      })
    }

    _converse.api.listen.on('livechatViewerModeSetNickname', () => refreshViewerMode(true))

    _converse.ChatRoomOccupants.prototype.on('change:nick', (data: any, nick: string) => {
      try {
        // On nick change, if the user is_me, storing the new nickname
        if (nick && data?.attributes?.is_me === true) {
          console.log('Nickname change, storing to previousAnonymousNick')
          setPreviousAnonymousNick(nick)
        }
      } catch (err) {
        console.error('Error on nick change handling...', err)
      }
    })

    _converse.api.listen.on('chatRoomInitialized', function (this: any, model: any): void {
      // When room is initialized, if user has chosen a nickname, set viewermode to off.
      // Note: when previousNickname is set, model.get('nick') has not the nick yet...
      // It will only come after receiving a presence stanza.
      // So we use previousNickname before trying to read the model.
      const nick = previousNickname ?? (model?.get ? model.get('nick') : '')
      refreshViewerMode(nick && !/^Anonymous /.test(nick))
    })
  }
}
