import * as fs from 'fs'
import * as path from 'path'
import { pluginName, getBaseRouter } from '../helpers'
import { ProsodyFilePaths } from './config/paths'
import { ProsodyConfigContent } from './config/content'
import { getProsodyDomain } from './config/domain'
import { getAPIKey } from '../apikey'

async function getWorkingDir ({ peertubeHelpers, storageManager }: RegisterServerOptions): Promise<string> {
  const logger = peertubeHelpers.logger
  logger.debug('Calling getWorkingDir')

  const tmpBaseDir = '/tmp/'
  let value: string = await storageManager.getData('tempDirId')

  function getPath (value: string): string {
    return path.resolve(tmpBaseDir, pluginName + '-' + value)
  }

  while (!value) {
    peertubeHelpers.logger.info('Generating an id for temp dir')
    value = Math.random().toString(36).slice(2, 12)
    const name = getPath(value)
    if (fs.existsSync(name)) {
      peertubeHelpers.logger.info('The folder ' + name + ' already exists, generating another name...')
      value = ''
      continue
    }
    await storageManager.storeData('tempDirId', value)
  }

  const dir = getPath(value)
  logger.debug('getWorkingDir will return ' + dir)
  return dir
}

/**
 * Creates the working dir if needed, and returns it.
 * NB: for now, I try to create a directory in /tmp/.
 * To ensure that there is no conflict with another peertube instance,
 * I used a randomly generated id that will be stored in database.
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
    modules: path.resolve(__dirname, '../../prosody-modules')
  }
}

interface ProsodyConfig {
  content: string
  paths: ProsodyFilePaths
  port: string
}
async function getProsodyConfig (options: RegisterServerOptions): Promise<ProsodyConfig> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling getProsodyConfig')

  const port = (await options.settingsManager.getSetting('prosody-port') as string) || '52800'
  if (!/^\d+$/.test(port)) {
    throw new Error('Invalid port')
  }
  const prosodyDomain = await getProsodyDomain(options)
  const paths = await getProsodyFilePaths(options)

  const apikey = await getAPIKey(options)
  const baseApiUrl = options.peertubeHelpers.config.getWebserverUrl() +
    getBaseRouter() +
    'api/'
  const authApiUrl = baseApiUrl + 'user' // FIXME: should be protected by apikey, but mod_auth_http cant handle params
  const roomApiUrl = baseApiUrl + 'room?apikey=' + apikey + '&jid={room.jid|jid_node}'

  const config = new ProsodyConfigContent(paths, prosodyDomain)
  config.useHttpAuthentication(authApiUrl)
  config.usePeertubeBosh(prosodyDomain, port)
  config.useMucHttpDefault(roomApiUrl)
  config.setArchive('1w') // Remove archived messages after 1 week
  config.setLog(process.env.NODE_ENV === 'test' ? 'debug' : 'info')
  const content = config.write()

  return {
    content,
    paths,
    port
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

export {
  getProsodyConfig,
  getWorkingDir,
  ensureWorkingDir,
  getProsodyFilePaths,
  writeProsodyConfig
}
