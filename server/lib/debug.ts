import type { RegisterServerOptions } from '@peertube/peertube-types'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Check if debug mode is enabled
 * @param options server options
 * @returns true if debug mode enabled
 */
export function isDebugMode (options: RegisterServerOptions): boolean {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger

  if (!peertubeHelpers.plugin) {
    return false
  }
  const filepath = path.resolve(peertubeHelpers.plugin.getDataDirectoryPath(), 'debug_mode')
  logger.debug('Testing debug mode by testing if file exists: ' + filepath)
  if (fs.existsSync(filepath)) {
    logger.info('Plugin livechat Debug mode is on.')
    return true
  }
  return false
}

interface ProsodyDebuggerOptions {
  mobdebugPath: string
  mobdebugHost: string
  mobdebugPort: string
}

/**
 * On dev environnement, it is possible to enable a Lua debugger.
 * @param options server options
 * @returns false if we dont use the Prosody debugger. Else the need information to launch the debugger.
 */
export function prosodyDebuggerOptions (options: RegisterServerOptions): false | ProsodyDebuggerOptions {
  if (process.env.NODE_ENV !== 'dev') { return false }
  if (!isDebugMode(options)) { return false }

  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger

  try {
    const filepath = path.resolve(peertubeHelpers.plugin.getDataDirectoryPath(), 'debug_mode')
    const content = fs.readFileSync(filepath).toString()
    if (!content) { return false }
    const json = JSON.parse(content)
    if (!json) { return false }
    if (typeof json !== 'object') { return false }
    if (!json.debug_prosody) { return false }
    if (typeof json.debug_prosody !== 'object') { return false }
    if (!json.debug_prosody.debugger_path) { return false }
    if (typeof json.debug_prosody.debugger_path !== 'string') { return false }
    const mobdebugPath = json.debug_prosody.debugger_path
    if (!fs.statSync(mobdebugPath).isDirectory()) {
      logger.error('The should be a debugger, but cant find it. Path should be: ', mobdebugPath)
      return false
    }
    const mobdebugHost = json.debug_prosody.host?.toString() || 'localhost'
    const mobdebugPort = json.debug_prosody.port?.toString() || '8172'
    return {
      mobdebugPath,
      mobdebugHost,
      mobdebugPort
    }
  } catch (err) {
    logger.error('Failed to read the debug_mode file content:', err)
    return false
  }
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
export function disableLuaUnboundIfNeeded (options: RegisterServerOptions, squashfsPath: string): void {
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
