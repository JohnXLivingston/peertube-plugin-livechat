// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Request, Response, NextFunction } from 'express'
import type { RequestPromiseHandler } from '../async'
import { getChannelInfosById } from '../../database/channel'
import { isUserAdminOrModerator } from '../../helpers'

/**
 * Returns a middleware handler to get the channelInfos from the channel parameter.
 * This is used in api related to channel configuration options.
 * @param options Peertube server options
 * @returns middleware function
 */
function getCheckConfigurationChannelMiddleware (options: RegisterServerOptions): RequestPromiseHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const logger = options.peertubeHelpers.logger
    const channelId = req.params.channelId
    const currentUser = await options.peertubeHelpers.user.getAuthUser(res)

    if (!channelId || !/^\d+$/.test(channelId)) {
      res.sendStatus(400)
      return
    }

    const channelInfos = await getChannelInfosById(options, parseInt(channelId), true)
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
      logger.warn('Current user tries to access a channel for which they has no right.')
      res.sendStatus(403)
      return
    }

    logger.debug('User can access the configuration channel api.')
    res.locals.channelInfos = channelInfos
    next()
  }
}

export {
  getCheckConfigurationChannelMiddleware
}
