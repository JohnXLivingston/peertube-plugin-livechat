import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ChannelModeration, ChannelInfos } from '../../../../shared/lib/types'
import { sanitizeChannelModerationOptions } from '../../moderation/channel/sanitize'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Get saved moderation options for the given channel.
 * Can throw an exception.
 * @param options Peertube server options
 * @param channelInfos Info from channel from which we want to get infos
 * @returns Channel moderation data
 */
async function getChannelModerationOptions (
  options: RegisterServerOptions,
  channelInfos: ChannelInfos
): Promise<ChannelModeration> {
  const logger = options.peertubeHelpers.logger
  const filePath = _getFilePath(options, channelInfos)
  if (!fs.existsSync(filePath)) {
    logger.debug('No stored data for channel, returning default values')
    return {
      channel: channelInfos,
      moderation: {
        bot: false,
        bannedJIDs: [],
        forbiddenWords: []
      }
    }
  }
  const content = await fs.promises.readFile(filePath, {
    encoding: 'utf-8'
  })
  const sanitized = await sanitizeChannelModerationOptions(options, channelInfos, JSON.parse(content))
  return {
    channel: channelInfos,
    moderation: sanitized
  }
}

/**
 * Save channel moderation options.
 * Can throw an exception.
 * @param _options Peertube server options
 * @param _channelModeration data to save
 */
async function storeChannelModerationOptions (
  options: RegisterServerOptions,
  channelModeration: ChannelModeration
): Promise<void> {
  const channelInfos = channelModeration.channel
  const filePath = _getFilePath(options, channelInfos)

  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const jsonContent = JSON.stringify(channelModeration.moderation)

  await fs.promises.writeFile(filePath, jsonContent, {
    encoding: 'utf-8'
  })
}

function _getFilePath (
  options: RegisterServerOptions,
  channelInfos: ChannelInfos
): string {
  const channelId = channelInfos.id
  // some sanitization, just in case...
  if (!/^\d+$/.test(channelId.toString())) {
    throw new Error(`Invalid channelId: ${channelId}`)
  }

  return path.resolve(
    options.peertubeHelpers.plugin.getDataDirectoryPath(),
    'channelModerationOptions',
    channelId.toString() + '.json'
  )
}

export {
  getChannelModerationOptions,
  storeChannelModerationOptions
}
