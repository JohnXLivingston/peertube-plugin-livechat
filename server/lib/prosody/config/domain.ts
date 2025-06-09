// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'

async function getProsodyDomain (options: RegisterServerOptions): Promise<string> {
  const url = options.peertubeHelpers.config.getWebserverUrl()
  const matches = url.match(/^https?:\/\/([^:/]*)(:\d+)?(\/|$)/)
  if (!matches) {
    throw new Error(`Cant get a domain name from url '${url}'`)
  }
  return matches[1]
}

export {
  getProsodyDomain
}
