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

/**
 * Creates the working dir if needed, and returns it.
 */
async function ensureWorkingDir (options: RegisterServerOptions): Promise<string> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling ensureworkingDir')

  const paths = await getProsodyFilePaths(options)
  const dir = paths.dir
  if (!fs.existsSync(dir)) {
    logger.info(`The working dir ${dir} does not exists, trying to create it`)
    await fs.promises.mkdir(dir)
    logger.debug(`Working dir ${dir} was created`)
  }
  logger.debug(`Testing write access on ${dir}`)
  await fs.promises.access(dir, fs.constants.W_OK) // will throw an error if no access
  logger.debug(`Write access ok on ${dir}`)

  if (!fs.existsSync(paths.data)) {
    logger.info(`The data dir ${paths.data} does not exists, trying to create it`)
    await fs.promises.mkdir(paths.data)
    logger.debug(`Working dir ${paths.data} was created`)
  }

  return dir
}

async function getProsodyFilePaths (options: RegisterServerOptions): Promise<ProsodyFilePaths> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling getProsodyFilePaths')

  const dir = await getWorkingDir(options)
  return {
    dir: dir,
    pid: path.resolve(dir, 'prosody.pid'),
    error: path.resolve(dir, 'prosody.err'),
    log: path.resolve(dir, 'prosody.log'),
    config: path.resolve(dir, 'prosody.cfg.lua'),
    data: path.resolve(dir, 'data'),
    modules: path.resolve(__dirname, '../../prosody-modules'),
    avatars: path.resolve(__dirname, '../../avatars')
  }
}

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
    'prosody-room-type',
    'prosody-peertube-uri',
    'prosody-components',
    'prosody-components-port',
    'prosody-components-list',
    'chat-no-anonymous'
  ])

  const valuesToHideInDiagnostic = new Map<string, string>()
  const port = (settings['prosody-port'] as string) || '52800'
  if (!/^\d+$/.test(port)) {
    throw new Error('Invalid port')
  }
  const logByDefault = (settings['prosody-muc-log-by-default'] as boolean) ?? true
  const disableAnon = (settings['chat-no-anonymous'] as boolean) || false
  const logExpirationSetting = (settings['prosody-muc-expiration'] as string) ?? DEFAULTLOGEXPIRATION
  const enableC2s = (settings['prosody-c2s'] as boolean) || false
  const enableComponents = (settings['prosody-components'] as boolean) || false
  const prosodyDomain = await getProsodyDomain(options)
  const paths = await getProsodyFilePaths(options)
  const roomType = settings['prosody-room-type'] === 'channel' ? 'channel' : 'video'

  const apikey = await getAPIKey(options)
  valuesToHideInDiagnostic.set('APIKey', apikey)

  let basePeertubeUrl = settings['prosody-peertube-uri'] as string
  if (basePeertubeUrl && !/^https?:\/\/[a-z0-9.-_]+(?::\d+)?$/.test(basePeertubeUrl)) {
    throw new Error('Invalid prosody-peertube-uri')
  }
  if (!basePeertubeUrl) {
    basePeertubeUrl = options.peertubeHelpers.config.getWebserverUrl()
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
  config.usePeertubeBoshAndWebsocket(prosodyDomain, port, options.peertubeHelpers.config.getWebserverUrl(), useWS)
  config.useMucHttpDefault(roomApiUrl)

  if (enableC2s) {
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
    valuesToHideInDiagnostic
  }
}

async function writeProsodyConfig (options: RegisterServerOptions): Promise<ProsodyConfig> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling writeProsodyConfig')

  logger.debug('Ensuring that the working dir exists')
  await ensureWorkingDir(options)
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
  getProsodyConfig,
  getWorkingDir,
  ensureWorkingDir,
  getProsodyFilePaths,
  writeProsodyConfig,
  getProsodyConfigContentForDiagnostic
}
