import type { Router, RequestHandler, Request, Response, NextFunction } from 'express'
import type { ProxyOptions } from 'express-http-proxy'
import type { ChatType, ProsodyListRoomsResult } from '../../../shared/lib/types'
import { getBaseRouterRoute, getBaseStaticRoute, isUserAdmin } from '../helpers'
import { asyncMiddleware } from '../middlewares/async'
import { getProsodyDomain } from '../prosody/config/domain'
import { getAPIKey } from '../apikey'
import * as path from 'path'
const bodyParser = require('body-parser')
const got = require('got')

const fs = require('fs').promises
const proxy = require('express-http-proxy')

let httpBindRoute: RequestHandler
interface ProsodyHttpBindInfo {
  host: string
  port: string
}
let currentProsodyHttpBindInfo: ProsodyHttpBindInfo | null = null

async function initWebchatRouter (options: RegisterServerOptions): Promise<Router> {
  const {
    getRouter,
    peertubeHelpers,
    settingsManager
  } = options

  const converseJSIndex = await fs.readFile(path.resolve(__dirname, '../../conversejs/index.html'))

  const router: Router = getRouter()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/room/:videoUUID', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      res.removeHeader('X-Frame-Options') // this route can be opened in an iframe

      const settings = await settingsManager.getSettings([
        'chat-type', 'chat-room', 'chat-server',
        'chat-bosh-uri', 'chat-ws-uri'
      ])
      const chatType: ChatType = (settings['chat-type'] ?? 'disabled') as ChatType

      let server: string
      let room: string
      let boshUri: string
      let wsUri: string
      let authenticationUrl: string = ''
      let advancedControls: boolean = false
      if (chatType === 'builtin-prosody') {
        const prosodyDomain = await getProsodyDomain(options)
        server = 'anon.' + prosodyDomain
        room = '{{VIDEO_UUID}}@room.' + prosodyDomain
        boshUri = getBaseRouterRoute(options) + 'webchat/http-bind'
        wsUri = ''
        authenticationUrl = options.peertubeHelpers.config.getWebserverUrl() +
          getBaseRouterRoute(options) +
          'api/auth'
        advancedControls = true
      } else if (chatType === 'builtin-converse') {
        if (!settings['chat-server']) {
          throw new Error('Missing chat-server settings.')
        }
        if (!settings['chat-room']) {
          throw new Error('Missing chat-room settings.')
        }
        if (!settings['chat-bosh-uri'] && !settings['chat-ws-uri']) {
          throw new Error('Missing BOSH or Websocket uri.')
        }
        server = settings['chat-server'] as string
        room = settings['chat-room'] as string
        boshUri = settings['chat-bosh-uri'] as string
        wsUri = settings['chat-ws-uri'] as string
      } else {
        throw new Error('Builtin chat disabled.')
      }

      const uuid = req.params.videoUUID
      const video = await peertubeHelpers.videos.loadByIdOrUUID(uuid)
      if (!video) {
        throw new Error('Video not found')
      }

      let page = '' + (converseJSIndex as string)
      const baseStaticUrl = getBaseStaticRoute(options)
      page = page.replace(/{{BASE_STATIC_URL}}/g, baseStaticUrl)
      page = page.replace(/{{JID}}/g, server)
      room = room.replace(/{{VIDEO_UUID}}/g, video.uuid)
      page = page.replace(/{{ROOM}}/g, room)
      page = page.replace(/{{BOSH_SERVICE_URL}}/g, boshUri)
      page = page.replace(/{{WS_SERVICE_URL}}/g, wsUri)
      page = page.replace(/{{AUTHENTICATION_URL}}/g, authenticationUrl)
      page = page.replace(/{{ADVANCEDCONTROLS}}/g, advancedControls ? 'true' : 'false')

      res.status(200)
      res.type('html')
      res.send(page)
    }
  ))

  changeHttpBindRoute(options, null)
  router.all('/http-bind',
    bodyParser.raw({ type: 'text/xml' }),
    (req: Request, res: Response, next: NextFunction) => {
      httpBindRoute(req, res, next)
    }
  )

  router.get('/prosody-list-rooms', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!res.locals.authenticated) {
        res.sendStatus(403)
        return
      }
      if (!await isUserAdmin(options, res)) {
        res.sendStatus(403)
        return
      }

      const chatType: ChatType = await options.settingsManager.getSetting('chat-type') as ChatType
      if (chatType !== 'builtin-prosody') {
        const message = 'Please save the settings first.' // TODO: translate?
        res.status(200)
        const r: ProsodyListRoomsResult = {
          ok: false,
          error: message
        }
        res.json(r)
        return
      }

      if (!currentProsodyHttpBindInfo) {
        throw new Error('It seems that prosody is not binded... Cant list rooms.')
      }
      const apiUrl = `http://localhost:${currentProsodyHttpBindInfo.port}/peertubelivechat_list_rooms/list-rooms`
      peertubeHelpers.logger.debug('Calling list rooms API on url: ' + apiUrl)
      const rooms = await got(apiUrl, {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + await getAPIKey(options),
          host: currentProsodyHttpBindInfo.host
        },
        responseType: 'json',
        resolveBodyOnly: true
      })

      res.status(200)
      const r: ProsodyListRoomsResult = {
        ok: true,
        rooms: rooms
      }
      res.json(r)
    }
  ))

  return router
}

function changeHttpBindRoute (
  { peertubeHelpers }: RegisterServerOptions,
  prosodyHttpBindInfo: ProsodyHttpBindInfo | null
): void {
  const logger = peertubeHelpers.logger
  if (prosodyHttpBindInfo && !/^\d+$/.test(prosodyHttpBindInfo.port)) {
    logger.error(`Port '${prosodyHttpBindInfo.port}' is not valid. Replacing by null`)
    prosodyHttpBindInfo = null
  }

  if (!prosodyHttpBindInfo) {
    logger.info('Changing http-bind port for null')
    currentProsodyHttpBindInfo = null
    httpBindRoute = (_req: Request, res: Response, _next: NextFunction) => {
      res.status(404)
      res.send('Not found')
    }
  } else {
    logger.info('Changing http-bind port for ' + prosodyHttpBindInfo.port + ', on host ' + prosodyHttpBindInfo.host)
    const options: ProxyOptions = {
      https: false,
      proxyReqPathResolver: async (_req: Request): Promise<string> => {
        return '/http-bind' // should not be able to access anything else
      },
      // preserveHostHdr: true,
      parseReqBody: true // Note that setting this to false overrides reqAsBuffer and reqBodyEncoding below.
      // FIXME: should we remove cookies?
    }
    currentProsodyHttpBindInfo = prosodyHttpBindInfo
    httpBindRoute = proxy('http://localhost:' + prosodyHttpBindInfo.port, options)
  }
}

export {
  initWebchatRouter,
  changeHttpBindRoute
}
