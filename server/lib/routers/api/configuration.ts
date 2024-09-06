// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { ChannelConfiguration, ChannelEmojisConfiguration, ChannelInfos } from '../../../../shared/lib/types'
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
import { Emojis } from '../../../lib/emojis'
import { RoomChannel } from '../../../lib/room-channel'
import { updateProsodyRoom } from '../../../lib/prosody/api/manage-rooms'

async function initConfigurationApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get('/configuration/room/:roomKey', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const roomKey = req.params.roomKey

      const user = await options.peertubeHelpers.user.getAuthUser(res)

      const initConverseJSParam = await getConverseJSParams(
        options,
        roomKey,
        {
          forcetype: req.query.forcetype === '1'
        },
        !!user
      )
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

      const result: ChannelConfiguration = {
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
      const result: ChannelConfiguration = {
        channel: channelInfos,
        configuration: channelOptions
      }
      await storeChannelConfigurationOptions(options, channelInfos.id, channelOptions)
      res.status(200)
      res.json(result)
    }
  ]))

  router.get('/configuration/channel/emojis/:channelId', asyncMiddleware([
    checkConfigurationEnabledMiddleware(options),
    getCheckConfigurationChannelMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        if (!res.locals.channelInfos) {
          throw new Error('Missing channelInfos in res.locals, should not happen')
        }

        const emojis = Emojis.singleton()
        const channelInfos = res.locals.channelInfos as ChannelInfos

        const channelEmojis =
          (await emojis.channelCustomEmojisDefinition(channelInfos.id)) ??
          emojis.emptyChannelDefinition()

        const result: ChannelEmojisConfiguration = {
          channel: channelInfos,
          emojis: channelEmojis
        }
        res.status(200)
        res.json(result)
      } catch (err) {
        logger.error(err)
        res.sendStatus(500)
      }
    }
  ]))

  router.post('/configuration/channel/emojis/:channelId', asyncMiddleware([
    checkConfigurationEnabledMiddleware(options),
    getCheckConfigurationChannelMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        if (!res.locals.channelInfos) {
          throw new Error('Missing channelInfos in res.locals, should not happen')
        }

        const emojis = Emojis.singleton()
        const channelInfos = res.locals.channelInfos as ChannelInfos

        const emojisDefinition = req.body
        let emojisDefinitionSanitized, bufferInfos
        try {
          [emojisDefinitionSanitized, bufferInfos] = await emojis.sanitizeChannelDefinition(
            channelInfos.id,
            emojisDefinition
          )
        } catch (err) {
          logger.warn(err)
          res.sendStatus(400)
          return
        }

        await emojis.saveChannelDefinition(channelInfos.id, emojisDefinitionSanitized, bufferInfos)

        // We must update the emoji only regexp on the Prosody server.
        const customEmojisRegexp = await emojis.getChannelCustomEmojisRegexp(channelInfos.id)
        const roomJIDs = RoomChannel.singleton().getChannelRoomJIDs(channelInfos.id)
        for (const roomJID of roomJIDs) {
          // No need to await here
          logger.info(`Updating room ${roomJID} emoji only regexp...`)
          updateProsodyRoom(options, roomJID, {
            livechat_custom_emoji_regexp: customEmojisRegexp
          }).then(
            () => {},
            (err) => logger.error(err)
          )
        }

        // Reloading data, to send them back to front:
        const channelEmojis =
          (await emojis.channelCustomEmojisDefinition(channelInfos.id)) ??
          emojis.emptyChannelDefinition()
        const result: ChannelEmojisConfiguration = {
          channel: channelInfos,
          emojis: channelEmojis
        }
        res.status(200)
        res.json(result)
      } catch (err) {
        logger.error(err)
        res.sendStatus(500)
      }
    }
  ]))

  router.post('/configuration/channel/emojis/:channelId/enable_emoji_only', asyncMiddleware([
    checkConfigurationEnabledMiddleware(options),
    getCheckConfigurationChannelMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        if (!res.locals.channelInfos) {
          throw new Error('Missing channelInfos in res.locals, should not happen')
        }

        const emojis = Emojis.singleton()
        const channelInfos = res.locals.channelInfos as ChannelInfos

        logger.info(`Enabling emoji only mode on each channel ${channelInfos.id} rooms ...`)

        // We can also update the EmojisRegexp, just in case.
        const customEmojisRegexp = await emojis.getChannelCustomEmojisRegexp(channelInfos.id)
        const roomJIDs = RoomChannel.singleton().getChannelRoomJIDs(channelInfos.id)
        for (const roomJID of roomJIDs) {
          // No need to await here
          logger.info(`Enabling emoji only mode on room ${roomJID} ...`)
          updateProsodyRoom(options, roomJID, {
            livechat_emoji_only: true,
            livechat_custom_emoji_regexp: customEmojisRegexp
          }).then(
            () => {},
            (err) => logger.error(err)
          )
        }

        res.status(200)
        res.json({ ok: true })
      } catch (err) {
        logger.error(err)
        res.sendStatus(500)
      }
    }
  ]))
}

export {
  initConfigurationApiRouter
}
