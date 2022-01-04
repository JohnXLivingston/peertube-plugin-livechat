import type { ChatType } from 'shared/lib/types'
import { AutoColors, isAutoColorsAvailable } from 'shared/lib/autocolors'
import { logger } from './logger'
import { computeAutoColors } from './colors'

interface UriOptions {
  readonly?: boolean | 'noscroll'
  ignoreAutoColors?: boolean
  permanent?: boolean
}

function getBaseRoute ({ peertubeHelpers }: RegisterOptions, permanent: boolean = false): string {
  if (permanent) {
    return '/plugins/livechat/router'
  }
  // NB: this will come with Peertube > 3.2.1 (3.3.0?)
  if (peertubeHelpers.getBaseRouterRoute) {
    return peertubeHelpers.getBaseRouterRoute()
  }
  // We are guessing the route with the correct plugin version with this trick:
  const staticBase = peertubeHelpers.getBaseStaticRoute()
  return staticBase.replace(/\/static.*$/, '/router')
}

function getIframeUri (
  registerOptions: RegisterOptions, settings: any, video: Video, uriOptions: UriOptions = {}
): string | null {
  if (!settings) {
    logger.error('Settings are not initialized, too soon to compute the iframeUri')
    return null
  }
  let iframeUriStr = ''
  const chatType: ChatType = (settings['chat-type'] ?? 'disabled') as ChatType
  if (chatType === 'builtin-prosody' || chatType === 'builtin-converse') {
    // Using the builtin converseJS
    iframeUriStr = getBaseRoute(registerOptions, uriOptions.permanent)
    iframeUriStr += '/webchat/room/' + encodeURIComponent(video.uuid)
  } else if (chatType === 'external-uri') {
    iframeUriStr = settings['chat-uri'] || ''
    iframeUriStr = iframeUriStr.replace(/{{VIDEO_UUID}}/g, encodeURIComponent(video.uuid))
    if (iframeUriStr.includes('{{CHANNEL_ID}}')) {
      if (!video.channel || !video.channel.id) {
        logger.error('Missing channel info in video object.')
        return null
      }
      iframeUriStr = iframeUriStr.replace(/{{CHANNEL_ID}}/g, encodeURIComponent(video.channel.id))
    }
    if (!/^https?:\/\//.test(iframeUriStr)) {
      logger.error('The webchaturi must begin with https://')
      return null
    }
  } else {
    logger.error('Chat disabled.')
    return null
  }
  if (iframeUriStr === '') {
    logger.error('No iframe uri')
    return null
  }

  const iFrameUri = new URL(iframeUriStr, window.location.origin)

  if (
    !uriOptions.ignoreAutoColors &&
    settings['converse-autocolors'] &&
    isAutoColorsAvailable(settings['chat-type'] as ChatType, settings['converse-theme'])
  ) {
    logger.info('We have to try to compute autocolors.')
    try {
      const autocolors = computeAutoColors()
      if (autocolors) {
        for (const p in autocolors) {
          iFrameUri.searchParams.set('_ac_' + p, autocolors[p as keyof AutoColors])
        }
      }
    } catch (err) {
      logger.error(`Failed computing autocolors:  '${err as string}'`)
    }
  }

  if (uriOptions.readonly) {
    iFrameUri.searchParams.set('_readonly', (typeof uriOptions.readonly === 'string') ? uriOptions.readonly : 'true')
  }

  iframeUriStr = iFrameUri.href
  return iframeUriStr
}

export {
  UriOptions,
  getBaseRoute,
  getIframeUri
}
