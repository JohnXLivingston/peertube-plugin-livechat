// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Request, Response, NextFunction } from 'express'
import type { RequestPromiseHandler } from './async'
import { isUserAdmin } from '../helpers'

/**
 * Returns a middleware handler to check if advanced configuration is not disabled
 * @param options Peertube server options
 * @returns middleware function
 */
function checkUserIsAdminMiddleware (options: RegisterServerOptions): RequestPromiseHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const logger = options.peertubeHelpers.logger
    if (!await isUserAdmin(options, res)) {
      logger.warn('Current user tries to access a page only allowed for admins, and has no right.')
      res.sendStatus(403)
      return
    }

    logger.debug('User is admin, can access the page..')
    next()
  }
}

export {
  checkUserIsAdminMiddleware
}
