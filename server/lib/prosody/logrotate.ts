// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ProsodyFilePaths } from './config/paths'
import { debugNumericParameter } from '../debug'
import { reloadProsody } from './ctl'

type Rotate = (file: string, options: {
  count?: number
  compress?: boolean
}, cb: (err: any) => void) => void
const rotate: Rotate = require('log-rotate')

interface ProsodyLogRotate {
  timer: NodeJS.Timeout
  lastRotation: number
}

let logRotate: ProsodyLogRotate | undefined

async function _rotate (options: RegisterServerOptions, path: string): Promise<void> {
  const p = new Promise<void>((resolve) => {
    // I dont use compress.
    // I guess that this could cause log losses, because the prosody reload will not happen immediatly.
    rotate(path, { count: 14, compress: false }, (err: any) => {
      if (err) {
        options.peertubeHelpers.logger.error('Failed to rotate file ' + path, err)
        resolve()
        return
      }
      resolve()
    })
  })
  return p
}

function startProsodyLogRotate (options: RegisterServerOptions, paths: ProsodyFilePaths): void {
  const logger = options.peertubeHelpers.logger
  // check every hour
  const checkInterval = debugNumericParameter(options, 'logRotateCheckInterval', 60 * 1000, 60 * 60 * 1000)
  // rotate every 24hour
  const rotateEvery = debugNumericParameter(options, 'logRotateEvery', 2 * 60 * 1000, 24 * 60 * 60 * 1000)
  // TODO: also rotate when file is too big

  if (logRotate) {
    stopProsodyLogRotate(options)
  }

  logger.info('Starting Prosody log rotation')
  const timer = setInterval(() => {
    logger.debug('Checking if Prosody logs need to be rotated')
    if (!logRotate) {
      logger.error('Seems that we dont need to rotate Prosody logs, but the timer was called.')
      return
    }
    if (logRotate.lastRotation + rotateEvery - 1000 > Date.now()) {
      // minus 1000 to not miss next check
      logger.debug('To soon to rotate.')
      return
    }

    logger.info('Rotating Prosody log files.')
    logRotate.lastRotation = Date.now()

    const p = Promise.all([
      _rotate(options, paths.log),
      _rotate(options, paths.error)
    ])
    p.then(() => {
      reloadProsody(options).then(() => {
        logger.debug('Prosody reloaded')
      }, () => {
        logger.error('Prosody failed to reload')
      })
    }, (err) => {
      logger.error('Failed rotating logs', err)
    })
  }, checkInterval)

  logRotate = {
    timer,
    lastRotation: Date.now()
  }
}

function stopProsodyLogRotate (options: RegisterServerOptions): void {
  const logger = options.peertubeHelpers.logger
  if (logRotate === undefined) {
    return
  }
  logger.info('Stoping Prosody log rotation')
  clearInterval(logRotate.timer)
}

export {
  startProsodyLogRotate,
  stopProsodyLogRotate
}
