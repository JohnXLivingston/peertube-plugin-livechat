// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { ExternalAuthResult } from '../../../shared/lib/types'
import { asyncMiddleware } from '../middlewares/async'
import { ExternalAuth } from '../external-auth'
import { ExternalAuthenticationError } from '../external-auth/error'
import { ensureUser } from '../prosody/api/manage-users'

/**
 * When using a popup for external auth, writes the HTML/Javascript to close the popup
 * and send the result to the parent window.
 * @param result the result to send to the parent window
 */
function popupResultHTML (result: ExternalAuthResult): string {
  return `<!DOCTYPE html><html>
    <body>
      <noscript>Your browser must enable javascript for this page to work.</noscript>
      <script>
        try {
          const data = ${JSON.stringify(result)};
          if (!window.opener || !window.opener.externalAuthGetResult) {
            throw new Error("Can't find parent window callback handler.")
          }
          window.opener.externalAuthGetResult(data);
          window.close();
        } catch (err) {
          document.body.innerText = 'Error: ' + err;
        }
      </script>
    </body>
  </html>`
}

async function initAuthRouter (options: RegisterServerOptions): Promise<Router> {
  const { peertubeHelpers, getRouter } = options
  const router = getRouter()
  const logger = peertubeHelpers.logger

  router.get('/:type/:provider?/connect', asyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
      const type = req.params.type
      const provider = req.params.provider ?? 'custom'
      logger.info(`[auth router] external auth connect call (${type}, ${provider})`)
      try {
        const auth = ExternalAuth.singleton(type, provider)
        const authClient = await auth.load()
        if (!authClient) {
          throw new Error('[auth router] External Auth not loaded yet')
        }

        const redirectUrl = await auth.initAuthenticationProcess(req, res)
        res.redirect(redirectUrl)
      } catch (err) {
        logger.error('[auth router] Failed to process the external auth connect call: ' + (err as string))
        next()
      }
    }
  ))

  const cbHandler = asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const type = req.params.type
      const provider = req.params.provider ?? 'custom'
      logger.info(`[auth router] external auth callback call (${type}, ${provider})`)
      try {
        const auth = ExternalAuth.singleton(type, provider)
        const authClient = await auth.load()
        if (!authClient) {
          throw new Error('[auth router] External Auth not loaded yet')
        }

        const externalAccountInfos = await auth.validateAuthenticationProcess(req)
        logger.debug('external account infos: ' + JSON.stringify(
          Object.assign(
            {},
            externalAccountInfos,
            {
              password: '**removed**', // removing the password from logs!
              token: '**removed**', // same as password
              avatar: externalAccountInfos.avatar
                ? `**removed** ${externalAccountInfos.avatar.mimetype} avatar`
                : undefined
            }
          )
        ))

        // Now we create or update the user:
        if (!await ensureUser(options, externalAccountInfos)) {
          throw new ExternalAuthenticationError(
            'Failing to create your account, please try again later or report this issue'
          )
        }

        res.send(popupResultHTML({
          ok: true,
          token: externalAccountInfos.token
        }))
      } catch (err) {
        logger.error('[auth router] Failed to process the external auth callback: ' + (err as string))
        const message = err instanceof ExternalAuthenticationError ? err.message : undefined
        res.status(500)
        res.send(popupResultHTML({
          ok: false,
          message
        }))
      }
    }
  )
  router.get('/:type/:provider?/cb', cbHandler)
  router.post('/:type/:provider?/cb', cbHandler)

  return router
}

export {
  initAuthRouter
}
