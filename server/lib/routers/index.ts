// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { NextFunction, Request, Response } from 'express'
import { initWebchatRouter } from './webchat'
import { initSettingsRouter } from './settings'
import { initApiRouter } from './api'
import { initOIDCRouter } from './oidc'

async function initRouters (options: RegisterServerOptions): Promise<void> {
  const { getRouter } = options

  const router = getRouter()
  router.get(
    '/ping',
    (req: Request, res: Response, _next: NextFunction) => {
      res.json({ message: 'pong' })
    }
  )

  router.use('/webchat', await initWebchatRouter(options))
  router.use('/settings', await initSettingsRouter(options))
  router.use('/api', await initApiRouter(options))
  router.use('/oidc', await initOIDCRouter(options))
}

export {
  initRouters
}
