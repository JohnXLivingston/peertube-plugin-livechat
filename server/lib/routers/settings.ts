import type { Router, Request, Response, NextFunction } from 'express'
import { getBaseStaticRoute, isUserAdmin } from '../helpers'

interface Result {
  label?: string
  messages: string[]
  next?: string
  ok: boolean
  test: string
}

async function initSettingsRouter ({
  peertubeHelpers,
  getRouter
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

      let result: Result
      if (test === 'backend') {
        result = {
          ok: true,
          label: 'Backend connection',
          test: test,
          messages: []
        }
      } else {
        result = {
          label: test,
          test: test,
          messages: ['Unknown test'],
          ok: false
        }
      }

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
