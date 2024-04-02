import type { InitConverseJSParams, ChatIncludeMode } from 'shared/lib/types'
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
import { randomNick } from './lib/nick'
import { slowModePlugin } from './lib/plugins/slow-mode'
import { windowTitlePlugin } from './lib/plugins/window-title'
import { livechatSpecificsPlugin } from './lib/plugins/livechat-specific'
import { livechatViewerModePlugin } from './lib/plugins/livechat-viewer-mode'

declare global {
  interface Window {
    converse: {
      initialize: (args: any) => void
      plugins: {
        add: (name: string, plugin: any) => void
      }
      livechatDisconnect?: Function
    }
    initConversePlugins: typeof initConversePlugins
    initConverse: typeof initConverse
    reconnectConverse?: (room: string) => void
  }
}

/**
 * Initilialize ConverseJS plugins.
 * @param peertubeEmbedded true if we are embedded in Peertube, false if it is the old full page mode.
 */
function initConversePlugins (peertubeEmbedded: boolean): void {
  const converse = window.converse

  if (!peertubeEmbedded) {
    // When in full page mode, this plugin ensure the window title is equal to the room title.
    converse.plugins.add('livechatWindowTitlePlugin', windowTitlePlugin)
  }

  // Slow mode
  converse.plugins.add('converse-slow-mode', slowModePlugin)

  // livechatSpecifics plugins add some customization for the livechat plugin.
  converse.plugins.add('livechatSpecifics', livechatSpecificsPlugin)

  // Viewer mode (anonymous accounts, before they have chosen their nickname).
  // This plugin will be blacklisted in initConverse if not necessary.
  converse.plugins.add('livechatViewerModePlugin', livechatViewerModePlugin)
}
window.initConversePlugins = initConversePlugins

/**
 * Init ConverseJS
 * @param initConverseParams ConverseJS init Params
 * @param chatIncludeMode How the chat is included in the html page
 * @param peertubeAuthHeader when embedded in Peertube, we can get the header from peertubeHelpers
 */
async function initConverse (
  initConverseParams: InitConverseJSParams,
  chatIncludeMode: ChatIncludeMode = 'chat-only',
  peertubeAuthHeader?: { [header: string]: string } | null
): Promise<void> {
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
  if (!isInIframe) { initConverseParams.autofocus = true }
  if (isInIframe || chatIncludeMode === 'peertube-video') {
    initConverseParams.forceDefaultHideMucParticipants = true
  }
  const params = defaultConverseParams(initConverseParams)
  params.view_mode = chatIncludeMode === 'chat-only' ? 'fullscreen' : 'embedded'
  params.allow_url_history_change = chatIncludeMode === 'chat-only'

  let isAuthenticated: boolean = false
  let isRemoteWithNicknameSet: boolean = false

  const auth = await getLocalAuthentInfos(authenticationUrl, peertubeAuthHeader)
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
    if (!(autoViewerMode && !isAuthenticated && !isRemoteWithNicknameSet)) {
      params.blacklisted_plugins ??= []
      params.blacklisted_plugins.push('livechatViewerModePlugin')
    }

    if (window.reconnectConverse) { // this is set in the livechatSpecificsPlugin
      window.reconnectConverse(params)
    } else {
      converse.initialize(params)
    }
  } catch (error) {
    console.error('Failed initializing converseJS', error)
  }
}
window.initConverse = initConverse
