// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  converse: {
    initialize: (args: any) => void
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

function authenticatedMode (): boolean {
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
  return true
}

interface InitConverseParams {
  jid: string
  assetsPath: string
  room: string
  boshServiceUrl: string
  websocketServiceUrl: string
  tryAuthenticatedMode: string
}
window.initConverse = function initConverse ({
  jid,
  assetsPath,
  room,
  boshServiceUrl,
  websocketServiceUrl,
  tryAuthenticatedMode
}: InitConverseParams) {
  const params: any = {
    assets_path: assetsPath,

    authentication: 'anonymous',
    auto_login: true,
    auto_join_rooms: [
      room
    ],
    discover_connection_methods: false, // this parameter seems buggy with converseJS 7.0.4
    bosh_service_url: boshServiceUrl === '' ? undefined : boshServiceUrl,
    websocket_url: websocketServiceUrl === '' ? undefined : websocketServiceUrl,
    jid: jid,
    notify_all_room_messages: [
      room
    ],
    singleton: true,
    auto_focus: false,
    hide_muc_participants: inIframe(),
    keepalive: true,
    play_sounds: false,
    muc_mention_autocomplete_min_chars: 3,
    muc_mention_autocomplete_filter: 'contains',
    modtools_disable_assign: true,
    muc_disable_slash_commands: [
      'admin', 'ban', 'clear', 'deop', 'destroy', 'kick',
      'member', 'modtools', 'mute', 'op', 'owner', 'register',
      'revoke', 'subject', 'topic', 'voice'
    ],
    muc_instant_rooms: true,
    show_client_info: false,
    allow_adhoc_commands: false,
    allow_contact_requests: false,
    allow_logout: false,
    show_controlbox_by_default: false,
    view_mode: 'fullscreen',
    allow_message_corrections: true,
    allow_message_retraction: 'all'
  }

  if (tryAuthenticatedMode === 'true' && authenticatedMode()) {
    params.authentication = 'login'
    params.auto_login = true
    params.auto_reconnect = true
    params.jid = 'john@localhost'
    params.password = 'password'
    // FIXME: use params.oauth_providers?
  }

  window.converse.initialize(params)
}
