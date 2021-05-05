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
