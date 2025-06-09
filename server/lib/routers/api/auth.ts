// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../../middlewares/async'
import { getProsodyDomain } from '../../prosody/config/domain'
import { LivechatProsodyAuth } from '../../prosody/auth'
import { ExternalAuthOIDC } from '../../external-auth/oidc'

/**
 * Instanciate the authentication API.
 * This API is used by the frontend to get current user's XMPP credentials.
 * @param options server register options
 */
async function initAuthApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  router.get('/auth', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const user = await options.peertubeHelpers.user.getAuthUser(res)

      if (!user) {
        // No Peertube user, but perhaps an external authentication?
        const token = req.header('X-Peertube-Plugin-Livechat-External-Auth-OIDC-Token')
        if (token) {
          try {
            const oidc = ExternalAuthOIDC.singletonForToken(token)
            if (oidc && await oidc.isOk()) {
              const unserializedToken = await oidc.unserializeToken(token)
              if (unserializedToken) {
                res.status(200).json({
                  jid: unserializedToken.jid,
                  password: unserializedToken.password,
                  nickname: unserializedToken.nickname,
                  type: 'oidc'
                })
                return
              }
            }
          } catch (err) {
            options.peertubeHelpers.logger.error(err)
            // Just continue with the normal flow.
          }
        }
      }

      const tempPassword = await LivechatProsodyAuth.singleton().getUserTempPassword(user)
      if (!tempPassword) {
        res.sendStatus(403)
        return
      }
      res.status(200).json(tempPassword)
    }
  ))

  router.get('/auth/tokens', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const user = await options.peertubeHelpers.user.getAuthUser(res)

      try {
        const tokens = await LivechatProsodyAuth.singleton().getUserTokens(user)
        if (!tokens) {
          res.sendStatus(403)
          return
        }
        res.status(200).json(tokens)
      } catch (err) {
        options.peertubeHelpers.logger.error(err as string)
        res.sendStatus(500)
      }
    }
  ))

  router.post('/auth/tokens', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const user = await options.peertubeHelpers.user.getAuthUser(res)

      try {
        const label = req.body.label
        if ((typeof label !== 'string') || !label) {
          res.sendStatus(400)
          return
        }
        const token = await LivechatProsodyAuth.singleton().createUserToken(user, label)
        if (!token) {
          res.sendStatus(403)
          return
        }
        res.status(200).json(token)
      } catch (err) {
        options.peertubeHelpers.logger.error(err as string)
        res.sendStatus(500)
      }
    }
  ))

  router.delete('/auth/tokens/:tokenId', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const user = await options.peertubeHelpers.user.getAuthUser(res)

      try {
        const tokenId = parseInt(req.params.tokenId)
        if (isNaN(tokenId)) {
          res.sendStatus(400)
          return
        }
        const r = await LivechatProsodyAuth.singleton().revokeUserToken(user, tokenId)
        if (!r) {
          res.sendStatus(403)
          return
        }
        res.status(200).json(true)
      } catch (err) {
        options.peertubeHelpers.logger.error(err as string)
        res.sendStatus(500)
      }
    }
  ))
}

/**
 * Instanciates API used by the Prosody module http_auth.
 * This is used to check user's credentials.
 * @param options server register options
 * @returns a router
 */
async function initUserAuthApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.post('/user/register', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      res.sendStatus(501)
    }
  ))

  router.get('/user/check_password', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const prosodyDomain = await getProsodyDomain(options)
      const user = req.query.user
      const server = req.query.server
      const pass = req.query.pass
      if (server !== prosodyDomain) {
        logger.warn(`Cannot call check_password on user on server ${server as string}.`)
        res.status(200).send('false')
        return
      }
      if (user && pass && await LivechatProsodyAuth.singleton().checkUserPassword(user as string, pass as string)) {
        res.status(200).send('true')
        return
      }
      res.status(200).send('false')
    }
  ))

  router.get('/user/user_exists', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const prosodyDomain = await getProsodyDomain(options)
      const user = req.query.user
      const server = req.query.server
      if (server !== prosodyDomain) {
        logger.warn(`Cannot call user_exists on user on server ${server as string}.`)
        res.status(200).send('false')
        return
      }
      if (user && await LivechatProsodyAuth.singleton().userRegistered(user as string)) {
        res.status(200).send('true')
        return
      }
      res.status(200).send('false')
    }
  ))

  router.post('/user/set_password', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      res.sendStatus(501)
    }
  ))

  router.post('/user/remove_user', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      res.sendStatus(501)
    }
  ))
}

export {
  initAuthApiRouter,
  initUserAuthApiRouter
}
