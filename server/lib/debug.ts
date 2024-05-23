// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import * as path from 'path'
import * as fs from 'fs'

interface ProsodyDebuggerOptions {
  mobdebugPath: string
  mobdebugHost: string
  mobdebugPort: string
}

interface DebugContent {
  renewCertCheckInterval?: number
  renewSelfSignedCertInterval?: number
  useOpenSSL?: boolean
  logRotateCheckInterval?: number
  logRotateEvery?: number
  remoteServerInfosMaxAge?: number
  prosodyDebuggerOptions?: ProsodyDebuggerOptions
  alwaysPublishXMPPRoom?: boolean
  enablePodcastChatTagForNonLive?: boolean
  mucAdmins?: string[]
  externalAccountPruneInterval?: number
}

type DebugNumericValue = 'renewCertCheckInterval'
| 'renewSelfSignedCertInterval'
| 'logRotateEvery'
| 'logRotateCheckInterval'
| 'remoteServerInfosMaxAge'
| 'externalAccountPruneInterval'

type DebugBooleanValue = 'alwaysPublishXMPPRoom' | 'enablePodcastChatTagForNonLive' | 'useOpenSSL'

let debugContent: DebugContent | null | false = null
function _readDebugFile (options: RegisterServerOptions): DebugContent | false {
  if (debugContent !== null) { return debugContent }

  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger
  if (!peertubeHelpers.plugin) {
    return false
  }

  const filepath = path.resolve(peertubeHelpers.plugin.getDataDirectoryPath(), 'debug_mode')
  logger.debug('Testing debug mode by testing if file exists: ' + filepath)
  if (!fs.existsSync(filepath)) {
    debugContent = false
    return false
  }

  logger.info('Plugin livechat Debug mode is on.')
  debugContent = {}

  try {
    // content is optional, the file can be empty!
    const content = fs.readFileSync(filepath).toString()
    let json: any = !content ? {} : JSON.parse(content)
    if (!json || (typeof json !== 'object')) { json = {} }

    debugContent.prosodyDebuggerOptions = _getProsodyDebuggerOptions(options, json)
    debugContent.logRotateCheckInterval = _getNumericOptions(options, json, 'log_rotate_check_interval')
    debugContent.logRotateEvery = _getNumericOptions(options, json, 'log_rotate_every')
    debugContent.renewCertCheckInterval = _getNumericOptions(options, json, 'renew_cert_check_interval')
    debugContent.renewSelfSignedCertInterval = _getNumericOptions(options, json, 'renew_self_signed_cert_interval')
    debugContent.useOpenSSL = json.use_openssl === true
    debugContent.remoteServerInfosMaxAge = _getNumericOptions(options, json, 'remote_server_infos_max_age')
    debugContent.alwaysPublishXMPPRoom = json.always_publish_xmpp_room === true
    debugContent.enablePodcastChatTagForNonLive = json.enable_podcast_chat_tag_for_nonlive === true
    debugContent.mucAdmins = _getJIDs(options, json, 'muc_admins')
    debugContent.externalAccountPruneInterval = _getNumericOptions(options, json, 'external_account_prune_interval')
  } catch (err) {
    logger.error('Failed to read the debug_mode file content:', err)
  }

  return debugContent
}

function _getProsodyDebuggerOptions (options: RegisterServerOptions, json: any): ProsodyDebuggerOptions | undefined {
  if (!json) { return undefined }
  if (typeof json !== 'object') { return undefined }
  if (!json.debug_prosody) { return undefined }
  if (typeof json.debug_prosody !== 'object') { return undefined }
  if (!json.debug_prosody.debugger_path) { return undefined }
  if (typeof json.debug_prosody.debugger_path !== 'string') { return undefined }

  const mobdebugPath = json.debug_prosody.debugger_path

  if (!fs.statSync(mobdebugPath).isDirectory()) {
    options.peertubeHelpers.logger.error('There should be a debugger, but cant find it. Path should be: ', mobdebugPath)
    return undefined
  }

  const mobdebugHost = json.debug_prosody.host?.toString() || 'localhost'
  const mobdebugPort = json.debug_prosody.port?.toString() || '8172'
  return {
    mobdebugPath,
    mobdebugHost,
    mobdebugPort
  }
}

