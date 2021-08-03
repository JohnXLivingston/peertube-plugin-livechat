import { getProsodyDomain } from './domain'
import { getUserNameByChannelId } from '../../database/channel'

interface Affiliations { [jid: string]: 'outcast' | 'none' | 'member' | 'admin' | 'owner' }

async function getVideoAffiliations (options: RegisterServerOptions, video: MVideoThumbnail): Promise<Affiliations> {
  const peertubeHelpers = options.peertubeHelpers
  const prosodyDomain = await getProsodyDomain(options)
  // Get all admins and moderators
  const [results] = await peertubeHelpers.database.query(
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

  // Adding an 'admin' affiliation for video owner
  // NB: if it fails, we want previous results to be returned...
  try {
    if (!video.remote) {
      // don't add the video owner if it is a remote video!
      const userName = await _getVideoOwnerUsername(options, video)
      const userJid = userName + '@' + prosodyDomain
      if (!(userJid in r)) { // don't override if already owner!
        r[userJid] = 'admin'
      }
    }
  } catch (error) {
    peertubeHelpers.logger.error('Failed to get video owner informations:', error)
  }

  return r
}

async function _getVideoOwnerUsername (options: RegisterServerOptions, video: MVideoThumbnail): Promise<string> {
  const username = await getUserNameByChannelId(options, video.channelId)
  if (username === null) {
    throw new Error('Username not found')
  }
  return username
}

export {
  Affiliations,
  getVideoAffiliations
}
