import type { ChatType } from 'shared/lib/types'

interface ActionPluginSettingsParams {
  npmName: string
}

function register ({ registerHook, registerSettingsScript, peertubeHelpers }: RegisterOptions): void {
  function getBaseRoute (): string {
    // NB: this will come with Peertube > 3.2.1 (3.3.0?)
    if (peertubeHelpers.getBaseRouterRoute) {
      return peertubeHelpers.getBaseRouterRoute()
    }
    // We are guessing the route with the correct plugin version with this trick:
    const staticBase = peertubeHelpers.getBaseStaticRoute()
    // we can't use '/plugins/livechat/router', because the loaded html page needs correct relative paths.
    return staticBase.replace(/\/static.*$/, '/router')
  }

  registerHook({
    target: 'action:admin-plugin-settings.init',
    handler: ({ npmName }: ActionPluginSettingsParams) => {
      if (npmName !== PLUGIN_CHAT_PACKAGE_NAME) {
        console.log(`[peertube-plugin-livechat] Settings for ${npmName}, not ${PLUGIN_CHAT_PACKAGE_NAME}. Returning.`)
        return
      }
      console.log('[peertube-plugin-livechat] Initializing diagnostic button')
      const diagButtons = document.querySelectorAll('.peertube-plugin-livechat-launch-diagnostic')
      diagButtons.forEach(diagButton => {
        if (diagButton.hasAttribute('href')) { return }
        // TODO: use a modal instead of a target=_blank
        diagButton.setAttribute('href', getBaseRoute() + '/settings/diagnostic')
        diagButton.setAttribute('target', '_blank')
      })
    }
  })
  registerSettingsScript({
    isSettingHidden: options => {
      const name = options.setting.name
      switch (name) {
        case 'chat-type-help-disabled':
          return options.formValues['chat-type'] !== ('disabled' as ChatType)
        case 'prosody-port':
        case 'prosody-peertube-uri':
        case 'chat-type-help-builtin-prosody':
        case 'prosody-advanced':
        case 'prosody-c2s':
          return options.formValues['chat-type'] !== ('builtin-prosody' as ChatType)
        case 'prosody-c2s-port':
          return options.formValues['chat-type'] !== ('builtin-prosody' as ChatType) || options.formValues['prosody-c2s'] === false
        case 'chat-server':
        case 'chat-room':
        case 'chat-bosh-uri':
        case 'chat-ws-uri':
        case 'chat-type-help-builtin-converse':
          return options.formValues['chat-type'] !== ('builtin-converse' as ChatType)
        case 'chat-uri':
        case 'chat-type-help-external-uri':
          return options.formValues['chat-type'] !== ('external-uri' as ChatType)
        case 'chat-style':
          return options.formValues['chat-type'] === 'disabled'
        case 'chat-only-locals-warning':
          return options.formValues['chat-only-locals'] === true
        case 'chat-per-live-video-warning':
          return !(options.formValues['chat-all-lives'] === true && options.formValues['chat-per-live-video'] === true)
      }

      return false
    }
  })
}

export {
  register
}
