// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Config as XMPPBotConfig } from 'xmppjs-chat-bot'
import type { ProsodyLogLevel } from './config/content'
import type { AvatarSet } from '../settings'
import * as fs from 'fs'
import * as path from 'path'
import { getBaseRouterRoute, RegisterServerOptionsV5 } from '../helpers'
import { ProsodyFilePaths } from './config/paths'
import { ConfigLogExpiration, ProsodyConfigContent } from './config/content'
import { getProsodyDomain } from './config/domain'
import { getAPIKey } from '../apikey'
import { parseExternalComponents } from './config/components'
import { getRemoteServerInfosDir } from '../federation/storage'
import { BotConfiguration } from '../configuration/bot'
import { debugMucAdmins } from '../debug'
import { ExternalAuthOIDC } from '../external-auth/oidc'
import { listModFirewallFiles } from '../firewall/config'
import { Emojis } from '../emojis'

async function getWorkingDir (options: RegisterServerOptions): Promise<string> {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger
  logger.debug('Calling getWorkingDir')

  if (!peertubeHelpers.plugin) {
    throw new Error('Missing peertubeHelpers.plugin, have you the correct Peertube version?')
  }
  const dir = path.resolve(peertubeHelpers.plugin.getDataDirectoryPath(), 'prosody')
  logger.debug('getWorkingDir will return the dir ' + dir)
  return dir
}

async function getProsodyFilePaths (options: RegisterServerOptions): Promise<ProsodyFilePaths> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling getProsodyFilePaths')

  const dir = await getWorkingDir(options)
  const settings = await options.settingsManager.getSettings([
    'use-system-prosody', 'prosody-room-allow-s2s', 'prosody-certificates-dir', 'avatar-set'
  ])
  let exec
  let execArgs: string[] = []
  let execCtl
  let execCtlArgs: string[] = []
  let appImageToExtract

  // this one is always needed (must create the directory on startup)
  const appImageExtractPath = path.resolve(dir, '..', 'prosodyAppImage')

  if (settings['use-system-prosody']) {
    exec = 'prosody'
    execCtl = 'prosodyctl'
  } else {
    // const arch = process.arch
    // if (arch === 'arm' || arch === 'arm64') {
    //   logger.info('Node process.arch is ' + arch + ', we will be using the aarch64 Prosody AppImage')
    //   appImageToExtract = path.resolve(__dirname, '../../prosody/livechat-prosody-aarch64.AppImage')
    // } else {
    //   appImageToExtract = path.resolve(__dirname, '../../prosody/livechat-prosody-x86_64.AppImage')
    // }
    if (process.arch === 'x64' || process.arch === 'x86_64') {
      logger.debug('Node process.arch is ' + process.arch + ', we will be using the x86_64 Prosody AppImage')
      appImageToExtract = path.resolve(__dirname, '../../prosody/livechat-prosody-x86_64.AppImage')
      exec = path.resolve(appImageExtractPath, 'squashfs-root/AppRun')
      execArgs = ['prosody']
      execCtl = exec
      execCtlArgs = ['prosodyctl']
    } else if (process.arch === 'arm64') {
      logger.debug('Node process.arch is ' + process.arch + ', we will be using the aarch64 Prosody AppImage')
      appImageToExtract = path.resolve(__dirname, '../../prosody/livechat-prosody-aarch64.AppImage')
      exec = path.resolve(appImageExtractPath, 'squashfs-root/AppRun')
      execArgs = ['prosody']
      execCtl = exec
      execCtlArgs = ['prosodyctl']
    } else {
      logger.info('Node process.arch is ' + process.arch + ', cant use the Prosody AppImage')
    }
  }

  let certsDir: string | undefined = path.resolve(dir, 'certs')
  let certsDirIsCustom = false
  if (settings['prosody-room-allow-s2s'] && (settings['prosody-certificates-dir'] as string ?? '') !== '') {
    if (!(await fs.promises.stat(settings['prosody-certificates-dir'] as string)).isDirectory()) {
      // We can throw an exception here...
      // Because if the user input a wrong directory, the plugin will not register,
      // and they will never be able to fix the conf.
      logger.error('Certificate directory does not exist or is not a directory')
      certsDir = undefined
    } else {
      certsDir = settings['prosody-certificates-dir'] as string
    }
    certsDirIsCustom = true
  } else {
    // In this case we are generating and using self signed certificates

    // Note: when using prosodyctl to generate self-signed certificates,
    // there are wrongly generated in the data dir.
    // So we will use this dir as the certs dir.
    certsDir = path.resolve(dir, 'data')
  }

  let avatarSet: AvatarSet = (settings['avatar-set'] ?? 'sepia') as AvatarSet
  let avatarsDir
  let avatarsFiles
  let botAvatarsDir
  let botAvatarsFiles
  if (avatarSet === 'none') {
    botAvatarsDir = path.resolve(__dirname, '../../bot_avatars/', 'sepia') // fallback to default avatars for the bot
    botAvatarsFiles = await _listAvatars(botAvatarsDir)
  } else {
    if (!['sepia', 'cat', 'bird', 'fenec', 'abstract', 'legacy'].includes(avatarSet)) {
      logger.error('Invalid avatar-set setting, using sepia as default')
      avatarSet = 'sepia'
    }
    avatarsDir = path.resolve(__dirname, '../../avatars/', avatarSet)
    avatarsFiles = await _listAvatars(avatarsDir)
    botAvatarsDir = path.resolve(__dirname, '../../bot_avatars/', avatarSet)
    botAvatarsFiles = await _listAvatars(botAvatarsDir)
  }

  return {
    dir,
    pid: path.resolve(dir, 'prosody.pid'),
    error: path.resolve(dir, 'prosody.err'),
    log: path.resolve(dir, 'prosody.log'),
    config: path.resolve(dir, 'prosody.cfg.lua'),
    data: path.resolve(dir, 'data'),
    certs: certsDir,
    certsDirIsCustom,
    modules: path.resolve(__dirname, '../../prosody-modules'),
    avatars: avatarsDir,
    avatarsFiles,
    botAvatars: botAvatarsDir,
    botAvatarsFiles,
    exec,
    execArgs,
    execCtl,
    execCtlArgs,
    appImageToExtract,
    appImageExtractPath,
    modFirewallFiles: path.resolve(dir, 'mod_firewall_config')
  }
}

