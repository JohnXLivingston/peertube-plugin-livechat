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
  advancedControls: 'true' | 'false'
}
window.initConverse = async function initConverse ({
  jid,
  assetsPath,
  room,
  boshServiceUrl,
  websocketServiceUrl,
  authenticationUrl,
  advancedControls
}: InitConverseParams) {
  const isInIframe = inIframe()

  if (isInIframe) {
    const body = document.querySelector('body')
    if (body) {
      body.classList.add('livechat-iframe')
    }
  }

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
    auto_focus: isInIframe,
    hide_muc_participants: isInIframe,
    keepalive: true,
    play_sounds: false,
    muc_mention_autocomplete_min_chars: 3,
    muc_mention_autocomplete_filter: 'contains',
    muc_instant_rooms: true,
    show_client_info: false,
    allow_adhoc_commands: false,
    allow_contact_requests: false,
    allow_logout: false,
    show_controlbox_by_default: false,
    view_mode: 'fullscreen',
    allow_message_corrections: 'all',
    allow_message_retraction: 'all'
  }

  if (authenticationUrl !== '') {
    const auth = await authenticatedMode(authenticationUrl)
    if (auth) {
      params.authentication = 'login'
      params.auto_login = true
      params.auto_reconnect = true
      params.jid = auth.jid
      params.password = auth.password
      if (auth.nickname) {
        params.nickname = auth.nickname
      } else {
        params.muc_nickname_from_jid = true
      }
      // FIXME: use params.oauth_providers?
    }
  }

  if (!advancedControls) {
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

  window.converse.initialize(params)
}
