import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { localizedHelpUrl } from '../../../utils/help'
import { helpButtonSVG } from '../../../videowatch/buttons'
import { vivifyConfigurationChannel, getConfigurationChannelViewData } from './logic/channel'
// Must use require for mustache, import seems buggy.
const Mustache = require('mustache')

/**
 * Renders the configuration settings page for a given channel,
 * and set it as innerHTML to rootEl.
 * The page content can be empty. In such case, the notifier will be used to display a message.
 * @param registerClientOptions Peertube client options
 * @param channelId The channel id
 * @param rootEl The HTMLElement in which insert the generated DOM.
 */
async function renderConfigurationChannel (
  registerClientOptions: RegisterClientOptions,
  channelId: string,
  rootEl: HTMLElement
): Promise<void> {
  try {
    const view = await getConfigurationChannelViewData(registerClientOptions, channelId)
    await fillViewHelpButtons(registerClientOptions, view)
    await fillLabels(registerClientOptions, view)

    const content = Mustache.render(`
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
                    {{#channelConfiguration.configuration.bot.enabled}}
                      checked="checked"
                    {{/channelConfiguration.configuration.bot.enabled}}
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
                  value="{{channelConfiguration.configuration.bot.nickname}}"
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
                  >{{entries}}</textarea>
                  <p class="form-group-description">{{forbiddenWordsDesc2}}</p>
                </div>
                <div class="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="forbidden_words_regexp_{{fieldNumber}}"
                      value="1"
                      {{#regexp}}
                        checked="checked"
                      {{/regexp}}
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
                      {{#applyToModerators}}
                        checked="checked"
                      {{/applyToModerators}}
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
                    value="{{reason}}"
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

    rootEl.innerHTML = content

    await vivifyConfigurationChannel(registerClientOptions, rootEl, channelId)
  } catch (err: any) {
    registerClientOptions.peertubeHelpers.notifier.error(err.toString())
    rootEl.innerHTML = ''
  }
}

async function fillViewHelpButtons (
  registerClientOptions: RegisterClientOptions,
  view: any
): Promise<void> {
  const helpUrl = await localizedHelpUrl(registerClientOptions, {
    page: 'documentation/user/streamers/' // FIXME: this is not the good link
  })
  const helpIcon = helpButtonSVG()
  view.helpButton = `<a
      href="${helpUrl}"
      target=_blank
      class="orange-button peertube-button-link"
    >${helpIcon}</a>`
  view.helpButtonForbiddenWords = view.helpButton // FIXME: this is not the good link
  view.helpButtonQuotes = view.helpButton // FIXME: this is not the good link
  view.helpButtonCommands = view.helpButton // FIXME: this is not the good link
}

async function fillLabels (
  registerClientOptions: RegisterClientOptions,
  view: any
): Promise<void> {
  const { peertubeHelpers } = registerClientOptions
  view.title = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TITLE)
  view.description = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_DESC)

  view.enableBot = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_ENABLE_BOT_LABEL)
  view.botOptions = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_OPTIONS_TITLE)
  view.forbiddenWords = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_LABEL)
  view.forbiddenWordsDesc = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC)
  view.forbiddenWordsDesc2 = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_DESC2)
  view.forbiddenWordsReason = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_LABEL
  )
  view.forbiddenWordsReasonDesc = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REASON_DESC
  )
  view.forbiddenWordsRegexp = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_LABEL
  )
  view.forbiddenWordsRegexpDesc = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_REGEXP_DESC
  )
  view.forbiddenWordsApplyToModerators = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_LABEL
  )
  view.forbiddenWordsApplyToModeratorsDesc = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_APPLYTOMODERATORS_DESC
  )
  view.quoteLabel = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_LABEL)
  view.quoteDesc = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DESC)
  view.quoteDesc2 = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DESC2)
  view.quoteDelayLabel = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DELAY_LABEL)
  view.quoteDelayDesc = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_DELAY_DESC)
  view.commandLabel = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_LABEL)
  view.commandDesc = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_DESC)
  view.commandCmdLabel = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_CMD_LABEL)
  view.commandCmdDesc = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_CMD_DESC)
  view.commandMessageLabel = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_MESSAGE_LABEL)
  view.commandMessageDesc = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_COMMAND_MESSAGE_DESC)
  // view.bannedJIDs = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BANNED_JIDS_LABEL)

  view.save = await peertubeHelpers.translate(LOC_SAVE)
  view.cancel = await peertubeHelpers.translate(LOC_CANCEL)
  view.botNickname = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_BOT_NICKNAME)
  view.moreInfo = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_FOR_MORE_INFO)
}

export {
  renderConfigurationChannel
}
