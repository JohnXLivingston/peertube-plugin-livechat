// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions, VideoObject, Video } from '@peertube/peertube-types'
import { getBaseRouterRoute, getBaseWebSocketRoute } from '../helpers'
import { canonicalizePluginUri } from './canonicalize'

export function getBoshUri (options: RegisterServerOptions): string {
  return getBaseRouterRoute(options) + 'http-bind'
}

export function getWSUri (options: RegisterServerOptions): string | undefined {
  const base = getBaseWebSocketRoute(options) // can be undefined if Peertube is too old
  if (base === undefined) { return undefined }
  return base + 'xmpp-websocket'
}

export function getWSS2SUri (options: RegisterServerOptions): string | undefined {
  const base = getBaseWebSocketRoute(options) // can be undefined if Peertube is too old
  if (base === undefined) { return undefined }
  return base + 'xmpp-websocket-s2s'
}

export function getPublicChatUri (options: RegisterServerOptions, video: VideoObject | Video): string {
  const url = getBaseRouterRoute(options) + 'webchat/room/' + encodeURIComponent(video.uuid)
  return canonicalizePluginUri(options, url, {
    removePluginVersion: true
  })
}
