import type { RegisterServerOptions } from '@peertube/peertube-types'
import { getProsodyDomain } from '../prosody/config/domain'
import * as path from 'path'
import * as fs from 'fs'

let singleton: RoomChannel | undefined

/**
 * Class used to request some informations about relation between rooms and channels.
 */
class RoomChannel {
  protected readonly options: RegisterServerOptions
  protected readonly prosodyDomain: string
  protected readonly dataFilePath: string
  protected readonly logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  protected room2Channel: Map<string, number> = new Map<string, number>()
  protected channel2Rooms: Map<number, Map<string, true>> = new Map<number, Map<string, true>>()

  constructor (params: {
    options: RegisterServerOptions
    prosodyDomain: string
    dataFilePath: string
  }) {
    this.options = params.options
    this.prosodyDomain = params.prosodyDomain
    this.dataFilePath = params.dataFilePath

    const logger = params.options.peertubeHelpers.logger
    this.logger = {
      debug: (s) => logger.debug('[RoomChannel] ' + s),
      info: (s) => logger.info('[RoomChannel] ' + s),
      warn: (s) => logger.warn('[RoomChannel] ' + s),
      error: (s) => logger.error('[RoomChannel] ' + s)
    }
  }

  /**
   * Instanciate the singleton
   */
  public static async initSingleton (options: RegisterServerOptions): Promise<RoomChannel> {
    const prosodyDomain = await getProsodyDomain(options)
    const dataFilePath = path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'room-channel',
      prosodyDomain + '.json'
    )

    singleton = new RoomChannel({
      options,
      prosodyDomain,
      dataFilePath
    })

    return singleton
  }

  /**
   * frees the singleton
   */
  public static async destroySingleton (): Promise<void> {
    if (!singleton) { return }
    await singleton.sync()
    singleton = undefined
  }

  /**
   * Gets the singleton, or raise an exception if it is too soon.
   * @returns the singleton
   */
  public static singleton (): RoomChannel {
    if (!singleton) {
      throw new Error('RoomChannel singleton is not initialized yet')
    }
    return singleton
  }

  /**
   * Reads data from the room-channel data file.
   * @return Returns true if the data where found and valid. If there is no data (or no valid data), returns false.
   */
  public async readData (): Promise<boolean> {
    // Reading the data file (see https://livingston.frama.io/peertube-plugin-livechat/fr/technical/data/)

    let content: string
    try {
      content = (await fs.promises.readFile(this.dataFilePath)).toString()
    } catch (err) {
      this.logger.info('Failed reading room-channel data file (' + this.dataFilePath + '), assuming it does not exists')
      return false
    }
    content ??= '{}'

    let data: any
    try {
      data = JSON.parse(content)
    } catch (err) {
      this.logger.error('Unable to parse the content of the room-channel data file, will start with an empty database.')
      return false
    }

    // This part must be done atomicly:
    return this._readData(data)
  }

  /**
   * _readData is the atomic part of readData:
   * once the date are read from disk, object data must be emptied and filled atomicly.
   */
  protected _readData (data: any): boolean {
    this.room2Channel.clear()
    this.channel2Rooms.clear()

    if (typeof data !== 'object') {
      this.logger.error('Invalid room-channel data file content')
      return false
    }

    for (const k in data) {
      if (!/^\d+$/.test(k)) {
        this.logger.error('Invalid channel ID type, should be a number, dropping')
        continue
      }
      const channelId = parseInt(k)
      const rooms = data[k]
      if (!Array.isArray(rooms)) {
        this.logger.error('Invalid room list for Channel ' + channelId.toString() + ', dropping')
        continue
      }

      const c2r = new Map<string, true>()
      this.channel2Rooms.set(channelId, c2r)

      for (const jid of rooms) {
        if (typeof jid !== 'string') {
          this.logger.error('Invalid room jid for Channel ' + channelId.toString() + ', dropping')
          continue
        }
        c2r.set(jid, true)
        this.room2Channel.set(jid, channelId)
      }
    }

    return true
  }

  /**
   * Rebuilt the data from scratch.
   * Can be used for the initial migration.
   */
  public async rebuildData (): Promise<void> {
    this.logger.error('rebuildData Not implemented yet')
    await this.sync() // FIXME: or maybe scheduleSync ?
  }

  /**
   * Syncs data to disk.
   */
  public async sync (): Promise<void> {
    this.logger.error('sync Not implemented yet')
  }

  /**
   * Schedules a sync.
   * Each times data are modified, we can schedule a sync, but we don't have to wait the file writing to be done.
   */
  public scheduleSync (): void {
    this.logger.error('scheduleSync Not implemented yet')
  }

  /**
   * Sets a relation between room and channel id
   * @param channelId The channel ID
   * @param roomJID The room JID. Can be the local part only, or the full JID.
   *                In the second case, the domain will be checked.
   */
  public link (channelId: number | string, roomJIDParam: string): void {
    channelId = parseInt(channelId.toString())
    if (isNaN(channelId)) {
      this.logger.error('Invalid channelId, we wont link')
      return
    }

    const roomJID = this._canonicJID(roomJIDParam)
    if (!roomJID) {
      this.logger.error('Invalid room JID, we wont link')
      return
    }

    // First, if the room was linked to another channel, we must unlink.
    const previousChannelId = this.room2Channel.get(roomJID)
    if (previousChannelId) {
      this.room2Channel.delete(roomJID)
      const previousRooms = this.channel2Rooms.get(previousChannelId)
      if (previousRooms) {
        previousRooms.delete(roomJID)
      }
    }

    this.room2Channel.set(roomJID, channelId)
    let rooms = this.channel2Rooms.get(channelId)
    if (!rooms) {
      rooms = new Map<string, true>()
      this.channel2Rooms.set(channelId, rooms)
    }
    rooms.set(roomJID, true)

    this.scheduleSync()
  }

  /**
   * Removes all relations for this room
   * @param roomJID the room JID
   */
  public removeRoom (roomJIDParam: string): void {
    const roomJID = this._canonicJID(roomJIDParam)
    if (!roomJID) {
      this.logger.error('Invalid room JID, we wont link')
      return
    }

    const channelId = this.room2Channel.get(roomJID)
    if (channelId) {
      const rooms = this.channel2Rooms.get(channelId)
      if (rooms) {
        rooms.delete(roomJID)
      }
    }

    this.room2Channel.delete(roomJID)

    this.scheduleSync()
  }

  /**
   * Removes all relations for this channel
   * @param channelId the channel id
   */
  public removeChannel (channelId: number | string): void {
    channelId = parseInt(channelId.toString())
    if (isNaN(channelId)) {
      this.logger.error('Invalid channelId, we wont remove')
      return
    }

    const rooms = this.channel2Rooms.get(channelId)
    if (rooms) {
      for (const jid of rooms.keys()) {
        // checking the consistency... only removing if the channel is the current one
        if (this.room2Channel.get(jid) === channelId) {
          this.room2Channel.delete(jid)
        }
      }
    }

    this.channel2Rooms.delete(channelId)

    this.scheduleSync()
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
  RoomChannel
}

// TODO: schedule rebuild every X hours/days
// TODO: write to disk, debouncing writes
// TODO: only write if there is data changes
