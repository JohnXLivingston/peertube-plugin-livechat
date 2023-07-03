// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { pluginVersionWordBreakRegex } from '../helpers'
import * as url from 'url'

const removeVersionRegex = new RegExp(
  /\/plugins\/livechat\//.source +
  pluginVersionWordBreakRegex.source +
  /\//.source
)

interface CanonicalizeOptions {
  protocol?: 'http' | 'ws'
  removePluginVersion?: boolean
}

/**
 * Takes a Plugin uri or route path (for example an API endpoint, the websocket route, ...),
 * and returns a canonicalized version that include the host, and can handle different options
 * (with the given scheme, without the plugin version, ...)
 * @param options Peertube server options
 * @param path the uri to canonicalize
 * @param canonicalizeOptions canonicalize options
 * @returns the canonicalize uri
 */
export function canonicalizePluginUri (
  options: RegisterServerOptions,
  path: string,
  canonicalizeOptions?: CanonicalizeOptions
): string {
  let uri: url.URL
  if (path.match(/^(http|ws)s?:\/\//)) {
    uri = new url.URL(path)
  } else {
    uri = new url.URL(path, options.peertubeHelpers.config.getWebserverUrl())
  }
  if (canonicalizeOptions?.protocol) {
    // Assuming that current protocol is https?: or wss?:, other cases dont concern us, and will be buggy
    const currentProtocolSecure = uri.protocol === 'https:' || uri.protocol === 'wss:'
    if (canonicalizeOptions.protocol === 'http') {
      uri.protocol = currentProtocolSecure ? 'https' : 'http'
    } else if (canonicalizeOptions.protocol === 'ws') {
      uri.protocol = currentProtocolSecure ? 'wss' : 'ws'
    }
  }
  if (canonicalizeOptions?.removePluginVersion) {
    uri.pathname = uri.pathname.replace(
      removeVersionRegex,
      '/plugins/livechat/'
    )
  }
  return uri.toString()
}
