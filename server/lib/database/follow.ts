// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'

type FollowInfos = Record<string, {
  following: Date | null
}>

/**
 * Returns information about user following the channel.
 * @param options server options
 * @param channelId channel ID
 * @param user user to query (ActivityPub handles)
 */
async function getFollowInfos (
  options: RegisterServerOptions,
  channelId: number,
  user: string
): Promise<FollowInfos | false> {
  return false
}

export {
  getFollowInfos,
  FollowInfos
}
