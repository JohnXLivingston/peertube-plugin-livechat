import * as fs from 'fs'
import * as path from 'path'
import { pluginName } from '../helpers'

type LogMode = 'debug' | 'info'

/**
 * Creates the working dir if needed, and returns it.
 * NB: for now, I try to create a directory in /tmp/.
 * To ensure that there is no conflict with another peertube instance,
 * I used a randomly generated id that will be stored in database.
 */
async function getWorkingDir ({ peertubeHelpers, storageManager }: RegisterServerOptions): Promise<string> {
  const tmpBaseDir = '/tmp/'
  await fs.promises.access(tmpBaseDir, fs.constants.W_OK) // will throw an error if no access
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

  const name = getPath(value)
  if (!fs.existsSync(name)) {
    await fs.promises.mkdir(name)
  }
  await fs.promises.access(name, fs.constants.W_OK) // will throw an error if no access
  return name
}

interface ProsodyFilePaths {
  dir: string
  pid: string
  error: string
  log: string
  config: string
}
async function getProsodyFilePaths (options: RegisterServerOptions): Promise<ProsodyFilePaths> {
  const dir = await getWorkingDir(options)
  return {
    dir: dir,
    pid: path.resolve(dir, 'prosody.pid'),
    error: path.resolve(dir, 'prosody.err'),
    log: path.resolve(dir, 'prosody.log'),
    config: path.resolve(dir, 'prosody.cfg.lua')
  }
}

async function getProsodyConfigContent (options: RegisterServerOptions): Promise<string> {
  const peertubeDomain = 'localhost'
  const paths = await getProsodyFilePaths(options)
  const logMode: LogMode = 'debug'
  return `

admins = { }
plugin_paths = { }

modules_enabled = {
  "version"; -- Replies to server version requests
  "uptime"; -- Report how long server has been running
  "ping"; -- Replies to XMPP pings with pongs

  "bosh"; -- Enable BOSH clients, aka "Jabber over HTTP"
  -- "websocket"; -- XMPP over WebSockets

  "posix"; -- POSIX functionality, sends server to background, enables syslog, etc.
}
modules_disabled = {
    "offline"; -- Store offline messages
    "c2s"; -- Handle client connections
    "s2s"; -- Handle server-to-server connections
}

allow_registration = false

daemonize = false;

pidfile = "${paths.pid}";

c2s_require_encryption = false

archive_expires_after = "1w" -- Remove archived messages after 1 week

log = {
  -- Log files (change 'info' to 'debug' for debug logs):
  ${logMode} = "${paths.log}";
  error = "${paths.error}";
  -- Syslog:
  -- { levels = { "error" }; to = "syslog";  };
}

cross_domain_bosh = false;
consider_bosh_secure = true;
cross_domain_websocket = false;
consider_websocket_secure = true;

VirtualHost "anon.localhost"
  https_ports = {};
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
}

async function getProsodyConfigPath (options: RegisterServerOptions): Promise<string> {
  const paths = await getProsodyFilePaths(options)
  return paths.config
}

async function writeProsodyConfig (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  const content = await getProsodyConfigContent(options)
  const fileName = await getProsodyConfigPath(options)
  logger.info(`Writing prosody configuration file to ${fileName}`)
  await fs.promises.writeFile(fileName, content)
}

export {
  getProsodyConfigContent,
  getWorkingDir,
  getProsodyFilePaths,
  getProsodyConfigPath,
  writeProsodyConfig
}
