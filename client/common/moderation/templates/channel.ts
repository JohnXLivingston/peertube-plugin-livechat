import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelModerationOptions } from 'shared/lib/types'
import { getBaseRoute } from '../../../videowatch/uri'
// Must use require for mustache, import seems buggy.
const Mustache = require('mustache')

/**
 * Renders the moderation settings page for a given channel.
 * @param registerClientOptions Peertube client options
 * @param channelId The channel id
 * @returns The page content
 */
async function renderModerationChannel (
  registerClientOptions: RegisterClientOptions,
  channelId: string
): Promise<string> {
  const { peertubeHelpers } = registerClientOptions

  try {
    if (!channelId || !/^\d+$/.test(channelId)) {
      throw new Error('Missing or invalid channel id.')
    }

    const channelModerationOptions: ChannelModerationOptions = await (await fetch(
      getBaseRoute(registerClientOptions) + '/api/moderation/channel/' + encodeURIComponent(channelId),
      {
        method: 'GET',
        headers: peertubeHelpers.getAuthHeader()
      }
    )).json()

    // Basic testing that channelModerationOptions has the correct format
    if ((typeof channelModerationOptions !== 'object') || !channelModerationOptions.channel) {
      throw new Error('Can\'t get channel moderation options.')
    }

    const view = {
      title:
        await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_TITLE) +
        ' ' + channelModerationOptions.channel.displayName,
      description: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_DESC)
    }

    return Mustache.render(`
      <div class="margin-content">
        <h1>{{title}}</h1>
        <p>{{description}}</p>
      </div>
    `, view) as string
  } catch (err: any) {
    peertubeHelpers.notifier.error(err.toString())
    return ''
  }
}

export {
  renderModerationChannel
}
