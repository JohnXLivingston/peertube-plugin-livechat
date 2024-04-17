import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { OIDCAuthResult } from '../../../shared/lib/types'
import { asyncMiddleware } from '../middlewares/async'
import { ExternalAuthOIDC } from '../external-auth/oidc'

/**
 * When using a popup for OIDC, writes the HTML/Javascript to close the popup
 * and send the result to the parent window.
 * @param result the result to send to the parent window
 */
function popupResultHTML (result: OIDCAuthResult): string {
  return `<!DOCTYPE html><html>
    <body>
      <noscript>Your browser must enable javascript for this page to work.</noscript>
      <script>
        try {
          const data = ${JSON.stringify(result)};
          if (!window.opener || !window.opener.oidcGetResult) {
            throw new Error("Can't find parent window callback handler.")
          }
          window.opener.oidcGetResult(data);
          window.close();
        } catch (err) {
          document.body.innerText = 'Error: ' + err;
        }
      </script>
    </body>
  </html> `
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

        const redirectUrl = await oidc.initAuthenticationProcess(req, res)
        res.redirect(redirectUrl)
      } catch (err) {
        logger.error('[oidc router] Failed to process the OIDC callback: ' + (err as string))
        next()
      }
    }
  ))

  router.get('/cb', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info('[oidc router] OIDC callback call')
      try {
        const oidc = ExternalAuthOIDC.singleton()
        const oidcClient = await oidc.load()
        if (!oidcClient) {
          throw new Error('[oidc router] External Auth OIDC not loaded yet')
        }

        const userInfos = await oidc.validateAuthenticationProcess(req)
        logger.info(JSON.stringify(userInfos)) // FIXME (normalize data type, process, ...)

        res.send(popupResultHTML({
          ok: true,
          username: userInfos.username,
          password: 'TODO'
        }))
      } catch (err) {
        logger.error('[oidc router] Failed to process the OIDC callback: ' + (err as string))
        res.sendStatus(500)
        res.send(popupResultHTML({
          ok: false
        }))
      }
    }
  ))

  return router
}

export {
  initOIDCRouter
}
