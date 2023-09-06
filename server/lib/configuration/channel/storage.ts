import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ChannelConfiguration, ChannelInfos } from '../../../../shared/lib/types'
import { sanitizeChannelConfigurationOptions } from '../../configuration/channel/sanitize'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Get saved configuration options for the given channel.
 * Can throw an exception.
 * @param options Peertube server options
 * @param channelInfos Info from channel from which we want to get infos
 * @returns Channel configuration data
 */
async function getChannelConfigurationOptions (
  options: RegisterServerOptions,
  channelInfos: ChannelInfos
): Promise<ChannelConfiguration> {
  const logger = options.peertubeHelpers.logger
  const filePath = _getFilePath(options, channelInfos)
  if (!fs.existsSync(filePath)) {
    logger.debug('No stored data for channel, returning default values')
    return {
      channel: channelInfos,
      configuration: {
        bot: false,
        bannedJIDs: [],
        forbiddenWords: []
      }
    }
  }
  const content = await fs.promises.readFile(filePath, {
    encoding: 'utf-8'
  })
  const sanitized = await sanitizeChannelConfigurationOptions(options, channelInfos, JSON.parse(content))
  return {
    channel: channelInfos,
    configuration: sanitized
  }
}

/**
 * Save channel configuration options.
 * Can throw an exception.
 * @param options Peertube server options
 * @param channelConfiguration data to save
 */
async function storeChannelConfigurationOptions (
  options: RegisterServerOptions,
  channelConfiguration: ChannelConfiguration
): Promise<void> {
  const channelInfos = channelConfiguration.channel
  const filePath = _getFilePath(options, channelInfos)

  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const jsonContent = JSON.stringify(channelConfiguration.configuration)

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
    'channelConfigurationOptions',
    channelId.toString() + '.json'
  )
}

export {
  getChannelConfigurationOptions,
  storeChannelConfigurationOptions
}
