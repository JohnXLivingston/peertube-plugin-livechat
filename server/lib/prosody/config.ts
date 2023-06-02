import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ProsodyLogLevel } from './config/content'
import * as fs from 'fs'
import * as path from 'path'
import { getBaseRouterRoute, RegisterServerOptionsV5 } from '../helpers'
import { ProsodyFilePaths } from './config/paths'
import { ConfigLogExpiration, ProsodyConfigContent } from './config/content'
import { getProsodyDomain } from './config/domain'
import { getAPIKey } from '../apikey'
import { parseExternalComponents } from './config/components'
import { getRemoteServerInfosDir } from '../federation/storage'

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
    'use-system-prosody', 'prosody-room-allow-s2s', 'prosody-certificates-dir'
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
    if (!fs.statSync(settings['prosody-certificates-dir'] as string).isDirectory()) {
      // We can throw an exception here...
      // Because if the user input a wrong directory, the plugin will not register,
      // and he will never be able to fix the conf
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

  return {
    dir: dir,
    pid: path.resolve(dir, 'prosody.pid'),
    error: path.resolve(dir, 'prosody.err'),
    log: path.resolve(dir, 'prosody.log'),
    config: path.resolve(dir, 'prosody.cfg.lua'),
    data: path.resolve(dir, 'data'),
    certs: certsDir,
    certsDirIsCustom,
    modules: path.resolve(__dirname, '../../prosody-modules'),
    avatars: path.resolve(__dirname, '../../avatars'),
    exec,
    execArgs,
    execCtl,
    execCtlArgs,
    appImageToExtract,
    appImageExtractPath
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
    'prosody-room-allow-s2s',
    'prosody-s2s-port',
    'prosody-s2s-interfaces',
    'prosody-certificates-dir',
    'prosody-room-type',
    'prosody-peertube-uri',
    'prosody-components',
    'prosody-components-port',
    'prosody-components-list',
    'chat-no-anonymous',
    'federation-dont-publish-remotely'
  ])

  const valuesToHideInDiagnostic = new Map<string, string>()
  const port = (settings['prosody-port'] as string) || '52800'
  if (!/^\d+$/.test(port)) {
    throw new Error('Invalid port')
  }
  const logByDefault = (settings['prosody-muc-log-by-default'] as boolean) ?? true
  const disableAnon = (settings['chat-no-anonymous'] as boolean) || false
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

  const apikey = await getAPIKey(options)
  valuesToHideInDiagnostic.set('APIKey', apikey)

  const publicServerUrl = options.peertubeHelpers.config.getWebserverUrl()

  let basePeertubeUrl = settings['prosody-peertube-uri'] as string
  if (basePeertubeUrl && !/^https?:\/\/[a-z0-9.-_]+(?::\d+)?$/.test(basePeertubeUrl)) {
    throw new Error('Invalid prosody-peertube-uri')
  }
  if (!basePeertubeUrl) {
    basePeertubeUrl = publicServerUrl
  }
  const baseApiUrl = basePeertubeUrl + getBaseRouterRoute(options) + 'api/'

  const authApiUrl = baseApiUrl + 'user' // FIXME: should be protected by apikey, but mod_auth_http cant handle params
  const roomApiUrl = baseApiUrl + 'room?apikey=' + apikey + '&jid={room.jid|jid_node}'
  const testApiUrl = baseApiUrl + 'test?apikey=' + apikey

  const config = new ProsodyConfigContent(paths, prosodyDomain)
  if (!disableAnon) {
    config.useAnonymous()
  }
  config.useHttpAuthentication(authApiUrl)
  const useWS = !!options.registerWebSocketRoute // this comes with Peertube >=5.0.0, and is a prerequisite to websocket
  config.usePeertubeBoshAndWebsocket(prosodyDomain, port, publicServerUrl, useWS)
  config.useMucHttpDefault(roomApiUrl)

  if (enableC2S) {
    const c2sPort = (settings['prosody-c2s-port'] as string) || '52822'
    if (!/^\d+$/.test(c2sPort)) {
      throw new Error('Invalid c2s port')
    }
    config.useC2S(c2sPort)
  }

  if (enableComponents) {
    const componentsPort = (settings['prosody-components-port'] as string) || '53470'
    if (!/^\d+$/.test(componentsPort)) {
      throw new Error('Invalid external components port')
    }
    const components = parseExternalComponents((settings['prosody-components-list'] as string) || '', prosodyDomain)
    for (const component of components) {
      valuesToHideInDiagnostic.set('Component ' + component.name + ' secret', component.secret)
    }
    config.useExternalComponents(componentsPort, components)
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

  config.useListRoomsApi(apikey)
  config.usePeertubeVCards(basePeertubeUrl)
  config.useAnonymousRandomVCards(paths.avatars)

  config.useTestModule(apikey, testApiUrl)

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
    certificates
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
  return r
}

export {
  ProsodyConfig,
  getProsodyConfig,
  getWorkingDir,
  getProsodyFilePaths,
  writeProsodyConfig,
  getProsodyConfigContentForDiagnostic
}
