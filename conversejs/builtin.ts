import type { InitConverseJSParams } from 'shared/lib/types'
import { inIframe } from './lib/utils'
import { initDom } from './lib/dom'
import {
  defaultConverseParams,
  localRoomAnonymousParams,
  localRoomAuthenticatedParams,
  remoteRoomAnonymousParams,
  remoteRoomAuthenticatedParams
} from './lib/converse-params'
import { getLocalAuthentInfos } from './lib/auth'
import { randomNick, getPreviousAnonymousNick, setPreviousAnonymousNick } from './lib/nick'

declare global {
  interface Window {
    converse: {
      initialize: (args: any) => void
      plugins: {
        add: (name: string, plugin: any) => void
      }
    }
    initConverse: (args: InitConverseJSParams) => Promise<void>
  }
}

window.initConverse = async function initConverse (initConverseParams: InitConverseJSParams): Promise<void> {
  // First, fixing relative websocket urls.
  if (initConverseParams.localWebsocketServiceUrl?.startsWith('/')) {
    initConverseParams.localWebsocketServiceUrl = new URL(
      initConverseParams.localWebsocketServiceUrl,
      (window.location.protocol === 'http:' ? 'ws://' : 'wss://') + window.location.host
    ).toString()
  }

  const {
    isRemoteChat,
    remoteAnonymousXMPPServer,
    remoteAuthenticatedXMPPServer,
    authenticationUrl,
    autoViewerMode,
    forceReadonly
  } = initConverseParams

  const converse = window.converse

  const isInIframe = inIframe()
  initDom(initConverseParams, isInIframe)
  const params = defaultConverseParams(initConverseParams, isInIframe)

  let isAuthenticated: boolean = false
  let isRemoteWithNicknameSet: boolean = false

  const auth = await getLocalAuthentInfos(authenticationUrl)
  if (auth) {
    if (!isRemoteChat) {
      localRoomAuthenticatedParams(initConverseParams, auth, params)
      isAuthenticated = true
    } else if (remoteAuthenticatedXMPPServer) {
      remoteRoomAuthenticatedParams(initConverseParams, auth, params)
      isAuthenticated = true
    } else if (remoteAnonymousXMPPServer) {
      // remote server does not allow remote authenticated users, falling back to anonymous mode
      remoteRoomAnonymousParams(initConverseParams, auth, params)
      isRemoteWithNicknameSet = true
    } else {
      throw new Error('Remote server does not allow remote connection')
    }
  } else {
    if (!isRemoteChat) {
      localRoomAnonymousParams(initConverseParams, params)
    } else if (remoteAnonymousXMPPServer) {
      remoteRoomAnonymousParams(initConverseParams, null, params)
    } else {
      throw new Error('Remote server does not allow remote connection')
    }
  }

  if (!isAuthenticated) {
    console.log('User is not authenticated.')
    if (forceReadonly) {
      params.nickname = randomNick('Viewer')
    }
    // TODO: try to make these params work
    // params.muc_nickname_from_jid = true => compute the muc nickname from the jid (will be random here)
    // params.auto_register_muc_nickname = true => maybe not relevant here (dont do what i thought)
    // params.muc_show_logs_before_join = true => displays muc history on top of nickname form. But it's not updated.
  }

  try {
    converse.plugins.add('livechatWindowTitlePlugin', {
      dependencies: ['converse-muc-views'],
      overrides: {
        ChatRoomView: {
          requestUpdate: function (this: any): any {
            console.log('[livechatWindowTitlePlugin] updating the document title.')
            try {
              if (this.model?.getDisplayName) {
                const title = this.model.getDisplayName()
                if (document.title !== title) {
                  document.title = title
                }
              }
            } catch (err) {
              console.error('[livechatWindowTitlePlugin] Failed updating the window title', err)
            }
            return this.__super__.requestUpdate.apply(this)
          }
        }
      }
    })

    // livechatSpecifics plugins add some customization for the livechat plugin.
    converse.plugins.add('livechatSpecifics', {
      dependencies: ['converse-muc'],
      overrides: {
        ChatRoom: {
          getActionInfoMessage: function (this: any, code: string, nick: string, actor: any): any {
            if (code === '303') {
              // When there is numerous anonymous users joining at the same time,
              // they can all change their nicknames at the same time, generating a log of action messages.
              // To mitigate this, will don't display nickname changes if the previous nick is something like
              // 'Anonymous 12345'.
              // To avoid displaying the message, we just have to return an empty one
              // (createInfoMessage will ignore if !data.message).
              if (/^Anonymous \d+$/.test(nick)) {
                return null
              }
            }
            return this.__super__.getActionInfoMessage(code, nick, actor)
          }
        }
      }
    })

    if (autoViewerMode && !isAuthenticated && !isRemoteWithNicknameSet) {
      const previousNickname = getPreviousAnonymousNick()
      converse.plugins.add('livechatViewerModePlugin', {
        dependencies: ['converse-muc', 'converse-muc-views'],
        initialize: function () {
          const _converse = this._converse
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
      })
    }

    // The following code does not work. Just keeping it in case we want to investigate.
    // if (authenticationUrl !== '') {
    //   // We are in builtin-prosody mode. I'll try to disconnect from the room
    //   // on page unload. This is to avoid some bugs:
    //   // - users are not show as disconnected until a long timeout
    //   // - anonymous users' nicknames are not available before this timeout
    //   // - logged in users sometimes can't switch between iframe and fullscreen more than 1 time
    //   converse.plugins.add('livechatDisconnectOnUnloadPlugin', {
    //     initialize: function () {
    //       const _converse = this._converse
    //       const { unloadevent } = _converse
    //       // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //       window.addEventListener(unloadevent, async () => {
    //         console.log('[livechatDisconnectOnUnloadPlugin] Disconnecting...')
    //         await _converse.api.user.logout()
    //       }, { once: true, passive: true })
    //     }
    //   })
    // }

    converse.initialize(params)
  } catch (error) {
    console.error('Failed initializing converseJS', error)
  }
}
