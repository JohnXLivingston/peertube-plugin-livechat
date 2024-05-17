import type { RegisterServerOptions } from '@peertube/peertube-types'
import { listProsodyRooms, updateProsodyRoom } from '../api/manage-rooms'
import { Affiliations, getVideoAffiliations, getChannelAffiliations } from '../config/affiliations'
import { getProsodyDomain } from '../config/domain'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Livechat v10.0.0: we change the way MUC affiliations are handled.
 * So we must remove all affiliations to peertube admin/owner (unless there are video/channel owners).
 * For more info, see https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/385
 *
 * This script will only be launched one time.
 */
async function migrateMUCAffiliations (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger

  // First, detect if we already run this script.
  const doneFilePath = path.resolve(options.peertubeHelpers.plugin.getDataDirectoryPath(), 'fix-v10-affiliations')
  if (fs.existsSync(doneFilePath)) {
    logger.debug('[migratev10MUCAffiliations] MUC affiliations for v10 already migrated.')
    return
  }

  logger.info('[migratev10MUCAffiliations] Migrating MUC affiliations for livechat v10...')

  const prosodyDomain = await getProsodyDomain(options)
  const rooms = await listProsodyRooms(options)
  logger.debug('[migratev10MUCAffiliations] Found ' + rooms.length.toString() + ' rooms.')

  logger.debug('[migratev10MUCAffiliations] loading peertube admins and moderators...')
  const peertubeAff = await _getPeertubeAdminsAndModerators(options, prosodyDomain)

  for (const room of rooms) {
    try {
      let affiliations: Affiliations
      logger.info('[migratev10MUCAffiliations] Must migrate affiliations for room ' + room.localpart)
      const matches = room.localpart.match(/^channel\.(\d+)$/)
      if (matches?.[1]) {
        // room associated to a channel
        const channelId: number = parseInt(matches[1])
        if (isNaN(channelId)) { throw new Error('Invalid channelId ' + room.localpart) }
        affiliations = await getChannelAffiliations(options, channelId)
      } else {
        // room associated to a video
        const video = await options.peertubeHelpers.videos.loadByIdOrUUID(room.localpart)
        if (!video || video.remote) {
          logger.info('[migratev10MUCAffiliations] Video ' + room.localpart + ' not found or remote, skipping')
          continue
        }
        affiliations = await getVideoAffiliations(options, video)
      }

      const affiliationsToRemove: string[] = []
      for (const jid in peertubeAff) {
        if (jid in affiliations) {
          continue
        }
        affiliationsToRemove.push(jid)
      }

      logger.debug(
        '[migratev10MUCAffiliations] Room ' + room.localpart + ', affiliations to set: ' + JSON.stringify(affiliations)
      )
      logger.debug(
        '[migratev10MUCAffiliations] Room ' +
        room.localpart + ', affilations to remove: ' + JSON.stringify(affiliationsToRemove)
      )
      await updateProsodyRoom(options, room.jid, {
        addAffiliations: affiliations,
        removeAffiliationsFor: affiliationsToRemove
      })
    } catch (err) {
      logger.error(
        '[migratev10MUCAffiliations] Failed to handle room ' + room.localpart + ', skipping. Error: ' + (err as string)
      )
      continue
    }
  }

  await fs.promises.writeFile(doneFilePath, '')
}

async function _getPeertubeAdminsAndModerators (
  options: RegisterServerOptions,
  prosodyDomain: string
): Promise<Affiliations> {
  // Get all admins and moderators
  const [results] = await options.peertubeHelpers.database.query(
    'SELECT "username" FROM "user"' +
    ' WHERE "user"."role" IN (0, 1)'
  )
  if (!Array.isArray(results)) {
    throw new Error('_getPeertubeAdminsAndModerators: query result is not an array.')
  }
  const r: Affiliations = {}
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (typeof result !== 'object') {
      throw new Error('_getPeertubeAdminsAndModerators: query result is not an object')
    }
    if (!('username' in result)) {
      throw new Error('_getPeertubeAdminsAndModerators: no username field in result')
    }
    const jid = (result.username as string) + '@' + prosodyDomain
    r[jid] = 'member' // member, but in fact the migration will just remove the affilation.
  }
  return r
}

export {
  migrateMUCAffiliations
}
