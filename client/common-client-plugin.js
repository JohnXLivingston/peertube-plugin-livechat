
'use strict'

function register ({ registerHook, _peertubeHelpers }) {
  registerHook({
    target: 'action:router.navigation-end',
    handler: () => {
      document.querySelectorAll('.peertube-plugin-livechat-stuff')
        .forEach(dom => dom.remove())
    }
  })
}

export {
  register
}
