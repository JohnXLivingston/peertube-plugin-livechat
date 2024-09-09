// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { RegisterClientFormFieldOptions } from '@peertube/peertube-types'
import { registerConfiguration } from './common/configuration/register'
import { registerVideoWatch } from './common/videowatch/register'
import { registerRoom } from './common/room/register'
import { initPtContext } from './common/lib/contexts/peertube'
import { registerAdminFirewall } from './common/admin/firewall/register'
import './common/lib/elements' // Import shared elements.

async function register (clientOptions: RegisterClientOptions): Promise<void> {
  const { peertubeHelpers, registerHook, registerVideoField } = clientOptions

  initPtContext(clientOptions)

  registerHook({
    target: 'action:router.navigation-end',
    handler: () => {
      const container = document.querySelector('#peertube-plugin-livechat-container')
      if (container) {
        const url = container.getAttribute('peertube-plugin-livechat-current-url')
        if (url && url === window.location.href) {
          console.warn(
            '[peertube-plugin-livechat navigation-end] ' +
            'It seems that action:router.navigation-end was called after action:video-watch.video.loaded. ' +
            'Not removing the chat from the DOM.'
          )
          return
        }
        container.remove()
      }

      if (window.converse?.livechatDisconnect) {
        window.converse.livechatDisconnect()
      }
    }
  })

  const [label, description, settings] = await Promise.all([
    peertubeHelpers.translate(LOC_USE_CHAT),
    peertubeHelpers.translate(LOC_USE_CHAT_HELP),
    peertubeHelpers.getSettings()
  ])
  const webchatFieldOptions: RegisterClientFormFieldOptions = {
    name: 'livechat-active',
    label,
    descriptionHTML: description,
    type: 'input-checkbox',
    default: true,
    hidden: ({ liveVideo }) => {
      if (!liveVideo) {
        return true
      }
      if (!settings['chat-per-live-video']) {
        return true
      }
      if (settings['chat-all-lives']) {
        // No need to add this field if live is active for all live videos
        return true
      }
      return false
    }
  }
  registerVideoField(webchatFieldOptions, { type: 'update' })
  registerVideoField(webchatFieldOptions, { type: 'go-live' })

  await Promise.all([
    registerVideoWatch(),
    registerRoom(clientOptions),
    registerConfiguration(clientOptions),
    registerAdminFirewall(clientOptions)
  ])
}

export {
  register
}
