import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { renderModerationHome } from './templates/home'
import { renderModerationChannel } from './templates/channel'
import { vivifyModerationChannel } from './logic/channel'

/**
 * Registers stuff related to the moderation settings.
 * @param clientOptions Peertube client options
 */
async function registerModeration (clientOptions: RegisterClientOptions): Promise<void> {
  const { peertubeHelpers, registerClientRoute, registerHook } = clientOptions

  registerClientRoute({
    route: 'livechat/moderation',
    onMount: async ({ rootEl }) => {
      rootEl.innerHTML = await renderModerationHome(clientOptions)
    }
  })

  registerClientRoute({
    route: 'livechat/moderation/channel',
    onMount: async ({ rootEl }) => {
      const urlParams = new URLSearchParams(window.location.search)
      const channelId = urlParams.get('channelId') ?? ''
      const html = await renderModerationChannel(clientOptions, channelId)
      if (!html) {
        // renderModerationChannel has already used the notifier to display an error
        rootEl.innerHTML = ''
        return
      }
      rootEl.innerHTML = html
      await vivifyModerationChannel(clientOptions, rootEl, channelId)
    }
  })

  registerHook({
    target: 'filter:left-menu.links.create.result',
    handler: async (links: any) => {
      // Adding the links to livechat/moderation for logged users.
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

      const label = await peertubeHelpers.translate(LOC_MENU_MODERATION_LABEL)
      myLibraryLinks.links.push({
        label,
        shortLabel: label,
        path: '/p/livechat/moderation',
        icon: 'live'
      })
      return links
    }
  })
}

export {
  registerModeration
}
