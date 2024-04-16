import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction, CookieOptions } from 'express'
import { asyncMiddleware } from '../middlewares/async'
import { ExternalAuthOIDC } from '../external-auth/oidc'

const cookieNamePrefix = 'peertube-plugin-livechat-oidc-'
const cookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
  maxAge: 1000 * 60 * 10 // 10 minutes
}

async function initOIDCRouter (options: RegisterServerOptions): Promise<Router> {
  const { peertubeHelpers, getRouter } = options
  const router = getRouter()
  const logger = peertubeHelpers.logger

  router.get('/connect', asyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
      logger.info('[oidc router] OIDC connect call')
      try {
        const oidc = ExternalAuthOIDC.singleton()
        const oidcClient = await oidc.load()
        if (!oidcClient) {
          throw new Error('[oidc router] External Auth OIDC not loaded yet')
        }

        const authenticationProcess = await oidc.initAuthenticationProcess()
        res.cookie(cookieNamePrefix + 'code-verifier', authenticationProcess.encryptedCodeVerifier, cookieOptions)
        res.cookie(cookieNamePrefix + 'state', authenticationProcess.encryptedState, cookieOptions)
        return res.redirect(authenticationProcess.redirectUrl)
      } catch (err) {
        logger.error('[oidc router] Failed to process the OIDC callback: ' + (err as string))
        next()
      }
    }
  ))

  router.get('/cb', asyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
      logger.info('[oidc router] OIDC callback call')
      try {
        const oidc = ExternalAuthOIDC.singleton()
        const oidcClient = await oidc.load()
        if (!oidcClient) {
          throw new Error('[oidc router] External Auth OIDC not loaded yet')
        }

        const userInfos = await oidc.validateAuthenticationProcess(req, cookieNamePrefix)
        logger.info(JSON.stringify(userInfos)) // FIXME

        res.send('ok')
      } catch (err) {
        logger.error('[oidc router] Failed to process the OIDC callback: ' + (err as string))
        next()
      }
    }
  ))

  return router
}

export {
  initOIDCRouter
}
