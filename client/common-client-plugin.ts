
async function register ({ peertubeHelpers, registerHook, registerVideoField }: RegisterOptions): Promise<void> {
  registerHook({
    target: 'action:router.navigation-end',
    handler: () => {
      const container = document.querySelector('#peertube-plugin-livechat-container')
      if (container) {
        container.remove()
      }
    }
  })

  const [label, description, settings] = await Promise.all([
    peertubeHelpers.translate('Use chat'),
    peertubeHelpers.translate('If enabled, there will be a chat next to the video.'),
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
