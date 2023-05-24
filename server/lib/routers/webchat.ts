import type { RegisterServerOptions, MVideoThumbnail, SettingEntries } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type {
  ProsodyListRoomsResult, ProsodyListRoomsResultRoom
} from '../../../shared/lib/types'
import { createProxyServer } from 'http-proxy'
import {
  RegisterServerOptionsV5, getBaseRouterRoute, getBaseStaticRoute, isUserAdmin
} from '../helpers'
import { asyncMiddleware } from '../middlewares/async'
import { getProsodyDomain } from '../prosody/config/domain'
import { getAPIKey } from '../apikey'
import { getChannelInfosById, getChannelNameById } from '../database/channel'
import { isAutoColorsAvailable, areAutoColorsValid, AutoColors } from '../../../shared/lib/autocolors'
import { getBoshUri, getWSUri } from '../uri/webchat'
import { getVideoLiveChatInfos } from '../federation/storage'
import { LiveChatJSONLDAttributeV1 } from '../federation/types'
import {
  anonymousConnectionInfos, compatibleRemoteAuthenticatedConnectionEnabled
} from '../federation/connection-infos'
import { fetchMissingRemoteServerInfos } from '../federation/fetch-infos'
import * as path from 'path'
const got = require('got')

const fs = require('fs').promises

interface ProsodyProxyInfo {
  host: string
  port: string
}
let currentProsodyProxyInfo: ProsodyProxyInfo | null = null
let currentHttpBindProxy: ReturnType<typeof createProxyServer> | null = null
let currentWebsocketProxy: ReturnType<typeof createProxyServer> | null = null
let currentS2SWebsocketProxy: ReturnType<typeof createProxyServer> | null = null

