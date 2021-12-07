import * as fs from 'fs'
import * as path from 'path'
import { getBaseRouterRoute } from '../helpers'
import { ProsodyFilePaths } from './config/paths'
import { ConfigLogExpiration, ProsodyConfigContent } from './config/content'
import { getProsodyDomain } from './config/domain'
import { getAPIKey, getExternalComponentKey } from '../apikey'
import type { ProsodyLogLevel } from './config/content'
import { parseConfigDemoBotUUIDs } from './config/bots'

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
async function ensureWorkingDirs (options: RegisterServerOptions): Promise<string> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling ensureworkingDirs')

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

  for (const path of [paths.data, paths.bots.dir]) {
    if (!fs.existsSync(path)) {
      logger.info(`The data dir ${path} does not exists, trying to create it`)
      await fs.promises.mkdir(path)
      logger.debug(`Working dir ${path} was created`)
    }
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
    bots: {
      dir: path.resolve(dir, 'bots'),
      demobot: path.resolve(dir, 'bots', 'demobot.js')
    },
    modules: path.resolve(__dirname, '../../prosody-modules')
  }
}

interface ProsodyConfigBots {
  demobot?: string[] // if the demo bot is activated, here are the video UUIDS where it will be.
}

type ProsodyConfigFilesKey = 'prosody' | 'demobot'
type ProsodyConfigFiles = Array<{
  key: ProsodyConfigFilesKey
  path: string
  content: string
}>

class ProsodyConfig {
  constructor (
    private readonly configFiles: ProsodyConfigFiles,
    public paths: ProsodyFilePaths,
    public host: string,
    public port: string,
    public baseApiUrl: string,
    public roomType: 'video' | 'channel',
    public logByDefault: boolean,
    public logExpiration: ConfigLogExpiration,
    public bots: ProsodyConfigBots,
    public valuesToHideInDiagnostic: {[key: string]: string}
  ) {}

  public getConfigFiles (): ProsodyConfigFiles {
    return this.configFiles
  }

  public contentForDiagnostic (content: string): string {
    let r: string = content
    for (const key in this.valuesToHideInDiagnostic) {
      // replaceAll not available, using trick:
      r = r.split(this.valuesToHideInDiagnostic[key]).join(`***${key}***`)
    }
    return r
  }
}

