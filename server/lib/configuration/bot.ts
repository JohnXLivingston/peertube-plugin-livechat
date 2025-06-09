// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { RoomConf, Config } from 'xmppjs-chat-bot'
import { getProsodyDomain } from '../prosody/config/domain'
import { isDebugMode } from '../debug'
import * as path from 'path'
import * as fs from 'fs'

let singleton: BotConfiguration | undefined

type RoomConfCache =
  null // already loaded, but file does not exist
    | RoomConf // loaded, and contains the room conf

type ChannelCommonRoomConf = Omit<RoomConf, 'local' | 'domain'>

/**
 * Handles Bot configuration files.
 */
class BotConfiguration {
  protected readonly options: RegisterServerOptions
  protected readonly mucDomain: string
  protected readonly botsDomain: string
  protected readonly confDir: string
  protected readonly roomConfDir: string
  protected readonly moderationBotGlobalConf: string
  protected readonly logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  protected readonly roomConfCache: Map<string, RoomConfCache> = new Map<string, RoomConfCache>()

  constructor (params: {
    options: RegisterServerOptions
    mucDomain: string
    botsDomain: string
    confDir: string
    roomConfDir: string
    moderationBotGlobalConf: string
  }) {
    this.options = params.options
    this.mucDomain = params.mucDomain
    this.botsDomain = params.botsDomain
    this.confDir = params.confDir
    this.roomConfDir = params.roomConfDir
    this.moderationBotGlobalConf = params.moderationBotGlobalConf

    const logger = params.options.peertubeHelpers.logger
    this.logger = {
      debug: (s) => logger.debug('[BotConfiguration] ' + s),
      info: (s) => logger.info('[BotConfiguration] ' + s),
      warn: (s) => logger.warn('[BotConfiguration] ' + s),
      error: (s) => logger.error('[BotConfiguration] ' + s)
    }
  }

  /**
   * Instanciate the BotConfiguration singleton
   */
  public static async initSingleton (options: RegisterServerOptions): Promise<BotConfiguration> {
    const prosodyDomain = await getProsodyDomain(options)
    const mucDomain = 'room.' + prosodyDomain
    const botsDomain = 'bot.' + prosodyDomain
    const confDir = path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'bot',
      mucDomain
    )

    const roomConfDir = path.resolve(
      confDir,
      'rooms'
    )
    const moderationBotGlobalConf = path.resolve(
      confDir,
      'moderation.json'
    )

    await fs.promises.mkdir(confDir, { recursive: true })
    await fs.promises.mkdir(roomConfDir, { recursive: true })

    singleton = new BotConfiguration({
      options,
      mucDomain,
      botsDomain,
      confDir,
      roomConfDir,
      moderationBotGlobalConf
    })

