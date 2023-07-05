import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { RegisterClientFormFieldOptions } from '@peertube/peertube-types'

async function register ({ peertubeHelpers, registerHook, registerVideoField }: RegisterClientOptions): Promise<void> {
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
            'No removing the chat from the DOM.'
          )
          return
        }
        container.remove()
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
    label: label,
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
}

export {
  register
}
