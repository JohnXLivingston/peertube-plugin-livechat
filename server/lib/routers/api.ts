// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../middlewares/async'
import { getCheckAPIKeyMiddleware } from '../middlewares/apikey'
import { ensureProsodyRunning } from '../prosody/ctl'
import { isUserAdmin } from '../helpers'
import { isDebugMode } from '../debug'
import { initRoomApiRouter } from './api/room'
import { initAuthApiRouter, initUserAuthApiRouter } from './api/auth'
import { initFederationServerInfosApiRouter } from './api/federation-server-infos'
import { initConfigurationApiRouter } from './api/configuration'
import { initPromoteApiRouter } from './api/promote'
import { initEmojisRouter } from './emojis'
import { initAdminFirewallApiRouter } from './api/admin/firewall'

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

  await initAuthApiRouter(options, router)
  await initUserAuthApiRouter(options, router)

  await initFederationServerInfosApiRouter(options, router)

  await initConfigurationApiRouter(options, router)
  await initPromoteApiRouter(options, router)
  await initEmojisRouter(options, router)

  await initAdminFirewallApiRouter(options, router)

  router.get('/restart_prosody', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      // The restart_prosody endpoint is accessible in any of the 2 following case:
      // * you are authenticated as an admin
      // * without authentication if the debug mode is enabled.
      // In debug mode, we want this API to be callable from debug tools.
      // This should not be an issue, as debug_mode should only be available on dev environments.
      const debugMode = isDebugMode(options)
      if (!(
        debugMode || await isUserAdmin(options, res)
      )) {
        res.json({ ok: false })
        return
      }
      const restartProsodyInDebugMode = debugMode && req.query.debugger === 'true'
      await ensureProsodyRunning(options, true, restartProsodyInDebugMode)
      res.json({ ok: true })
    }
  ))

  return router
}

export {
  initApiRouter
}
