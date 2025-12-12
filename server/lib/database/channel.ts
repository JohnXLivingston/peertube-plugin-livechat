// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { getPeertubeVersion } from '../helpers'

async function getChannelNameById (options: RegisterServerOptions, channelId: number): Promise<string | null> {
  if (!channelId) {
    throw new Error('Missing channelId')
  }
  if (!Number.isInteger(channelId)) {
    throw new Error('Invalid channelId: not an integer')
  }
  const [results] = await options.peertubeHelpers.database.query(
    getPeertubeVersion().major >= 8
      ? (
          'SELECT "actor"."preferredUsername"' +
          ' FROM "actor"' +
          ' WHERE "videoChannelId" = ' + channelId.toString()
        )
      : (
          'SELECT "actor"."preferredUsername"' +
          ' FROM "videoChannel"' +
          ' RIGHT JOIN "actor" ON "actor"."id" = "videoChannel"."actorId"' +
          ' WHERE "videoChannel"."id" = ' + channelId.toString()
        )
  )
  if (!Array.isArray(results)) {
    throw new Error('getChannelNameById: query result is not an array.')
  }
  if (!results[0]) {
    options.peertubeHelpers.logger.debug(`getChannelNameById: channel ${channelId} not found.`)
    return null
  }
  return results[0].preferredUsername ?? null
}

async function getUserNameByChannelId (options: RegisterServerOptions, channelId: number): Promise<string | null> {
  if (!channelId) {
    throw new Error('Missing channelId')
  }
  if (!Number.isInteger(channelId)) {
    throw new Error('Invalid channelId: not an integer')
  }
  const [results] = await options.peertubeHelpers.database.query(
    'SELECT "user"."username"' +
    ' FROM "videoChannel"' +
    ' JOIN "account" ON "account"."id" = "videoChannel"."accountId"' +
    ' JOIN "user" ON "account"."userId" = "user"."id" ' +
    ' WHERE "videoChannel"."id" = ' + channelId.toString()
  )
  if (!Array.isArray(results)) {
    throw new Error('getUserNameByChannelId: query result is not an array.')
  }
  if (!results[0]) {
    options.peertubeHelpers.logger.debug(`getUserNameByChannelId: channel ${channelId} not found.`)
    return null
  }
  return results[0].username ?? null
}

interface ChannelInfos {
  id: number
  name: string
  displayName: string
  ownerAccountId: number
}

async function getChannelInfosById (
  options: RegisterServerOptions,
  channelId: number,
  restrictToLocalChannels = false
): Promise<ChannelInfos | null> {
  if (!channelId) {
    throw new Error('Missing channelId')
  }
  if (!Number.isInteger(channelId)) {
    throw new Error('Invalid channelId: not an integer')
  }
  const [results] = await options.peertubeHelpers.database.query(
    getPeertubeVersion().major >= 8
      ? (
          'SELECT' +
          ' "actor"."preferredUsername" as "channelName",' +
          ' "videoChannel"."id" as "channelId",' +
          ' "videoChannel"."name" as "channelDisplayName",' +
          ' "videoChannel"."accountId" as "ownerAccountId"' +
          ' FROM "videoChannel"' +
          ' INNER JOIN "actor" ON "actor"."videoChannelId" = "videoChannel"."id"' +
          ' WHERE "videoChannel"."id" = ' + channelId.toString() +
          (restrictToLocalChannels
            ? ' AND "serverId" is null '
            : ''
          )
        )
      : (
          'SELECT' +
          ' "actor"."preferredUsername" as "channelName",' +
          ' "videoChannel"."id" as "channelId",' +
          ' "videoChannel"."name" as "channelDisplayName",' +
          ' "videoChannel"."accountId" as "ownerAccountId"' +
          ' FROM "videoChannel"' +
          ' RIGHT JOIN "actor" ON "actor"."id" = "videoChannel"."actorId"' +
          ' WHERE "videoChannel"."id" = ' + channelId.toString() +
          (restrictToLocalChannels
            ? ' AND "serverId" is null '
            : ''
          )
        )
  )
  if (!Array.isArray(results)) {
    throw new Error('getChannelInfosById: query result is not an array.')
  }
  if (!results[0]) {
    options.peertubeHelpers.logger.debug(`getChannelInfosById: channel ${channelId} not found.`)
    return null
  }
  return {
    id: results[0].channelId,
    name: results[0].channelName ?? '',
    displayName: results[0].channelDisplayName ?? '',
    ownerAccountId: results[0].ownerAccountId
  }
}

export {
  getChannelNameById,
  getUserNameByChannelId,
  getChannelInfosById
}
