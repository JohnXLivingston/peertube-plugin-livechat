// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { displayConverseJS } from '../../utils/conversejs'
import { logger } from '../../utils/logger'

/**
 * Registers stuff related to "room" page.
 * @param clientOptions Peertube client options
 */
async function registerRoom (clientOptions: RegisterClientOptions): Promise<void> {
  const { peertubeHelpers, registerClientRoute } = clientOptions

  registerClientRoute({
    route: 'livechat/room',
    onMount: async ({ rootEl }) => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const roomKey = urlParams.get('room')
        if (!roomKey) {
          throw new Error('missing room parameter')
        }
        const forceType = urlParams.get('forcetype') === '1'

        const container = document.createElement('div')
        container.classList.add('livechat-embed-fullpage')
        rootEl.append(container)

        await displayConverseJS(clientOptions, container, roomKey, 'peertube-fullpage', forceType)
      } catch (err) {
        logger.error(err)
        // Displaying an error page.
        rootEl.innerHTML = ''
        const message = document.createElement('div')
        message.classList.add('peertube-plugin-livechat-error-message')
        message.innerText = await peertubeHelpers.translate(LOC_CHATROOM_NOT_ACCESSIBLE)
        rootEl.append(message)
      }
    }
  })
}

export {
  registerRoom
}
