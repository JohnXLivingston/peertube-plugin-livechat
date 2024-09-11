// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { listProsodyRooms, updateProsodyRoom } from '../api/manage-rooms'
import * as path from 'path'
import * as fs from 'fs'
import { Emojis } from '../../emojis'

/**
 * Livechat v12.0.0: we must send channel custom emojis regexp to Prosody.
 *
 * This script will only be launched one time.
 */
async function updateProsodyChannelEmojisRegex (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger

  // First, detect if we already run this script.
  const doneFilePath = path.resolve(options.peertubeHelpers.plugin.getDataDirectoryPath(), 'fix-v11.1-emojis')
  if (fs.existsSync(doneFilePath)) {
    logger.debug('[migratev11_1_ChannelEmojis] Channel Emojis Regex already updated on Prosody.')
    return
  }

  logger.info('[migratev11_1_ChannelEmojis] Updating Channel custom emojis regexp on Prosody')

  const emojis = Emojis.singleton()
  const rooms = await listProsodyRooms(options)
  logger.debug('[migratev11_1_ChannelEmojis] Found ' + rooms.length.toString() + ' rooms.')

  for (const room of rooms) {
    try {
      let channelId: number
      logger.info('[migratev11_1_ChannelEmojis] Must update custom emojis regexp for room ' + room.localpart)
      const matches = room.localpart.match(/^channel\.(\d+)$/)
      if (matches?.[1]) {
        // room associated to a channel
        channelId = parseInt(matches[1])
      } else {
        // room associated to a video
        const video = await options.peertubeHelpers.videos.loadByIdOrUUID(room.localpart)
        if (!video || video.remote) {
          logger.info('[migratev11_1_ChannelEmojis] Video ' + room.localpart + ' not found or remote, skipping')
          continue
        }
        channelId = video.channelId
      }

      if (!channelId) {
        throw new Error('Cant find channelId')
      }

      const regexp = await emojis.getChannelCustomEmojisRegexp(channelId)
      if (regexp === undefined) {
        logger.info('[migratev11_1_ChannelEmojis] Room ' + room.localpart + ' channel has no custom emojis, skipping.')
        continue
      }

      await updateProsodyRoom(options, room.jid, {
        livechat_custom_emoji_regexp: regexp
      })
    } catch (err) {
      logger.error(
        '[migratev11_1_ChannelEmojis] Failed to handle room ' + room.localpart + ', skipping. Error: ' + (err as string)
      )
      continue
    }
  }

  await fs.promises.writeFile(doneFilePath, '')
}

export {
  updateProsodyChannelEmojisRegex
}
