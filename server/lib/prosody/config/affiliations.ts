import type { RegisterServerOptions, MVideoThumbnail } from '@peertube/peertube-types'
import { getProsodyDomain } from './domain'
import { getUserNameByChannelId } from '../../database/channel'
import { BotConfiguration } from '../../configuration/bot'

interface Affiliations { [jid: string]: 'outcast' | 'none' | 'member' | 'admin' | 'owner' }

async function _getCommonAffiliations (options: RegisterServerOptions, _prosodyDomain: string): Promise<Affiliations> {
  const r: Affiliations = {}

  // Adding the moderation bot JID as room owner if feature is enabled.
  const settings = await options.settingsManager.getSettings([
    'disable-channel-configuration'
  ])
  const useBots = !settings['disable-channel-configuration']
  if (useBots) {
    r[BotConfiguration.singleton().moderationBotJID()] = 'owner'
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
      r[userJid] = 'owner'
    }
  } catch (error) {
    options.peertubeHelpers.logger.error('Failed to get channel owner informations:', error)
  }
}

async function getVideoAffiliations (options: RegisterServerOptions, video: MVideoThumbnail): Promise<Affiliations> {
  const prosodyDomain = await getProsodyDomain(options)
  const r = await _getCommonAffiliations(options, prosodyDomain)

  // Adding an affiliation for video owner
  if (!video.remote) {
    // don't add the video owner if it is a remote video!
    await _addAffiliationByChannelId(options, prosodyDomain, r, video.channelId)
  }

  return r
}

async function getChannelAffiliations (options: RegisterServerOptions, channelId: number): Promise<Affiliations> {
  const prosodyDomain = await getProsodyDomain(options)
  const r = await _getCommonAffiliations(options, prosodyDomain)

  // Adding an affiliation for channel owner
  // NB: remote channel can't be found, there are not in the videoChannel table.
  await _addAffiliationByChannelId(options, prosodyDomain, r, channelId)

  return r
}

export {
  Affiliations,
  getVideoAffiliations,
  getChannelAffiliations
}
