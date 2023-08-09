import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelModeration } from 'shared/lib/types'
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
): Promise<string | false> {
  const { peertubeHelpers } = registerClientOptions

  try {
    if (!channelId || !/^\d+$/.test(channelId)) {
      throw new Error('Missing or invalid channel id.')
    }

    const response = await fetch(
      getBaseRoute(registerClientOptions) + '/api/moderation/channel/' + encodeURIComponent(channelId),
      {
        method: 'GET',
        headers: peertubeHelpers.getAuthHeader()
      }
    )
    if (!response.ok) {
      throw new Error('Can\'t get channel moderation options.')
    }
    const channelModeration: ChannelModeration = await (response).json()

    // Basic testing that channelModeration has the correct format
    if ((typeof channelModeration !== 'object') || !channelModeration.channel) {
      throw new Error('Invalid channel moderation options.')
    }

    const view = {
      title: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_TITLE),
      description: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_DESC),
      enableBot: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_ENABLE_BOT_LABEL),
      botOptions: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_BOT_OPTIONS_TITLE),
      forbiddenWords: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_FORBIDDEN_WORDS_LABEL),
      bannedJIDs: await peertubeHelpers.translate(LOC_LIVECHAT_MODERATION_CHANNEL_BANNED_JIDS_LABEL),
      save: await peertubeHelpers.translate(LOC_SAVE),
      cancel: await peertubeHelpers.translate(LOC_CANCEL),
      channelModeration
    }

    return Mustache.render(`
      <div class="margin-content">
        <h1>{{title}} {{channelModeration.moderation.channel.displayName}}</h1>
        <p>{{description}}</p>
        <form livechat-moderation-channel-options>
          <fieldset>
            <label>
              <input
                type="checkbox" name="bot"
                value="1"
                {{#channelModeration.moderation.bot}} checked="checked" {{/channelModeration.moderation.bot}}
              />
              {{enableBot}}
            </label>
          </fieldset>
          <fieldset livechat-moderation-channel-options-bot-enabled>
            <legend>{{botOptions}}</legend>
            <label>
              {{forbiddenWords}}
<textarea name="forbidden_words">
{{#channelModeration.moderation.forbiddenWords}}{{.}}
{{/channelModeration.moderation.forbiddenWords}}
</textarea>
            </label>
            <label>
              {{bannedJIDs}}
<textarea name="banned_jids">
{{#channelModeration.moderation.bannedJIDs}}{{.}}
{{/channelModeration.moderation.bannedJIDs}}
</textarea>
            </label>
          </fieldset>
          <input type="submit" value="{{save}}" />
          <input type="reset" value="{{cancel}}" />
        </form>
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
