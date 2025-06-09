// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { randomNick, getPreviousAnonymousNick, setPreviousAnonymousNick } from '../nick'

export const livechatViewerModePlugin = {
  dependencies: ['converse-muc', 'converse-muc-views'],
  initialize: function (this: any) {
    const _converse = this._converse

    _converse.api.settings.extend({
      livechat_enable_viewer_mode: false,
      livechat_peertube_video_original_url: undefined,
      livechat_peertube_video_uuid: undefined,
      livechat_external_auth_oidc_buttons: undefined,
      livechat_external_auth_reconnect_mode: undefined
    })

    const originalGetDefaultMUCNickname = _converse.exports.getDefaultMUCNickname
    if (!originalGetDefaultMUCNickname) {
      console.error('[livechatViewerModePlugin] getDefaultMUCNickname is not initialized.')
    } else {
      Object.assign(_converse.exports, {
        getDefaultMUCNickname: function (this: any, ...args: any[]): any {
          if (!_converse.api.settings.get('livechat_enable_viewer_mode')) {
            return originalGetDefaultMUCNickname.apply(this, args)
          }
          return originalGetDefaultMUCNickname.apply(this, args) ??
            getPreviousAnonymousNick() ??
            randomNick('Anonymous')
        }
      })
    }

    function refreshViewerMode (canChat: boolean | null): void {
      console.log('[livechatViewerModePlugin] refreshViewerMode: ' + (canChat ? 'off' : 'on'))
      if (canChat === null) {
        document.body.removeAttribute('livechat-viewer-mode')
      } else if (canChat) {
        document.body.setAttribute('livechat-viewer-mode', 'off')
      } else {
        document.body.setAttribute('livechat-viewer-mode', 'on')
      }
    }

    _converse.api.listen.on('livechatViewerModeSetNickname', () => refreshViewerMode(true))

    _converse.ChatRoomOccupants.prototype.on('change:nick', (data: any, nick: string) => {
      try {
        if (!_converse.api.settings.get('livechat_enable_viewer_mode')) {
          refreshViewerMode(null)
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
        refreshViewerMode(null)
        return
      }
      // When room is initialized, if user has chosen a nickname, set viewermode to off.
      // Note: when previousNickname is set, model.get('nick') has not the nick yet...
      // It will only come after receiving a presence stanza.
      // So we use previousNickname before trying to read the model.
      const nick = getPreviousAnonymousNick() ?? (model?.get ? model.get('nick') as string : '')
      refreshViewerMode(!!nick && !/^Anonymous /.test(nick))
    })
  }
}
