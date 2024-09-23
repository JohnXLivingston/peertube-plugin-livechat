// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../../middlewares/async'
import { getCheckAPIKeyMiddleware } from '../../middlewares/apikey'
import { RoomChannel } from '../../room-channel'
import { getFollowInfos, FollowInfos } from '../../database/follow'

/**
 * Instanciate the route for follow APIs.
 * These APIs are used by Prosody to get the follow status of users.
 * @param options server register options
 */
async function initFollowApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.post('/follow', asyncMiddleware([
    getCheckAPIKeyMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info('Requesting follow information.')
      try {
        const data = req.body
        if (typeof data !== 'object') {
          logger.warn('Body data type is not an object.')
          res.sendStatus(400)
          return
        }

        const result: Record<string, FollowInfos | false> = {}

        for (const key in data) {
          const entry = data[key]
          if (typeof entry !== 'object') {
            logger.warn('Body data entry type is not an object.')
            res.sendStatus(400)
            return
          }
          const roomJID = entry.room
          const user = entry.user
          if (typeof roomJID !== 'string') {
            logger.warn('Entry room is not a string.')
            res.sendStatus(400)
            return
          }
          if (typeof user !== 'string') {
            logger.warn('Entry user is not a string.')
            res.sendStatus(400)
            return
          }

          const channelId = RoomChannel.singleton().getRoomChannelId(roomJID)
          if (!channelId) {
            logger.warn('Can\'t find channel for room ' + roomJID)
            result[key] = false
            continue
          }

          const follow = await getFollowInfos(options, channelId, user)
          result[key] = follow
        }

        // logger.debug('Follow API result: ' + JSON.stringify(result))
        res.json(result)
      } catch (err) {
        logger.error('Failed to compute follow infos: ' + (err as string))
        res.sendStatus(500)
      }
    }
  ]))
}

export {
  initFollowApiRouter
}
