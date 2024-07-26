// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ChannelConfigurationOptions } from '../../../../shared/lib/types'
import { channelTermsMaxLength } from '../../../../shared/lib/constants'

/**
 * Sanitize data so that they can safely be used/stored for channel configuration configuration.
 * Throw an error if the format is obviously wrong.
 * Cleans data (removing empty values, ...)
 * @param options Peertube server options
 * @param _channelInfos Channel infos
 * @param data Input data
 */
async function sanitizeChannelConfigurationOptions (
  _options: RegisterServerOptions,
  _channelId: number | string,
  data: any
): Promise<ChannelConfigurationOptions> {
  if (typeof data !== 'object') {
    throw new Error('Invalid data type')
  }

  const botData = data.bot
  if (typeof botData !== 'object') {
    throw new Error('Invalid data.bot data type')
  }

  // slowMode not present in livechat <= 8.2.0:
  const slowModeData = data.slowMode ?? {}
  slowModeData.duration ??= slowModeData.defaultDuration ?? 0 // v8.3.0 to 8.3.2: was in defaultDuration

  if (typeof slowModeData !== 'object') {
    throw new Error('Invalid data.slowMode data type')
  }

  const moderationData = data.moderation ?? {} // comes with livechat 10.3.0
  moderationData.delay ??= 0
  moderationData.anonymize ??= false // comes with livechat 11.0.0

  // mute not present in livechat <= 10.2.0
  const mute = data.mute ?? {}
  mute.anonymous ??= false

  if (typeof mute !== 'object') {
    throw new Error('Invalid data.mute data type')
  }

  // terms not present in livechat <= 10.2.0
  let terms = data.terms
  if (terms !== undefined && (typeof terms !== 'string')) {
    throw new Error('Invalid data.terms data type')
  }
  if (terms && terms.length > channelTermsMaxLength) {
    throw new Error('data.terms value too long')
  }
  if (terms === '') { terms = undefined }

  const result: ChannelConfigurationOptions = {
    bot: {
      enabled: _readBoolean(botData, 'enabled'),
      nickname: _readSimpleInput(botData, 'nickname', true),
      forbiddenWords: await _readForbiddenWords(botData),
      quotes: _readQuotes(botData),
      commands: _readCommands(botData)
      // TODO: bannedJIDs
    },
    slowMode: {
      duration: _readInteger(slowModeData, 'duration', 0, 1000)
    },
    mute: {
      anonymous: _readBoolean(mute, 'anonymous')
    },
    moderation: {
      delay: _readInteger(moderationData, 'delay', 0, 60),
      anonymize: _readBoolean(moderationData, 'anonymize')
    }
  }
  if (terms !== undefined) {
    result.terms = terms
  }

  return result
}

function _readBoolean (data: any, f: string): boolean {
  if (!(f in data)) {
    return false
  }
  if (typeof data[f] !== 'boolean') {
    throw new Error('Invalid data type for field ' + f)
  }
  return data[f]
}

function _readInteger (data: any, f: string, min: number, max: number): number {
  if (!(f in data)) {
    throw new Error('Missing integer value for field ' + f)
  }
  const v = parseInt(data[f])
  if (isNaN(v)) {
    throw new Error('Invalid value type for field ' + f)
  }
  if (v < min) {
    throw new Error('Invalid value type (<min) for field ' + f)
  }
  if (v > max) {
    throw new Error('Invalid value type (>max) for field ' + f)
  }
  return v
}

function _readSimpleInput (data: any, f: string, strict?: boolean, noSpace?: boolean): string {
  if (!(f in data)) {
    return ''
  }
  if (typeof data[f] !== 'string') {
    throw new Error('Invalid data type for field ' + f)
  }
  // Removing control characters.
  // eslint-disable-next-line no-control-regex
  let s = (data[f] as string).replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
  if (strict) {
    // Replacing all invalid characters, no need to throw an error..
    s = s.replace(/[^\p{L}\p{N}\p{Z}_-]$/gu, '')
  }
  if (noSpace) {
    s = s.replace(/\s+/g, '')
  }
  return s
}

