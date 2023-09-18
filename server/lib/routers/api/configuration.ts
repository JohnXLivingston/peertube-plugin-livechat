import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { ChannelInfos } from '../../../../shared/lib/types'
import { asyncMiddleware } from '../../middlewares/async'
import { getCheckConfigurationChannelMiddleware } from '../../middlewares/configuration/channel'
import { checkConfigurationEnabledMiddleware } from '../../middlewares/configuration/configuration'
import {
  getChannelConfigurationOptions,
  getDefaultChannelConfigurationOptions,
  storeChannelConfigurationOptions
} from '../../configuration/channel/storage'
import { sanitizeChannelConfigurationOptions } from '../../configuration/channel/sanitize'

async function initConfigurationApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get('/configuration/channel/:channelId', asyncMiddleware([
    checkConfigurationEnabledMiddleware(options),
    getCheckConfigurationChannelMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      if (!res.locals.channelInfos) {
        logger.error('Missing channelInfos in res.locals, should not happen')
        res.sendStatus(500)
        return
      }
      const channelInfos = res.locals.channelInfos as ChannelInfos

      const channelOptions =
        await getChannelConfigurationOptions(options, channelInfos.id) ??
        getDefaultChannelConfigurationOptions(options)

      const result = {
        channel: channelInfos,
        configuration: channelOptions
      }
      res.status(200)
      res.json(result)
    }
  ]))

  router.post('/configuration/channel/:channelId', asyncMiddleware([
    checkConfigurationEnabledMiddleware(options),
    getCheckConfigurationChannelMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      if (!res.locals.channelInfos) {
        logger.error('Missing channelInfos in res.locals, should not happen')
        res.sendStatus(500)
        return
      }
      const channelInfos = res.locals.channelInfos as ChannelInfos
      logger.debug('Trying to save ChannelConfigurationOptions')

      let channelOptions
      try {
        channelOptions = await sanitizeChannelConfigurationOptions(options, channelInfos.id, req.body)
      } catch (err) {
        logger.warn(err)
        res.sendStatus(400)
        return
      }

      logger.debug('Data seems ok, storing them.')
      const result = {
        channel: channelInfos,
        configuration: channelOptions
      }
      await storeChannelConfigurationOptions(options, channelInfos.id, channelOptions)
      res.status(200)
      res.json(result)
    }
  ]))
}

export {
  initConfigurationApiRouter
}
