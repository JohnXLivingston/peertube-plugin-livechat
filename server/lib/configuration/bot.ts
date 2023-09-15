import type { RegisterServerOptions } from '@peertube/peertube-types'
import { RoomConf } from 'xmppjs-chat-bot'
import { getProsodyDomain } from '../prosody/config/domain'
import { RoomChannel } from '../room-channel'
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
  protected readonly prosodyDomain: string
  protected readonly confDir: string
  protected readonly roomConfDir: string
  protected readonly logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  protected readonly roomConfCache: Map<string, RoomConfCache> = new Map<string, RoomConfCache>()

  constructor (params: {
    options: RegisterServerOptions
    prosodyDomain: string
    confDir: string
    roomConfDir: string
  }) {
    this.options = params.options
    this.prosodyDomain = params.prosodyDomain
    this.confDir = params.confDir
    this.roomConfDir = params.roomConfDir

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
    const confDir = path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'bot',
      prosodyDomain
    )
    const roomConfDir = path.resolve(
      confDir,
      'rooms'
    )

    await fs.promises.mkdir(confDir, { recursive: true })
    await fs.promises.mkdir(roomConfDir, { recursive: true })

    singleton = new BotConfiguration({
      options,
      prosodyDomain,
      confDir,
      roomConfDir
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
   * Recompute the room configuration, and save it to disk.
   * @param roomJIDParam room JID (local part only, or full JID)
   */
  public async updateChannelConf (channelId: number | string, conf: ChannelCommonRoomConf): Promise<void> {
    const jids = RoomChannel.singleton().getChannelRoomJIDs(channelId)

    // cloning to avoid issues:
    const roomConf: RoomConf = JSON.parse(JSON.stringify(conf))
    roomConf.domain = this.prosodyDomain

    for (const jid of jids) {
      roomConf.local = jid

      if (!(roomConf.enabled ?? true)) {
        // Bot disabled... If the room config file does not exist, no need to create
        const current = await this._getRoomConf(jid)
        if (!current) {
          this.logger.debug(`Bot is disabled for channel ${channelId}, room ${jid} has not current conf, skipping`)
          return
        }
      }
      this.roomConfCache.set(jid, roomConf)
      await this._writeRoomConf(jid)
    }
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
    } catch (err) {
      this.logger.debug('Failed to read room conf file, assuming it does not exists')
      this.roomConfCache.set(roomJID, null)
      return null
    }

    let json: RoomConf
    try {
      json = JSON.parse(content) as RoomConf
    } catch (err) {
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
    if (splits[1] !== this.prosodyDomain) {
      this.logger.error('The room JID is not on the correct domain')
      return null
    }

    return splits[0]
  }
}

export {
  BotConfiguration
}
