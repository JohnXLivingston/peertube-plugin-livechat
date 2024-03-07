import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { ProsodyListRoomsResult, ProsodyListRoomsResultRoom } from '../../../shared/lib/types'
import { createProxyServer } from 'http-proxy'
import { RegisterServerOptionsV5, isUserAdmin } from '../helpers'
import { asyncMiddleware } from '../middlewares/async'
import { isAutoColorsAvailable, areAutoColorsValid, AutoColors } from '../../../shared/lib/autocolors'
import { fetchMissingRemoteServerInfos } from '../federation/fetch-infos'
import { getConverseJSParams } from '../conversejs/params'
import { setCurrentProsody, delCurrentProsody } from '../prosody/api/host'
import { getChannelInfosById } from '../database/channel'
import { listProsodyRooms } from '../prosody/api/manage-rooms'
import * as path from 'path'

const fs = require('fs').promises

interface ProsodyProxyInfo {
  host: string
  port: string
}
let currentHttpBindProxy: ReturnType<typeof createProxyServer> | null = null
let currentWebsocketProxy: ReturnType<typeof createProxyServer> | null = null
let currentS2SWebsocketProxy: ReturnType<typeof createProxyServer> | null = null

async function initWebchatRouter (options: RegisterServerOptionsV5): Promise<Router> {
  const {
    getRouter,
    registerWebSocketRoute,
    peertubeHelpers
  } = options

  const converseJSIndex = await fs.readFile(path.resolve(__dirname, '../../conversejs/index.html'))

  const router: Router = getRouter()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/room/:roomKey', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      res.removeHeader('X-Frame-Options') // this route can be opened in an iframe

      const roomKey = req.params.roomKey
      let readonly: boolean | 'noscroll' = false
      if (req.query._readonly === 'true') {
        readonly = true
      } else if (req.query._readonly === 'noscroll') {
        readonly = 'noscroll'
      }

      const initConverseJSParam = await getConverseJSParams(options, roomKey, {
        readonly,
        transparent: req.query._transparent === 'true',
        forcetype: req.query.forcetype === '1',
        forceDefaultHideMucParticipants: req.query.force_default_hide_muc_participants === '1'
      })

      if (('isError' in initConverseJSParam)) {
        res.status(initConverseJSParam.code)
        res.send(initConverseJSParam.message)
        return
      }

      let page = '' + (converseJSIndex as string)
      page = page.replace(/{{BASE_STATIC_URL}}/g, initConverseJSParam.staticBaseUrl)

      const settings = await options.settingsManager.getSettings([
        'converse-theme', 'converse-autocolors'
      ])

      // Adding some custom CSS if relevant...
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

      // ... then insert CSS in the page.
      page = page.replace(/{{CONVERSEJS_AUTOCOLORS}}/g, autocolorsStyles)

      // ... and finaly inject all other parameters
      page = page.replace('{INIT_CONVERSE_PARAMS}', JSON.stringify(initConverseJSParam))
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

      const rooms = await listProsodyRooms(options)
      // For the frontend, we are adding channel data if the room is channel specific
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
    delCurrentProsody()
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
  setCurrentProsody(prosodyProxyInfo.host, prosodyProxyInfo.port)

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

export {
  initWebchatRouter,
  disableProxyRoute,
  enableProxyRoute
}
