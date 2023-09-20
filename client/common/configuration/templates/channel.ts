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
      // bannedJIDs: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BANNED_JIDS_LABEL),
      save: await peertubeHelpers.translate(LOC_SAVE),
      cancel: await peertubeHelpers.translate(LOC_CANCEL),
      botNickname: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_NICKNAME),
      channelConfiguration
    }

    return Mustache.render(`
      <div class="margin-content peertube-plugin-livechat-configuration peertube-plugin-livechat-configuration-channel">
        <h1>
          {{title}}:
          <span class="peertube-plugin-livechat-configuration-channel-info">
            <span>{{channelConfiguration.channel.displayName}}</span>
            <span>{{channelConfiguration.channel.name}}</span>
          </span>
        </h1>
        <p>{{description}}</p>
        <form livechat-configuration-channel-options role="form">
          <div class="row mt-3">
            <div class="col-12 col-lg-4 col-xl-3">
              <h2>{{botOptions}}</h2>
            </div>
            <div class="col-12 col-lg-8 col-xl-9">
              <fieldset>
                <div class="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="bot"
                      id="peertube-livechat-bot"
                      value="1"
                      {{#channelConfiguration.configuration.bot}}
                        checked="checked"
                      {{/channelConfiguration.configuration.bot}}
                    />
                    {{enableBot}}
                  </label>
                </div>
              </fieldset>
              <fieldset livechat-configuration-channel-options-bot-enabled>
                <div class="form-group">
                  <label for="peertube-livechat-bot-nickname">{{botNickname}}</label>
                  <input
                    type="text"
                    name="bot_nickname"
                    class="form-control"
                    id="peertube-livechat-bot-nickname"
                    value="{{channelConfiguration.configuration.botNickname}}"
                  />
                </div>
                <div class="form-group">
                  <label for="peertube-livechat-forbidden-words">{{forbiddenWords}}</label>
<textarea name="forbidden_words" id="peertube-livechat-forbidden-words" class="form-control">
{{#channelConfiguration.configuration.forbiddenWords}}{{.}}
{{/channelConfiguration.configuration.forbiddenWords}}
</textarea>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="form-group">
            <input type="submit" value="{{save}}" />
            <input type="reset" value="{{cancel}}" />
          </div>
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
