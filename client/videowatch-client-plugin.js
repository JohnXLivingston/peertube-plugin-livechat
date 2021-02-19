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

function register ({ registerHook, peertubeHelpers }) {
  registerHook({
    target: 'action:video-watch.player.loaded',
    handler: ({player, videojs, video}) => {
      peertubeHelpers.getSettings().then(s => {
        const liveOn = !!s['chat-all-lives']
        const nonLiveOn = !!s['chat-all-non-lives']
        const uuids = parseUUIDs(s['chat-videos-list'])
        const iframeUri = s['chat-uri'] || ''
        if ( iframeUri === '' ) {
          console.log('[peertube-plugin-livechat] no uri, can\'t add chat.')
          return
        }
        if (!uuids.length && !liveOn && !nonLiveOn) {
          console.log('[peertube-plugin-livechat] not activated.')
          return
        }

        console.log('[peertube-plugin-livechat] Checking if this video should have a chat...')
        const uuid = video.uuid
        if (uuids.indexOf(uuid) >= 0) {
          console.log('[peertube-plugin-livechat] This video is in the list for chats.')
        } else if (video.isLive && liveOn) {
          console.log('[peertube-plugin-livechat] This video is live and we want all lives.')
        } else if (!video.isLive && nonLiveOn) {
          console.log('[peertube-plugin-livechat] This video is not live and we want all non-lives.')
        } else {
          console.log('[peertube-plugin-livechat] This video will not have a chat.')
          return
        }
        console.info('[peertube-plugin-livechat] Trying to load the chat for video ' + uuid + '.')
        const chatUrl = iframeUri.replace('{{VIDEO_UUID}}', uuid)
        if (!/^https?:\/\//.test(chatUrl)) {
          console.error('[peertube-plugin-livechat] The webchaturi must begin with https://')
          return
        }
        const parent = document.querySelector('.video-info')
        const iframe = document.createElement('iframe')
        iframe.setAttribute('src', chatUrl)
        iframe.setAttribute('class', 'peertube-plugin-livechat')
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups')
        iframe.setAttribute('frameborder', '0')
        parent.prepend(iframe)
      })
    }
  })
}

export {
  register
}
