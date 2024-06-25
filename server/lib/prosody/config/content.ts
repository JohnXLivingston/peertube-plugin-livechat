// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ProsodyFilePaths } from './paths'
import type { ExternalComponent } from './components'
import { BotConfiguration } from '../../configuration/bot'
import { userInfo } from 'os'

/**
 * Use this class to construct a string that will be writen as a multiline Lua string.
 */
class ConfigEntryValueMultiLineString extends String {
  public serialize (): string {
    const s = this.toString()
    let i = 0
    // Lua multiline strings can be escaped by [[ ]], or [==[ ]==] with any number of =
    // http://lua-users.org/wiki/StringsTutorial
    // So, to have a proper value, we will check if the string contains [[ or ]],
    // and try again by adding "=" until we do not found the pattern.
    while (true) {
      const opening = '[' + '='.repeat(i) + '['
      const closing = ']' + '='.repeat(i) + ']'
      if (!s.includes(opening) && !s.includes(closing)) {
        break
      }
      i++
    }
    return '[' + '='.repeat(i) + '[' + s + ']' + '='.repeat(i) + ']'
  }
}

type ConfigEntryValue = boolean | number | string | ConfigEntryValueMultiLineString | ConfigEntryValue[]

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
  if (value instanceof ConfigEntryValueMultiLineString) {
    return value.serialize() + ';\n'
  }
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

  remove (name: string, value: ConfigEntryValue): void {
    if (!this.entries.has(name)) {
      return
    }
    let entry = this.entries.get(name) as ConfigEntryValue
    if (!Array.isArray(entry)) {
      entry = [entry]
    }
    entry = entry.filter(v => v !== value)
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

  override write (): string {
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

  override write (): string {
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
  external?: ProsodyConfigVirtualHost
  muc: ProsodyConfigComponent
  bot?: ProsodyConfigVirtualHost
  externalComponents: ProsodyConfigComponent[] = []
  log: string
  prosodyDomain: string

  constructor (paths: ProsodyFilePaths, prosodyDomain: string, chatTerms?: string) {
    this.paths = paths
    this.global = new ProsodyConfigGlobal()
    this.log = ''
    this.prosodyDomain = prosodyDomain
    this.muc = new ProsodyConfigComponent('room.' + prosodyDomain, 'muc')

    this.global.set('daemonize', false)
    this.global.set('allow_registration', false)
    this.global.set('admins', [])

    this.global.set('prosody_user', userInfo().username)

    this.global.set('pidfile', this.paths.pid)
    this.global.set('plugin_paths', [this.paths.modules])
    this.global.set('data_path', this.paths.data)
    // this.global.set('default_storage', 'internal') Not needed as storage is set to a string
    this.global.set('storage', 'internal')

    this.global.set('modules_enabled', [
      'roster', // Allow users to have a roster. Recommended ;)
      'saslauth', // Authentication for clients and servers. Recommended if you want to log in.
      'carbons', // Keep multiple clients in sync
      'version', // Replies to server version requests
      'uptime', // Report how long server has been running
      'ping', // Replies to XMPP pings with pongs
      // 'bosh', // Enable BOSH clients, aka "Jabber over HTTP"
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

    // this.global.set('cross_domain_bosh', false) No more needed with Prosody 0.12
    this.global.set('consider_bosh_secure', false)
    // this.global.set('cross_domain_websocket', false) No more needed with Prosody 0.12
    this.global.set('consider_websocket_secure', false)
    if (this.paths.certs) {
      this.global.set('certificates', this.paths.certs)
    }

    this.muc.set('admins', [])
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

    this.muc.add('modules_enabled', 'muc_slow_mode')
    this.muc.add('slow_mode_duration_form_position', 120)

    this.muc.add('modules_enabled', 'pubsub_peertubelivechat')
    this.muc.add('modules_enabled', 'muc_peertubelivechat_roles')

    this.muc.add('modules_enabled', 'muc_peertubelivechat_terms')
    this.muc.set('muc_terms_service_nickname', 'Peertube')
    if (chatTerms) {
      this.muc.set('muc_terms', new ConfigEntryValueMultiLineString(chatTerms))
    }
  }

  useAnonymous (autoBanIP: boolean): void {
    this.anon = new ProsodyConfigVirtualHost('anon.' + this.prosodyDomain)
    this.anon.set('authentication', 'anonymous')
    this.anon.set('modules_enabled', ['ping'])
    this.anon.set('modules_disabled', [
      'carbons' // carbon make no sense for anonymous users, they can't have multiple windows
    ])
    if (autoBanIP) {
      this.anon.add('modules_enabled', 'muc_ban_ip')
    }
  }

  /**
   * Activates the virtual host for external account authentication (OpenID Connect, ...)
   */
  useExternal (apikey: string): void {
    this.external = new ProsodyConfigVirtualHost('external.' + this.prosodyDomain)
    this.external.set('modules_enabled', [
      'ping',
      'http',
      'vcard',
      'http_peertubelivechat_manage_users'
    ])
    this.external.set('peertubelivechat_manage_users_apikey', apikey)
  }

  useHttpAuthentication (url: string): void {
    this.authenticated = new ProsodyConfigVirtualHost(this.prosodyDomain)

    this.authenticated.set('authentication', 'http')
    this.authenticated.set('modules_enabled', ['ping'])

    this.authenticated.set('http_auth_url', url)
  }

  /**
   * Activate BOSH (and optionnaly Websocket).
   * @param prosodyDomain prosody domain
   * @param port port to use for BOSH and Websocket interfaces
   * @param publicServerUrl public server url
   * @param useWS activate Websocket or not
   * @param multiplexing activate multiplexing on port. Note: it will only listen on localhost interfaces.
   */
  usePeertubeBoshAndWebsocket (
    prosodyDomain: string,
    port: string,
    publicServerUrl: string,
    useWS: boolean,
    multiplexing: boolean
  ): void {
    // Note: don't activate other http_interface or https_interfaces than localhost.
    // Elsewhere it would be a security issue.
    this.global.set('c2s_require_encryption', false)
    this.global.set('interfaces', ['127.0.0.1', '::1'])
    this.global.set('c2s_ports', [])
    this.global.set('c2s_interfaces', ['127.0.0.1', '::1'])
    this.global.set('s2s_ports', [])
    this.global.set('s2s_interfaces', ['127.0.0.1', '::1'])
    if (!multiplexing) {
      this.global.set('http_ports', [port])
    } else {
      // Note: don't activate other http_interface or https_interfaces than localhost.
      // Elsewhere it would be a security issue.
      this.global.add('modules_enabled', 'net_multiplex')
      this.global.set('ports', [port])
      // FIXME: this generates Prosody error logs saying that BOSH/Websocket won't work... even if it is not true.
      this.global.set('http_ports', [])
    }
    this.global.set('http_interfaces', ['127.0.0.1', '::1'])
    this.global.set('https_ports', [])
    this.global.set('https_interfaces', ['127.0.0.1', '::1'])
    this.global.set('trusted_proxies', ['127.0.0.1', '::1'])

    this.global.set('consider_bosh_secure', true)
    if (useWS) {
      this.global.set('consider_websocket_secure', true)
      // c2s_close_timeout must be set accordingly with ConverseJS ping_interval (25s) and nginx timeout (30s)
      this.global.set('c2s_close_timeout', 29)

      // This line seems to be required by Prosody, otherwise it rejects websocket...
      // this.global.set('cross_domain_websocket', [publicServerUrl])  No more needed with Prosody 0.12
    }

    if (this.anon) {
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
      this.authenticated.set('allow_anonymous_s2s', false)
      this.authenticated.add('modules_enabled', 'http')
      this.authenticated.add('modules_enabled', 'bosh')
      if (useWS) {
        this.authenticated.add('modules_enabled', 'websocket')
      }
      this.authenticated.set('http_host', prosodyDomain)
      this.authenticated.set('http_external_url', 'http://' + prosodyDomain)
    }

    if (this.external) {
      this.external.set('allow_anonymous_s2s', false)
      this.external.add('modules_enabled', 'http')
      this.external.add('modules_enabled', 'bosh')
      if (useWS) {
        this.external.add('modules_enabled', 'websocket')
      }
      this.external.set('http_host', prosodyDomain)
      this.external.set('http_external_url', 'http://' + prosodyDomain)
    }
  }

  useC2S (c2sPort: string, c2sInterfaces: string[]): void {
    this.global.set('c2s_ports', [c2sPort])
    this.global.set('c2s_interfaces', c2sInterfaces)
  }

  useS2S (
    s2sPort: string | null,
    s2sInterfaces: string[] | null,
    publicServerUrl: string,
    serverInfosDir: string
  ): void {
    if (s2sPort !== null) {
      this.global.set('s2s_ports', [s2sPort])
    } else {
      this.global.set('s2s_ports', [])
    }
    if (s2sInterfaces !== null) {
      this.global.set('s2s_interfaces', s2sInterfaces)
    } else {
      this.global.set('s2s_interfaces', [])
    }
    this.global.set('s2s_secure_auth', false)
    this.global.remove('modules_disabled', 's2s')
    this.global.add('modules_enabled', 's2s')
    this.global.add('modules_enabled', 'tls') // required for s2s and co

    this.global.add('modules_enabled', 's2s_peertubelivechat')
    this.global.set('peertubelivechat_server_infos_path', serverInfosDir)
    this.global.set('peertubelivechat_instance_url', publicServerUrl)

    this.global.add('modules_enabled', 'websocket_s2s_peertubelivechat')
    // Nginx closes the websockets connection after a timeout. Seems the default is 60s.
    // So we will ping on outgoing websocket s2s connection every 55s.
    this.global.set('websocket_s2s_ping_interval', 55)
    // FIXME: seems to be necessary to add the module on the muc host, so that dialback can trigger route/remote.
    this.muc.add('modules_enabled', 'websocket_s2s_peertubelivechat')

    // Using direct S2S for outgoing connection can be an issue, if the local instance dont allow incomming S2S.
    // Indeed, the remote instance will not necessarely be able to discover the Websocket Endpoint.
    // To be sure the remote instance knows the websocket endpoint, we must use Websocket for the firt outgoing connect.
    // So, we will add a parameter for mod_s2s_peertubelivechat, to tell him not to use outgoint s2s connection.
    this.global.set('s2s_peertubelivechat_no_outgoing_directs2s_to_peertube', s2sPort === null)

    this.muc.add('modules_enabled', 'dialback') // This allows s2s connections without certicicates!
    this.authenticated?.add('modules_enabled', 'dialback') // This allows s2s connections without certicicates!
    this.external?.add('modules_enabled', 'dialback') // same.
  }

  useExternalComponents (
    componentsPort: string,
    componentsInterfaces: string[] | null,
    components: ExternalComponent[]
  ): void {
    this.global.set('component_ports', [componentsPort])
    if (componentsInterfaces !== null) {
      this.global.set('component_interfaces', componentsInterfaces)
    } else {
      this.global.set('component_interfaces', [])
    }

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
    // NB: Prosody has a partial support of this feature in combination with «internal» storage
    // (Requires the `set` function in mod_storage_internal).
    // This was fixed in Prosody 0.12.x.
    this.muc.add('modules_enabled', 'muc_moderation')
  }

  /**
   * Rooms will be persistent by default (they will not be deleted if no participant).
   */
  useDefaultPersistent (): void {
    this.muc.set('muc_room_default_persistent', true)
  }

  useManageRoomsApi (apikey: string): void {
    this.muc.add('modules_enabled', 'http_peertubelivechat_manage_rooms')
    this.muc.set('peertubelivechat_manage_rooms_apikey', apikey)
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

  useAnonymousRandomVCards (avatarPath: string, avatarFiles: string[]): void {
    if (this.anon) {
      this.anon.add('modules_enabled', 'random_vcard_peertubelivechat')
      this.anon.set('peertubelivechat_random_vcard_avatars_path', avatarPath)
      this.anon.set('peertubelivechat_random_vcard_avatars_files', avatarFiles)
    }
  }

  /**
   * Enable the bots virtualhost.
   */
  useBotsVirtualHost (botAvatarPath: string, botAvatarFiles: string[]): void {
    this.bot = new ProsodyConfigVirtualHost('bot.' + this.prosodyDomain)
    this.bot.set('modules_enabled', ['ping'])
    this.bot.set('authentication', 'peertubelivechat_bot')

    // For now, just using random_vcard_peertubelivechat to set bot avatar
    this.bot.add('modules_enabled', 'random_vcard_peertubelivechat')
    this.bot.set('peertubelivechat_random_vcard_avatars_path', botAvatarPath)
    this.bot.set('peertubelivechat_random_vcard_avatars_files', botAvatarFiles)

    // Adding the moderation bot as admin to the muc component.
    this.muc.add('admins', BotConfiguration.singleton().moderationBotJID())

    const configurationPaths = BotConfiguration.singleton().configurationPaths()
    if (configurationPaths.moderation?.globalDir) {
      this.bot.set('livechat_bot_conf_folder', configurationPaths.moderation.globalDir)
    }
  }

  addMucAdmins (jids: string[]): void {
    for (const jid of jids) {
      this.muc.add('admins', jid)
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
    if (this.bot) {
      content += this.bot.write()
      content += '\n\n'
    }
    if (this.external) {
      content += this.external.write()
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
