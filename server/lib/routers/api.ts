import type { Router, Request, Response, NextFunction } from 'express'
import { videoHasWebchat } from '../../../shared/lib/video'
import { asyncMiddleware } from '../middlewares/async'
import { getCheckAPIKeyMiddleware } from '../middlewares/apikey'
import { prosodyCheckUserPassword, prosodyRegisterUser, prosodyUserRegistered } from '../prosody/auth'
import { getUserNickname } from '../helpers'
import { Affiliations, getVideoAffiliations } from '../prosody/config/affiliations'
import { getProsodyDomain } from '../prosody/config/domain'
import type { ChatType } from '../../../shared/lib/types'
import { fillVideoCustomFields } from '../custom-fields'

// See here for description: https://modules.prosody.im/mod_muc_http_defaults.html
interface RoomDefaults {
  config: {
    name: string
    description: string
    language?: string
    persistent?: boolean
    public?: boolean
    members_only?: boolean
    allow_member_invites?: boolean
    public_jids?: boolean
    subject: string
    changesubject?: boolean
    // historylength: number
    moderated?: boolean
    archiving?: boolean
  }
  affiliations?: Affiliations
}

async function initApiRouter (options: RegisterServerOptions): Promise<Router> {
  const { peertubeHelpers, getRouter } = options
  const router = getRouter()
  const logger = peertubeHelpers.logger

  router.get('/test', asyncMiddleware([
    getCheckAPIKeyMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction) => {
      logger.info('Test api call')
      res.json({ ok: true })
    }
  ]))

  router.get('/room', asyncMiddleware([
    getCheckAPIKeyMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction) => {
      const jid: string = req.query.jid as string || ''
      logger.info(`Requesting room information for room '${jid}'.`)

      const video = await peertubeHelpers.videos.loadByIdOrUUID(jid)
      if (!video) {
        logger.warn(`Video ${jid} not found`)
        res.sendStatus(403)
        return
      }

      // Adding the custom fields:
      await fillVideoCustomFields(options, video)

      // check settings (chat enabled for this video?)
      const settings = await options.settingsManager.getSettings([
        'chat-type',
        'chat-only-locals',
        'chat-per-live-video',
        'chat-all-lives',
        'chat-all-non-lives',
        'chat-videos-list'
      ])
      if (settings['chat-type'] !== ('builtin-prosody' as ChatType)) {
        logger.warn('Prosody chat is not active')
        res.sendStatus(403)
        return
      }
      if (!videoHasWebchat({
        'chat-only-locals': !!settings['chat-only-locals'],
        'chat-per-live-video': !!settings['chat-per-live-video'],
        'chat-all-lives': !!settings['chat-all-lives'],
        'chat-all-non-lives': !!settings['chat-all-non-lives'],
        'chat-videos-list': settings['chat-videos-list'] as string
      }, video)) {
        logger.warn(`Video ${jid} has not chat activated`)
        res.sendStatus(403)
        return
      }

      let affiliations: Affiliations
      try {
        affiliations = await getVideoAffiliations(options, video)
      } catch (error) {
        logger.error(`Failed to get video affiliations for ${video.uuid}:`, error)
        // affiliations: should at least be {}, so that the first user will not be moderator/admin
        affiliations = {}
      }

      const roomDefaults: RoomDefaults = {
        config: {
          name: video.name,
          description: '',
          language: video.language,
          subject: video.name
        },
        affiliations: affiliations
      }
      res.json(roomDefaults)
    }
  ]))

  router.get('/auth', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const user = await peertubeHelpers.user.getAuthUser(res)
      if (!user) {
        res.sendStatus(403)
        return
      }
      if (user.blocked) {
        res.sendStatus(403)
        return
      }
      const prosodyDomain = await getProsodyDomain(options)
      const password: string = await prosodyRegisterUser(user.username)
      const nickname: string | undefined = await getUserNickname(options, user)
      res.status(200).json({
        jid: user.username + '@' + prosodyDomain,
        password: password,
        nickname: nickname
      })
    }
  ))

  router.post('/user/register', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      res.sendStatus(501)
    }
  ))

  router.get('/user/check_password', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      const settings = await options.settingsManager.getSettings([
        'chat-type'
      ])
      if (settings['chat-type'] !== ('builtin-prosody' as ChatType)) {
        logger.warn('Prosody chat is not active')
        res.status(200).send('false')
        return
      }
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
      const settings = await options.settingsManager.getSettings([
        'chat-type'
      ])
      if (settings['chat-type'] !== ('builtin-prosody' as ChatType)) {
        logger.warn('Prosody chat is not active')
        res.status(200).send('false')
        return
      }
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

  return router
}

export {
  initApiRouter
}
