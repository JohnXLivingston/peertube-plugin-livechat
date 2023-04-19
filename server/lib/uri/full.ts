import type { RegisterServerOptions } from '@peertube/peertube-types'
import * as url from 'url'

export function fullUri (options: RegisterServerOptions, path: string): string {
  if (path.startsWith('https://') || path.startsWith('http://')) {
    return path
  }
  const uri = new url.URL(path, options.peertubeHelpers.config.getWebserverUrl())
  return uri.toString()
}
