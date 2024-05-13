// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { localizedHelpUrl } from '../../../utils/help'
import { helpButtonSVG } from '../../../videowatch/buttons'
import {  getConfigurationChannelViewData } from './logic/channel'
import { TemplateResult, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
// Must use require for mustache, import seems buggy.
const Mustache = require('mustache')
import './DynamicTableFormElement'
import './ChannelConfigurationElement'

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
): Promise<TemplateResult> {
  try {
    const view : {[key: string] : any} = await getConfigurationChannelViewData(registerClientOptions, channelId)
    await fillViewHelpButtons(registerClientOptions, view)
    await fillLabels(registerClientOptions, view)

    //await vivifyConfigurationChannel(registerClientOptions, rootEl, channelId)

    let tableHeader = {
      words: html`${view.forbiddenWords}<div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${view.forbiddenWordsDesc}></div>`,
      regex: html`${view.forbiddenWordsRegexp}<div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${view.forbiddenWordsRegexpDesc}></div>`,
      applyToModerators: html`${view.forbiddenWordsApplyToModerators}<div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${view.forbiddenWordsApplyToModeratorsDesc}></div>`,
      label: html`${view.forbiddenWordsLabel}<div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${view.forbiddenWordsLabelDesc}></div>`,
      reason: html`${view.forbiddenWordsReason}<div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${view.forbiddenWordsReasonDesc}></div>`,
      comments: html`${view.forbiddenWordsComments}<div data-toggle="tooltip" data-placement="bottom" data-html="true" title=${view.forbiddenWordsCommentsDesc}></div>`,
    }
    let tableSchema = {
      words: {
        inputType: 'text',
        default: 'helloqwesad'
      },
      regex: {
        inputType: 'text',
        default: 'helloaxzca'
      },
      applyToModerators: {
        inputType: 'checkbox',
        default: true
      },
      label: {
        inputType: 'text',
        default: 'helloasx'
      },
      reason: {
        inputType: 'select',
        default: 'transphobia',
        label: 'choose your poison',
        options: {'racism': 'Racism', 'sexism': 'Sexism', 'transphobia': 'Transphobia', 'bigotry': 'Bigotry'}
      },
      comments: {
        inputType: 'textarea',
        default: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.`
      },
    }
    let tableRows = [
      {
        words: 'teweqwst',
        regex: 'tesdgst',
        applyToModerators: false,
        label: 'teswet',
        reason: 'sexism',
        comments: 'tsdaswest',
      },
      {
        words: 'tedsadst',
        regex: 'tezxccst',
        applyToModerators: true,
        label: 'tewest',
        reason: 'racism',
        comments: 'tesxzct',
      },
      {
        words: 'tesadsdxst',
        regex: 'dsfsdf',
        applyToModerators: false,
        label: 'tesdadst',
        reason: 'bigotry',
        comments: 'tsadest',
      },
    ]

    return html`${unsafeHTML(Mustache.render(MUSTACHE_CONFIGURATION_CHANNEL, view))}
    <div class="container">
      <channel-configuration></channel-configuration>
      <dynamic-table-form
        .header=${tableHeader}
        .schema=${tableSchema}
        .rows=${tableRows}
        .formName=${'dynamic-table-form'}
      >
      </dynamic-table-form>
    </div>${JSON.stringify(tableRows)}`
  } catch (err: any) {
    registerClientOptions.peertubeHelpers.notifier.error(err.toString())
    return html``
  }
}

async function fillViewHelpButtons (
  registerClientOptions: RegisterClientOptions,
  view: {[key: string]: string}
): Promise<void> {
  const title = await registerClientOptions.peertubeHelpers.translate(LOC_ONLINE_HELP)

  const button = async (page: string): Promise<string> => {
    const helpUrl = await localizedHelpUrl(registerClientOptions, {
      page
    })
    const helpIcon = helpButtonSVG()
    return `<a
        href="${helpUrl}"
        target=_blank
        title="${title}"
        class="orange-button peertube-button-link"
      >${helpIcon}</a>`
  }

  view.helpButton = await button('documentation/user/streamers/channel')
  view.helpButtonBot = await button('documentation/user/streamers/bot')
  view.helpButtonForbiddenWords = await button('documentation/user/streamers/bot/forbidden_words')
  view.helpButtonQuotes = await button('documentation/user/streamers/bot/quotes')
  view.helpButtonCommands = await button('documentation/user/streamers/bot/commands')
  view.helpButtonSlowMode = await button('documentation/user/streamers/slow_mode')
}

async function fillLabels (
  registerClientOptions: RegisterClientOptions,
  view: {[key: string] : string}
): Promise<void> {
  const { peertubeHelpers } = registerClientOptions
  view.title = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_TITLE)
  view.description = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_DESC)

  view.slowModeLabel = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_LABEL)
  view.slowModeDesc = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_SLOW_MODE_DESC)
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
  view.forbiddenWordsComments = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_COMMENTS_LABEL
  )
  view.forbiddenWordsCommentsDesc = await peertubeHelpers.translate(
    LOC_LIVECHAT_CONFIGURATION_CHANNEL_FORBIDDEN_WORDS_COMMENTS_DESC
  )
  view.quoteLabel = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_LABEL)
  view.quoteLabel2 = await peertubeHelpers.translate(LOC_LIVECHAT_CONFIGURATION_CHANNEL_QUOTE_LABEL2)
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
