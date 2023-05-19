
import type { RegisterServerOptions } from '@peertube/peertube-types'
import { getBaseRouterRoute, getBaseWebSocketRoute } from '../helpers'

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
