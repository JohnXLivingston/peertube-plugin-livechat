// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  converse: {
    initialize: (args: any) => void
    plugins: {
      add: (name: string, plugin: any) => void
    }
  }
  initConverse: (args: any) => void
}

function inIframe (): boolean {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

interface AuthentInfos {
  jid: string
  password: string
  nickname?: string
}
async function authenticatedMode (authenticationUrl: string): Promise<false | AuthentInfos> {
  try {
    if (!window.fetch) {
      console.error('Your browser has not the fetch api, we cant log you in')
      return false
    }
    if (!window.localStorage) {
      // FIXME: is the Peertube token always in localStorage?
      console.error('Your browser has no localStorage, we cant log you in')
      return false
    }
    const tokenType = window.localStorage.getItem('token_type') ?? ''
    const accessToken = window.localStorage.getItem('access_token') ?? ''
    const refreshToken = window.localStorage.getItem('refresh_token') ?? ''
    if (tokenType === '' && accessToken === '' && refreshToken === '') {
      console.info('User seems not to be logged in.')
      return false
    }

    const response = await window.fetch(authenticationUrl, {
      method: 'GET',
      headers: new Headers({
        Authorization: tokenType + ' ' + accessToken,
        'content-type': 'application/json;charset=UTF-8'
      })
    })

    if (!response.ok) {
      console.error('Failed fetching user informations')
      return false
    }
    const data = await response.json()
    if ((typeof data) !== 'object') {
      console.error('Failed reading user informations')
      return false
    }

    if (!data.jid || !data.password) {
      console.error('User informations does not contain required fields')
      return false
    }
    return {
      jid: data.jid,
      password: data.password,
      nickname: data.nickname
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

function randomNick (base: string): string {
  // using a 6 digit random number to generate a nickname with low colision risk
  const n = 100000 + Math.floor(Math.random() * 900000)
  return base + ' ' + n.toString()
}

interface InitConverseParams {
  jid: string
  remoteAnonymousXMPPServer: boolean
  assetsPath: string
  room: string
  boshServiceUrl: string
  websocketServiceUrl: string
  authenticationUrl: string
  autoViewerMode: boolean
  forceReadonly: boolean | 'noscroll'
  noScroll: boolean
  theme: string
  transparent: boolean
}
window.initConverse = async function initConverse ({
  jid,
  remoteAnonymousXMPPServer,
  assetsPath,
  room,
  boshServiceUrl,
  websocketServiceUrl,
  authenticationUrl,
  autoViewerMode,
  forceReadonly,
  theme,
  transparent
}: InitConverseParams) {
  const isInIframe = inIframe()
  const converse = window.converse

  const body = document.querySelector('body')
  if (isInIframe) {
    if (body) {
      body.classList.add('livechat-iframe')
      // prevent horizontal scrollbar when in iframe. (don't know why, but does not work if done by CSS)
      body.style.overflowX = 'hidden'
    }
  }
  if (forceReadonly) {
    body?.classList.add('livechat-readonly')
    if (forceReadonly === 'noscroll') {
      body?.classList.add('livechat-noscroll')
    }
  }
  if (transparent) {
    body?.classList.add('livechat-transparent')
  }

  if (websocketServiceUrl?.startsWith('/')) {
    websocketServiceUrl = new URL(
      websocketServiceUrl,
      (window.location.protocol === 'http:' ? 'ws://' : 'wss://') + window.location.host
    ).toString()
  }

  const mucShowInfoMessages = forceReadonly
    ? [
        // in readonly mode, show only following info messages:
        '301', '307', '321', '322', '332', '333' // disconnected
      ]
    : [
        // FIXME: wait for a response here, and rewrite: https://github.com/conversejs/converse.js/issues/3125
        '100', '102', '103', '172', '173', '174', // visibility_changes
        '110', // self
        '104', '201', // non_privacy_changes
        '170', '171', // muc_logging_changes
        '210', '303', // nickname_changes
        '301', '307', '321', '322', '332', '333', // disconnected
        'owner', 'admin', 'member', 'exadmin', 'exowner', 'exoutcast', 'exmember', // affiliation_changes
        // 'entered', 'exited', // join_leave_events
        'op', 'deop', 'voice', 'mute' // role_changes
      ]

  const params: any = {
    assets_path: assetsPath,

    authentication: 'anonymous',
    ping_interval: 25, // must be set accordingly to c2s_close_timeout backend websocket settings and nginx timeout
    auto_login: true,
    auto_join_rooms: [
      room
    ],
    keepalive: true,
    discover_connection_methods: false, // this parameter seems buggy with converseJS 7.0.4
    bosh_service_url: boshServiceUrl === '' ? undefined : boshServiceUrl,
    websocket_url: websocketServiceUrl === '' ? undefined : websocketServiceUrl,
    jid: jid,
    notify_all_room_messages: [
      room
    ],
    show_desktop_notifications: false,
    show_tab_notifications: false,
    singleton: true,
    auto_focus: !isInIframe,
    hide_muc_participants: isInIframe,
    play_sounds: false,
    muc_mention_autocomplete_min_chars: 2,
    muc_mention_autocomplete_filter: 'contains',
    muc_instant_rooms: true,
    show_client_info: false,
    allow_adhoc_commands: false,
    allow_contact_requests: false,
    allow_logout: false,
    show_controlbox_by_default: false,
    view_mode: 'fullscreen',
    allow_message_corrections: 'all',
    allow_message_retraction: 'all',
    visible_toolbar_buttons: {
      call: false,
      spoiler: false,
      emoji: true,
      toggle_occupants: true
    },
    theme: theme || 'peertube',
    dark_theme: theme || 'peertube', // dark theme should be the same as theme
    persistent_store: 'sessionStorage',
    show_images_inline: false, // for security reason, and to avoid bugs when image is larger that iframe
    render_media: false, // for security reason, and to avoid bugs when image is larger that iframe
    whitelisted_plugins: ['livechatWindowTitlePlugin', 'livechatViewerModePlugin', 'livechatDisconnectOnUnloadPlugin'],
    show_retraction_warning: false, // No need to use this warning (except if we open to external clients?)
    muc_show_info_messages: mucShowInfoMessages,
    send_chat_state_notifications: false // don't send this for performance reason
  }

  // TODO: params.clear_messages_on_reconnection = true when muc_mam will be available.

  let isAuthenticated: boolean = false
  let isRemoteWithNicknameSet: boolean = false
  if (authenticationUrl === '') {
    throw new Error('Missing authenticationUrl')
  }

  // The user will never se the «trusted browser» checkbox (that allows to save credentials).
  // So we have to disable it
  // (and ensure clear_cache_on_logout is true,
  // see https://conversejs.org/docs/html/configuration.html#allow-user-trust-override).
  params.clear_cache_on_logout = true
  params.allow_user_trust_override = false

  const auth = await authenticatedMode(authenticationUrl)
  if (auth) {
    if (remoteAnonymousXMPPServer) {
      // Spécial case: anonymous connection to remote XMPP server.
      if (auth.nickname) {
        params.nickname = auth.nickname
        isRemoteWithNicknameSet = true
      }
    } else {
      params.authentication = 'login'
      params.auto_login = true
      params.jid = auth.jid
      params.password = auth.password
      if (auth.nickname) {
        params.nickname = auth.nickname
      } else {
        params.muc_nickname_from_jid = true
      }
      // We dont need the keepalive. And I suppose it is related to some bugs when opening a previous chat window.
      params.keepalive = false
      isAuthenticated = true
      // FIXME: use params.oauth_providers?
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

    if (autoViewerMode && !isAuthenticated && !isRemoteWithNicknameSet) {
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
                return getDefaultMUCNickname.apply(this, arguments) ?? randomNick('Anonymous')
              }
            })
          }
          _converse.api.settings.update({
            livechat_viewer_mode: true
          })

          function refreshViewerMode (canChat: boolean): void {
            console.log('[livechatViewerModePlugin] refreshViewerMode: ' + (canChat ? 'off' : 'on'))
            if (canChat) {
              body?.setAttribute('livechat-viewer-mode', 'off')
            } else {
              body?.setAttribute('livechat-viewer-mode', 'on')
            }
          }

          _converse.api.listen.on('livechatViewerModeSetNickname', () => refreshViewerMode(true))
          _converse.api.listen.on('chatRoomInitialized', function (this: any, model: any): void {
            const nick = model?.get ? model.get('nick') : ''
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
