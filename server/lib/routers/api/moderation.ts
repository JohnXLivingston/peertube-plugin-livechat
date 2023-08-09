import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { ChannelModerationOptions } from '../../../../shared/lib/types'
import { asyncMiddleware } from '../../middlewares/async'
import { getChannelInfosById } from '../../database/channel'
import { isUserAdminOrModerator } from '../../helpers'

async function initModerationApiRouter (options: RegisterServerOptions): Promise<Router> {
  const router = options.getRouter()
  const logger = options.peertubeHelpers.logger

  router.get('/channel/:channelId', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const channelId = req.params.channelId
      const currentUser = await options.peertubeHelpers.user.getAuthUser(res)

      if (!channelId || !/^\d+$/.test(channelId)) {
        res.sendStatus(400)
        return
      }

      const channelInfos = await getChannelInfosById(options, parseInt(channelId))
      if (!channelInfos) {
        logger.warn(`Channel ${channelId} not found`)
        res.sendStatus(404)
        return
      }

      // To access this page, you must either be:
      // - the channel owner,
      // - an instance modo/admin
      // - TODO: a channel chat moderator, as defined in this page.
      if (channelInfos.ownerAccountId === currentUser.Account.id) {
        logger.debug('Current user is the channel owner')
      } else if (await isUserAdminOrModerator(options, res)) {
        logger.debug('Current user is an instance moderator or admin')
      } else {
        logger.warn('Current user tries to access a channel for which he has no right.')
        res.sendStatus(403)
        return
      }

      logger.debug('User can access the moderation channel api.')

      const result: ChannelModerationOptions = {
        channel: {
          id: channelInfos.id,
          name: channelInfos.name,
          displayName: channelInfos.displayName
        },
        bot: false,
        forbiddenWords: [],
        bannedJIDs: []
      }
      res.status(200)
      res.json(result)
    }
  ))

  return router
}

export {
  initModerationApiRouter
}
