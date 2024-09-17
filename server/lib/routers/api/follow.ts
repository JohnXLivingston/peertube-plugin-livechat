// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../../middlewares/async'
import { getCheckAPIKeyMiddleware } from '../../middlewares/apikey'

/**
 * Instanciate the route for follow APIs.
 * These APIs are used by Prosody to get the follow status of users.
 * @param options server register options
 */
async function initFollowApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get('/follow', asyncMiddleware([
    getCheckAPIKeyMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info('Requesting follow information.')
      res.json({})
    }
  ]))
}

export {
  initFollowApiRouter
}
