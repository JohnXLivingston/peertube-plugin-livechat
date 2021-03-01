
'use strict'

function register ({ registerHook, _peertubeHelpers }) {
  registerHook({
    target: 'action:router.navigation-end',
    handler: () => {
      const container = document.querySelector('#peertube-plugin-livechat-container')
      if (container) {
        container.remove()
      }
    }
  })
}

export {
  register
}
