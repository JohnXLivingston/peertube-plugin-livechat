import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ChannelConfigurationOptions, ChannelInfos } from '../../../../shared/lib/types'

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
  _channelInfos: ChannelInfos,
  data: any
): Promise<ChannelConfigurationOptions> {
  const result = {
    bot: false,
    bannedJIDs: [],
    forbiddenWords: []
  }

  if (typeof data !== 'object') {
    throw new Error('Invalid data type')
  }
  // boolean fields
  for (const f of ['bot']) {
    if (!(f in data) || (typeof data[f] !== 'boolean')) {
      throw new Error('Invalid data type for field ' + f)
    }
    result[f as keyof ChannelConfigurationOptions] = data[f]
  }
  // value/regexp array fields
  for (const f of ['bannedJIDs', 'forbiddenWords']) {
    if (!(f in data) || !Array.isArray(data[f])) {
      throw new Error('Invalid data type for field ' + f)
    }
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
        // eslint-disable-next-line no-new
        new RegExp(v)
      } catch (_err) {
        throw new Error('Invalid value in field ' + f)
      }
      (result[f as keyof ChannelConfigurationOptions] as string[]).push(v)
    }
  }

  return result
}

export {
  sanitizeChannelConfigurationOptions
}
