// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type {
  ChannelLiveChatInfos, ChannelConfiguration, ChannelConfigurationOptions, ChannelEmojisConfiguration, ChannelEmojis
} from 'shared/lib/types'
import { ValidationError, ValidationErrorType } from '../../lib/models/validation'
import { getBaseRoute } from '../../../utils/uri'

export class ChannelDetailsService {
  private readonly _registerClientOptions: RegisterClientOptions

  private readonly _headers: any = {}

  constructor (registerClientOptions: RegisterClientOptions) {
    this._registerClientOptions = registerClientOptions

    this._headers = this._registerClientOptions.peertubeHelpers.getAuthHeader() ?? {}
    this._headers['content-type'] = 'application/json;charset=UTF-8'
  }

  validateOptions = async (channelConfigurationOptions: ChannelConfigurationOptions): Promise<boolean> => {
    const propertiesError: ValidationError['properties'] = {}

    const botConf = channelConfigurationOptions.bot
    const slowModeDuration = channelConfigurationOptions.slowMode.duration

    propertiesError['slowMode.duration'] = []

    if (
      (typeof slowModeDuration !== 'number') ||
      isNaN(slowModeDuration)
    ) {
      propertiesError['slowMode.duration'].push(ValidationErrorType.WrongType)
    } else if (
      slowModeDuration < 0 ||
      slowModeDuration > 1000
    ) {
      propertiesError['slowMode.duration'].push(ValidationErrorType.NotInRange)
    }

    // If !bot.enabled, we don't have to validate these fields:
    // The backend will ignore those values.
    if (botConf.enabled) {
      propertiesError['bot.nickname'] = []

      if (/[^\p{L}\p{N}\p{Z}_-]/u.test(botConf.nickname ?? '')) {
        propertiesError['bot.nickname'].push(ValidationErrorType.WrongFormat)
      }

      for (const [i, fw] of botConf.forbiddenWords.entries()) {
        for (const v of fw.entries) {
          propertiesError[`bot.forbiddenWords.${i}.entries`] = []
          if (fw.regexp) {
            if (v.trim() !== '') {
              try {
                // eslint-disable-next-line no-new
                new RegExp(v)
              } catch (_) {
                propertiesError[`bot.forbiddenWords.${i}.entries`]
                  .push(ValidationErrorType.WrongFormat)
              }
            }
          }
        }
      }

      for (const [i, cd] of botConf.commands.entries()) {
        propertiesError[`bot.commands.${i}.command`] = []

        if (/\s+/.test(cd.command)) {
          propertiesError[`bot.commands.${i}.command`].push(ValidationErrorType.WrongFormat)
        }
      }
    }

    if (Object.values(propertiesError).find(e => e.length > 0)) {
      const validationError = new ValidationError(
        'ChannelConfigurationOptionsValidationError',
        await this._registerClientOptions.peertubeHelpers.translate(LOC_VALIDATION_ERROR),
        propertiesError
      )
      throw validationError
    }

    return true
  }

  saveOptions = async (channelId: number,
    channelConfigurationOptions: ChannelConfigurationOptions): Promise<Response> => {
    if (!await this.validateOptions(channelConfigurationOptions)) {
      throw new Error('Invalid form data')
    }

    const response = await fetch(
      getBaseRoute(this._registerClientOptions) + '/api/configuration/channel/' + encodeURIComponent(channelId),
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(channelConfigurationOptions)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to save configuration options.')
    }

    return response.json()
  }

  fetchUserChannels = async (username: string): Promise<ChannelLiveChatInfos[]> => {
    // FIXME: if more than 100 channels, loop (or add a pagination)
    const channels = await (await fetch(
      '/api/v1/accounts/' + encodeURIComponent(username) + '/video-channels?start=0&count=100&sort=name',
      {
        method: 'GET',
        headers: this._headers
      }
    )).json()
    if (!channels || !('data' in channels) || !Array.isArray(channels.data)) {
      throw new Error('Can\'t get the channel list.')
    }

    for (const channel of channels.data) {
      channel.livechatConfigurationUri = '/p/livechat/configuration/channel?channelId=' + encodeURIComponent(channel.id)

      // Note: since Peertube v6.0.0, channel.avatar is dropped, and we have to use channel.avatars.
      // So, if !channel.avatar, we will search a suitable one in channel.avatars, and fill channel.avatar.
      if (!channel.avatar && channel.avatars && Array.isArray(channel.avatars)) {
        for (const avatar of channel.avatars) {
          if (avatar.width === 120) {
            channel.avatar = avatar
            break
          }
        }
      }
    }

    return channels.data
  }

  fetchConfiguration = async (channelId: number): Promise<ChannelConfiguration> => {
    const response = await fetch(
      getBaseRoute(this._registerClientOptions) + '/api/configuration/channel/' + encodeURIComponent(channelId),
      {
        method: 'GET',
        headers: this._headers
      }
    )

    if (!response.ok) {
      throw new Error('Can\'t get channel configuration options.')
    }

    return response.json()
  }

  public async fetchEmojisConfiguration (channelId: number): Promise<ChannelEmojisConfiguration> {
    const response = await fetch(
      getBaseRoute(this._registerClientOptions) +
        '/api/configuration/channel/emojis/' +
        encodeURIComponent(channelId),
      {
        method: 'GET',
        headers: this._headers
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        // File does not exist yet, that is a normal use case.
      }
      throw new Error('Can\'t get channel emojis options.')
    }

    return response.json()
  }

  public async validateEmojisConfiguration (channelEmojis: ChannelEmojis): Promise<boolean> {
    const propertiesError: ValidationError['properties'] = {}

    const seen = new Map<string, true>()
    for (const [i, e] of channelEmojis.customEmojis.entries()) {
      propertiesError[`emojis.${i}.sn`] = []
      if (e.sn === '') {
        propertiesError[`emojis.${i}.sn`].push(ValidationErrorType.Missing)
      } else if (!/^:[\w-]+:$/.test(e.sn)) {
        propertiesError[`emojis.${i}.sn`].push(ValidationErrorType.WrongFormat)
      } else if (seen.has(e.sn)) {
        propertiesError[`emojis.${i}.sn`].push(ValidationErrorType.Duplicate)
      } else {
        seen.set(e.sn, true)
      }

      propertiesError[`emojis.${i}.url`] = []
      if (!e.url) {
        propertiesError[`emojis.${i}.url`].push(ValidationErrorType.Missing)
      }
    }

    if (Object.values(propertiesError).find(e => e.length > 0)) {
      const validationError = new ValidationError(
        'ChannelEmojisValidationError',
        await this._registerClientOptions.peertubeHelpers.translate(LOC_VALIDATION_ERROR),
        propertiesError
      )
      throw validationError
    }

    return true
  }

  public async saveEmojisConfiguration (
    channelId: number,
    channelEmojis: ChannelEmojis
  ): Promise<void> {
    if (!await this.validateEmojisConfiguration(channelEmojis)) {
      throw new Error('Invalid form data')
    }

    const response = await fetch(
      getBaseRoute(this._registerClientOptions) +
        '/api/configuration/channel/emojis/' +
        encodeURIComponent(channelId),
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(channelEmojis)
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        // File does not exist yet, that is a normal use case.
      }
      throw new Error('Can\'t get channel emojis options.')
    }
  }
}
