// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { InitConverseJSParams } from 'shared/lib/types'
import type { ProsodyAuthentInfos } from './auth'

/**
 * Instanciate defaults params to use for ConverseJS.
 * Note: these parameters must be completed with one of the other function present in this module.
 * @param param0 global parameters
 * @returns default parameters to provide to ConverseJS.
 */
function defaultConverseParams (
  {
    forceReadonly, theme, assetsPath, room, forceDefaultHideMucParticipants, autofocus,
    peertubeVideoOriginalUrl, peertubeVideoUUID,
    customEmojisUrl
  }: InitConverseJSParams
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
        '210', // nickname_changes. 210=Inform user that the service has assigned or modified the occupant's roomnick
        '303', // nickname_changes. 303=Inform all occupants of new room nickname
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
    auto_focus: autofocus === true,
    hide_muc_participants: forceDefaultHideMucParticipants === true,
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
      emoji: true
    },
    theme: theme || 'peertube',
    dark_theme: theme || 'peertube', // dark theme should be the same as theme
    persistent_store: 'sessionStorage',
    show_images_inline: false, // for security reason, and to avoid bugs when image is larger that iframe
    render_media: false, // for security reason, and to avoid bugs when image is larger that iframe
    whitelisted_plugins: [
      'livechatWindowTitlePlugin',
      'livechatSpecifics',
      'livechatMiniMucHeadPlugin',
      'livechatViewerModePlugin',
      'livechatDisconnectOnUnloadPlugin',
      'converse-slow-mode',
      'livechatEmojis',
      'converse-moderation-delay',
      'livechatAnnouncementsPlugin'
    ],
    show_retraction_warning: false, // No need to use this warning (except if we open to external clients?)
    muc_show_info_messages: mucShowInfoMessages,
    send_chat_state_notifications: false, // don't send this for performance reason

    prune_messages_above: 100, // only keep 100 message in history.
    pruning_behavior: 'unscrolled',
    colorize_username: true,
    send_chat_markers: [],
    reuse_scram_keys: false, // for now we don't use this.

    // This is a specific settings, that is used in ConverseJS customization, to force avatars loading in readonly mode.
    livechat_load_all_vcards: !!forceReadonly,

    livechat_peertube_video_original_url: peertubeVideoOriginalUrl,
    livechat_peertube_video_uuid: peertubeVideoUUID,

    livechat_custom_emojis_url: customEmojisUrl
  }

  // TODO: params.clear_messages_on_reconnection = true when muc_mam will be available.

  // The user will never se the «trusted browser» checkbox (that allows to save credentials).
  // So we have to disable it
  // (and ensure clear_cache_on_logout is true,
  // see https://conversejs.org/docs/html/configuration.html#allow-user-trust-override).
  params.clear_cache_on_logout = true
  params.allow_user_trust_override = false

  // We change emoji_categories to put custom first.
  // We set custom to null, it will be set to another value if custom emojis are enabled.
  params.emoji_categories = {
    custom: null,
    smileys: ':grinning:',
    people: ':thumbsup:',
    activity: ':soccer:',
    travel: ':motorcycle:',
    objects: ':bomb:',
    nature: ':rainbow:',
    food: ':hotdog:',
    symbols: ':musical_note:',
    flags: ':flag_ac:'
  }

  return params
}

/**
 * The room is local, and we are an authenticated local user
 * @param initConverseParams global parameters
 * @param auth authent infos.
 * @param params ConverseJS parameters to fill
 */
function localRoomAuthenticatedParams (
  initConverseParams: InitConverseJSParams,
  auth: ProsodyAuthentInfos, params: any
): void {
  _fillAuthenticatedParams(initConverseParams, auth, params)
  _fillLocalProtocols(initConverseParams, params)
}

/**
 * The room is local, and we are an anonymous local user
 * @param initConverseParams global parameters
 * @param params ConverseJS parameters to fill
 */
function localRoomAnonymousParams (initConverseParams: InitConverseJSParams, params: any): void {
  params.jid = initConverseParams.localAnonymousJID
  _fillLocalProtocols(initConverseParams, params)
}

/**
 * The room is remote, and we are an authenticated local user
 * @param initConverseParams global parameters
 * @param auth authent infos.
 * @param params ConverseJS parameters to fill
 */
function remoteRoomAuthenticatedParams (
  initConverseParams: InitConverseJSParams,
  auth: ProsodyAuthentInfos, params: any
): void {
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
  initConverseParams: InitConverseJSParams,
  auth: ProsodyAuthentInfos | null,
  params: any
): void {
  params.jid = initConverseParams.remoteAnonymousJID
  if (auth?.nickname) {
    params.nickname = auth.nickname
  }
  _fillRemoteProtocols(initConverseParams, params)
}

function _fillAuthenticatedParams (
  initConverseParams: InitConverseJSParams,
  auth: ProsodyAuthentInfos,
  params: any
): void {
  params.authentication = 'login'
  params.auto_login = true
  params.jid = auth.jid
  params.password = auth.password
  if (auth.nickname) {
    params.nickname = auth.nickname
  }
  params.muc_nickname_from_jid = true // if nickname already used, ConverseJS will add a suffix.
  // We dont need the keepalive. And I suppose it is related to some bugs when opening a previous chat window.
  params.keepalive = false
  // FIXME: use params.oauth_providers?
}

function _fillLocalProtocols (initConverseParams: InitConverseJSParams, params: any): void {
  params.bosh_service_url = initConverseParams.localBoshServiceUrl
  params.websocket_url = initConverseParams.localWebsocketServiceUrl
}

function _fillRemoteProtocols (initConverseParams: InitConverseJSParams, params: any): void {
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
