// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Request, Response, NextFunction } from 'express'
import { getAPIKey } from '../apikey'

type CheckAPIKeyMiddlewareFunc = (req: Request, res: Response, next: NextFunction) => Promise<void>

function getCheckAPIKeyMiddleware (options: RegisterServerOptions): CheckAPIKeyMiddlewareFunc {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.query.apikey
    const apikey = await getAPIKey(options)
    if (key !== apikey) {
      options.peertubeHelpers.logger.warn('Invalid APIKEY')
      res.sendStatus(403)
      return
    }
    next()
  }
}

export {
  getCheckAPIKeyMiddleware
}
