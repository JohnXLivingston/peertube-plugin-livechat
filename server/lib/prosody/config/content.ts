import type { ProsodyFilePaths } from './paths'
import type { ExternalComponent } from './components'

type ConfigEntryValue = boolean | number | string | ConfigEntryValue[]

type ConfigEntries = Map<string, ConfigEntryValue>

interface ConfigLogExpirationNever {
  value: 'never'
  type: 'never'
}
interface ConfigLogExpirationSeconds {
  value: string
  seconds: number
  type: 'seconds'
}
interface ConfigLogExpirationPeriod {
  value: string
  type: 'period'
}
interface ConfigLogExpirationError {
  value: string
  error: string
  type: 'period'
}
type ConfigLogExpiration =
  ConfigLogExpirationNever | ConfigLogExpirationPeriod | ConfigLogExpirationSeconds | ConfigLogExpirationError

function writeValue (value: ConfigEntryValue): string {
  if (typeof value === 'boolean') {
    return value.toString() + ';\n'
  }
  if (typeof value === 'string') {
    return '"' + value.replace(/"/g, '\\"') + '"' + ';\n'
  }
  if (typeof value === 'number') {
    return value.toString() + ';\n'
  }
  if (Array.isArray(value)) {
    let s = '{\n'
    for (let i = 0; i < value.length; i++) {
      s += '  ' + writeValue(value[i])
    }
    s += '};\n'
    return s
  }
  throw new Error(`Don't know how to handle this value: ${value as string}`)
}

abstract class ProsodyConfigBlock {
  entries: ConfigEntries
  prefix: string

  constructor (prefix: string) {
    this.prefix = prefix
    this.entries = new Map()
  }

  set (name: string, value: ConfigEntryValue): void {
    this.entries.set(name, value)
  }

  add (name: string, value: ConfigEntryValue): void {
    if (!this.entries.has(name)) {
      this.entries.set(name, [])
    }
    let entry = this.entries.get(name) as ConfigEntryValue
    if (!Array.isArray(entry)) {
      entry = [entry]
    }
    entry.push(value)
    this.entries.set(name, entry)
  }

  write (): string {
    let content = ''
    // Map keeps order :)
    this.entries.forEach((value, key) => {
      content += this.prefix + key + ' = ' + writeValue(value)
    })
    return content
  }
}

class ProsodyConfigGlobal extends ProsodyConfigBlock {
  constructor () {
    super('')
  }
}

class ProsodyConfigVirtualHost extends ProsodyConfigBlock {
  name: string

  constructor (name: string) {
    super('  ')
    this.name = name
  }

  write (): string {
    return `VirtualHost "${this.name}"\n` + super.write()
  }
}

class ProsodyConfigComponent extends ProsodyConfigBlock {
  name: string
  type?: string

  constructor (name: string, type?: string) {
    super('  ')
    this.type = type
    this.name = name
  }

  write (): string {
    if (this.type !== undefined) {
      return `Component "${this.name}" "${this.type}"\n` + super.write()
    }
    return `Component "${this.name}"\n` + super.write()
  }
}

type ProsodyLogLevel = 'debug' | 'info' | 'warn' | 'error'

class ProsodyConfigContent {
  paths: ProsodyFilePaths
  global: ProsodyConfigGlobal
  authenticated?: ProsodyConfigVirtualHost
  anon?: ProsodyConfigVirtualHost
  muc: ProsodyConfigComponent
  externalComponents: ProsodyConfigComponent[] = []
  log: string
  prosodyDomain: string

  constructor (paths: ProsodyFilePaths, prosodyDomain: string) {
    this.paths = paths
    this.global = new ProsodyConfigGlobal()
    this.log = ''
    this.prosodyDomain = prosodyDomain
    this.muc = new ProsodyConfigComponent('room.' + prosodyDomain, 'muc')

    this.global.set('daemonize', false)
    this.global.set('allow_registration', false)
    this.global.set('admins', [])

    this.global.set('pidfile', this.paths.pid)
    this.global.set('plugin_paths', [this.paths.modules])
    this.global.set('data_path', this.paths.data)
    this.global.set('default_storage', 'internal')
    this.global.set('storage', 'internal')

    this.global.set('modules_enabled', [
      'roster', // Allow users to have a roster. Recommended ;)
      'saslauth', // Authentication for clients and servers. Recommended if you want to log in.
      'carbons', // Keep multiple clients in sync
      'version', // Replies to server version requests
      'uptime', // Report how long server has been running
      'ping', // Replies to XMPP pings with pongs
      'bosh', // Enable BOSH clients, aka "Jabber over HTTP"
      // 'websocket', // Enable Websocket clients
      'posix', // POSIX functionality, sends server to background, enables syslog, etc.
      // 'pep', // Enables users to publish their avatar, mood, activity, playing music and more
      // 'vcard_legacy' // Conversion between legacy vCard and PEP Avatar, vcard
      // 'vcard4' // User profiles (stored in PEP)
      'disco' // Enable mod_disco (feature discovering)

    ])
    this.global.set('modules_disabled', [
      // 'offline' // Store offline messages
      // 'c2s' // Handle client connections
      's2s' // Handle server-to-server connections
    ])

    this.global.set('cross_domain_bosh', false)
    this.global.set('consider_bosh_secure', false)
    this.global.set('cross_domain_websocket', false)
    this.global.set('consider_websocket_secure', false)

    this.muc.set('muc_room_locking', false)
    this.muc.set('muc_tombstones', false)
    this.muc.set('muc_room_default_language', 'en')
    this.muc.set('muc_room_default_public', false)
    this.muc.set('muc_room_default_persistent', false)
    this.muc.set('muc_room_default_members_only', false)
    this.muc.set('muc_room_default_moderated', false)
    this.muc.set('muc_room_default_public_jids', false)
    this.muc.set('muc_room_default_change_subject', false)
    this.muc.set('muc_room_default_history_length', 20)
  }

  useAnonymous (): void {
    this.anon = new ProsodyConfigVirtualHost('anon.' + this.prosodyDomain)
    this.anon.set('authentication', 'anonymous')
    this.anon.set('modules_enabled', ['ping'])
  }

  useHttpAuthentication (url: string): void {
    this.authenticated = new ProsodyConfigVirtualHost(this.prosodyDomain)

    this.authenticated.set('authentication', 'http')
    this.authenticated.set('modules_enabled', ['ping', 'auth_http'])

    this.authenticated.set('http_auth_url', url)
  }

  usePeertubeBoshAndWebsocket (prosodyDomain: string, port: string, publicServerUrl: string, useWS: boolean): void {
    this.global.set('c2s_require_encryption', false)
    this.global.set('interfaces', ['127.0.0.1', '::1'])
    this.global.set('c2s_ports', [])
    this.global.set('c2s_interfaces', ['127.0.0.1', '::1'])
    this.global.set('s2s_ports', [])
    this.global.set('s2s_interfaces', ['127.0.0.1', '::1'])
    this.global.set('http_ports', [port])
    this.global.set('http_interfaces', ['127.0.0.1', '::1'])
    this.global.set('https_ports', [])
    this.global.set('https_interfaces', ['127.0.0.1', '::1'])

    this.global.set('consider_bosh_secure', true)
    if (useWS) {
      this.global.set('consider_websocket_secure', true)

      // This line seems to be required by Prosody, otherwise it rejects websocket...
      this.global.set('cross_domain_websocket', [publicServerUrl])
    }

    if (this.anon) {
      this.anon.set('trusted_proxies', ['127.0.0.1', '::1'])
      this.anon.set('allow_anonymous_s2s', false)
      this.anon.add('modules_enabled', 'http')
      this.anon.add('modules_enabled', 'bosh')
      if (useWS) {
        this.anon.add('modules_enabled', 'websocket')
      }
      this.anon.set('http_host', prosodyDomain)
      this.anon.set('http_external_url', 'http://' + prosodyDomain)
    }

    this.muc.set('restrict_room_creation', 'local')
    this.muc.set('http_host', prosodyDomain)
    this.muc.set('http_external_url', 'http://' + prosodyDomain)

    if (this.authenticated) {
      this.authenticated.set('trusted_proxies', ['127.0.0.1', '::1'])
      this.authenticated.set('allow_anonymous_s2s', false)
      this.authenticated.add('modules_enabled', 'http')
      this.authenticated.add('modules_enabled', 'bosh')
      if (useWS) {
        this.authenticated.add('modules_enabled', 'websocket')
      }
      this.authenticated.set('http_host', prosodyDomain)
      this.authenticated.set('http_external_url', 'http://' + prosodyDomain)
    }
  }

  useC2S (c2sPort: string): void {
    this.global.set('c2s_ports', [c2sPort])
  }

  useExternalComponents (componentsPort: string, components: ExternalComponent[]): void {
    this.global.set('component_ports', [componentsPort])
    this.global.set('component_interfaces', ['127.0.0.1', '::1'])

    for (const component of components) {
      const c = new ProsodyConfigComponent(component.name)
      c.set('component_secret', component.secret)
      c.set('disco_hidden', true)
      this.externalComponents.push(c)
    }
  }

  useMucHttpDefault (url: string): void {
    this.muc.add('modules_enabled', 'muc_http_defaults')
    this.muc.add('muc_create_api_url', url)

    // restrict_room_creation: we can override the 'local' value.
    // Indeed, when muc_http_default is used, room creation will be managed by api.
    this.muc.set('restrict_room_creation', false)
  }

  /**
   * Calling this method makes Prosody use mod_muc_mam to store rooms history.
   * @param logByDefault: if the room content should be archived by default.
   * @param logExpiration: how long the server must store messages. See https://prosody.im/doc/modules/mod_muc_mam
   */
  useMam (logByDefault: boolean, logExpiration: ConfigLogExpiration): void {
    this.muc.add('modules_enabled', 'muc_mam')

    this.muc.set('muc_log_by_default', !!logByDefault)
    this.muc.set('muc_log_presences', true)
    this.muc.set('log_all_rooms', false)
    this.muc.set('muc_log_expires_after', logExpiration.value)
    const defaultCleanupInterval = 4 * 60 * 60
    if (logExpiration.type === 'seconds' && logExpiration.seconds && logExpiration.seconds < defaultCleanupInterval) {
      // if the log expiration is less than the default cleanup interval, we have to decrease it.
      this.muc.set('muc_log_cleanup_interval', logExpiration.seconds)
    } else {
      this.muc.set('muc_log_cleanup_interval', defaultCleanupInterval)
    }

    // We can also use mod_muc_moderation
    // NB: for now Prosody has a partial support of this feature with «internal» storage.
    // It will be available in next version (0.11.8?).
    this.muc.add('modules_enabled', 'muc_moderation')
  }

  /**
   * Rooms will be persistent by default (they will not be deleted if no participant).
   */
  useDefaultPersistent (): void {
    this.muc.set('muc_room_default_persistent', true)
  }

  useListRoomsApi (apikey: string): void {
    this.muc.add('modules_enabled', 'http_peertubelivechat_list_rooms')
    this.muc.set('peertubelivechat_list_rooms_apikey', apikey)
  }

  useTestModule (prosodyApikey: string, apiurl: string): void {
    this.muc.add('modules_enabled', 'http_peertubelivechat_test')
    this.muc.set('peertubelivechat_test_apikey', prosodyApikey)
    this.muc.set('peertubelivechat_test_peertube_api_url', apiurl)
  }

  usePeertubeVCards (peertubeUrl: string): void {
    if (this.authenticated) {
      this.authenticated.add('modules_enabled', 'vcard_peertubelivechat')
      this.authenticated.set('peertubelivechat_vcard_peertube_url', peertubeUrl)
    }
  }

  useAnonymousRandomVCards (avatarPath: string): void {
    if (this.anon) {
      this.anon.add('modules_enabled', 'random_vcard_peertubelivechat')
      this.anon.set('peertubelivechat_random_vcard_avatars_path', avatarPath)
    }
  }

  setLog (level: ProsodyLogLevel, syslog?: ProsodyLogLevel[]): void {
    let log = ''
    log += 'log = {\n'
    if (level !== 'error') {
      log += '  ' + level + ' = ' + writeValue(this.paths.log)
    }
    // always log error level in a separate file.
    log += '  error = ' + writeValue(this.paths.error)
    if (syslog) {
      log += '  { to = "syslog"; levels = ' + writeValue(syslog) + ' };\n'
    }
    log += '\n};\n'
    this.log = log
  }

  public write (): string {
    let content = ''
    content += this.global.write()
    content += this.log + '\n'
    content += '\n\n'
    if (this.authenticated) {
      content += this.authenticated.write()
      content += '\n\n'
    }
    if (this.anon) {
      content += this.anon.write()
      content += '\n\n'
    }
    content += this.muc.write()
    content += '\n\n'
    for (const externalComponent of this.externalComponents) {
      content += '\n\n'
      content += externalComponent.write()
      content += '\n\n'
    }
    return content
  }
}

export {
  ProsodyLogLevel,
  ProsodyConfigContent,
  ConfigLogExpiration
}
