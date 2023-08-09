import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { ChannelInfos } from '../../../../shared/lib/types'
import { asyncMiddleware } from '../../middlewares/async'
import { getCheckModerationChannelMiddleware } from '../../middlewares/moderation/channel'
import { getChannelModerationOptions, storeChannelModerationOptions } from '../../moderation/channel/storage'
import { sanitizeChannelModerationOptions } from '../../moderation/channel/sanitize'

async function initModerationApiRouter (options: RegisterServerOptions): Promise<Router> {
  const router = options.getRouter()
  const logger = options.peertubeHelpers.logger

  router.get('/channel/:channelId', asyncMiddleware([
    getCheckModerationChannelMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      if (!res.locals.channelInfos) {
        logger.error('Missing channelInfos in res.locals, should not happen')
        res.sendStatus(500)
        return
      }
      const channelInfos = res.locals.channelInfos as ChannelInfos

      const result = await getChannelModerationOptions(options, channelInfos)
      res.status(200)
      res.json(result)
    }
  ]))

  router.post('/channel/:channelId', asyncMiddleware([
    getCheckModerationChannelMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      if (!res.locals.channelInfos) {
        logger.error('Missing channelInfos in res.locals, should not happen')
        res.sendStatus(500)
        return
      }
      const channelInfos = res.locals.channelInfos as ChannelInfos
      logger.debug('Trying to save ChannelModerationOptions')

      let moderation
      try {
        moderation = await sanitizeChannelModerationOptions(options, channelInfos, req.body)
      } catch (err) {
        logger.warn(err)
        res.sendStatus(400)
        return
      }

      logger.debug('Data seems ok, storing them.')
      const result = {
        channel: channelInfos,
        moderation
      }
      await storeChannelModerationOptions(options, result)
      res.status(200)
      res.json(result)
    }
  ]))

  return router
}

export {
  initModerationApiRouter
}
