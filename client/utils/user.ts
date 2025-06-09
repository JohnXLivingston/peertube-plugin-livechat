// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { Video } from '@peertube/peertube-types'
import { logger } from './logger'

export function isAnonymousUser (registerOptions: RegisterClientOptions): boolean {
  return !registerOptions.peertubeHelpers.isLoggedIn()
}

export function guessIsMine (registerOptions: RegisterClientOptions, video: Video): boolean {
  // Note: this is not safe, but it is not a problem:
  // this function is used for non critical functions
  try {
    if (!video) {
      return false
    }
    if (!video.isLocal) {
      return false
    }
    if (!window.localStorage) {
      return false
    }
    const username = window.localStorage.getItem('username') ?? ''
    if (!username) {
      return false
    }
    if (username !== video.account?.name) {
      return false
    }
    return true
  } catch (err) {
    logger.error(err as string)
    return false
  }
}

export function guessIamIModerator (_registerOptions: RegisterClientOptions): boolean {
  // Note: this is not safe, but it is not a problem:
  // this function is used for non critical functions
  try {
    if (!window.localStorage) {
      return false
    }
    const role = window.localStorage.getItem('role') ?? ''
    if (!role) {
      return false
    }
    if (role !== '0' && role !== '1') {
      return false
    }
    return true
  } catch (err) {
    logger.error(err as string)
    return false
  }
}
