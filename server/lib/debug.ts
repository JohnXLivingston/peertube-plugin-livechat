import type { RegisterServerOptions } from '@peertube/peertube-types'
import * as path from 'path'
import * as fs from 'fs'

export function isDebugMode (options: RegisterServerOptions): boolean {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger

  if (!peertubeHelpers.plugin) {
    return false
  }
  const filepath = path.resolve(peertubeHelpers.plugin.getDataDirectoryPath(), 'debug_mode')
  logger.debug('Testing debug mode by testing if file exists: ' + filepath)
  if (fs.existsSync(filepath)) {
    logger.info('Plugin livechat Debug mode is on.')
    return true
  }
  return false
}
