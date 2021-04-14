import type { Router, Request, Response, NextFunction } from 'express'
import { getBaseRouter } from '../helpers'
import * as path from 'path'
const fs = require('fs').promises

async function initWebchatRouter ({
  getRouter,
  peertubeHelpers,
  settingsManager
}: RegisterServerOptions): Promise<Router> {
  const converseJSIndex = await fs.readFile(path.resolve(__dirname, '../../conversejs/index.html'))

  const router = getRouter()
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsManager.getSettings([
        'chat-use-prosody', 'chat-use-builtin', 'chat-room', 'chat-server',
        'chat-bosh-uri', 'chat-ws-uri'
      ])

      let server: string
      let room: string
      let boshUri: string
      let wsUri: string
      if (settings['chat-use-prosody']) {
        server = 'localhost'
        room = '{{VIDEO_UUID}}@room.localhost'
        boshUri = getBaseRouter() + 'http-bind'
        wsUri = ''
      } else if (settings['chat-use-builtin']) {
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

      // FIXME: with Peertube 3.0.1 the following method is not available...
      // When loadByIdOrUUID is available, change the entry point to
      // be /webchat/:videoId
      // const id = req.param('videoId')
      // const video = await peertubeHelpers.videos.loadByIdOrUUID(id)
      let url: string = req.query.url as string || ''
      if (!url) {
        throw new Error('Missing url parameter)')
      }
      let video = await peertubeHelpers.videos.loadByUrl(url)
      if (!video) {
        // FIXME: remove this when loadByIdOrUUID will be available...
        // This is a dirty Hack for dev environnements...
        url = url.replace(/^https:/, 'http:')
        video = await peertubeHelpers.videos.loadByUrl(url)
      }
      if (!video) {
        throw new Error('Video not found')
      }

      let page = '' + (converseJSIndex as string)
      // FIXME: Peertube should provide the static folder path. For now:
      const staticRelative = '../static'
      page = page.replace(/{{BASE_STATIC_URL}}/g, staticRelative)
      page = page.replace(/{{JID}}/g, server)
      room = room.replace(/{{VIDEO_UUID}}/g, video.uuid)
      page = page.replace(/{{ROOM}}/g, room)
      page = page.replace(/{{BOSH_SERVICE_URL}}/g, boshUri)
      page = page.replace(/{{WS_SERVICE_URL}}/g, wsUri)

      res.status(200)
      res.type('html')
      res.send(page)
    } catch (error) {
      return next(error)
    }
  })
  return router
}

export {
  initWebchatRouter
}
