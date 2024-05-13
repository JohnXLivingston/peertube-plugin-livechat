// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelConfiguration, ChannelConfigurationOptions } from 'shared/lib/types'
import { getBaseRoute } from '../../../../utils/uri'

/**
 * Returns the data that can be feed into the template view
 * @param registerClientOptions
 * @param channelId
 */
async function getConfigurationChannelViewData (
  registerClientOptions: RegisterClientOptions,
  channelId: string
): Promise<{[key: string] : any}> {
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
      label:fw.label,
      reason: fw.reason,
      comments: fw.comments
    })
  }
  // Ensuring we have at least N blocks:
  while (forbiddenWordsArray.length < 1) {
    const i = forbiddenWordsArray.length
    // default value
    forbiddenWordsArray.push({
      displayNumber: i + 1,
      fieldNumber: i,
      displayHelp: i === 0,
      joinedEntries: '',
      regexp: false,
      applyToModerators: false,
      label:'',
      reason: '',
      comments: ''
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
  while (cmdsArray.length < 1) {
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
  const translate = clientOptions.peertubeHelpers.translate
  const labelSaved = await translate(LOC_SUCCESSFULLY_SAVED)
  const labelError = await translate(LOC_ERROR)
  const enableBotCB = form.querySelector('input[name=bot]') as HTMLInputElement
  const botEnabledEl = form.querySelectorAll('[livechat-configuration-channel-options-bot-enabled]')

  const dataClasses = ['forbidden-words', 'command', 'quote']
  type ChannelConfigClass = (typeof dataClasses)[number]

  type ChannelRowData = Record<ChannelConfigClass,{ rows: HTMLTableRowElement[], addButton: HTMLButtonElement, removeButtons: HTMLButtonElement[]}>

  const populateRowData: Function = () => {
    let modifiers : ChannelRowData = {};
    for (let dataClass in dataClasses) {
      let rows : HTMLTableRowElement[] = [];
      let removeButtons : HTMLButtonElement[] = [];

      for (let i = 0, row : HTMLTableRowElement; row = form.querySelector(`button.peertube-livechat-${dataClass}-${i}-row`) as HTMLTableRowElement; i++) {
        rows.push(row)
      }

      for (let i = 0, button : HTMLButtonElement; button = form.querySelector(`button.peertube-livechat-${dataClass}-${i}-remove`) as HTMLButtonElement; i++) {
        removeButtons.push(button)
      }

      modifiers[dataClass] = {
        rows,
        addButton: form.querySelector(`button.peertube-livechat-${dataClass}-add`) as HTMLButtonElement,
        removeButtons
      }
    }
    return modifiers
  }

  let rowDataRecords : ChannelRowData = populateRowData();

  function removeRow(dataClass: ChannelConfigClass, index: number): any {
    let {rows} = rowDataRecords[dataClass]

    let rowToDelete = rows.splice(index,1)[0]

    rowToDelete
    
    for (let i = index, row : HTMLTableRowElement; row = form.querySelector(`button.peertube-livechat-${dataClass}-${i}-row`) as HTMLTableRowElement; i++) {
      rows.push(row)
    }
  }
  
  function addRow(dataClass: ChannelConfigClass): any {
    throw new Error('Function not implemented.')
  }

  const refresh: Function = () => {
    botEnabledEl.forEach(el => {
      if (enableBotCB.checked) {
        (el as HTMLElement).style.removeProperty('display')
      } else {
        (el as HTMLElement).style.display = 'none'
      }
    })
  }

  const removeDisplayedErrors = (): void => {
    form.querySelectorAll('.form-error').forEach(el => el.remove())
  }

  const displayError = async (fieldSelector: string, message: string): Promise<void> => {
    form.querySelectorAll(fieldSelector).forEach(el => {
      const erEl = document.createElement('div')
      erEl.classList.add('form-error')
      erEl.textContent = message
      el.after(erEl)
    })
  }

  const validateData: Function = async (channelConfigurationOptions: ChannelConfigurationOptions): Promise<boolean> => {
    const botConf = channelConfigurationOptions.bot
    const slowModeDuration = channelConfigurationOptions.slowMode.duration
    const errorFieldSelectors = []

    if (
      (typeof slowModeDuration !== 'number') ||
      isNaN(slowModeDuration) ||
      slowModeDuration < 0 ||
      slowModeDuration > 1000
    ) {
      const selector = '#peertube-livechat-slow-mode-duration'
      errorFieldSelectors.push(selector)
      await displayError(selector, await translate(LOC_INVALID_VALUE))
    }

    // If !bot.enabled, we don't have to validate these fields:
    // The backend will ignore those values.
    if (botConf.enabled) {
      if (/[^\p{L}\p{N}\p{Z}_-]/u.test(botConf.nickname ?? '')) {
        const selector = '#peertube-livechat-bot-nickname'
        errorFieldSelectors.push(selector)
        await displayError(selector, await translate(LOC_INVALID_VALUE))
      }

      for (let iFw = 0; iFw < botConf.forbiddenWords.length; iFw++) {
        const fw = botConf.forbiddenWords[iFw]
        if (fw.regexp) {
          for (const v of fw.entries) {
            if (v === '' || /^\s+$/.test(v)) { continue }
            try {
              // eslint-disable-next-line no-new
              new RegExp(v)
            } catch (err) {
              const selector = '#peertube-livechat-forbidden-words-' + iFw.toString()
              errorFieldSelectors.push(selector)
              let message = await translate(LOC_INVALID_VALUE)
              message += ` "${v}": ${err as string}`
              await displayError(selector, message)
            }
          }
        }
      }

      for (let iQt = 0; iQt < botConf.quotes.length; iQt++) {
        const qt = botConf.quotes[iQt]
        if (qt.messages.some(/\s+/.test)) {
          const selector = '#peertube-livechat-quote-' + iQt.toString()
          errorFieldSelectors.push(selector)
          const message = await translate(LOC_INVALID_VALUE)
          await displayError(selector, message)
        }
      }

      for (let iCd = 0; iCd < botConf.commands.length; iCd++) {
        const cd = botConf.commands[iCd]
        if (/\s+/.test(cd.command)) {
          const selector = '#peertube-livechat-command-' + iCd.toString()
          errorFieldSelectors.push(selector)
          const message = await translate(LOC_INVALID_VALUE)
          await displayError(selector, message)
        }
      }
    }

    if (errorFieldSelectors.length) {
      // Set the focus to the first in-error field:
      const el: HTMLInputElement | HTMLTextAreaElement | null = document.querySelector(errorFieldSelectors[0])
      el?.focus()
      return false
    }

    return true
  }

  const submitForm: Function = async () => {
    const data = new FormData(form)
    removeDisplayedErrors()
    const channelConfigurationOptions: ChannelConfigurationOptions = {
      slowMode: {
        duration: parseInt(data.get('slow_mode_duration')?.toString() ?? '0')
      },
      bot: {
        enabled: data.get('bot') === '1',
        nickname: data.get('bot_nickname')?.toString() ?? '',
        // TODO bannedJIDs
        forbiddenWords: [],
        quotes: [],
        commands: []
      }
    }

    // Note: but data in order, because validateData assume index are okay to find associated fields.
    for (let i = 0; data.has('forbidden_words_' + i.toString()); i++) {
      const entries = (data.get('forbidden_words_' + i.toString())?.toString() ?? '')
        .split(/\r?\n|\r|\n/g)
        .filter(s => !/^\s*$/.test(s)) // filtering empty lines
      const regexp = data.get('forbidden_words_regexp_' + i.toString())
      const applyToModerators = data.get('forbidden_words_applytomoderators_' + i.toString())
      const label = data.get('forbidden_words_label_' + i.toString())?.toString()
      const reason = data.get('forbidden_words_reason_' + i.toString())?.toString()
      const comments = data.get('forbidden_words_comments_' + i.toString())?.toString()
      const fw: ChannelConfigurationOptions['bot']['forbiddenWords'][0] = {
        entries,
        applyToModerators: !!applyToModerators,
        regexp: !!regexp
      }
      if (label) {
        fw.label = label
      }
      if (reason) {
        fw.reason = reason
      }
      if (comments) {
        fw.comments = comments
      }
      channelConfigurationOptions.bot.forbiddenWords.push(fw)
    }

    // Note: but data in order, because validateData assume index are okay to find associated fields.
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

    // Note: but data in order, because validateData assume index are okay to find associated fields.
    for (let i = 0; data.has('command_' + i.toString()); i++) {
      const command = (data.get('command_' + i.toString())?.toString() ?? '')
      const message = (data.get('command_message_' + i.toString())?.toString() ?? '')
      const c: ChannelConfigurationOptions['bot']['commands'][0] = {
        command,
        message
      }
      channelConfigurationOptions.bot.commands.push(c)
    }

    if (!await validateData(channelConfigurationOptions)) {
      throw new Error('Invalid form data')
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

  for(let [dataClass, rowData] of Object.entries(rowDataRecords)) {
    rowData.addButton.onclick = () => addRow(dataClass)

    for (let i = 0; i < rowData.removeButtons.length; i++) {
      rowData.removeButtons[i].onclick = () => removeRow(dataClass, i)
    }
  }

  form.onsubmit = () => {
    toggleSubmit(true)
    if (!form.checkValidity()) {
      return false
    }
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