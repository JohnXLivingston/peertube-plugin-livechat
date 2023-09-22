import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelConfiguration, ChannelConfigurationOptions } from 'shared/lib/types'
import { getBaseRoute } from '../../../../videowatch/uri'

/**
 * Returns the data that can be feed into the template view
 * @param registerClientOptions
 * @param channelId
 */
async function getConfigurationChannelViewData (
  registerClientOptions: RegisterClientOptions,
  channelId: string
): Promise<Object> {
  if (!channelId || !/^\d+$/.test(channelId)) {
    throw new Error('Missing or invalid channel id.')
  }

  const { peertubeHelpers } = registerClientOptions
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

  const forbiddenWordsArray: Object[] = []
  for (let i = 0; i < channelConfiguration.configuration.bot.forbiddenWords.length; i++) {
    const fw = channelConfiguration.configuration.bot.forbiddenWords[i]
    forbiddenWordsArray.push({
      displayNumber: i + 1,
      fieldNumber: i,
      displayHelp: i === 0,
      joinedEntries: fw.entries.join('\n'),
      regexp: !!fw.regexp,
      applyToModerators: fw.applyToModerators,
      reason: fw.reason
    })
  }
  // Ensuring we have at least N blocks:
  while (forbiddenWordsArray.length < 3) {
    const i = forbiddenWordsArray.length
    // default value
    forbiddenWordsArray.push({
      displayNumber: i + 1,
      fieldNumber: i,
      displayHelp: i === 0,
      joinedEntries: '',
      regexp: false,
      applyToModerators: false,
      reason: ''
    })
    continue
  }

  const quotesArray: Object[] = []
  for (let i = 0; i < channelConfiguration.configuration.bot.quotes.length; i++) {
    const qs = channelConfiguration.configuration.bot.quotes[i]
    quotesArray.push({
      displayNumber: i + 1,
      fieldNumber: i,
      displayHelp: i === 0,
      joinedMessages: qs.messages.join('\n'),
      delay: Math.round(qs.delay / 60) // converting to minutes
    })
  }
  // Ensuring we have at least N blocks:
  while (quotesArray.length < 1) {
    const i = quotesArray.length
    // default value
    quotesArray.push({
      displayNumber: i + 1,
      fieldNumber: i,
      displayHelp: i === 0,
      joinedMessages: '',
      delay: 5
    })
    continue
  }

  const cmdsArray: Object[] = []
  for (let i = 0; i < channelConfiguration.configuration.bot.commands.length; i++) {
    const cs = channelConfiguration.configuration.bot.commands[i]
    cmdsArray.push({
      displayNumber: i + 1,
      fieldNumber: i,
      displayHelp: i === 0,
      message: cs.message,
      command: cs.command
    })
  }
  // Ensuring we have at least N blocks:
  while (cmdsArray.length < 3) {
    const i = cmdsArray.length
    // default value
    cmdsArray.push({
      displayNumber: i + 1,
      fieldNumber: i,
      displayHelp: i === 0,
      message: '',
      command: ''
    })
    continue
  }

  return {
    channelConfiguration,
    forbiddenWordsArray,
    quotesArray,
    cmdsArray
  }
}

/**
 * Adds the front-end logic on the generated html for the channel configuration options.
 * @param clientOptions Peertube client options
 * @param rootEl The root element in which the template was rendered
 */
