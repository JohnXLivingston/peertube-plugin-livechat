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
import { getConverseJSParams } from '../../../lib/conversejs/params'

async function initConfigurationApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get('/configuration/room/:roomKey', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const roomKey = req.params.roomKey
      const initConverseJSParam = await getConverseJSParams(options, roomKey, {})
      if (('isError' in initConverseJSParam) && initConverseJSParam.isError) {
        res.sendStatus(initConverseJSParam.code)
        return
      }
      res.status(200)
      res.json(initConverseJSParam)
    }
  ))

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
        // Note: the front-end should do some input validation.
        // If there is any invalid value, we just return a 400 error.
        // The frontend should have prevented to post invalid data.

        // Note: if !bot.enabled, we wont try to save hidden fields values, to minimize the risk of error
        if (req.body.bot?.enabled === false) {
          logger.debug('Bot disabled, loading the previous bot conf to not override hidden fields')
          const channelOptions =
            await getChannelConfigurationOptions(options, channelInfos.id) ??
            getDefaultChannelConfigurationOptions(options)
          req.body.bot = channelOptions.bot
          req.body.bot.enabled = false
        }
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