function _readStringArray (data: any, f: string): string[] {
  if (!(f in data)) {
    return []
  }
  if (!Array.isArray(data[f])) {
    throw new Error('Invalid data type for field ' + f)
  }
  const result: string[] = []
  for (const v of data[f]) {
    if (typeof v !== 'string') {
      throw new Error('Invalid data type in a value of field ' + f)
    }
    if (v === '' || /^\s+$/.test(v)) {
      // ignore empty values
      continue
    }
    result.push(v)
  }
  return result
}

function _readMultiLineString (data: any, f: string): string {
  if (!(f in data)) {
    return ''
  }
  if (typeof data[f] !== 'string') {
    throw new Error('Invalid data type for field ' + f)
  }
  // Removing control characters (must authorize \u001A: line feed)
  // eslint-disable-next-line no-control-regex
  const s = (data[f] as string).replace(/[\u0000-\u0009\u001B-\u001F\u007F-\u009F]/g, '')
  return s
}

async function _readRegExpArray (data: any, f: string): Promise<string[]> {
  // Note: this function can instanciate a lot of RegExp.
  // To avoid freezing the server, we make it async, and will validate each regexp in a separate tick.
  if (!(f in data)) {
    return []
  }
  if (!Array.isArray(data[f])) {
    throw new Error('Invalid data type for field ' + f)
  }
  const result: string[] = []
  for (const v of data[f]) {
    if (typeof v !== 'string') {
      throw new Error('Invalid data type in a value of field ' + f)
    }
    if (v === '' || /^\s+$/.test(v)) {
      // ignore empty values
      continue
    }
    // value must be a valid regexp
    try {
      async function _validate (): Promise<void> {
        // eslint-disable-next-line no-new
        new RegExp(v)
      }
      await _validate()
    } catch (_err) {
      throw new Error('Invalid value in field ' + f)
    }
    result.push(v)
  }
  return result
}

async function _readForbiddenWords (botData: any): Promise<ChannelConfigurationOptions['bot']['forbiddenWords']> {
  if (!Array.isArray(botData.forbiddenWords)) {
    throw new Error('Invalid forbiddenWords data')
  }
  const result: ChannelConfigurationOptions['bot']['forbiddenWords'] = []
  for (const fw of botData.forbiddenWords) {
    const regexp = !!fw.regexp
    let entries
    if (regexp) {
      entries = await _readRegExpArray(fw, 'entries')
    } else {
      entries = _readStringArray(fw, 'entries')
    }
    const applyToModerators = _readBoolean(fw, 'applyToModerators')
    const label = fw.label ? _readSimpleInput(fw, 'label') : undefined
    const reason = fw.reason ? _readSimpleInput(fw, 'reason') : undefined
    const comments = fw.comments ? _readMultiLineString(fw, 'comments') : undefined

    result.push({
      regexp,
      entries,
      applyToModerators,
      label,
      reason,
      comments
    })
  }
  return result
}

function _readQuotes (botData: any): ChannelConfigurationOptions['bot']['quotes'] {
  if (!Array.isArray(botData.quotes)) {
    throw new Error('Invalid quotes data')
  }
  const result: ChannelConfigurationOptions['bot']['quotes'] = []
  for (const qs of botData.quotes) {
    const messages = _readStringArray(qs, 'messages')
    const delay = _readInteger(qs, 'delay', 1, 6000)

    result.push({
      messages,
      delay
    })
  }
  return result
}

function _readCommands (botData: any): ChannelConfigurationOptions['bot']['commands'] {
  if (!Array.isArray(botData.commands)) {
    throw new Error('Invalid commands data')
  }
  const result: ChannelConfigurationOptions['bot']['commands'] = []
  for (const cs of botData.commands) {
    const message = _readSimpleInput(cs, 'message')
    const command = _readSimpleInput(cs, 'command', false, true)

    result.push({
      message,
      command
    })
  }
  return result
}

export {
  sanitizeChannelConfigurationOptions
}