async function vivifyConfigurationChannel (
  clientOptions: RegisterClientOptions,
  rootEl: HTMLElement,
  channelId: string
): Promise<void> {
  const form = rootEl.querySelector('form[livechat-configuration-channel-options]') as HTMLFormElement
  if (!form) { return }
  const labelSaved = await clientOptions.peertubeHelpers.translate(LOC_SUCCESSFULLY_SAVED)
  const labelError = await clientOptions.peertubeHelpers.translate(LOC_ERROR)
  const enableBotCB = form.querySelector('input[name=bot]') as HTMLInputElement
  const botEnabledEl = form.querySelectorAll('[livechat-configuration-channel-options-bot-enabled]')

  const refresh: Function = () => {
    botEnabledEl.forEach(el => {
      if (enableBotCB.checked) {
        (el as HTMLElement).style.removeProperty('display')
      } else {
        (el as HTMLElement).style.display = 'none'
      }
    })
  }

  const submitForm: Function = async () => {
    const data = new FormData(form)
    const channelConfigurationOptions: ChannelConfigurationOptions = {
      bot: {
        enabled: data.get('bot') === '1',
        nickname: data.get('bot_nickname')?.toString() ?? '',
        // TODO bannedJIDs
        forbiddenWords: [],
        quotes: [],
        commands: []
      }
    }

    // TODO: handle form errors.

    for (let i = 0; data.has('forbidden_words_' + i.toString()); i++) {
      const entries = (data.get('forbidden_words_' + i.toString())?.toString() ?? '')
        .split(/\r?\n|\r|\n/g)
        .filter(s => !/^\s*$/.test(s)) // filtering empty lines
      const regexp = data.get('forbidden_words_regexp_' + i.toString())
      const applyToModerators = data.get('forbidden_words_applytomoderators_' + i.toString())
      const reason = data.get('forbidden_words_reason_' + i.toString())?.toString()
      const fw: ChannelConfigurationOptions['bot']['forbiddenWords'][0] = {
        entries,
        applyToModerators: !!applyToModerators,
        regexp: !!regexp
      }
      if (reason) {
        fw.reason = reason
      }
      channelConfigurationOptions.bot.forbiddenWords.push(fw)
    }

    for (let i = 0; data.has('quote_' + i.toString()); i++) {
      const messages = (data.get('quote_' + i.toString())?.toString() ?? '')
        .split(/\r?\n|\r|\n/g)
        .filter(s => !/^\s*$/.test(s)) // filtering empty lines
      let delay = parseInt(data.get('quote_delay_' + i.toString())?.toString() ?? '')
      if (!delay || isNaN(delay) || delay < 1) {
        delay = 5
      }
      delay = delay * 60 // converting to seconds
      const q: ChannelConfigurationOptions['bot']['quotes'][0] = {
        messages,
        delay
      }
      channelConfigurationOptions.bot.quotes.push(q)
    }

    for (let i = 0; data.has('command_' + i.toString()); i++) {
      const command = (data.get('command_' + i.toString())?.toString() ?? '')
      const message = (data.get('command_message_' + i.toString())?.toString() ?? '')
      const c: ChannelConfigurationOptions['bot']['commands'][0] = {
        command,
        message
      }
      channelConfigurationOptions.bot.commands.push(c)
    }

    const headers: any = clientOptions.peertubeHelpers.getAuthHeader() ?? {}
    headers['content-type'] = 'application/json;charset=UTF-8'

    const response = await fetch(
      getBaseRoute(clientOptions) + '/api/configuration/channel/' + encodeURIComponent(channelId),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(channelConfigurationOptions)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to save configuration options.')
    }
  }
  const toggleSubmit: Function = (disabled: boolean) => {
    form.querySelectorAll('input[type=submit], input[type=reset]').forEach((el) => {
      if (disabled) {
        el.setAttribute('disabled', 'disabled')
      } else {
        el.removeAttribute('disabled')
      }
    })
  }

  enableBotCB.onclick = () => refresh()
  form.onsubmit = () => {
    toggleSubmit(true)
    submitForm().then(
      () => {
        clientOptions.peertubeHelpers.notifier.success(labelSaved)
        toggleSubmit(false)
      },
      () => {
        clientOptions.peertubeHelpers.notifier.error(labelError)
        toggleSubmit(false)
      }
    )
    return false
  }
  form.onreset = () => {
    // Must refresh in a setTimeout, otherwise the checkbox state is not up to date.
    setTimeout(() => refresh(), 1)
  }
  refresh()
}

export {
  getConfigurationChannelViewData,
  vivifyConfigurationChannel
}
