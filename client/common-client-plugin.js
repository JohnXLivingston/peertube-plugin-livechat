
'use strict'

function register ({ registerHook, _peertubeHelpers }) {
  registerHook({
    target: 'action:router.navigation-end',
    handler: () => {
      const el = document.querySelector('.peertube-plugin-livechat-init')
      if (el) {
        el.classList.remove('peertube-plugin-livechat-init')
      }

      document.querySelectorAll('.peertube-plugin-livechat-stuff')
        .forEach(dom => dom.remove())
    }
  })
}

export {
  register
}
