import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ChannelConfigurationOptions } from '../../../../shared/lib/types'
import type { ChannelCommonRoomConf } from '../../configuration/bot'
import { RoomChannel } from '../../room-channel'
import { sanitizeChannelConfigurationOptions } from '../../configuration/channel/sanitize'
import * as fs from 'fs'
import * as path from 'path'

// FIXME: should be exported by xmppjs-chat-bot
type ConfigHandlers = ChannelCommonRoomConf['handlers']
type ConfigHandler = ConfigHandlers[0]

/**
 * Get saved configuration options for the given channel.
 * Can throw an exception.
 * @param options Peertube server options
 * @param channelInfos Info from channel from which we want to get infos
 * @returns Channel configuration data, or null if nothing is stored
 */
async function getChannelConfigurationOptions (
  options: RegisterServerOptions,
  channelId: number | string
): Promise<ChannelConfigurationOptions | null> {
  const logger = options.peertubeHelpers.logger
  const filePath = _getFilePath(options, channelId)
  if (!fs.existsSync(filePath)) {
    logger.debug('No stored data for channel, returning default values')
    return null
  }
  const content = await fs.promises.readFile(filePath, {
    encoding: 'utf-8'
  })
  const sanitized = await sanitizeChannelConfigurationOptions(options, channelId, JSON.parse(content))
  return sanitized
}

function getDefaultChannelConfigurationOptions (_options: RegisterServerOptions): ChannelConfigurationOptions {
  return {
    bot: false,
    botNickname: 'Sepia',
    bannedJIDs: [],
    forbiddenWords: []
  }
}

/**
 * Save channel configuration options.
 * Can throw an exception.
 * @param options Peertube server options
 * @param ChannelConfigurationOptions data to save
 */
async function storeChannelConfigurationOptions (
  options: RegisterServerOptions,
  channelId: number | string,
  channelConfigurationOptions: ChannelConfigurationOptions
): Promise<void> {
  const filePath = _getFilePath(options, channelId)

  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const jsonContent = JSON.stringify(channelConfigurationOptions)

  await fs.promises.writeFile(filePath, jsonContent, {
    encoding: 'utf-8'
  })

  RoomChannel.singleton().refreshChannelConfigurationOptions(channelId)
}

/**
 * Converts the channel configuration to the bot room configuration object (minus the room JID and domain)
 * @param options server options
 * @param channelConfigurationOptions The channel configuration
 * @returns Partial bot room configuration
 */
function channelConfigurationOptionsToBotRoomConf (
  options: RegisterServerOptions,
  channelConfigurationOptions: ChannelConfigurationOptions
): ChannelCommonRoomConf {
  // Note concerning handlers:
  // If we want the bot to correctly enable/disable the handlers,
  // we must always define all handlers, even if not used.
  const handlers: ConfigHandlers = []
  handlers.push(_getForbiddenWordsHandler(
    'forbidden_words_0',
    channelConfigurationOptions.forbiddenWords
  ))

  const roomConf: ChannelCommonRoomConf = {
    enabled: channelConfigurationOptions.bot,
    handlers
  }
  if (channelConfigurationOptions.botNickname && channelConfigurationOptions.botNickname !== '') {
    roomConf.nick = channelConfigurationOptions.botNickname
  }
  return roomConf
}

function _getForbiddenWordsHandler (
  id: string,
  forbiddenWords: string[],
  reason?: string
): ConfigHandler {
  const handler: ConfigHandler = {
    type: 'moderate',
    id,
    enabled: false,
    options: {
      rules: []
    }
  }
  if (forbiddenWords.length === 0) {
    return handler
  }

  handler.enabled = true
  // Note: on the Peertube frontend, channelConfigurationOptions.forbiddenWords
  // is an array of RegExp definition (strings).
  // They are validated one by bone.
  // To increase the bot performance, we will join them all (hopping the bot will optimize them).
  const rule: any = {
    name: id,
    regexp: '(?:' + forbiddenWords.join(')|(?:') + ')'
  }
  if (reason) {
    rule.reason = reason
  }
  handler.options.rules.push(rule)
  return handler
}

function _getFilePath (
  options: RegisterServerOptions,
  channelId: number | string
): string {
  // some sanitization, just in case...
  channelId = parseInt(channelId.toString())
  if (isNaN(channelId)) {
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
  getDefaultChannelConfigurationOptions,
  channelConfigurationOptionsToBotRoomConf,
  storeChannelConfigurationOptions
}
