// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { diag } from '../diagnostic'
import { getBaseStaticRoute, isUserAdmin } from '../helpers'
import { asyncMiddleware } from '../middlewares/async'

async function initSettingsRouter (options: RegisterServerOptions): Promise<Router> {
  const { peertubeHelpers, getRouter } = options
  const router = getRouter()
  const logger = peertubeHelpers.logger

  router.get('/diagnostic', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info('Accessing peertube-plugin-livechat diagnostic tool.')
      const src = getBaseStaticRoute(options) + 'settings/settings.js'
      res.status(200)
      res.type('html')
      res.send(`<html>
        <body><div>Loading...</div></body>
        <script type="module" src="${src}"></script>
        </html>
      `)
    }
  ))

  router.post('/diagnostic/test', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!res.locals.authenticated) {
        res.sendStatus(403)
        return
      }
      if (!await isUserAdmin(options, res)) {
        res.sendStatus(403)
        return
      }

      const test: string = req.body.test || ''
      logger.info('Accessing peertube-plugin-livechat diagnostic tool, test "' + test + '".')

      const result = await diag(test, options)

      res.status(200)
      res.json(result)
    }
  ))

  return router
}

export {
  initSettingsRouter
}
