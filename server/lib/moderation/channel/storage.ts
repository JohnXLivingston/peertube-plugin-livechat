import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ChannelModeration, ChannelInfos } from '../../../../shared/lib/types'

async function getChannelModerationOptions (
  options: RegisterServerOptions,
  channelInfos: ChannelInfos
): Promise<ChannelModeration> {
  return {
    channel: channelInfos,
    moderation: {
      bot: false,
      bannedJIDs: [],
      forbiddenWords: []
    }
  }
}

async function storeChannelModerationOptions (
  _options: RegisterServerOptions,
  _channelModeration: ChannelModeration
): Promise<void> {
  throw new Error('Not implemented yet')
}

export {
  getChannelModerationOptions,
  storeChannelModerationOptions
}
