import type { InitConverseParams } from './types'
import type { AuthentInfos } from './auth'

/**
 * Instanciate defaults params to use for ConverseJS.
 * Note: these parameters must be completed with one of the other function present in this module.
 * @param param0 global parameters
 * @param isInIframe true if we are in iframe mode (inside Peertube, beside video)
 * @returns default parameters to provide to ConverseJS.
 */
function defaultConverseParams (
  { forceReadonly, theme, assetsPath, room }: InitConverseParams,
  isInIframe: boolean
): any {
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

  // The user will never se the «trusted browser» checkbox (that allows to save credentials).
  // So we have to disable it
  // (and ensure clear_cache_on_logout is true,
  // see https://conversejs.org/docs/html/configuration.html#allow-user-trust-override).
  params.clear_cache_on_logout = true
  params.allow_user_trust_override = false

  return params
}

/**
 * The room is local, and we are an authenticated local user
 * @param initConverseParams global parameters
 * @param auth authent infos.
 * @param params ConverseJS parameters to fill
 */
function localRoomAuthenticatedParams (initConverseParams: InitConverseParams, auth: AuthentInfos, params: any): void {
  _fillAuthenticatedParams(initConverseParams, auth, params)
  _fillLocalProtocols(initConverseParams, params)
}

/**
 * The room is local, and we are an anonymous local user
 * @param initConverseParams global parameters
 * @param params ConverseJS parameters to fill
 */
function localRoomAnonymousParams (initConverseParams: InitConverseParams, params: any): void {
  params.jid = initConverseParams.localAnonymousJID
  _fillLocalProtocols(initConverseParams, params)
}

/**
 * The room is remote, and we are an authenticated local user
 * @param initConverseParams global parameters
 * @param auth authent infos.
 * @param params ConverseJS parameters to fill
 */
function remoteRoomAuthenticatedParams (initConverseParams: InitConverseParams, auth: AuthentInfos, params: any): void {
  _fillAuthenticatedParams(initConverseParams, auth, params)
  _fillLocalProtocols(initConverseParams, params)
}

/**
 * The room is remote, and we are an anonymous local user
 * @param initConverseParams global parameters
 * @param auth optionnal authent infos. Used to get the default nickname
 * @param params ConverseJS parameters to fill
 */
function remoteRoomAnonymousParams (
  initConverseParams: InitConverseParams,
  auth: AuthentInfos | null,
  params: any
): void {
  params.jid = initConverseParams.remoteAnonymousJID
  if (auth?.nickname) {
    params.nickname = auth.nickname
  }
  _fillRemoteProtocols(initConverseParams, params)
}

function _fillAuthenticatedParams (initConverseParams: InitConverseParams, auth: AuthentInfos, params: any): void {
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
  // FIXME: use params.oauth_providers?
}

function _fillLocalProtocols (initConverseParams: InitConverseParams, params: any): void {
  params.bosh_service_url = initConverseParams.localBoshServiceUrl
  params.websocket_url = initConverseParams.localWebsocketServiceUrl
}

function _fillRemoteProtocols (initConverseParams: InitConverseParams, params: any): void {
  params.bosh_service_url = initConverseParams.remoteBoshServiceUrl
  params.websocket_url = initConverseParams.remoteWebsocketServiceUrl
}

export {
  defaultConverseParams,
  localRoomAuthenticatedParams,
  localRoomAnonymousParams,
  remoteRoomAnonymousParams,
  remoteRoomAuthenticatedParams
}
