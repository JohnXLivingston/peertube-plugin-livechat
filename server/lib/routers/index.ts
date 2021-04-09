import type { NextFunction, Request, Response } from 'express'
import { initWebchatRouter } from './webchat'

async function initRouters (options: RegisterServerOptions): Promise<void> {
  const { getRouter } = options

  const router = getRouter()
  router.get('/ping', (req: Request, res: Response, _next: NextFunction) => res.json({ message: 'pong' }))

  router.use('/webchat', await initWebchatRouter(options))
}

export {
  initRouters
}
