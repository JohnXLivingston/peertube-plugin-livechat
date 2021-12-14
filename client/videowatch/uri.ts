import type { ChatType } from 'shared/lib/types'
import { AutoColors, isAutoColorsAvailable } from 'shared/lib/autocolors'
import { logger } from './logger'
import { computeAutoColors } from './colors'

function getBaseRoute ({ peertubeHelpers }: RegisterOptions): string {
  // NB: this will come with Peertube > 3.2.1 (3.3.0?)
  if (peertubeHelpers.getBaseRouterRoute) {
    return peertubeHelpers.getBaseRouterRoute()
  }
  // We are guessing the route with the correct plugin version with this trick:
  const staticBase = peertubeHelpers.getBaseStaticRoute()
  // we can't use '/plugins/livechat/router', because the loaded html page needs correct relative paths.
  return staticBase.replace(/\/static.*$/, '/router')
}

function getIframeUri (registerOptions: RegisterOptions, settings: any, video: Video): string | null {
  if (!settings) {
    logger.error('Settings are not initialized, too soon to compute the iframeUri')
    return null
  }
  let iframeUri = ''
  const chatType: ChatType = (settings['chat-type'] ?? 'disabled') as ChatType
  if (chatType === 'builtin-prosody' || chatType === 'builtin-converse') {
    // Using the builtin converseJS
    iframeUri = getBaseRoute(registerOptions) + '/webchat/room/' + encodeURIComponent(video.uuid)
  } else if (chatType === 'external-uri') {
    iframeUri = settings['chat-uri'] || ''
    iframeUri = iframeUri.replace(/{{VIDEO_UUID}}/g, encodeURIComponent(video.uuid))
    if (iframeUri.includes('{{CHANNEL_ID}}')) {
      if (!video.channel || !video.channel.id) {
        logger.error('Missing channel info in video object.')
        return null
      }
      iframeUri = iframeUri.replace(/{{CHANNEL_ID}}/g, encodeURIComponent(video.channel.id))
    }
    if (!/^https?:\/\//.test(iframeUri)) {
      logger.error('The webchaturi must begin with https://')
      return null
    }
  } else {
    logger.error('Chat disabled.')
    return null
  }
  if (iframeUri === '') {
    logger.error('No iframe uri')
    return null
  }

  if (
    settings['converse-autocolors'] &&
    isAutoColorsAvailable(settings['chat-type'] as ChatType, settings['converse-theme'])
  ) {
    logger.info('We have to try to compute autocolors.')
    try {
      const autocolors = computeAutoColors()
      if (autocolors) {
        const url = new URL(iframeUri, window.location.origin)
        for (const p in autocolors) {
          url.searchParams.set('_ac_' + p, autocolors[p as keyof AutoColors])
        }
        iframeUri = url.href
      }
    } catch (err) {
      logger.error(`Failed computing autocolors:  '${err as string}'`)
    }
  }

  return iframeUri
}

export {
  getBaseRoute,
  getIframeUri
}