type ProsodyConfigCertificates = false | 'generate-self-signed' | 'use-from-dir'

interface ProsodyConfig {
  content: string
  paths: ProsodyFilePaths
  host: string
  port: string
  baseApiUrl: string
  roomType: 'video' | 'channel'
  logByDefault: boolean
  logExpiration: ConfigLogExpiration
  valuesToHideInDiagnostic: Map<string, string>
  certificates: ProsodyConfigCertificates
  bots: {
    moderation?: XMPPBotConfig
  }
}
async function getProsodyConfig (options: RegisterServerOptionsV5): Promise<ProsodyConfig> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling getProsodyConfig')

  const settings = await options.settingsManager.getSettings([
    'prosody-port',
    'prosody-muc-log-by-default',
    'prosody-muc-expiration',
    'prosody-c2s',
    'prosody-c2s-port',
    'prosody-c2s-interfaces',
    'prosody-room-allow-s2s',
    'prosody-s2s-port',
    'prosody-s2s-interfaces',
    'prosody-certificates-dir',
    'prosody-room-type',
    'prosody-peertube-uri',
    'prosody-components',
    'prosody-components-port',
    'prosody-components-interfaces',
    'prosody-components-list',
    'chat-no-anonymous',
    'auto-ban-anonymous-ip',
    'federation-dont-publish-remotely',
    'disable-channel-configuration',
    'chat-terms',
    'prosody-firewall-enabled'
  ])

  const valuesToHideInDiagnostic = new Map<string, string>()
  const port = (settings['prosody-port'] as string) || '52800'
  if (!/^\d+$/.test(port)) {
    throw new Error('Invalid port')
  }
  const logByDefault = (settings['prosody-muc-log-by-default'] as boolean) ?? true
  const disableAnon = (settings['chat-no-anonymous'] as boolean) || false
  const autoBanIP = (settings['auto-ban-anonymous-ip'] as boolean) || false
  const logExpirationSetting = (settings['prosody-muc-expiration'] as string) ?? DEFAULTLOGEXPIRATION
  const enableC2S = (settings['prosody-c2s'] as boolean) || false
  // enableRoomS2S: room can be joined from remote XMPP servers (Peertube or not)
  const enableRoomS2S = (settings['prosody-room-allow-s2s'] as boolean) || false
  const enableComponents = (settings['prosody-components'] as boolean) || false
  const prosodyDomain = await getProsodyDomain(options)
  const paths = await getProsodyFilePaths(options)
  const roomType = settings['prosody-room-type'] === 'channel' ? 'channel' : 'video'
  // enableRemoteChatConnections: local users can communicate with external rooms
  const enableRemoteChatConnections = !(settings['federation-dont-publish-remotely'] as boolean)
  let certificates: ProsodyConfigCertificates = false
  const useBots = !settings['disable-channel-configuration']
  const bots: ProsodyConfig['bots'] = {}
  const chatTerms = (typeof settings['chat-terms'] === 'string') && settings['chat-terms']
    ? settings['chat-terms']
    : undefined

  let useExternal = false
  try {
    const oidcs = ExternalAuthOIDC.allSingletons()
    for (const oidc of oidcs) {
      if (await oidc.isOk()) {
        // At least one external authentcation => we must enable the external virtual host.
        useExternal = true
        break
      }
    }
  } catch (err) {
    logger.error(err)
    useExternal = false
  }

  // Note: for the bots to connect, we must allow multiplexing.
  // This will be done on the http (BOSH/Websocket) port, as it only listen on localhost.
  // TODO: to improve performance, try to avoid multiplexing, and find a better way for bots to connect.
  const useMultiplexing = useBots

  const apikey = await getAPIKey(options)
  valuesToHideInDiagnostic.set('APIKey', apikey)

  const publicServerUrl = options.peertubeHelpers.config.getWebserverUrl()

  let basePeertubeUrl = settings['prosody-peertube-uri'] as string
  if (basePeertubeUrl) {
    logger.debug('basePeertubeUrl for internal API: using the settings value')
    if (!/^https?:\/\/[a-z0-9.-_]+(?::\d+)?$/.test(basePeertubeUrl)) {
      throw new Error('Invalid prosody-peertube-uri')
    }
  }
  if (!basePeertubeUrl && ('getServerListeningConfig' in options.peertubeHelpers.config)) {
    // Peertube >=5.1 has getServerListeningConfig to get relevant information.
    const listeningConfig = options.peertubeHelpers.config.getServerListeningConfig()
    if (listeningConfig?.port) {
      if (!listeningConfig.hostname || listeningConfig.hostname === '::') {
        logger.debug(
          'basePeertubeUrl for internal API: getServerListeningConfig.hostname==="' +
          (listeningConfig.hostname ?? '') +
          '", fallbacking on 127.0.0.1.'
        )
        basePeertubeUrl = `http://127.0.0.1:${listeningConfig.port}`
      } else {
        logger.debug('basePeertubeUrl for internal API: using getServerListeningConfig')
        basePeertubeUrl = `http://${listeningConfig.hostname}:${listeningConfig.port}`
      }
    }
  }
  if (!basePeertubeUrl) {
    // In still nothing, just using the public url (it will get througt nginx, but will work)
    logger.debug('basePeertubeUrl for internal API: using public Url')
    basePeertubeUrl = publicServerUrl
  }
  const baseApiUrl = basePeertubeUrl + getBaseRouterRoute(options) + 'api/'

  const authApiUrl = baseApiUrl + 'user' // FIXME: should be protected by apikey, but mod_auth_http cant handle params
  const roomApiUrl = baseApiUrl + 'room?apikey=' + apikey + '&jid={room.jid|jid_node}'
  const testApiUrl = baseApiUrl + 'test?apikey=' + apikey
  const followApiUrl = baseApiUrl + 'follow?apikey=' + apikey

  const config = new ProsodyConfigContent(paths, prosodyDomain, chatTerms)
  if (!disableAnon) {
    config.useAnonymous(autoBanIP)
  }

  if (useExternal) {
    config.useExternal(apikey)
  }

  config.useHttpAuthentication(authApiUrl)
  const useWS = !!options.registerWebSocketRoute // this comes with Peertube >=5.0.0, and is a prerequisite to websocket
  config.usePeertubeBoshAndWebsocket(prosodyDomain, port, publicServerUrl, useWS, useMultiplexing)
  config.useMucHttpDefault(roomApiUrl)

  if (enableC2S) {
    const c2sPort = (settings['prosody-c2s-port'] as string) || '52822'
    if (!/^\d+$/.test(c2sPort)) {
      throw new Error('Invalid c2s port')
    }
    const c2sInterfaces = ((settings['prosody-c2s-interfaces'] as string) || '127.0.0.1, ::1')
      .split(',')
      .map(s => s.trim())
    // Check that there is no invalid values (to avoid injections):
    c2sInterfaces.forEach(networkInterface => {
      if (networkInterface === '*') return
      if (networkInterface === '::') return
      if (networkInterface.match(/^\d+\.\d+\.\d+\.\d+$/)) return
      if (networkInterface.match(/^[a-f0-9:]+$/)) return
      throw new Error('Invalid c2s interfaces')
    })
    config.useC2S(c2sPort, c2sInterfaces)
  }

  if (enableComponents) {
    const componentsPort = (settings['prosody-components-port'] as string) || '53470'
    if (!/^\d+$/.test(componentsPort)) {
      throw new Error('Invalid external components port')
    }
    const componentsInterfaces = ((settings['prosody-components-interfaces'] as string) || '')
      .split(',')
      .map(s => s.trim())
    // Check that there is no invalid values (to avoid injections):
    componentsInterfaces.forEach(networkInterface => {
      if (networkInterface === '*') return
      if (networkInterface === '::') return
      if (networkInterface.match(/^\d+\.\d+\.\d+\.\d+$/)) return
      if (networkInterface.match(/^[a-f0-9:]+$/)) return
      throw new Error('Invalid components interfaces')
    })
    const components = parseExternalComponents((settings['prosody-components-list'] as string) || '', prosodyDomain)
    for (const component of components) {
      valuesToHideInDiagnostic.set('Component ' + component.name + ' secret', component.secret)
    }
    config.useExternalComponents(componentsPort, componentsInterfaces, components)
  }

  if (enableRoomS2S || enableRemoteChatConnections) {
    certificates = 'generate-self-signed'
    if (config.paths.certsDirIsCustom) {
      certificates = 'use-from-dir'
    }
    let s2sPort, s2sInterfaces
    if (enableRoomS2S) {
      s2sPort = (settings['prosody-s2s-port'] as string) || '5269'
      if (!/^\d+$/.test(s2sPort)) {
        throw new Error('Invalid s2s port')
      }
      s2sInterfaces = ((settings['prosody-s2s-interfaces'] as string) || '')
        .split(',')
        .map(s => s.trim())
      // Check that there is no invalid values (to avoid injections):
      s2sInterfaces.forEach(networkInterface => {
        if (networkInterface === '*') return
        if (networkInterface === '::') return
        if (networkInterface.match(/^\d+\.\d+\.\d+\.\d+$/)) return
        if (networkInterface.match(/^[a-f0-9:]+$/)) return
        throw new Error('Invalid s2s interfaces')
      })
    } else {
      s2sPort = null
      s2sInterfaces = null
    }
    config.useS2S(s2sPort, s2sInterfaces, publicServerUrl, getRemoteServerInfosDir(options))
  }

  const logExpiration = readLogExpiration(options, logExpirationSetting)
  config.useMam(logByDefault, logExpiration)
  // TODO: add a settings to choose?
  config.useDefaultPersistent()

  config.useManageRoomsApi(apikey)
  config.useLivechatRoles(followApiUrl)
  config.usePeertubeVCards(basePeertubeUrl)
  if (paths.avatars && paths.avatarsFiles) {
    config.useAnonymousRandomVCards(paths.avatars, paths.avatarsFiles)
  }

  if (useBots) {
    config.useBotsVirtualHost(paths.botAvatars, paths.botAvatarsFiles)
    bots.moderation = await BotConfiguration.singleton().getModerationBotGlobalConf()
    if (bots.moderation?.connection?.password && typeof bots.moderation.connection.password === 'string') {
      valuesToHideInDiagnostic.set('BotPassword', bots.moderation.connection.password as string)
    }
  }

  config.usePoll()

  if (settings['prosody-firewall-enabled'] === true) {
    const modFirewallFiles = await listModFirewallFiles(options, paths.modFirewallFiles)
    // We load the module, even if there is no configuration file.
    // So we will be sure that a Prosody reload is enought to take into account any change.
    config.useModFirewall(modFirewallFiles)
  }

  const commonEmojisRegexp = Emojis.singletonSafe()?.getCommonEmojisRegexp()
  if (commonEmojisRegexp) {
    config.useRestrictMessage(commonEmojisRegexp)
  } else {
    logger.error('Fail to load common emojis regexp, disabling restrict message module.')
  }

  config.useTestModule(apikey, testApiUrl)

  const debugMucAdminJids = debugMucAdmins(options)
  if (debugMucAdminJids) {
    config.addMucAdmins(debugMucAdminJids)
  }

  let logLevel: ProsodyLogLevel | undefined
  if (logger.level && (typeof logger.level === 'string')) {
    if (logger.level === 'error' || logger.level === 'info' || logger.level === 'debug') {
      logLevel = logger.level
    } else if (logger.level === 'warn' || logger.level === 'warning') {
      // Should be 'warn', but just in case... (this value was buggy with peertube <= 3.2.0-rc1)
      logLevel = 'warn'
    }
  }
  if (logLevel === undefined) {
    logger.info('No log level found in Peertube, will use default "info" for Prosody')
    logLevel = 'info'
  }
  config.setLog(logLevel)
  const content = config.write()

  return {
    content,
    paths,
    port,
    baseApiUrl,
    host: prosodyDomain,
    roomType,
    logByDefault,
    logExpiration,
    valuesToHideInDiagnostic,
    certificates,
    bots
  }
}

