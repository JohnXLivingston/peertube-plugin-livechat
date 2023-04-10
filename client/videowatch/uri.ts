import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { Video } from '@peertube/peertube-types'
import { AutoColors, isAutoColorsAvailable } from 'shared/lib/autocolors'
import { logger } from './logger'
import { computeAutoColors } from './colors'

interface UriOptions {
  readonly?: boolean | 'noscroll'
  transparent?: boolean
  ignoreAutoColors?: boolean
  permanent?: boolean
}

function getBaseRoute ({ peertubeHelpers }: RegisterClientOptions, permanent: boolean = false): string {
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
  registerOptions: RegisterClientOptions, settings: any, video: Video, uriOptions: UriOptions = {}
): string | null {
  if (!settings) {
    logger.error('Settings are not initialized, too soon to compute the iframeUri')
    return null
  }
  let iframeUriStr = getBaseRoute(registerOptions, uriOptions.permanent)
  iframeUriStr += '/webchat/room/' + encodeURIComponent(video.uuid)

  const iFrameUri = new URL(iframeUriStr, window.location.origin)

  if (
    !uriOptions.ignoreAutoColors &&
    settings['converse-autocolors'] &&
    isAutoColorsAvailable(settings['converse-theme'])
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

  if (uriOptions.transparent) {
    iFrameUri.searchParams.set('_transparent', 'true')
  }

  iframeUriStr = iFrameUri.href
  return iframeUriStr
}

function getXMPPUri (
  registerOptions: RegisterClientOptions, settings: any, video: Video
): string | null {
  // returns something like xmpp:256896ac-199a-4dab-bb3a-4fd916140272@room.instance.tdl?join
  if (!settings['prosody-room-allow-s2s']) {
    return null
  }

  let uuid: string
  if (settings['prosody-room-type'] === 'channel') {
    uuid = 'channel.' + video.channel.id.toString()
  } else {
    uuid = video.uuid.toString()
  }

  const hostname = window.location.hostname

  return 'xmpp:' + uuid + '@room.' + hostname + '?join'
}

export type {
  UriOptions
}
export {
  getBaseRoute,
  getIframeUri,
  getXMPPUri
}
