import * as fs from 'fs'
import * as path from 'path'
import { pluginName } from '../helpers'

type LogMode = 'debug' | 'info'

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

interface ProsodyFilePaths {
  dir: string
  pid: string
  error: string
  log: string
  config: string
  data: string
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
    data: path.resolve(dir, 'data')
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
  const peertubeDomain = 'localhost'
  const paths = await getProsodyFilePaths(options)
  const logMode: LogMode = 'info'
  const content = `

daemonize = false
pidfile = "${paths.pid}"
plugin_paths = { }
data_path = "${paths.data}"
interfaces = { "127.0.0.1" }
c2s_ports = { }
c2s_interfaces = { "127.0.0.1" }
s2s_ports = { }
s2s_interfaces = { "127.0.0.1" }
http_ports = { "${port}" }
http_interfaces = { "127.0.0.1" }
https_ports = { }
https_interfaces = { "127.0.0.1" }

admins = { }

modules_enabled = {
  "roster"; -- Allow users to have a roster. Recommended ;)
  "saslauth"; -- Authentication for clients and servers. Recommended if you want to log in.
  "version"; -- Replies to server version requests
  "uptime"; -- Report how long server has been running
  "ping"; -- Replies to XMPP pings with pongs

  "bosh"; -- Enable BOSH clients, aka "Jabber over HTTP"

  "posix"; -- POSIX functionality, sends server to background, enables syslog, etc.
}
modules_disabled = {
    -- "offline"; -- Store offline messages
    -- "c2s"; -- Handle client connections
    "s2s"; -- Handle server-to-server connections
}

allow_registration = false

c2s_require_encryption = false

archive_expires_after = "1w" -- Remove archived messages after 1 week

log = {
  -- Log files (change 'info' to 'debug' for debug logs):
  ${logMode} = "${paths.log}";
  error = "${paths.error}";
  -- Syslog:
  -- { levels = { "error" }; to = "syslog";  };
}

cross_domain_bosh = false
consider_bosh_secure = true
cross_domain_websocket = false
consider_websocket_secure = true

VirtualHost "localhost"
  trusted_proxies = { "127.0.0.1", "::1" }

  authentication = "anonymous"
  allow_anonymous_s2s = false
  modules_enabled = {
    "http";
    "bosh";
    "ping";
  }
  http_host = "${peertubeDomain}"
  http_external_url = "http://${peertubeDomain}"

Component "room.localhost" "muc"
  restrict_room_creation = "local"
  muc_room_locking = false
  muc_tombstones = false
  muc_room_default_language = "en"
  muc_room_default_public = true
  muc_room_default_persistent = false
  muc_room_default_members_only = false
  muc_room_default_moderated = false
  muc_room_default_public_jids = false
  muc_room_default_change_subject = false
  muc_room_default_history_length = 20
`
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
