// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ValidationError } from '../../lib/models/validation'
import type { ChannelLiveChatInfos, ChannelConfiguration, ChannelConfigurationOptions } from 'shared/lib/types'
import { ValidationErrorType } from '../../lib/models/validation'
import { getBaseRoute } from '../../../utils/uri'

export class ChannelDetailsService {
  public _registerClientOptions: RegisterClientOptions

  private readonly _headers: any = {}

  constructor (registerClientOptions: RegisterClientOptions) {
    this._registerClientOptions = registerClientOptions

    this._headers = this._registerClientOptions.peertubeHelpers.getAuthHeader() ?? {}
    this._headers['content-type'] = 'application/json;charset=UTF-8'
  }

  validateOptions = (channelConfigurationOptions: ChannelConfigurationOptions): boolean => {
    let hasErrors = false
    const validationError: ValidationError = {
      name: 'ChannelConfigurationOptionsValidationError',
      message: 'There was an error during validation',
      properties: {}
    }
    const botConf = channelConfigurationOptions.bot
    const slowModeDuration = channelConfigurationOptions.slowMode.duration

    validationError.properties['slowMode.duration'] = []

    if (
      (typeof slowModeDuration !== 'number') ||
      isNaN(slowModeDuration)) {
      validationError.properties['slowMode.duration'].push(ValidationErrorType.WrongType)
      hasErrors = true
    } else if (
      slowModeDuration < 0 ||
      slowModeDuration > 1000
    ) {
      validationError.properties['slowMode.duration'].push(ValidationErrorType.NotInRange)
      hasErrors = true
    }

    // If !bot.enabled, we don't have to validate these fields:
    // The backend will ignore those values.
    if (botConf.enabled) {
      validationError.properties['bot.nickname'] = []

      if (/[^\p{L}\p{N}\p{Z}_-]/u.test(botConf.nickname ?? '')) {
        validationError.properties['bot.nickname'].push(ValidationErrorType.WrongFormat)
        hasErrors = true
      }

      for (const [i, fw] of botConf.forbiddenWords.entries()) {
        for (const v of fw.entries) {
          validationError.properties[`bot.forbiddenWords.${i}.entries`] = []
          if (fw.regexp) {
            if (v.trim() !== '') {
              try {
                const test = new RegExp(v)
                test.test(v)
              } catch (_) {
                validationError.properties[`bot.forbiddenWords.${i}.entries`]
                  .push(ValidationErrorType.WrongFormat)
                hasErrors = true
              }
            }
          }
        }
      }

      for (const [i, cd] of botConf.commands.entries()) {
        validationError.properties[`bot.commands.${i}.command`] = []

        if (/\s+/.test(cd.command)) {
          validationError.properties[`bot.commands.${i}.command`].push(ValidationErrorType.WrongFormat)
          hasErrors = true
        }
      }
    }

    if (hasErrors) {
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
}
