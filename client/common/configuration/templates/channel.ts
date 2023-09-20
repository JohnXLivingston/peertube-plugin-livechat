import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelConfiguration } from 'shared/lib/types'
import { getBaseRoute } from '../../../videowatch/uri'
// Must use require for mustache, import seems buggy.
const Mustache = require('mustache')

/**
 * Renders the configuration settings page for a given channel.
 * @param registerClientOptions Peertube client options
 * @param channelId The channel id
 * @returns The page content
 */
async function renderConfigurationChannel (
  registerClientOptions: RegisterClientOptions,
  channelId: string
): Promise<string | false> {
  const { peertubeHelpers } = registerClientOptions

  try {
    if (!channelId || !/^\d+$/.test(channelId)) {
      throw new Error('Missing or invalid channel id.')
    }

    const response = await fetch(
      getBaseRoute(registerClientOptions) + '/api/configuration/channel/' + encodeURIComponent(channelId),
      {
        method: 'GET',
        headers: peertubeHelpers.getAuthHeader()
      }
    )
    if (!response.ok) {
      throw new Error('Can\'t get channel configuration options.')
    }
    const channelConfiguration: ChannelConfiguration = await (response).json()

    // Basic testing that channelConfiguration has the correct format
    if ((typeof channelConfiguration !== 'object') || !channelConfiguration.channel) {
      throw new Error('Invalid channel configuration options.')
    }

    const view = {
      title: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TITLE),
      description: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_DESC),
      enableBot: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ENABLE_BOT_LABEL),
      botOptions: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_OPTIONS_TITLE),
      forbiddenWords: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL),
      bannedJIDs: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BANNED_JIDS_LABEL),
      save: await peertubeHelpers.translate(LOC_SAVE),
      cancel: await peertubeHelpers.translate(LOC_CANCEL),
      botNickname: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_NICKNAME),
      channelConfiguration
    }

    return Mustache.render(`
      <div class="margin-content peertube-plugin-livechat-configuration">
        <h1>{{title}} {{channelConfiguration.channel.displayName}}</h1>
        <p>{{description}}</p>
        <form livechat-configuration-channel-options>
          <fieldset>
            <label>
              <input
                type="checkbox" name="bot"
                value="1"
                {{#channelConfiguration.configuration.bot}}
                  checked="checked"
                {{/channelConfiguration.configuration.bot}}
              />
              {{enableBot}}
            </label>
          </fieldset>
          <fieldset livechat-configuration-channel-options-bot-enabled>
            <legend>{{botOptions}}</legend>
            <label>
              {{botNickname}}
              <input
                type="text"
                name="bot_nickname"
                value="{{channelConfiguration.configuration.botNickname}}"
              />
            </label>
            <label>
              {{forbiddenWords}}
<textarea name="forbidden_words">
{{#channelConfiguration.configuration.forbiddenWords}}{{.}}
{{/channelConfiguration.configuration.forbiddenWords}}
</textarea>
            </label>
            <label>
              {{bannedJIDs}}
<textarea name="banned_jids">
{{#channelConfiguration.configuration.bannedJIDs}}{{.}}
{{/channelConfiguration.configuration.bannedJIDs}}
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
  renderConfigurationChannel
}
