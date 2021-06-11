import type { Router, Request, Response, NextFunction } from 'express'
import type { ChatType, ProsodyListRoomsResult } from '../../../shared/lib/types'
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
      res.send('<html><body><div>Loading...</div></body><script src="' + src + '"></script></html>')
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

  router.get('/prosody-list-rooms', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!res.locals.authenticated) {
        res.sendStatus(403)
        return
      }
      if (!await isUserAdmin(options, res)) {
        res.sendStatus(403)
        return
      }

      const chatType: ChatType = await options.settingsManager.getSetting('chat-type') as ChatType
      if (chatType !== 'builtin-prosody') {
        const message = 'Please save the settings first.' // TODO: translate?
        res.status(200)
        const r: ProsodyListRoomsResult = {
          ok: false,
          error: message
        }
        res.json(r)
        return
      }

      res.status(200)
      const r: ProsodyListRoomsResult = {
        ok: true,
        rooms: [] // TODO: get room list from Prosody
      }
      res.json(r)
    }
  ))

  return router
}

export {
  initSettingsRouter
}
