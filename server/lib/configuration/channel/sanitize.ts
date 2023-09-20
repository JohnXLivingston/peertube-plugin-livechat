import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ChannelConfigurationOptions } from '../../../../shared/lib/types'

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

  const result: ChannelConfigurationOptions = {
    bot: _readBoolean(data, 'bot'),
    botNickname: _readSimpleInput(data, 'botNickname'),
    // bannedJIDs: await _readRegExpArray(data, 'bannedJIDs'),
    forbiddenWords: await _readRegExpArray(data, 'forbiddenWords')
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

function _readSimpleInput (data: any, f: string): string {
  if (!(f in data)) {
    return ''
  }
  if (typeof data[f] !== 'string') {
    throw new Error('Invalid data type for field ' + f)
  }
  // Replacing all invalid characters, no need to throw an error..
  return (data[f] as string).replace(/[^\p{L}\p{N}\p{Z}_-]$/gu, '')
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

export {
  sanitizeChannelConfigurationOptions
}
