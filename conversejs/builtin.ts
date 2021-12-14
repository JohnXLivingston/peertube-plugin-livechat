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

interface InitConverseParams {
  jid: string
  assetsPath: string
  room: string
  boshServiceUrl: string
  websocketServiceUrl: string
  authenticationUrl: string
  advancedControls: boolean
  forceReadonly: boolean
  theme: string
}
window.initConverse = async function initConverse ({
  jid,
  assetsPath,
  room,
  boshServiceUrl,
  websocketServiceUrl,
  authenticationUrl,
  advancedControls,
  forceReadonly,
  theme
}: InitConverseParams) {
  const isInIframe = inIframe()

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
  }

  const params: any = {
    assets_path: assetsPath,

    authentication: 'anonymous',
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
      spoiler: true,
      emoji: true,
      toggle_occupants: true
    },
    theme: theme || 'peertube',
    persistent_store: 'sessionStorage',
    show_images_inline: false, // for security reason, and to avoid bugs when image is larger that iframe
    whitelisted_plugins: ['livechatWindowTitlePlugin']
  }

  // TODO: params.clear_messages_on_reconnection = true when muc_mam will be available.

  let isAuthenticated: boolean = false
  if (authenticationUrl !== '') {
    const auth = await authenticatedMode(authenticationUrl)
    if (auth) {
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
      params.nickname = 'Viewer ' + (new Date()).getTime().toString()
    }
    // TODO: try to make these params work
    // params.muc_nickname_from_jid = true => compute the muc nickname from the jid (will be random here)
    // params.auto_register_muc_nickname = true => maybe not relevant here (dont do what i thought)
    // params.muc_show_logs_before_join = true => displays muc history on top of nickname form. But it's not updated.
  }

  if (advancedControls) {
    // with the builtin prosody, no need to use this warning (except if we open to external clients?)
    params.show_retraction_warning = false
  } else {
    // These params are for externals XMPP servers.
    // NB: because we dont know if external servers have authentication mecanism,
    // we disable all moderation functionnality.
    // This is also done for backward compatibility with older installations.
    params.muc_disable_slash_commands = [
      'admin', 'ban', 'clear', 'deop', 'destroy', 'kick',
      'member', 'modtools', 'mute', 'op', 'owner', 'register',
      'revoke', 'subject', 'topic', 'voice'
    ]
    params.modtools_disable_assign = true
  }

  try {
    window.converse.plugins.add('livechatWindowTitlePlugin', {
      dependencies: ['converse-muc-views'],
      overrides: {
        ChatRoomView: {
          renderHeading: function (this: any): any {
            console.log('[livechatWindowTitlePlugin] updating the document title.')
            try {
              const title = this.model.getDisplayName()
              if (document.title !== title) {
                document.title = title
              }
            } catch (err) {
              console.error('Failed updating the window title', err)
            }
            return this.__super__.renderHeading.apply(this, arguments)
          }
        }
      }
    })
    window.converse.initialize(params)
  } catch (error) {
    console.error('Failed initializing converseJS', error)
  }
}
