import type { ProsodyFilePaths } from './paths'

type ConfigEntryValue = boolean | number | string | ConfigEntryValue[]

type ConfigEntries = Map<string, ConfigEntryValue>

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
  type: string

  constructor (type: string, name: string) {
    super('  ')
    this.type = type
    this.name = name
  }

  write (): string {
    return `Component "${this.name}" "${this.type}"\n` + super.write()
  }
}

type ProsodyLogLevel = 'debug' | 'info'

class ProsodyConfigContent {
  paths: ProsodyFilePaths
  global: ProsodyConfigGlobal
  authenticated?: ProsodyConfigVirtualHost
  anon: ProsodyConfigVirtualHost
  muc: ProsodyConfigComponent
  log: string
  prosodyDomain: string

  constructor (paths: ProsodyFilePaths, prosodyDomain: string) {
    this.paths = paths
    this.global = new ProsodyConfigGlobal()
    this.log = ''
    this.prosodyDomain = prosodyDomain
    this.anon = new ProsodyConfigVirtualHost('anon.' + prosodyDomain)
    this.muc = new ProsodyConfigComponent('muc', 'room.' + prosodyDomain)

    this.global.set('daemonize', false)
    this.global.set('allow_registration', false)
    this.global.set('admins', [])

    this.global.set('pidfile', this.paths.pid)
    this.global.set('plugin_paths', [this.paths.modules])
    this.global.set('data_path', this.paths.data)
    this.global.set('storage', 'internal')

    this.global.set('modules_enabled', [
      'roster', // Allow users to have a roster. Recommended ;)
      'saslauth', // Authentication for clients and servers. Recommended if you want to log in.
      'carbons', // Keep multiple clients in sync
      'version', // Replies to server version requests
      'uptime', // Report how long server has been running
      'ping', // Replies to XMPP pings with pongs
      'bosh', // Enable BOSH clients, aka "Jabber over HTTP"
      'posix' // POSIX functionality, sends server to background, enables syslog, etc.
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

    this.anon.set('authentication', 'anonymous')
    this.anon.set('modules_enabled', ['ping'])

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

  useHttpAuthentication (url: string): void {
    this.authenticated = new ProsodyConfigVirtualHost(this.prosodyDomain)

    this.authenticated.set('authentication', 'http')
    this.authenticated.set('modules_enabled', ['ping', 'auth_http'])

    this.authenticated.set('http_auth_url', url)
  }

  usePeertubeBosh (prosodyDomain: string, port: string): void {
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

    this.anon.set('trusted_proxies', ['127.0.0.1', '::1'])
    this.anon.set('allow_anonymous_s2s', false)
    this.anon.add('modules_enabled', 'http')
    this.anon.add('modules_enabled', 'bosh')
    this.anon.set('http_host', prosodyDomain)
    this.anon.set('http_external_url', 'http://' + prosodyDomain)

    this.muc.set('restrict_room_creation', 'local')

    if (this.authenticated) {
      this.authenticated.set('trusted_proxies', ['127.0.0.1', '::1'])
      this.authenticated.set('allow_anonymous_s2s', false)
      this.authenticated.add('modules_enabled', 'http')
      this.authenticated.add('modules_enabled', 'bosh')
      this.authenticated.set('http_host', prosodyDomain)
      this.authenticated.set('http_external_url', 'http://' + prosodyDomain)
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
   * Should not be used when using a temporary dir.
   * @param duration: how long the server must store messages. See https://prosody.im/doc/modules/mod_muc_mam
   */
  useMam (duration: string): void {
    this.muc.add('modules_enabled', 'muc_mam')

    this.muc.set('muc_log_by_default', true)
    this.muc.set('muc_log_presences', true)
    this.muc.set('log_all_rooms', true)
    this.muc.set('muc_log_expires_after', duration)
    this.muc.set('muc_log_cleanup_interval', 4 * 60 * 60)
  }

  setLog (level: ProsodyLogLevel, syslog?: ProsodyLogLevel[]): void {
    let log = ''
    log += 'log = {\n'
    log += '  ' + level + ' = ' + writeValue(this.paths.log)
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
    content += this.anon.write()
    content += '\n\n'
    content += this.muc.write()
    content += '\n\n'
    return content
  }
}

export {
  ProsodyConfigContent
}
