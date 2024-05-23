// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { html, render } from 'lit'
import './elements' // Import all needed elements.

/**
 * Registers stuff related to the user's configuration pages.
 * @param clientOptions Peertube client options
 */
async function registerConfiguration (clientOptions: RegisterClientOptions): Promise<void> {
  const { peertubeHelpers, registerClientRoute, registerHook } = clientOptions

  const settings = await peertubeHelpers.getSettings()
  if (settings['disable-channel-configuration']) { return }

  registerClientRoute({
    route: 'livechat/configuration',
    onMount: async ({ rootEl }) => {
      render(html`<livechat-channel-home .registerClientOptions=${clientOptions}></livechat-channel-home>`, rootEl)
    }
  })

  registerClientRoute({
    route: 'livechat/configuration/channel',
    onMount: async ({ rootEl }) => {
      const urlParams = new URLSearchParams(window.location.search)
      const channelId = urlParams.get('channelId') ?? ''
      render(html`<livechat-channel-configuration .registerClientOptions=${clientOptions}
                                         .channelId=${channelId}></livechat-channel-configuration>`, rootEl)
    }
  })

  registerHook({
    target: 'filter:left-menu.links.create.result',
    handler: async (links: any) => {
      // Adding the links to livechat/configuration for logged users.
      if (!peertubeHelpers.isLoggedIn()) { return links }

      if (!Array.isArray(links)) { return links }
      let myLibraryLinks
      // Searching the 'in-my-library' entry.
      for (const link of links) {
        if (typeof link !== 'object') { continue }
        if (!('key' in link)) { continue }
        if (link.key !== 'in-my-library') { continue }
        myLibraryLinks = link
        break
      }
      if (!myLibraryLinks) { return links }
      if (!Array.isArray(myLibraryLinks.links)) { return links }

      const label = await peertubeHelpers.translate(LOC_MENU_CONFIGURATION_LABEL)
      myLibraryLinks.links.push({
        label,
        shortLabel: label,
        path: '/p/livechat/configuration',
        icon: 'live'
      })
      return links
    }
  })
}

export {
  registerConfiguration
}