function _getNumericOptions (options: RegisterServerOptions, json: any, name: string): number | undefined {
  if (!(name in json)) { return undefined }
  const v = json[name]
  if (typeof v !== 'number') { return undefined }
  return json[name]
}

function _getJIDs (options: RegisterServerOptions, json: any, name: string): string[] | undefined {
  if (!(name in json)) { return undefined }
  const v = json[name]
  if (!Array.isArray(v)) { return undefined }
  return v.filter(jid => {
    if (typeof jid !== 'string') { return false }
    if (!/^[a-zA-Z0-9_.-]+(?:@[a-zA-Z0-9_.-]+)?$/.test(jid)) { return false }
    return true
  })
}

function unloadDebugMode (): void {
  debugContent = null
}

/**
 * Check if debug mode is enabled
 * @param options server options
 * @param feature optional feature name.
 *                Returns true only if the debug_mode file contains a key with that name, and that is true.
 * @returns true if debug mode enabled
 */
function isDebugMode (options: RegisterServerOptions, feature?: DebugBooleanValue): boolean {
  const debugContent = _readDebugFile(options)
  if (!debugContent) {
    return false
  }
  if (!feature) {
    return true
  }
  return debugContent[feature] === true
}

/**
 * On dev environnement, it is possible to enable a Lua debugger.
 * @param options server options
 * @returns false if we dont use the Prosody debugger. Else the need information to launch the debugger.
 */
function prosodyDebuggerOptions (options: RegisterServerOptions): false | ProsodyDebuggerOptions {
  // Additional security: testing NODE_ENV.
  // It should absolutly not be possible to enable Prosody debugger on production env.
  if (process.env.NODE_ENV !== 'dev') { return false }
  const debugContent = _readDebugFile(options)
  if (debugContent === false) { return false }
  if (!debugContent.prosodyDebuggerOptions) { return false }
  return debugContent.prosodyDebuggerOptions
}

/**
 * In some dev environment, Prosody will fail DNS queries when using Lua-unbound.
 * I did not managed to properly configure lua-unbound.
 * So, here is a dirty hack to disable lua-unbound: just put a `no_lua_unbound`
 * file in the plugin data dir. This will delete the lua file from the AppImage extraction.
 * You must restart Peertube after adding or deleting this file.
 * @param options server options
 * @param squashfsPath the folder where the AppImage is extracted
 */
function disableLuaUnboundIfNeeded (options: RegisterServerOptions, squashfsPath: string): void {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger

  if (!peertubeHelpers.plugin) {
    return
  }
  const filepath = path.resolve(peertubeHelpers.plugin.getDataDirectoryPath(), 'no_lua_unbound')
  logger.debug('Testing if file exists: ' + filepath)
  if (!fs.existsSync(filepath)) {
    return
  }
  logger.info('Must disable lua-unbound.')
  try {
    for (const luaVersion of ['5.1', '5.2', '5.3', '5.4']) {
      const fp = path.resolve(squashfsPath, 'squashfs-root/usr/lib/x86_64-linux-gnu/lua/', luaVersion, 'lunbound.so')
      if (fs.existsSync(fp)) {
        fs.rmSync(fp)
      }
    }
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Get a numerical parameter value. There are 3 kind of values:
 * - classic production value
 * - value when debug mode is activated
 * - value when debut mode is activated, and the debug_mode file overrides it
 * @param options server options
 * @param name name of the wanted value
 * @param defaultDebug default value when debug is activated
 * @param defaultValue default value when debug is disabled
 *
 */
function debugNumericParameter (
  options: RegisterServerOptions,
  name: DebugNumericValue,
  defaultDebug: number,
  defaultValue: number
): number {
  const debugContent = _readDebugFile(options)
  if (!debugContent) { return defaultValue }
  if (name in debugContent) {
    const v: any = debugContent[name]
    if (typeof v === 'number') { return v }
  }
  return defaultDebug
}

function debugMucAdmins (options: RegisterServerOptions): string[] | undefined {
  const debugContent = _readDebugFile(options)
  if (!debugContent) { return undefined }
  return debugContent.mucAdmins
}

export {
  unloadDebugMode,
  isDebugMode,
  prosodyDebuggerOptions,
  disableLuaUnboundIfNeeded,
  debugNumericParameter,
  debugMucAdmins
}
