import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelConfiguration } from 'shared/lib/types'
import { getBaseRoute } from '../../../videowatch/uri'
import { localizedHelpUrl } from '../../../utils/help'
import { helpButtonSVG } from '../../../videowatch/buttons'
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

    const helpUrl = await localizedHelpUrl(registerClientOptions, {
      page: 'documentation/user/streamers/' // FIXME: this is not the good link
    })
    const helpIcon = helpButtonSVG()
    const helpButton = `<a
        href="${helpUrl}"
        target=_blank
        class="orange-button peertube-button-link"
      >${helpIcon}</a>`
    const helpButtonForbiddenWords = helpButton
    const helpButtonQuotes = helpButton
    const helpButtonCommands = helpButton

    const view = {
      title: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TITLE),
      description: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_DESC),
      enableBot: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ENABLE_BOT_LABEL),
      botOptions: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_OPTIONS_TITLE),
      forbiddenWords: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL),
      forbiddenWordsDesc: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC),
      forbiddenWordsDesc2: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC2),
      forbiddenWordsReason: await peertubeHelpers.translate(
        LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_LABEL
      ),
      forbiddenWordsReasonDesc: await peertubeHelpers.translate(
        LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_DESC
      ),
      forbiddenWordsRegexp: await peertubeHelpers.translate(
        LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_LABEL
      ),
      forbiddenWordsRegexpDesc: await peertubeHelpers.translate(
        LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_DESC
      ),
      forbiddenWordsApplyToModerators: await peertubeHelpers.translate(
        LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_LABEL
      ),
      forbiddenWordsApplyToModeratorsDesc: await peertubeHelpers.translate(
        LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_DESC
      ),
      quoteLabel: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_LABEL),
      quoteDesc: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DESC),
      quoteDesc2: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DESC2),
      quoteDelayLabel: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DELAY_LABEL),
      quoteDelayDesc: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DELAY_DESC),
      commandLabel: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_LABEL),
      commandDesc: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_DESC),
      commandCmdLabel: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_CMD_LABEL),
      commandCmdDesc: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_CMD_DESC),
      commandMessageLabel: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_MESSAGE_LABEL),
      commandMessageDesc: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_MESSAGE_DESC),
      // bannedJIDs: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BANNED_JIDS_LABEL),
      save: await peertubeHelpers.translate(LOC_SAVE),
      cancel: await peertubeHelpers.translate(LOC_CANCEL),
      botNickname: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_NICKNAME),
      moreInfo: await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FOR_MORE_INFO),
      forbiddenWordsArray: [0, 1, 2].map(count => {
        return {
          displayNumber: count + 1,
          fieldNumber: count,
          displayHelp: count === 0
        }
      }),
      quotesArray: [0].map(count => {
        return {
          displayNumber: count + 1,
          fieldNumber: count,
          displayHelp: count === 0
        }
      }),
      cmdsArray: [0, 1, 2].map(count => {
        return {
          displayNumber: count + 1,
          fieldNumber: count,
          displayHelp: count === 0
        }
      }),
      helpButton,
      helpButtonForbiddenWords,
      helpButtonCommands,
      helpButtonQuotes,
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
          {{{helpButton}}}
        </h1>
        <p>{{description}}</p>
        <form livechat-configuration-channel-options role="form">
          <div class="row mt-3">
            <div class="col-12 col-lg-4 col-xl-3">
              <h2>{{botOptions}}</h2>
            </div>
            <div class="col-12 col-lg-8 col-xl-9">
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
              <div class="form-group" livechat-configuration-channel-options-bot-enabled>
                <label for="peertube-livechat-bot-nickname">{{botNickname}}</label>
                <input
                  type="text"
                  name="bot_nickname"
                  class="form-control"
                  id="peertube-livechat-bot-nickname"
                  value="{{channelConfiguration.configuration.botNickname}}"
                />
              </div>
            </div>
          </div>

          {{#forbiddenWordsArray}}{{! iterating on forbiddenWordsArray to display N fields }}
            <div class="row mt-5" livechat-configuration-channel-options-bot-enabled>
              <div class="col-12 col-lg-4 col-xl-3">
                <h2>{{forbiddenWords}} #{{displayNumber}}</h2>
                {{#displayHelp}}
                  <p>{{forbiddenWordsDesc}} {{moreInfo}}</p>
                  {{{HelpButtonForbiddenWords}}}
                {{/displayHelp}}
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <div class="form-group">
                  <label for="peertube-livechat-forbidden-words-{{fieldNumber}}">{{forbiddenWords}}</label>
                  {{! warning: don't add extra line break in textarea! }}
                  <textarea
                    name="forbidden_words_{{fieldNumber}}"
                    id="peertube-livechat-forbidden-words-{{fieldNumber}}"
                    class="form-control"
                  >{{
                    #channelConfiguration.configuration.forbiddenWords
                  }}{{.}}\n{{
                    /channelConfiguration.configuration.forbiddenWords
                  }}</textarea>
                  <p class="form-group-description">{{forbiddenWordsDesc2}}</p>
                </div>
                <div class="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="forbidden_words_regexp_{{fieldNumber}}"
                      value="1"
                    />
                    {{forbiddenWordsRegexp}}
                  </label>
                  <p class="form-group-description">{{forbiddenWordsRegexpDesc}}</p>
                </div>
                <div class="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="forbidden_words_applytomoderators_{{fieldNumber}}"
                      value="1"
                    />
                    {{forbiddenWordsApplyToModerators}}
                  </label>
                  <p class="form-group-description">{{forbiddenWordsApplyToModeratorsDesc}}</p>
                </div>
                <div class="form-group">
                  <label for="peertube-livechat-forbidden-words-reason-{{fieldNumber}}">{{forbiddenWordsReason}}</label>
                  <input
                    type="text"
                    name="forbidden_words_reason_{{fieldNumber}}"
                    class="form-control"
                    id="peertube-livechat-forbidden-words-reason-{{fieldNumber}}"
                    value=""
                  />
                  <p class="form-group-description">{{forbiddenWordsReasonDesc}}</p>
                </div>
              </div>
            </div>
          {{/forbiddenWordsArray}}

          {{#quotesArray}}{{! iterating on quotesArray to display N fields }}
            <div class="row mt-5" livechat-configuration-channel-options-bot-enabled>
              <div class="col-12 col-lg-4 col-xl-3">
                <h2>{{quoteLabel}} #{{displayNumber}}</h2>
                {{#displayHelp}}
                  <p>{{quoteDesc}} {{moreInfo}}</p>
                  {{{helpButtonQuotes}}}
                {{/displayHelp}}
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <div class="form-group">
                  <label for="peertube-livechat-quote-{{fieldNumber}}">{{quoteLabel}}</label>
                  {{! warning: don't add extra line break in textarea! }}
                  <textarea
                    name="quote_{{fieldNumber}}"
                    id="peertube-livechat-quote-{{fieldNumber}}"
                    class="form-control"
                  >{{
                    #channelConfiguration.configuration.TODO
                  }}{{.}}\n{{
                    /channelConfiguration.configuration.TODO
                  }}</textarea>
                  <p class="form-group-description">{{quoteDesc2}}</p>
                </div>
                <div class="form-group">
                  <label for="peertube-livechat-quote-delay-{{fieldNumber}}">{{quoteDelayLabel}}</label>
                  <input
                    type="number"
                    min="1"
                    max="6000"
                    step="1"
                    name="quote_delay_{{fieldNumber}}"
                    class="form-control"
                    id="peertube-livechat-quote-delay-{{fieldNumber}}"
                    value="5"
                  />
                  <p class="form-group-description">{{quoteDelayDesc}}</p>
                </div>
              </div>
            </div>
          {{/quotesArray}}

          {{#cmdsArray}}{{! iterating on cmdsArray to display N fields }}
            <div class="row mt-5" livechat-configuration-channel-options-bot-enabled>
              <div class="col-12 col-lg-4 col-xl-3">
                <h2>{{commandLabel}} #{{displayNumber}}</h2>
                {{#displayHelp}}
                  <p>{{commandDesc}} {{moreInfo}}</p>
                  {{{helpButtonCommands}}}
                {{/displayHelp}}
              </div>
              <div class="col-12 col-lg-8 col-xl-9">
                <div class="form-group">
                  <label for="peertube-livechat-command-{{fieldNumber}}">{{commandCmdLabel}}</label>
                  <input
                    type="text"
                    name="command_{{fieldNumber}}"
                    class="form-control"
                    id="peertube-livechat-command-{{fieldNumber}}"
                    value=""
                  />
                  <p class="form-group-description">{{commandCmdDesc}}</p>
                </div>
                <div class="form-group">
                  <label for="peertube-livechat-command-message-{{fieldNumber}}">{{commandMessageLabel}}</label>
                  <input
                    type="text"
                    name="command_message_{{fieldNumber}}"
                    class="form-control"
                    id="peertube-livechat-command-message-{{fieldNumber}}"
                    value=""
                  />
                  <p class="form-group-description">{{commandMessageDesc}}</p>
                </div>
              </div>
            </div>
          {{/cmdsArray}}
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
