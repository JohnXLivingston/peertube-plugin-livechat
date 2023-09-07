import { RegisterServerOptions } from '@peertube/peertube-types'
import { getProsodyDomain } from '../prosody/config/domain'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Stores that given room is related to given channel.
 * Can throw an exception.
 * @param options server options
 * @param channelId channel ID
 * @param roomJIDLocalPart room JID (only the local part)
 */
async function setChannel2Room (
  options: RegisterServerOptions,
  channelId: number,
  roomJIDLocalPart: string
): Promise<void> {
  const logger = options.peertubeHelpers.logger
  logger.info(`Calling setChannel2Room for channel ${channelId} and room ${roomJIDLocalPart}...`)

  _checkParameters(channelId, roomJIDLocalPart)

  const prosodyDomain = await getProsodyDomain(options)

  {
    const [channel2roomDir, channel2room] = await _getFilePath(
      options, channelId, roomJIDLocalPart, prosodyDomain, 'channel2room'
    )
    await fs.promises.mkdir(channel2roomDir, {
      recursive: true
    })
    await fs.promises.writeFile(
      channel2room,
      ''
    )
  }

  {
    const [room2channelDir, room2channel, room2channelFile] = await _getFilePath(
      options, channelId, roomJIDLocalPart, prosodyDomain, 'room2channel'
    )
    await fs.promises.mkdir(room2channelDir, {
      recursive: true
    })

    // The video's channel could have changed. We must delete any deprecated file.
    const previousFiles = await fs.promises.readdir(room2channelDir)
    for (const filename of previousFiles) {
      if (filename !== room2channelFile) {
        const p = path.resolve(room2channelDir, filename)
        logger.info('Cleaning a deprecated room2channelFile: ' + p)
        await fs.promises.unlink(p)
      }
    }

    await fs.promises.writeFile(
      room2channel,
      ''
    )
  }
}

function _checkParameters (channelId: number | string, roomJIDLocalPart: string): void {
  channelId = channelId.toString()
  if (!/^\d+$/.test(channelId)) {
    throw new Error(`Invalid Channel ID: ${channelId}`)
  }

  if (!/^[\w-.]+$/.test(roomJIDLocalPart)) { // channel.X or video uuid
    throw new Error(`Invalid ROOM JID: ${channelId}`)
  }
}

async function _getFilePath (
  options: RegisterServerOptions,
  channelId: number | string,
  roomJIDLocalPart: string,
  prosodyDomain: string,
  way: 'channel2room' | 'room2channel'
): Promise<[string, string, string]> {
  channelId = channelId.toString()

  const roomJID = roomJIDLocalPart + '@' + prosodyDomain

  if (way === 'channel2room') {
    const dir = path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'channel2room',
      channelId
    )
    return [
      dir,
      path.resolve(dir, roomJID),
      roomJID
    ]
  } else if (way === 'room2channel') {
    const dir = path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'room2channel',
      roomJID
    )
    return [
      dir,
      path.resolve(dir, channelId),
      channelId
    ]
  } else {
    throw new Error('Invalid way parameter')
  }
}

export {
  setChannel2Room
}