async function initWebchatRouter (options: RegisterServerOptionsV5): Promise<Router> {
  const {
    getRouter,
    registerWebSocketRoute,
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
        'prosody-room-type',
        'disable-websocket',
        'converse-theme', 'converse-autocolors',
        'federation-no-remote-chat',
        'prosody-room-allow-s2s'
      ])

      let autoViewerMode: boolean = false
      let forceReadonly: 'true' | 'false' | 'noscroll' = 'false'
      let converseJSTheme: string = settings['converse-theme'] as string
      let transparent: boolean = false
      if (!/^\w+$/.test(converseJSTheme)) {
        converseJSTheme = 'peertube'
      }

      const authenticationUrl = options.peertubeHelpers.config.getWebserverUrl() +
        getBaseRouterRoute(options) +
        'api/auth'
      if (req.query._readonly === 'true') {
        forceReadonly = 'true'
      } else if (req.query._readonly === 'noscroll') {
        forceReadonly = 'noscroll'
      } else {
        autoViewerMode = true // auto join the chat in viewer mode, if not logged in
      }
      if (req.query._transparent === 'true') {
        transparent = true
      }

      let video: MVideoThumbnail | undefined
      let channelId: number
      let remoteChatInfos: LiveChatJSONLDAttributeV1 | undefined
      const channelMatches = roomKey.match(/^channel\.(\d+)$/)
      if (channelMatches?.[1]) {
        channelId = parseInt(channelMatches[1])
        // Here we are on a channel room...
        const channelInfos = await getChannelInfosById(options, channelId)
        if (!channelInfos) {
          throw new Error('Channel not found')
        }
        channelId = channelInfos.id
      } else {
        const uuid = roomKey // must be a video UUID.
        video = await peertubeHelpers.videos.loadByIdOrUUID(uuid)
        if (!video) {
          res.status(404)
          res.send('Not found')
          return
        }
        if (video.remote) {
          remoteChatInfos = settings['federation-no-remote-chat'] ? false : await getVideoLiveChatInfos(options, video)
          if (!remoteChatInfos) {
            res.status(404)
            res.send('Not found')
            return
          }
        }
        channelId = video.channelId
      }

      let page = '' + (converseJSIndex as string)
      const baseStaticUrl = getBaseStaticRoute(options)
      page = page.replace(/{{BASE_STATIC_URL}}/g, baseStaticUrl)

      const prosodyDomain = await getProsodyDomain(options)
      const localAnonymousJID = 'anon.' + prosodyDomain
      const localBoshUri = getBoshUri(options)
      const localWsUri = settings['disable-websocket']
        ? ''
        : (getWSUri(options) ?? '')

      let remoteConnectionInfos: WCRemoteConnectionInfos | undefined
      let roomJID: string
      if (video?.remote) {
        const canWebsocketS2S = !settings['federation-no-remote-chat']
        const canDirectS2S = !settings['federation-no-remote-chat'] && !!settings['prosody-room-allow-s2s']
        remoteConnectionInfos = await _remoteConnectionInfos(remoteChatInfos ?? false, canWebsocketS2S, canDirectS2S)
        if (!remoteConnectionInfos) {
          res.status(404)
          res.send('No compatible way to connect to remote chat')
          return
        }
        roomJID = remoteConnectionInfos.roomJID
      } else {
        roomJID = await _localRoomJID(
          options,
          settings,
          prosodyDomain,
          roomKey,
          video,
          channelId,
          req.query.forcetype === '1'
        )
      }

      page = page.replace(/{{IS_REMOTE_CHAT}}/g, video?.remote ? 'true' : 'false')
      page = page.replace(/{{LOCAL_ANONYMOUS_JID}}/g, localAnonymousJID)
      page = page.replace(/{{REMOTE_ANONYMOUS_JID}}/g, remoteConnectionInfos?.anonymous?.userJID ?? '')

      let autocolorsStyles = ''
      if (
        settings['converse-autocolors'] &&
        isAutoColorsAvailable(settings['converse-theme'] as string)
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
        if (!Object.values(autocolors).find(c => c !== '')) {
          peertubeHelpers.logger.debug('All AutoColors are empty.')
        } else {
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
        }
      } else {
        peertubeHelpers.logger.debug('No AutoColors.')
      }

      // ... then inject it in the page.
      page = page.replace(/{{ROOM}}/g, roomJID)
      page = page.replace(/{{LOCAL_BOSH_SERVICE_URL}}/g, localBoshUri)
      page = page.replace(/{{LOCAL_WS_SERVICE_URL}}/g, localWsUri ?? '')
      page = page.replace(/{{REMOTE_BOSH_SERVICE_URL}}/g, remoteConnectionInfos?.anonymous?.boshUri ?? '')
      page = page.replace(/{{REMOTE_WS_SERVICE_URL}}/g, remoteConnectionInfos?.anonymous?.wsUri ?? '')
      page = page.replace(/{{REMOTE_ANONYMOUS_XMPP_SERVER}}/g, remoteConnectionInfos?.anonymous ? 'true' : 'false')
      page = page.replace(
        /{{REMOTE_AUTHENTICATED_XMPP_SERVER}}/g,
        remoteConnectionInfos?.authenticated ? 'true' : 'false'
      )
      page = page.replace(/{{AUTHENTICATION_URL}}/g, authenticationUrl)
      page = page.replace(/{{AUTOVIEWERMODE}}/g, autoViewerMode ? 'true' : 'false')
      page = page.replace(/{{CONVERSEJS_THEME}}/g, converseJSTheme)
      page = page.replace(/{{CONVERSEJS_AUTOCOLORS}}/g, autocolorsStyles)
      page = page.replace(/{{FORCEREADONLY}}/g, forceReadonly)
      page = page.replace(/{{TRANSPARENT}}/g, transparent ? 'true' : 'false')

      res.status(200)
      res.type('html')
      res.send(page)
    }
  ))

  await disableProxyRoute(options)
  router.post('/http-bind',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!currentHttpBindProxy) {
          res.status(404)
          res.send('Not found')
          return
        }
        req.url = 'http-bind'
        currentHttpBindProxy.web(req, res)
      } catch (err) {
        next(err)
      }
    }
  )
  // We should also forward OPTIONS request, for CORS.
  router.options('/http-bind',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!currentHttpBindProxy) {
          res.status(404)
          res.send('Not found')
          return
        }
        req.url = 'http-bind'
        currentHttpBindProxy.web(req, res)
      } catch (err) {
        next(err)
      }
    }
  )

  // Peertube >=5.0.0: Adding the websocket route.
  if (registerWebSocketRoute) {
    registerWebSocketRoute({
      route: '/xmpp-websocket',
      handler: (request, socket, head) => {
        try {
          if (!currentWebsocketProxy) {
            peertubeHelpers.logger.error('There is no current websocket proxy, should not get here.')
            // no need to close the socket, Peertube will
            // (see https://github.com/Chocobozzz/PeerTube/issues/5752#issuecomment-1510870894)
            return
          }
          currentWebsocketProxy.ws(request, socket, head)
        } catch (err) {
          peertubeHelpers.logger.error('Got an error when trying to connect to S2S', err)
        }
      }
    })

    registerWebSocketRoute({
      route: '/xmpp-websocket-s2s',
      handler: async (request, socket, head) => {
        try {
          if (!currentS2SWebsocketProxy) {
            peertubeHelpers.logger.error('There is no current websocket s2s proxy, should not get here.')
            // no need to close the socket, Peertube will
            // (see https://github.com/Chocobozzz/PeerTube/issues/5752#issuecomment-1510870894)
            return
          }
          // If the incomming request is from a remote Peertube instance, we must ensure that we know
          // how to connect to it using Websocket S2S (for the dialback mecanism).
          const remoteInstanceUrl = request.headers['peertube-livechat-ws-s2s-instance-url']
          if (remoteInstanceUrl && (typeof remoteInstanceUrl === 'string')) {
            // Note: fetchMissingRemoteServerInfos will store the information,
            // so that the Prosody mod_s2s_peertubelivechat module can access them.
            // We dont need to read the result.
            await fetchMissingRemoteServerInfos(options, remoteInstanceUrl)
          }
          currentS2SWebsocketProxy.ws(request, socket, head)
        } catch (err) {
          peertubeHelpers.logger.error('Got an error when trying to connect to Websocket S2S', err)
        }
      }
    })
  }

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

      if (!currentProsodyProxyInfo) {
        throw new Error('It seems that prosody is not binded... Cant list rooms.')
      }
      const apiUrl = `http://localhost:${currentProsodyProxyInfo.port}/peertubelivechat_list_rooms/list-rooms`
      peertubeHelpers.logger.debug('Calling list rooms API on url: ' + apiUrl)
      const rooms = await got(apiUrl, {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + await getAPIKey(options),
          host: currentProsodyProxyInfo.host
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

async function disableProxyRoute ({ peertubeHelpers }: RegisterServerOptions): Promise<void> {
  // Note: I tried to promisify the httpbind proxy closing (by waiting for the callback call).
  // But this seems to never happen, and stucked the plugin uninstallation.
  // So I don't wait.
  try {
    currentProsodyProxyInfo = null
    if (currentHttpBindProxy) {
      peertubeHelpers.logger.info('Closing the http bind proxy...')
      currentHttpBindProxy.close()
      currentHttpBindProxy = null
    }

    if (currentWebsocketProxy) {
      peertubeHelpers.logger.info('Closing the websocket proxy...')
      currentWebsocketProxy.close()
      currentWebsocketProxy = null
    }
    if (currentS2SWebsocketProxy) {
      peertubeHelpers.logger.info('Closing the s2s websocket proxy...')
      currentS2SWebsocketProxy.close()
      currentS2SWebsocketProxy = null
    }
  } catch (err) {
    peertubeHelpers.logger.error('Seems that the http bind proxy close has failed: ' + (err as string))
  }
}

async function enableProxyRoute (
  { peertubeHelpers }: RegisterServerOptions,
  prosodyProxyInfo: ProsodyProxyInfo
): Promise<void> {
  const logger = peertubeHelpers.logger
  if (!/^\d+$/.test(prosodyProxyInfo.port)) {
    logger.error(`Port '${prosodyProxyInfo.port}' is not valid. Aborting.`)
    return
  }
  currentProsodyProxyInfo = prosodyProxyInfo

  logger.info('Creating a new http bind proxy')
  currentHttpBindProxy = createProxyServer({
    target: 'http://localhost:' + prosodyProxyInfo.port + '/http-bind',
    ignorePath: true
  })
  currentHttpBindProxy.on('error', (err, req, res) => {
    // We must handle errors, otherwise Peertube server crashes!
    logger.error(
      'The http bind proxy got an error ' +
      '(this can be normal if you updated/uninstalled the plugin, or shutdowned peertube while users were chatting): ' +
      err.message
    )
    if ('writeHead' in res) {
      res.writeHead(500)
    }
    res.end('')
  })
  currentHttpBindProxy.on('close', () => {
    logger.info('Got a close event for the http bind proxy')
  })

  logger.info('Creating a new websocket proxy')
  currentWebsocketProxy = createProxyServer({
    target: 'http://localhost:' + prosodyProxyInfo.port + '/xmpp-websocket',
    ignorePath: true,
    ws: true
  })
  currentWebsocketProxy.on('error', (err, req, res) => {
    // We must handle errors, otherwise Peertube server crashes!
    logger.error(
      'The websocket proxy got an error ' +
      '(this can be normal if you updated/uninstalled the plugin, or shutdowned peertube while users were chatting): ' +
      err.message
    )
    if ('writeHead' in res) {
      res.writeHead(500)
    }
    res.end('')
  })
  currentWebsocketProxy.on('close', () => {
    logger.info('Got a close event for the websocket proxy')
  })

  logger.info('Creating a new s2s websocket proxy')
  currentS2SWebsocketProxy = createProxyServer({
    target: 'http://localhost:' + prosodyProxyInfo.port + '/xmpp-websocket-s2s',
    ignorePath: true,
    ws: true
  })
  currentS2SWebsocketProxy.on('error', (err, req, res) => {
    // We must handle errors, otherwise Peertube server crashes!
    logger.error(
      'The s2s websocket proxy got an error ' +
      '(this can be normal if you updated/uninstalled the plugin, or shutdowned peertube while users were chatting): ' +
      err.message
    )
    if ('writeHead' in res) {
      res.writeHead(500)
    }
    res.end('')
  })
  currentS2SWebsocketProxy.on('close', () => {
    logger.info('Got a close event for the s2s websocket proxy')
  })
}

interface WCRemoteConnectionInfos {
  roomJID: string
  anonymous?: {
    userJID: string
    boshUri: string
    wsUri?: string
  }
  authenticated?: boolean
}

async function _remoteConnectionInfos (
  remoteChatInfos: LiveChatJSONLDAttributeV1,
  canWebsocketS2S: boolean,
  canDirectS2S: boolean
): Promise<WCRemoteConnectionInfos> {
  if (!remoteChatInfos) { throw new Error('Should have remote chat infos for remote videos') }
  if (remoteChatInfos.type !== 'xmpp') { throw new Error('Should have remote xmpp chat infos for remote videos') }
  const connectionInfos: WCRemoteConnectionInfos = {
    roomJID: remoteChatInfos.jid
  }
  if (compatibleRemoteAuthenticatedConnectionEnabled(remoteChatInfos, canWebsocketS2S, canDirectS2S)) {
    connectionInfos.authenticated = true
  }
  const anonymousCI = anonymousConnectionInfos(remoteChatInfos ?? false)
  if (anonymousCI?.boshUri) {
    connectionInfos.anonymous = {
      userJID: anonymousCI.userJID,
      boshUri: anonymousCI.boshUri,
      wsUri: anonymousCI.wsUri
    }
  }
  return connectionInfos
}

async function _localRoomJID (
  options: RegisterServerOptions,
  settings: SettingEntries,
  prosodyDomain: string,
  roomKey: string,
  video: MVideoThumbnail | undefined,
  channelId: number,
  forceType: boolean
): Promise<string> {
  // Computing the room name...
  let room: string
  if (forceType) {
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
      options.peertubeHelpers.logger.error(`Invalid channel name, contains unauthorized chars: '${channelName}'`)
      throw new Error('Invalid channel name, contains unauthorized chars')
    }
    room = room.replace(/{{CHANNEL_NAME}}/g, channelName)
  }

  return room
}

export {
  initWebchatRouter,
  disableProxyRoute,
  enableProxyRoute
}
