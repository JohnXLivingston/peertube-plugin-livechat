import type { RegisterServerOptions, MVideoThumbnail } from '@peertube/peertube-types'
import type { Router, RequestHandler, Request, Response, NextFunction } from 'express'
import type { ProxyOptions } from 'express-http-proxy'
import type {
  ChatType, ProsodyListRoomsResult, ProsodyListRoomsResultRoom
} from '../../../shared/lib/types'
import { getBaseRouterRoute, getBaseStaticRoute, isUserAdmin } from '../helpers'
import { asyncMiddleware } from '../middlewares/async'
import { getProsodyDomain } from '../prosody/config/domain'
import { getAPIKey } from '../apikey'
import { getChannelInfosById, getChannelNameById } from '../database/channel'
import { isAutoColorsAvailable, areAutoColorsValid, AutoColors } from '../../../shared/lib/autocolors'
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
  router.get('/room/:roomKey', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      res.removeHeader('X-Frame-Options') // this route can be opened in an iframe

      const roomKey = req.params.roomKey
      const settings = await settingsManager.getSettings([
        'chat-type', 'chat-room', 'chat-server',
        'chat-bosh-uri', 'chat-ws-uri',
        'prosody-room-type',
        'converse-theme', 'converse-autocolors'
      ])
      const chatType: ChatType = (settings['chat-type'] ?? 'disabled') as ChatType

      let jid: string
      let room: string
      let boshUri: string
      let wsUri: string
      let authenticationUrl: string = ''
      let advancedControls: boolean = false // auto join the chat in viewer mode, if not logged in
      let autoViewerMode: boolean = false
      let forceReadonly: 'true' | 'false' | 'noscroll' = 'false'
      let converseJSTheme: string = settings['converse-theme'] as string
      if (!/^\w+$/.test(converseJSTheme)) {
        converseJSTheme = 'peertube'
      }
      if (chatType === 'builtin-prosody') {
        const prosodyDomain = await getProsodyDomain(options)
        jid = 'anon.' + prosodyDomain
        if (req.query.forcetype === '1') {
          // We come from the room list in the settings page.
          // Here we don't read the prosody-room-type settings,
          // but use the roomKey format.
          // NB: there is no extra security. Any user can add this parameter.
          //     This is not an issue: the setting will be tested at the room creation.
          //     No room can be created in the wrong mode.
          if (/^channel\.\d+$/.test(roomKey)) {
            room = 'channel.{{CHANNEL_ID}}@room.' + prosodyDomain
          } else {
            room = '{{VIDEO_UUID}}@room.' + prosodyDomain
          }
        } else {
          if (settings['prosody-room-type'] === 'channel') {
            room = 'channel.{{CHANNEL_ID}}@room.' + prosodyDomain
          } else {
            room = '{{VIDEO_UUID}}@room.' + prosodyDomain
          }
        }
        boshUri = getBaseRouterRoute(options) + 'webchat/http-bind'
        wsUri = ''
        authenticationUrl = options.peertubeHelpers.config.getWebserverUrl() +
          getBaseRouterRoute(options) +
          'api/auth'
        advancedControls = true
        if (req.query._readonly === 'true') {
          forceReadonly = 'true'
        } else if (req.query._readonly === 'noscroll') {
          forceReadonly = 'noscroll'
        } else {
          autoViewerMode = true // auto join the chat in viewer mode, if not logged in
        }
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
        jid = settings['chat-server'] as string
        room = settings['chat-room'] as string
        boshUri = settings['chat-bosh-uri'] as string
        wsUri = settings['chat-ws-uri'] as string
      } else {
        throw new Error('Builtin chat disabled.')
      }

      let video: MVideoThumbnail | undefined
      let channelId: number
      const channelMatches = roomKey.match(/^channel\.(\d+)$/)
      if (channelMatches?.[1]) {
        channelId = parseInt(channelMatches[1])
        // Here we are on a room... must be in prosody mode.
        if (chatType !== 'builtin-prosody') {
          throw new Error('Cant access a chat by a channel uri if chatType!==builtin-prosody')
        }
        const channelInfos = await getChannelInfosById(options, channelId)
        if (!channelInfos) {
          throw new Error('Channel not found')
        }
        channelId = channelInfos.id
      } else {
        const uuid = roomKey // must be a video UUID.
        video = await peertubeHelpers.videos.loadByIdOrUUID(uuid)
        if (!video) {
          throw new Error('Video not found')
        }
        channelId = video.channelId
      }

      let page = '' + (converseJSIndex as string)
      const baseStaticUrl = getBaseStaticRoute(options)
      page = page.replace(/{{BASE_STATIC_URL}}/g, baseStaticUrl)
      page = page.replace(/{{JID}}/g, jid)
      // Computing the room name...
      if (room.includes('{{VIDEO_UUID}}')) {
        if (!video) {
          throw new Error('Missing video')
        }
        room = room.replace(/{{VIDEO_UUID}}/g, video.uuid)
      }
      room = room.replace(/{{CHANNEL_ID}}/g, `${channelId}`)
      if (room.includes('{{CHANNEL_NAME}}')) {
        const channelName = await getChannelNameById(options, channelId)
        if (channelName === null) {
          throw new Error('Channel not found')
        }
        if (!/^[a-zA-Z0-9_.]+$/.test(channelName)) {
          // FIXME: see if there is a response here https://github.com/Chocobozzz/PeerTube/issues/4301 for allowed chars
          peertubeHelpers.logger.error(`Invalid channel name, contains unauthorized chars: '${channelName}'`)
          throw new Error('Invalid channel name, contains unauthorized chars')
        }
        room = room.replace(/{{CHANNEL_NAME}}/g, channelName)
      }

      let autocolorsStyles = ''
      if (
        settings['converse-autocolors'] &&
        isAutoColorsAvailable(settings['chat-type'] as ChatType, settings['converse-theme'] as string)
      ) {
        peertubeHelpers.logger.debug('Trying to load AutoColors...')
        const autocolors: AutoColors = {
          mainForeground: req.query._ac_mainForeground?.toString() ?? '',
          mainBackground: req.query._ac_mainBackground?.toString() ?? '',
          greyForeground: req.query._ac_greyForeground?.toString() ?? '',
          greyBackground: req.query._ac_greyBackground?.toString() ?? '',
          menuForeground: req.query._ac_menuForeground?.toString() ?? '',
          menuBackground: req.query._ac_menuBackground?.toString() ?? '',
          inputForeground: req.query._ac_inputForeground?.toString() ?? '',
          inputBackground: req.query._ac_inputBackground?.toString() ?? '',
          buttonForeground: req.query._ac_buttonForeground?.toString() ?? '',
          buttonBackground: req.query._ac_buttonBackground?.toString() ?? '',
          link: req.query._ac_link?.toString() ?? '',
          linkHover: req.query._ac_linkHover?.toString() ?? ''
        }
        const autoColorsTest = areAutoColorsValid(autocolors)
        if (autoColorsTest === true) {
          autocolorsStyles = `
          <style>
            :root {
              --peertube-main-foreground: ${autocolors.mainForeground};
              --peertube-main-background: ${autocolors.mainBackground};
              --peertube-grey-foreground: ${autocolors.greyForeground};
              --peertube-grey-background: ${autocolors.greyBackground};
              --peertube-menu-foreground: ${autocolors.menuForeground};
              --peertube-menu-background: ${autocolors.menuBackground};
              --peertube-input-foreground: ${autocolors.inputForeground};
              --peertube-input-background: ${autocolors.inputBackground};
              --peertube-button-foreground: ${autocolors.buttonForeground};
              --peertube-button-background: ${autocolors.buttonBackground};
              --peertube-link: ${autocolors.link};
              --peertube-link-hover: ${autocolors.linkHover};
            }
          </style>
          `
        } else {
          peertubeHelpers.logger.error('Provided AutoColors are invalid.', autoColorsTest)
        }
      } else {
        peertubeHelpers.logger.debug('No AutoColors.')
      }

      // ... then inject it in the page.
      page = page.replace(/{{ROOM}}/g, room)
      page = page.replace(/{{BOSH_SERVICE_URL}}/g, boshUri)
      page = page.replace(/{{WS_SERVICE_URL}}/g, wsUri)
      page = page.replace(/{{AUTHENTICATION_URL}}/g, authenticationUrl)
      page = page.replace(/{{ADVANCEDCONTROLS}}/g, advancedControls ? 'true' : 'false')
      page = page.replace(/{{AUTOVIEWERMODE}}/g, autoViewerMode ? 'true' : 'false')
      page = page.replace(/{{CONVERSEJS_THEME}}/g, converseJSTheme)
      page = page.replace(/{{CONVERSEJS_AUTOCOLORS}}/g, autocolorsStyles)
      page = page.replace(/{{FORCEREADONLY}}/g, forceReadonly)

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

      if (Array.isArray(rooms)) {
        for (let i = 0; i < rooms.length; i++) {
          const room: ProsodyListRoomsResultRoom = rooms[i]
          const matches = room.localpart.match(/^channel\.(\d+)$/)
          if (matches?.[1]) {
            const channelId = parseInt(matches[1])
            const channelInfos = await getChannelInfosById(options, channelId)
            if (channelInfos) {
              room.channel = {
                id: channelInfos.id,
                name: channelInfos.name,
                displayName: channelInfos.displayName
              }
            }
          }
        }
      }

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
