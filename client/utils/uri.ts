// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'

function getBaseRoute ({ peertubeHelpers }: RegisterClientOptions, permanent = false): string {
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

export {
  getBaseRoute
}