async function getProsodyConfig (options: RegisterServerOptions): Promise<ProsodyConfig> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling getProsodyConfig')

  let useExternalComponents = false
  const bots: ProsodyConfigBots = {}
  const valuesToHideInDiagnostic: {[key: string]: string} = {}

  const settings = await options.settingsManager.getSettings([
    'prosody-port',
    'prosody-muc-log-by-default',
    'prosody-muc-expiration',
    'prosody-c2s',
    'prosody-room-type',
    'prosody-peertube-uri',
    'prosody-c2s-port',
    'prosody-component-port',
    'chat-videos-list'
  ])

  const port = (settings['prosody-port'] as string) || '52800'
  if (!/^\d+$/.test(port)) {
    throw new Error('Invalid port')
  }
  const externalComponentsPort = (settings['prosody-component-port'] as string) || '53470'
  if (!/^\d+$/.test(externalComponentsPort)) {
    throw new Error('Invalid external components port')
  }
  const logByDefault = (settings['prosody-muc-log-by-default'] as boolean) ?? true
  const logExpirationSetting = (settings['prosody-muc-expiration'] as string) ?? DEFAULTLOGEXPIRATION
  const enableC2s = (settings['prosody-c2s'] as boolean) || false
  const prosodyDomain = await getProsodyDomain(options)
  const paths = await getProsodyFilePaths(options)
  const roomType = (settings['prosody-room-type']) === 'channel' ? 'channel' : 'video'

  const apikey = await getAPIKey(options)
  valuesToHideInDiagnostic.APIKey = apikey

  let baseApiUrl = settings['prosody-peertube-uri'] as string
  if (baseApiUrl && !/^https?:\/\/[a-z0-9.-_]+(?::\d+)?$/.test(baseApiUrl)) {
    throw new Error('Invalid prosody-peertube-uri')
  }
  if (!baseApiUrl) {
    baseApiUrl = options.peertubeHelpers.config.getWebserverUrl()
  }
  baseApiUrl += getBaseRouterRoute(options) + 'api/'

  const authApiUrl = baseApiUrl + 'user' // FIXME: should be protected by apikey, but mod_auth_http cant handle params
  const roomApiUrl = baseApiUrl + 'room?apikey=' + apikey + '&jid={room.jid|jid_node}'
  const testApiUrl = baseApiUrl + 'test?apikey=' + apikey

  const config = new ProsodyConfigContent(paths, prosodyDomain)
  config.useHttpAuthentication(authApiUrl)
  config.usePeertubeBosh(prosodyDomain, port)
  config.useMucHttpDefault(roomApiUrl)

  if (enableC2s) {
    const c2sPort = (settings['prosody-c2s-port'] as string) || '52822'
    if (!/^\d+$/.test(c2sPort)) {
      throw new Error('Invalid c2s port')
    }
    config.useC2S(c2sPort)
  }

  const logExpiration = readLogExpiration(options, logExpirationSetting)
  config.useMam(logByDefault, logExpiration)
  // TODO: add a settings to choose?
  config.useDefaultPersistent()

  config.useListRoomsApi(apikey)

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

  const demoBotUUIDs = parseConfigDemoBotUUIDs((settings['chat-videos-list'] as string) || '')
  let demoBotContentObj: string = JSON.stringify({})
  if (demoBotUUIDs?.length > 0) {
    useExternalComponents = true
    const componentSecret = await getExternalComponentKey(options, 'DEMOBOT')
    valuesToHideInDiagnostic.ComponentSecret = componentSecret
    config.useDemoBot(componentSecret)
    bots.demobot = demoBotUUIDs
    demoBotContentObj = JSON.stringify({
      UUIDs: demoBotUUIDs,
      service: 'xmpp://127.0.0.1:' + externalComponentsPort,
      domain: 'demobot.' + prosodyDomain,
      mucDomain: 'room.' + prosodyDomain,
      password: componentSecret
    })
  }
  let demoBotContent = '"use strict";\n'
  demoBotContent += 'Object.defineProperty(exports, "__esModule", { value: true });\n'
  demoBotContent += `function getConf () { return ${demoBotContentObj}; }` + '\n'
  demoBotContent += 'exports.getConf = getConf;\n'

  if (useExternalComponents) {
    config.useExternalComponents(externalComponentsPort)
  }

  const content = config.write()

  return new ProsodyConfig(
    [
      {
        key: 'prosody',
        path: paths.config,
        content: content
      },
      {
        key: 'demobot',
        path: paths.bots.demobot,
        content: demoBotContent
      }
    ],
    paths,
    prosodyDomain,
    port,
    baseApiUrl,
    roomType,
    logByDefault,
    logExpiration,
    bots,
    valuesToHideInDiagnostic
  )
}

async function writeProsodyConfig (options: RegisterServerOptions): Promise<ProsodyConfig> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling writeProsodyConfig')

  logger.debug('Ensuring that the working dir exists')
  await ensureWorkingDirs(options)
  logger.debug('Computing the Prosody config content')
  const config = await getProsodyConfig(options)

  const configFiles = config.getConfigFiles()
  for (const configFile of configFiles) {
    const content = configFile.content
    const fileName = configFile.path

    logger.info(`Writing prosody configuration file '${configFile.key}' to ${fileName}.`)
    await fs.promises.writeFile(fileName, content)
    logger.debug(`Prosody configuration file '${configFile.key}' writen.`)
  }

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

export {
  getProsodyConfig,
  getWorkingDir,
  ensureWorkingDirs,
  getProsodyFilePaths,
  writeProsodyConfig
}