async function writeProsodyConfig (options: RegisterServerOptions): Promise<ProsodyConfig> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling writeProsodyConfig')

  logger.debug('Computing the Prosody config content')
  const config = await getProsodyConfig(options)
  const content = config.content
  const fileName = config.paths.config

  logger.info(`Writing prosody configuration file to ${fileName}`)
  await fs.promises.writeFile(fileName, content)
  logger.debug('Prosody configuration file writen')

  return config
}

const DEFAULTLOGEXPIRATION = '1w'
const DEFAULTLOGEXPIRATIONTYPE = 'period'
function readLogExpiration (options: RegisterServerOptions, logExpiration: string): ConfigLogExpiration {
  const logger = options.peertubeHelpers.logger
  logExpiration = logExpiration?.trim()
  if (logExpiration === 'never') {
    return {
      value: 'never',
      type: 'never'
    }
  }
  if (/^\d+$/.test(logExpiration)) {
    if (logExpiration === '0') {
      logger.error('Invalid prosody-muc-expiration value, cannot be 0.')
      return {
        value: DEFAULTLOGEXPIRATION,
        type: DEFAULTLOGEXPIRATIONTYPE,
        error: '0 is not an acceptable value.'
      }
    }
    return {
      value: logExpiration,
      type: 'seconds',
      seconds: parseInt(logExpiration)
    }
  }
  const matches = logExpiration.match(/^(\d+)([d|w|m|y])$/)
  if (matches) {
    const d = matches[1]
    if (d === '0') {
      logger.error(`Invalid prosody-muc-expiration value, cannot be ${logExpiration}.`)
      return {
        value: DEFAULTLOGEXPIRATION,
        type: DEFAULTLOGEXPIRATIONTYPE,
        error: '0 is not an acceptable value.'
      }
    }
    return {
      value: logExpiration,
      type: 'period'
    }
  }

  logger.error(`Invalid prosody-muc-expiration value '${logExpiration}'.`)
  return {
    value: DEFAULTLOGEXPIRATION,
    type: DEFAULTLOGEXPIRATIONTYPE,
    error: `Invalid value '${logExpiration}'.`
  }
}

function getProsodyConfigContentForDiagnostic (config: ProsodyConfig, content?: string): string {
  let r: string = content ?? config.content
  for (const [key, value] of config.valuesToHideInDiagnostic.entries()) {
    // replaceAll not available, using trick:
    r = r.split(value).join(`***${key}***`)
  }
  // We also replace `peertubelivechat_restrict_message_common_emoji_regexp` because it could be a very long line
  r = r.replace(
    /^(?:(\s*peertubelivechat_restrict_message_common_emoji_regexp\s*=\s*.{0,10}).*)$/gm,
    '$1 ***long line truncated***'
  )
  return r
}

async function _listAvatars (dir: string): Promise<string[]> {
  const files = await fs.promises.readdir(dir)
  const r = []
  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png')) {
      continue
    }
    r.push(file)
  }
  return r.sort()
}

export {
  ProsodyConfig,
  getProsodyConfig,
  getWorkingDir,
  getProsodyFilePaths,
  writeProsodyConfig,
  getProsodyConfigContentForDiagnostic
}
