'use strict'

function register ({ registerHook, peertubeHelpers }) {
  const logger = {
    log: (s) => console.log('[peertube-plugin-livechat] ' + s),
    info: (s) => console.info('[peertube-plugin-livechat] ' + s),
    error: (s) => console.error('[peertube-plugin-livechat] ' + s),
    warn: (s) => console.warn('[peertube-plugin-livechat] ' + s)
  }

  const videoCache = {}
  let lastUUID = null
  let settings = {}

  function parseUUIDs (s) {
    if (!s) {
      return []
    }
    let a = s.split('\n')
    a = a.map(line => {
      return line.replace(/#.*$/, '')
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
    })
    return a.filter(line => line !== '')
  }

  function getBaseRoute () {
    // FIXME: should be provided by PeertubeHelpers (does not exists for now)
    return '/plugins/livechat/router'
  }

  function getIframeUri (uuid) {
    if (!settings) {
      logger.error('Settings are not initialized, too soon to compute the iframeUri')
      return null
    }
    let iframeUri = ''
    if (!settings['chat-use-builtin']) {
      iframeUri = settings['chat-uri'] || ''
      iframeUri = iframeUri.replace('{{VIDEO_UUID}}', uuid)
      if (!/^https?:\/\//.test(iframeUri)) {
        logger.error('The webchaturi must begin with https://')
        return null
      }
    } else {
      // Using the builtin converseJS
      // FIXME: with Peertube 3.0.1 there is no loadByIdOrUUID method,
      // we need to pass the complete url.
      const video = videoCache[uuid]
      if (video) {
        const url = video.originInstanceUrl + '/videos/watch/' + uuid
        iframeUri = getBaseRoute() + '/webchat?url=' + encodeURIComponent(url)
      }
    }
    if (iframeUri === '') {
      logger.error('No iframe uri')
      return null
    }
    return iframeUri
  }

  function displayButton (buttons, name, label, callback) {
    const button = document.createElement('button')
    button.classList.add(
      'action-button',
      'peertube-plugin-livechat-stuff',
      'peertube-plugin-livechat-button-' + name
    )
    button.setAttribute('type', 'button')
    button.textContent = label
    button.onclick = callback
    buttons.prepend(button)
  }

  function displayChatButtons (peertubeHelpers, uuid) {
    logger.log('Adding buttons in the DOM...')
    const p = new Promise((resolve, reject) => {
      Promise.all([
        peertubeHelpers.translate('Open chat'),
        peertubeHelpers.translate('Open chat in a new window'),
        peertubeHelpers.translate('Close chat')
      ]).then(labels => {
        const labelOpen = labels[0]
        const labelOpenBlank = labels[1]
        const labelClose = labels[2]
        const buttons = document.querySelector('.video-actions')

        const iframeUri = getIframeUri(uuid)
        if (!iframeUri) {
          return reject(new Error('No uri, cant display the buttons.'))
        }
        displayButton(buttons, 'openblank', labelOpenBlank, () => {
          closeChat()
          window.open(iframeUri)
        })
        displayButton(buttons, 'open', labelOpen, () => openChat())
        displayButton(buttons, 'close', labelClose, () => closeChat())

        toggleShowHideButtons(null)
        resolve()
      })
    })
    return p
  }

  function toggleShowHideButtons (chatOpened) {
    // showing/hiding buttons...
    document.querySelectorAll('.peertube-plugin-livechat-button-open')
      .forEach(button => (button.style.display = (chatOpened === true || chatOpened === null ? 'none' : '')))

    document.querySelectorAll('.peertube-plugin-livechat-button-close')
      .forEach(button => (button.style.display = (chatOpened === false || chatOpened === null ? 'none' : '')))
  }

  function openChat () {
    const p = new Promise((resolve, reject) => {
      const uuid = lastUUID
      if (!uuid) {
        logger.log('No current uuid.')
        return reject(new Error('No current uuid.'))
      }

      logger.info('Trying to load the chat for video ' + uuid + '.')
      const iframeUri = getIframeUri(uuid)
      if (!iframeUri) {
        logger.error('Incorrect iframe uri')
        return reject(new Error('Incorrect iframe uri'))
      }
      const additionalStyles = settings['chat-style'] || ''

      logger.info('Opening the chat...')
      const videoWrapper = document.querySelector('#video-wrapper')

      // Creating the iframe...
      const iframe = document.createElement('iframe')
      iframe.setAttribute('src', iframeUri)
      iframe.classList.add(
        'peertube-plugin-livechat',
        'peertube-plugin-livechat-stuff',
        'peertube-plugin-livechat-iframe-stuff'
      )
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
      iframe.setAttribute('frameborder', '0')
      if (additionalStyles) {
        iframe.setAttribute('style', additionalStyles)
      }
      videoWrapper.append(iframe)

      // showing/hiding buttons...
      toggleShowHideButtons(true)

      resolve()
    })
    return p
  }

  function closeChat () {
    document.querySelectorAll('.peertube-plugin-livechat-iframe-stuff')
      .forEach(dom => dom.remove())

    // showing/hiding buttons...
    toggleShowHideButtons(false)
  }

  function initChat () {
    const el = document.querySelector('#videojs-wrapper')
    if (!el) {
      logger.error('The required div is not present in the DOM.')
      return
    }
    if (el.classList.contains('peertube-plugin-livechat-init')) {
      logger.log('The chat seems already initialized...')
      return
    }
    // Adding a custom class in the dom, so we know initChat was already called.
    el.classList.add('peertube-plugin-livechat-init')

    peertubeHelpers.getSettings().then(s => {
      settings = s
      const liveOn = !!settings['chat-all-lives']
      const nonLiveOn = !!settings['chat-all-non-lives']
      const uuids = parseUUIDs(settings['chat-videos-list'])
      if (!uuids.length && !liveOn && !nonLiveOn) {
        logger.log('not activated.')
        return
      }

      logger.log('Checking if this video should have a chat...')
      const uuid = lastUUID
      const video = videoCache[uuid]
      if (!video) {
        logger.error('Can\'t find the video ' + uuid + ' in the videoCache')
        return
      }
      if (uuids.indexOf(uuid) >= 0) {
        logger.log('This video is in the list for chats.')
      } else if (video.isLive && liveOn) {
        logger.log('This video is live and we want all lives.')
      } else if (!video.isLive && nonLiveOn) {
        logger.log('This video is not live and we want all non-lives.')
      } else {
        logger.log('This video will not have a chat.')
        return
      }

      displayChatButtons(peertubeHelpers, uuid).then(() => {
        if (settings['chat-auto-display']) {
          openChat()
        } else {
          toggleShowHideButtons(false)
        }
      })
    })
  }

  registerHook({
    target: 'filter:api.video-watch.video.get.result',
    handler: (video) => {
      // For now, hooks for action:video-watch... did not receive the video object
      // So we store video objects in videoCache
      videoCache[video.uuid] = video
      lastUUID = video.uuid
      // FIXME: this should be made in action:video-watch.video.loaded.
      // But with Peertube 3.0.1, this hook is not called for lives
      // in WAITING_FOR_LIVE and LIVE_ENDED states.
      initChat()
      return video
    }
  })
  // FIXME: this should be the correct hook for initChat...
  // registerHook({
  //   target: 'action:video-watch.video.loaded',
  //   handler: () => {
  //     initChat()
  //   }
  // })
}

export {
  register
}
