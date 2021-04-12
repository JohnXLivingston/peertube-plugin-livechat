import type { Router, Request, Response, NextFunction } from 'express'
import { diag } from '../diagnostic'
import { getBaseStaticRoute, isUserAdmin } from '../helpers'

async function initSettingsRouter ({
  peertubeHelpers,
  getRouter,
  settingsManager
}: RegisterServerOptions): Promise<Router> {
  const router = getRouter()
  const logger = peertubeHelpers.logger

  router.get('/diagnostic', async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Accessing peertube-plugin-livechat diagnostic tool.')
      const src = getBaseStaticRoute() + 'settings/settings.js'
      res.status(200)
      res.type('html')
      res.send('<html><body><div>Loading...</div></body><script src="' + src + '"></script></html>')
    } catch (error) {
      return next(error)
    }
  })

  router.post('/diagnostic/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.authenticated) {
        return res.sendStatus(403)
      }
      if (!isUserAdmin(res)) {
        return res.sendStatus(403)
      }

      const test: string = req.body.test || ''
      logger.info('Accessing peertube-plugin-livechat diagnostic tool, test "' + test + '".')

      const result = await diag(test, settingsManager)

      res.status(200)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  })

  return router
}

export {
  initSettingsRouter
}
