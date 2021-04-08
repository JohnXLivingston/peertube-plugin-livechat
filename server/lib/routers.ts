import * as path from 'path'
import type { NextFunction, Request, Response } from 'express'
const fs = require('fs').promises

type InitRoutersOptions = Pick<RegisterServerOptions, 'settingsManager' | 'getRouter' | 'peertubeHelpers'>

export async function initRouters ({
  settingsManager,
  getRouter,
  peertubeHelpers
}: InitRoutersOptions): Promise<void> {
  const converseJSIndex = await fs.readFile(path.resolve(__dirname, '../conversejs/index.html'))

  const router = getRouter()
  router.get('/ping', (req: Request, res: Response) => res.json({ message: 'pong' }))
  router.get('/webchat', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsManager.getSettings([
        'chat-use-builtin', 'chat-room', 'chat-server',
        'chat-bosh-uri', 'chat-ws-uri'
      ])

      if (!settings['chat-use-builtin']) {
        throw new Error('Builtin chat disabled.')
      }
      if (!settings['chat-server']) {
        throw new Error('Missing chat-server settings.')
      }
      if (!settings['chat-room']) {
        throw new Error('Missing chat-room settings.')
      }
      if (!settings['chat-bosh-uri'] && !settings['chat-ws-uri']) {
        throw new Error('Missing BOSH or Websocket uri.')
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
      page = page.replace(/{{JID}}/g, settings['chat-server'] as string)
      const room = (settings['chat-room'] as string).replace(/{{VIDEO_UUID}}/g, video.uuid)
      page = page.replace(/{{ROOM}}/g, room)
      page = page.replace(/{{BOSH_SERVICE_URL}}/g, settings['chat-bosh-uri'] as string)
      page = page.replace(/{{WS_SERVICE_URL}}/g, settings['chat-ws-uri'] as string)

      res.status(200)
      res.type('html')
      res.send(page)
    } catch (error) {
      return next(error)
    }
  })
}
