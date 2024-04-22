import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../../middlewares/async'
import { getProsodyDomain } from '../../prosody/config/domain'
import { prosodyRegisterUser, prosodyCheckUserPassword, prosodyUserRegistered } from '../../prosody/auth'
import { getUserNickname } from '../../helpers'
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

      if (!user) {
        res.sendStatus(403)
        return
      }
      if (user.blocked) {
        res.sendStatus(403)
        return
      }
      // NB 2021-08-05: Peertube usernames should be lowercase. But it seems that
      // in some old installation, there can be uppercase letters in usernames.
      // When Peertube checks username unicity, it does a lowercase search.
      // So it feels safe to normalize usernames like so:
      const normalizedUsername = user.username.toLowerCase()
      const prosodyDomain = await getProsodyDomain(options)
      const password: string = await prosodyRegisterUser(normalizedUsername)
      const nickname: string | undefined = await getUserNickname(options, user)
      res.status(200).json({
        jid: normalizedUsername + '@' + prosodyDomain,
        password: password,
        nickname: nickname,
        type: 'peertube'
      })
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
      if (user && pass && await prosodyCheckUserPassword(user as string, pass as string)) {
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
      if (user && await prosodyUserRegistered(user as string)) {
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
