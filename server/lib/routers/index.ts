import type { NextFunction, Request, Response } from 'express'
import { initWebchatRouter } from './webchat'
import { initSettingsRouter } from './settings'
import { initApiRouter } from './api'

async function initRouters (options: RegisterServerOptions): Promise<void> {
  const { getRouter } = options

  const router = getRouter()
  router.get('/ping', (req: Request, res: Response, _next: NextFunction) => res.json({ message: 'pong' }))

  router.use('/webchat', await initWebchatRouter(options))
  router.use('/settings', await initSettingsRouter(options))
  router.use('/api', await initApiRouter(options))
}

export {
  initRouters
}
