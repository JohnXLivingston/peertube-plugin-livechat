import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../../middlewares/async'
import { serverBuildInfos } from '../../federation/outgoing'

/**
 * Instanciate the authentication API.
 * This API is used by the frontend to get current user's XMPP credentials.
 * @param options server register options
 */
async function initFederationServerInfosApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get('/federation_server_infos', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info('federation_server_infos api call')
      const result = await serverBuildInfos(options)
      res.json(result)
    }
  ))
}

export {
  initFederationServerInfosApiRouter
}