    return singleton
  }

  /**
   * Returns the singleton, of thrown an exception if it is not initialized yet.
   */
  public static singleton (): BotConfiguration {
    if (!singleton) {
      throw new Error('BotConfiguration singleton not initialized yet')
    }
    return singleton
  }

  /**
   * Get the current room conf content.
   * @param roomJIDParam room JID (local or full)
   * @returns the room conf, or null if does not exist
   */
  public async getRoom (roomJIDParam: string): Promise<ChannelCommonRoomConf | null> {
    const roomJID = this._canonicJID(roomJIDParam)
    if (!roomJID) {
      this.logger.error('Invalid room JID')
      return null
    }
    const conf = await this._getRoomConf(roomJID)
    return conf
  }

  /**
   * Update the bot configuration for a given room.
   * @param roomJIDParam Room full or local JID
   * @param conf Configuration to write
   */
  public async updateRoom (roomJIDParam: string, conf: ChannelCommonRoomConf): Promise<void> {
    const roomJID = this._canonicJID(roomJIDParam)
    if (!roomJID) {
      this.logger.error('Invalid room JID')
      return
    }

    const roomConf: RoomConf = Object.assign({
      local: roomJID,
      domain: this.mucDomain
    }, conf)

    if (!(roomConf.enabled ?? true)) {
      // Bot disabled... If the room config file does not exist, no need to create
      const current = await this._getRoomConf(roomJID)
      if (!current) {
        this.logger.debug(`Bot is disabled for room ${roomJID}, and room has not current conf, skipping`)
        return
      }
    }

    this.logger.debug(`Setting and writing a new conf for room ${roomJID}`)
    this.roomConfCache.set(roomJID, roomConf)
    await this._writeRoomConf(roomJID)
  }

  /**
   * Disable the bot for the room.
   * Can be used when a video/channel is deleted, for example.
   * @param roomJIDParam Room JID (can be local part only, or full JID)
   */
  public async disableRoom (roomJIDParam: string): Promise<void> {
    const roomJID = this._canonicJID(roomJIDParam)
    if (!roomJID) {
      this.logger.error('Invalid room JID')
      return
    }

    const conf = await this._getRoomConf(roomJID)
    if (!conf) {
      // no conf, so nothing to write.
      return
    }

    conf.enabled = false
    await this._writeRoomConf(roomJID)
  }

  /**
   * Returns the moderation bot global configuration.
   * It it does not exists, creates it.
   * @param forceRefresh if true, regenerates the configuration file, even if exists.
   */
  public async getModerationBotGlobalConf (forceRefresh?: boolean): Promise<Config> {
    let config: Config | undefined
    if (!forceRefresh) {
      try {
        const content = (await fs.promises.readFile(this.moderationBotGlobalConf, {
          encoding: 'utf-8'
        })).toString()

        config = JSON.parse(content)
      } catch (_err) {
        this.logger.info('Error reading the moderation bot global configuration file, assuming it does not exists.')
        config = undefined
      }
    }

    if (!config) {
      // FIXME: use existing lib to get the port, dont hardcode default value here.
      const portSetting = await this.options.settingsManager.getSetting('prosody-port')
      const port = (portSetting as string) || '52800'

      config = {
        type: 'client',
        connection: {
          username: 'moderator',
          password: Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12),
          domain: this.botsDomain,
          // Note: using localhost, and not currentProsody.host, because it does not always resolve correctly
          service: 'xmpp://localhost:' + port
        },
        name: 'Sepia',
        logger: 'ConsoleLogger',
        log_level: isDebugMode(this.options) ? 'debug' : 'info'
      }
      await fs.promises.writeFile(this.moderationBotGlobalConf, JSON.stringify(config), {
        encoding: 'utf-8'
      })
    }
    return config
  }

  public configurationPaths (): {
    moderation: {
      globalFile: string
      globalDir: string
      roomConfDir: string
    }
  } {
    return {
      moderation: {
        globalFile: this.moderationBotGlobalConf,
        globalDir: this.confDir,
        roomConfDir: this.roomConfDir
      }
    }
  }

  /**
   * Returns the moderation bot JID
   */
  public moderationBotJID (): string {
    return 'moderator@' + this.botsDomain
  }

  /**
   * frees the singleton
   */
  public static async destroySingleton (): Promise<void> {
    if (!singleton) { return }
    singleton = undefined
  }

  /**
   * Get the room conf.
   * Note: the returned object is not cloned. So it can be modified
   *  (and that's one reason why this is a protected method)
   * The other reason why it is protected, is because it assumes roomJID is already canonical.
   * @param roomJID room JID, canonic form
   * @returns the room conf, or null if does not exists
   */
  protected async _getRoomConf (roomJID: string): Promise<RoomConf | null> {
    const cached = this.roomConfCache.get(roomJID)
    if (cached !== undefined) {
      return cached
    }

    const filePath = path.resolve(
      this.roomConfDir,
      roomJID + '.json'
    )

    let content: string
    try {
      content = (await fs.promises.readFile(filePath, {
        encoding: 'utf-8'
      })).toString()
    } catch (_err) {
      this.logger.debug('Failed to read room conf file, assuming it does not exists')
      this.roomConfCache.set(roomJID, null)
      return null
    }

    let json: RoomConf
    try {
      json = JSON.parse(content) as RoomConf
    } catch (_err) {
      this.logger.error(`Error parsing JSON file ${filePath}, assuming empty`)
      this.roomConfCache.set(roomJID, null)
      return null
    }

    this.roomConfCache.set(roomJID, json)
    return json
  }

  protected async _writeRoomConf (roomJID: string): Promise<void> {
    const conf = this.roomConfCache.get(roomJID)
    if (!conf) {
      throw new Error(`No conf for room ${roomJID}, cant write it`)
    }

    const filePath = path.resolve(
      this.roomConfDir,
      roomJID + '.json'
    )

    await fs.promises.writeFile(filePath, JSON.stringify(conf), {
      encoding: 'utf-8'
    })
  }

  protected _canonicJID (roomJID: string): string | null {
    const splits = roomJID.split('@')
    if (splits.length < 2) {
      return roomJID
    }
    if (splits.length > 2) {
      this.logger.error('The room JID contains multiple @, not valid')
      return null
    }
    if (splits[1] !== this.mucDomain) {
      this.logger.error('The room JID is not on the correct domain')
      return null
    }

    return splits[0]
  }
}

export {
  BotConfiguration,
  ChannelCommonRoomConf
}
