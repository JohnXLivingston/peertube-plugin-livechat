import type { NextFunction, Request, Response } from 'express'
import { initWebchatRouter } from './webchat'

type InitRoutersOptions = Pick<RegisterServerOptions, 'settingsManager' | 'getRouter' | 'peertubeHelpers'>

async function initRouters ({
  settingsManager,
  getRouter,
  peertubeHelpers
}: InitRoutersOptions): Promise<void> {
  const router = getRouter()
  router.get('/ping', (req: Request, res: Response, _next: NextFunction) => res.json({ message: 'pong' }))

  router.use('/webchat', await initWebchatRouter({
    getRouter,
    peertubeHelpers,
    settingsManager
  }))
}

export {
  InitRoutersOptions,
  initRouters
}
