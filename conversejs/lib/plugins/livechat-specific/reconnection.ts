// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { getOpenPromise } from './utils'

/**
 * Initialiaze some function on `window` that will be used for the reconnection process.
 *
 * @param plugin The plugin object
 */
export function initReconnectionStuff (plugin: any): void {
  const _converse = plugin._converse

  // Adding a method on window.converse, so we can close the chat on navigation-end event
  // (when chatIncludeMode is peertube-*)
  window.converse.livechatDisconnect = function livechatDisconnect () {
    if (_converse.api.connection.connected()) {
      console.log('[livechatSpecificsPlugin] disconnecting converseJS...')
      _converse.api.user.logout()
    }
  }

  // To reconnect ConverseJS when joining another room (or the same one),
  // we store the relevant closure function:
  window.reconnectConverse = function reconnectConverse (params: any): void {
    console.log('[livechatSpecificsPlugin] reconnecting converseJS...')

    // The new room to join:
    _converse.api.settings.set('auto_join_rooms', params.auto_join_rooms)
    _converse.api.settings.set('notify_all_room_messages', params.notify_all_room_messages)

    // update connection parameters (in case the user logged in after the first chat)
    for (const k of [
      'bosh_service_url', 'websocket_url',
      'authentication', 'nickname', 'muc_nickname_from_jid', 'auto_login', 'jid', 'password', 'keepalive'
    ]) {
      _converse.api.settings.set(k, params[k])
    }

    // update other settings
    for (const k of [
      'hide_muc_participants',
      'livechat_enable_viewer_mode',
      'livechat_external_auth_oidc_buttons',
      'livechat_external_auth_reconnect_mode',
      'livechat_mini_muc_head',
      'livechat_specific_external_authent',
      'livechat_task_app_enabled',
      'livechat_task_app_restore',
      'livechat_custom_emojis_url',
      'emoji_categories'
    ]) {
      _converse.api.settings.set(k, params[k])
    }

    // We also unload emojis, in case there are custom emojis.
    window.converse.emojis = {
      initialized: false,
      initialized_promise: getOpenPromise()
    }

    // Then login.
    _converse.api.user.login()
  }
}
