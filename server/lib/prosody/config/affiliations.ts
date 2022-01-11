import type { RegisterServerOptions, MVideoThumbnail } from '@peertube/peertube-types'
import { getProsodyDomain } from './domain'
import { getUserNameByChannelId } from '../../database/channel'

interface Affiliations { [jid: string]: 'outcast' | 'none' | 'member' | 'admin' | 'owner' }

async function _getCommonAffiliations (options: RegisterServerOptions, prosodyDomain: string): Promise<Affiliations> {
  // Get all admins and moderators
  const [results] = await options.peertubeHelpers.database.query(
    'SELECT "username" FROM "user"' +
    ' WHERE "user"."role" IN (0, 1)'
  )
  if (!Array.isArray(results)) {
    throw new Error('getVideoAffiliations: query result is not an array.')
  }
  const r: Affiliations = {}
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (typeof result !== 'object') {
      throw new Error('getVideoAffiliations: query result is not an object')
    }
    if (!('username' in result)) {
      throw new Error('getVideoAffiliations: no username field in result')
    }
    const jid = (result.username as string) + '@' + prosodyDomain
    r[jid] = 'owner'
  }

  return r
}

async function _addAffiliationByChannelId (
  options: RegisterServerOptions,
  prosodyDomain: string,
  r: Affiliations,
  channelId: number
): Promise<void> {
  // NB: if it fails, we want previous results to be returned...
  try {
    const username = await getUserNameByChannelId(options, channelId)
    if (username === null) {
      options.peertubeHelpers.logger.error(`Failed to get the username for channelId '${channelId}'.`)
    } else {
      const userJid = username + '@' + prosodyDomain
      if (!(userJid in r)) { // don't override if already owner!
        r[userJid] = 'admin'
      }
    }
  } catch (error) {
    options.peertubeHelpers.logger.error('Failed to get channel owner informations:', error)
  }
}

async function getVideoAffiliations (options: RegisterServerOptions, video: MVideoThumbnail): Promise<Affiliations> {
  const prosodyDomain = await getProsodyDomain(options)
  const r = await _getCommonAffiliations(options, prosodyDomain)

  // Adding an 'admin' affiliation for video owner
  if (!video.remote) {
    // don't add the video owner if it is a remote video!
    await _addAffiliationByChannelId(options, prosodyDomain, r, video.channelId)
  }

  return r
}

async function getChannelAffiliations (options: RegisterServerOptions, channelId: number): Promise<Affiliations> {
  const prosodyDomain = await getProsodyDomain(options)
  const r = await _getCommonAffiliations(options, prosodyDomain)

  // Adding an 'admin' affiliation for channel owner
  // NB: remote channel can't be found, there are not in the videoChannel table.
  await _addAffiliationByChannelId(options, prosodyDomain, r, channelId)

  return r
}

export {
  Affiliations,
  getVideoAffiliations,
  getChannelAffiliations
}
