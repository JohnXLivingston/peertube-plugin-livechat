// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Affiliations } from '../config/affiliations'
import { getCurrentProsody } from './host'
import { getAPIKey } from '../../apikey'
import { getProsodyDomain } from '../config/domain'
const got = require('got')

interface ProsodyRoomDesc {
  jid: string
  localpart: string
  name: string
  lang: string
  description: string
  lasttimestamp?: number
}

/**
 * Lists existing chatrooms.
 * @param options Peertube server options
 * @returns List of chat rooms on the Prosody server
 */
async function listProsodyRooms (options: RegisterServerOptions): Promise<ProsodyRoomDesc[]> {
  const logger = options.peertubeHelpers.logger

  const currentProsody = getCurrentProsody()
  if (!currentProsody) {
    throw new Error('It seems that prosody is not binded... Cant list rooms.')
  }

  // Requesting on localhost, because currentProsody.host does not always resolves correctly (docker use case, ...)
  const apiUrl = `http://localhost:${currentProsody.port}/peertubelivechat_manage_rooms/list-rooms`
  logger.debug('Calling list rooms API on url: ' + apiUrl)
  const rooms = await got(apiUrl, {
    method: 'GET',
    headers: {
      authorization: 'Bearer ' + await getAPIKey(options),
      host: currentProsody.host
    },
    responseType: 'json',
    resolveBodyOnly: true
  })

  return rooms
}

/**
 * Update room metadata on the Prosody server.
 * Uses an API provided by mod_http_peertubelivechat_manage_rooms.
 *
 * Note: could be called without verifying that the room exists.
 * On the Prosody side, non existing rooms will be ignored.
 * @param options Peertube server options
 * @param jid Room JID (can be only the local part, or the local + domain)
 * @param data Data to update. Note: will only try to update data that are given.
 * @returns true if success
 */
async function updateProsodyRoom (
  options: RegisterServerOptions,
  jid: string,
  data: {
    name?: string
    slow_mode_duration?: number
    moderation_delay?: number
    livechat_emoji_only?: boolean
    livechat_custom_emoji_regexp?: string
    livechat_muc_terms?: string
    addAffiliations?: Affiliations
    removeAffiliationsFor?: string[]
  }
): Promise<boolean> {
  const logger = options.peertubeHelpers.logger

  const currentProsody = getCurrentProsody()
  if (!currentProsody) {
    throw new Error('It seems that prosody is not binded... Cant update room.')
  }

  if (!jid.includes('@')) {
    jid = jid + '@room.' + await getProsodyDomain(options)
  }

  logger.debug('Calling update room for ' + jid)

  // Requesting on localhost, because currentProsody.host does not always resolves correctly (docker use case, ...)
  const apiUrl = `http://localhost:${currentProsody.port}/peertubelivechat_manage_rooms/update-room`
  const apiData = {
    jid
  } as any
  if (('name' in data) && data.name !== undefined) {
    apiData.name = data.name
  }
  if (('slow_mode_duration' in data) && data.slow_mode_duration !== undefined) {
    apiData.slow_mode_duration = data.slow_mode_duration
  }
  if (('moderation_delay' in data) && data.moderation_delay !== undefined) {
    apiData.moderation_delay = data.moderation_delay
  }
  if ('livechat_muc_terms' in data) {
    apiData.livechat_muc_terms = data.livechat_muc_terms ?? ''
  }
  if ('livechat_emoji_only' in data) {
    apiData.livechat_emoji_only = data.livechat_emoji_only ?? false
  }
  if ('livechat_custom_emoji_regexp' in data) {
    apiData.livechat_custom_emoji_regexp = data.livechat_custom_emoji_regexp ?? ''
  }
  if (('addAffiliations' in data) && data.addAffiliations !== undefined) {
    apiData.addAffiliations = data.addAffiliations
  }
  if (('removeAffiliationsFor' in data) && data.removeAffiliationsFor !== undefined) {
    apiData.removeAffiliationsFor = data.removeAffiliationsFor
  }
  try {
    logger.debug('Calling update room API on url: ' + apiUrl)
    const result = await got(apiUrl, {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + await getAPIKey(options),
        host: currentProsody.host
      },
      json: apiData,
      responseType: 'json',
      resolveBodyOnly: true
    })

    logger.debug('Update room API response: ' + JSON.stringify(result))
  } catch (err) {
    // We consider it is not very bad if the metadata are not correctly updated.
    // Nothing too important.
    logger.error(`Failed to update room: ' ${err as string}`)
    return false
  }
  return true
}

export {
  listProsodyRooms,
  updateProsodyRoom
}
