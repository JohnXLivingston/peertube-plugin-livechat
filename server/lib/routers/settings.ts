import type { Router, Request, Response, NextFunction } from 'express'
import { getBaseStaticRoute, isUserAdmin } from '../helpers'

interface Result {
  label?: string
  messages: string[]
  next?: string
  ok: boolean
  test: string
}

async function initSettingsRouter ({
  peertubeHelpers,
  getRouter,
  settingsManager
}: RegisterServerOptions): Promise<Router> {
  const router = getRouter()
  const logger = peertubeHelpers.logger

  router.get('/diagnostic', async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Accessing peertube-plugin-livechat diagnostic tool.')
      const src = getBaseStaticRoute() + 'settings/settings.js'
      res.status(200)
      res.type('html')
      res.send('<html><body><div>Loading...</div></body><script src="' + src + '"></script></html>')
    } catch (error) {
      return next(error)
    }
  })

  router.post('/diagnostic/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.authenticated) {
        return res.sendStatus(403)
      }
      if (!isUserAdmin(res)) {
        return res.sendStatus(403)
      }

      const test: string = req.body.test || ''
      logger.info('Accessing peertube-plugin-livechat diagnostic tool, test "' + test + '".')

      const result: Result = {
        test: test,
        ok: false,
        messages: [],
        next: undefined
      }
      if (test === 'backend') {
        result.label = 'Backend connection'
        result.ok = true
        result.next = 'webchat-video'
      } else if (test === 'webchat-video') {
        result.label = 'Webchat activated on videos'
        const videoSettings = await settingsManager.getSettings([
          'chat-auto-display',
          'chat-open-blank',
          'chat-only-locals',
          'chat-all-lives',
          'chat-all-non-lives',
          'chat-videos-list'
        ])
        if (videoSettings['chat-auto-display']) {
          result.messages.push('Chat will open automatically')
        } else {
          result.messages.push('Chat will not open automatically')
        }

        if (videoSettings['chat-open-blank']) {
          result.messages.push('Displaying «open in new window» button')
        }

        if (videoSettings['chat-only-locals']) {
          result.messages.push('Chat will only be available for local videos')
        }

        let atLeastOne: boolean = false
        if (videoSettings['chat-all-lives']) {
          result.messages.push('Chat is enabled for all lives.')
          atLeastOne = true
        }
        if (videoSettings['chat-all-non-lives']) {
          result.messages.push('Chat is enabled for all non-lives.')
          atLeastOne = true
        }
        if ((videoSettings['chat-videos-list'] ?? '') !== '') {
          const lines = ((videoSettings['chat-videos-list'] ?? '') as string).split('\n')
          for (let i = 0; i < lines.length; i++) {
            if (/^\s*(-|\w)+\s*($|#)/.test(lines[i])) {
              result.messages.push('Chat is activated for a specific videos.')
              atLeastOne = true
            }
          }
        }
        if (atLeastOne) {
          result.ok = true
          result.next = 'webchat-type'
        } else {
          result.ok = false
          result.messages.push('Chat is activate for no video.')
        }
      } else if (test === 'webchat-type') {
        const typeSettings = await settingsManager.getSettings([
          'chat-use-prosody',
          'chat-use-builtin',
          'chat-use-uri'
        ])
        result.label = 'Webchat type'
        if (typeSettings['chat-use-prosody'] as boolean) {
          result.messages.push('Using builtin Prosody')
          result.ok = true
        } else if (typeSettings['chat-use-builtin'] as boolean) {
          result.messages.push('Using builtin ConverseJS to connect to an external XMPP server')
          const builtinSettings = await settingsManager.getSettings([
            'chat-server',
            'chat-room',
            'chat-bosh-uri',
            'chat-ws-uri'
          ])

          let isBuiltinError = false

          const chatServer: string = (builtinSettings['chat-server'] as string) || ''
          if (chatServer === '') {
            result.messages.push('Missing chat server configuration')
            isBuiltinError = true
          } else if (!/^([a-z0-9.]+)+[a-z0-9]+$/.test(chatServer)) {
            result.messages.push(
              'Invalid value for the webchat server: "' +
              chatServer +
              '"'
            )
            isBuiltinError = true
          } else {
            result.messages.push('Chat server is correct')
          }

          const chatRoom: string = (builtinSettings['chat-room'] as string) || ''
          if (chatRoom === '') {
            result.messages.push('Missing chat room configuration')
            isBuiltinError = true
          } else if (
            !/^(\w|{{VIDEO_UUID}})+@([a-z0-9.]+)+[a-z0-9]+$/
              .test(chatRoom)
          ) {
            result.messages.push(
              'Invalid value for the webchat room: "' +
              chatRoom +
              '"'
            )
            isBuiltinError = true
          } else {
            result.messages.push('Chat room is correct')
          }

          const chatBoshUri: string = (builtinSettings['chat-bosh-uri'] as string) || ''
          const chatWsUri: string = (builtinSettings['chat-ws-uri'] as string) || ''
          if (chatBoshUri === '' && chatWsUri === '') {
            result.messages.push('Missing BOSH or Websocket uri')
            isBuiltinError = true
          }
          if (chatBoshUri !== '') {
            if (!/^https?:\/\//.test(chatBoshUri)) {
              result.messages.push('Invalid BOSH Uri, should begin with https://')
              isBuiltinError = true
            } else {
              result.messages.push('Valid Bosh Uri')
            }
          }
          if (chatWsUri !== '') {
            if (!/^wss?:\/\//.test(chatWsUri)) {
              result.messages.push('Invalid Websocket Uri, should begin with wss://')
              isBuiltinError = true
            } else {
              result.messages.push('Valid Websocket Uri')
            }
          }

          if (!isBuiltinError) {
            result.messages.push('Builtin converse is correctly configured')
            result.ok = true
          }
        } else if ((typeSettings['chat-use-uri'] as string) !== '') {
          result.messages.push('Using an external uri')
          result.ok = true
        } else {
          result.messages.push('No webchat configuration')
        }
      } else {
        result.messages.push('Unknown test')
      }

      res.status(200)
      res.json(result)
    } catch (error) {
      return next(error)
    }
  })

  return router
}

export {
  initSettingsRouter
}
