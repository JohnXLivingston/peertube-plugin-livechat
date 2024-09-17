// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../middlewares/async'
import { getCheckAPIKeyMiddleware } from '../middlewares/apikey'
import { ensureProsodyRunning } from '../prosody/ctl'
import { isDebugMode } from '../debug'
import { initRoomApiRouter } from './api/room'
import { initAuthApiRouter, initUserAuthApiRouter } from './api/auth'
import { initFederationServerInfosApiRouter } from './api/federation-server-infos'
import { initConfigurationApiRouter } from './api/configuration'
import { initPromoteApiRouter } from './api/promote'
import { initEmojisRouter } from './emojis'
import { initAdminFirewallApiRouter } from './api/admin/firewall'
import { initFollowApiRouter } from './api/follow'

/**
 * Initiate API routes
 * @param options server register options
 * @returns the router
 */
async function initApiRouter (options: RegisterServerOptions): Promise<Router> {
  const { peertubeHelpers, getRouter } = options
  const router = getRouter()
  const logger = peertubeHelpers.logger

  // /test endpoint: used by the prosody module http_peertubelivechat_test to test Peertube API.
  router.get('/test', asyncMiddleware([
    getCheckAPIKeyMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info('Test api call')
      res.json({ ok: true })
    }
  ]))

  await initRoomApiRouter(options, router)
  await initFollowApiRouter(options, router)

  await initAuthApiRouter(options, router)
  await initUserAuthApiRouter(options, router)

  await initFederationServerInfosApiRouter(options, router)

  await initConfigurationApiRouter(options, router)
  await initPromoteApiRouter(options, router)
  await initEmojisRouter(options, router)

  await initAdminFirewallApiRouter(options, router)

  if (isDebugMode(options)) {
    // Only add this route if the debug mode is enabled at time of the server launch.
    // Note: the isDebugMode will be tested again when the API is called.
    // Note: we dont authenticate the user. We want this API to be callable from debug tools.
    //       This should not be an issue, as debug_mode should only be available on dev environments.
    router.get('/restart_prosody', asyncMiddleware(
      async (req: Request, res: Response, _next: NextFunction) => {
        if (!isDebugMode(options)) {
          res.json({ ok: false })
          return
        }
        const restartProsodyInDebugMode = req.query.debugger === 'true'
        await ensureProsodyRunning(options, true, restartProsodyInDebugMode)
        res.json({ ok: true })
      }
    ))
  }

  return router
}

export {
  initApiRouter
}
