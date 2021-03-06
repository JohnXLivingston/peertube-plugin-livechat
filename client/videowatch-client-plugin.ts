import { videoHasWebchat } from 'shared/lib/video'
import type { ChatType } from 'shared/lib/types'

interface VideoWatchLoadedHookOptions {
  videojs: any
  video: Video
  playlist?: any
}

function register ({ registerHook, peertubeHelpers }: RegisterOptions): void {
  const logger = {
    log: (s: string) => console.log('[peertube-plugin-livechat] ' + s),
    info: (s: string) => console.info('[peertube-plugin-livechat] ' + s),
    error: (s: string) => console.error('[peertube-plugin-livechat] ' + s),
    warn: (s: string) => console.warn('[peertube-plugin-livechat] ' + s)
  }

  let settings: any = {}

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

  function getIframeUri (uuid: string): string | null {
    if (!settings) {
      logger.error('Settings are not initialized, too soon to compute the iframeUri')
      return null
    }
    let iframeUri = ''
    const chatType: ChatType = (settings['chat-type'] ?? 'disabled') as ChatType
    if (chatType === 'builtin-prosody' || chatType === 'builtin-converse') {
      // Using the builtin converseJS
      iframeUri = getBaseRoute() + '/webchat/room/' + encodeURIComponent(uuid)
    } else if (chatType === 'external-uri') {
      iframeUri = settings['chat-uri'] || ''
      iframeUri = iframeUri.replace(/{{VIDEO_UUID}}/g, encodeURIComponent(uuid))
      if (!/^https?:\/\//.test(iframeUri)) {
        logger.error('The webchaturi must begin with https://')
        return null
      }
    } else {
      logger.error('Chat disabled.')
      return null
    }
    if (iframeUri === '') {
      logger.error('No iframe uri')
      return null
    }
    return iframeUri
  }

  function displayButton (
    buttonContainer: HTMLElement,
    name: string,
    label: string,
    callback: () => void | boolean,
    icon: string | null
  ): void {
    const button = document.createElement('button')
    button.classList.add(
      'peertube-plugin-livechat-button',
      'peertube-plugin-livechat-button-' + name
    )
    button.onclick = callback
    if (icon) {
      // FIXME: remove «as string» when peertube types will be available
      const iconUrl = peertubeHelpers.getBaseStaticRoute() + '/images/' + icon
      const iconEl = document.createElement('span')
      iconEl.classList.add('peertube-plugin-livechat-button-icon')
      iconEl.setAttribute('style',
        'background-image: url(\'' + iconUrl + '\');'
      )
      button.prepend(iconEl)
      button.setAttribute('title', label)
    } else {
      button.textContent = label
    }
    buttonContainer.append(button)
  }

  async function insertChatDom (container: HTMLElement, uuid: string, showOpenBlank: boolean): Promise<void> {
    logger.log('Adding livechat in the DOM...')
    const p = new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.all([
        peertubeHelpers.translate('Open chat'),
        peertubeHelpers.translate('Open chat in a new window'),
        peertubeHelpers.translate('Close chat')
      ]).then(labels => {
        const labelOpen = labels[0]
        const labelOpenBlank = labels[1]
        const labelClose = labels[2]

        const iframeUri = getIframeUri(uuid)
        if (!iframeUri) {
          return reject(new Error('No uri, cant display the buttons.'))
        }

        const buttonContainer = document.createElement('div')
        buttonContainer.classList.add('peertube-plugin-livechat-buttons')
        container.append(buttonContainer)

        displayButton(buttonContainer, 'open', labelOpen, () => openChat(uuid), 'talking.svg')
        if (showOpenBlank) {
          displayButton(buttonContainer, 'openblank', labelOpenBlank, () => {
            closeChat()
            window.open(iframeUri)
          }, 'talking-new-window.svg')
        }
        displayButton(buttonContainer, 'close', labelClose, () => closeChat(), 'bye.svg')

        resolve()
      })
    })
    return p
  }

  function openChat (uuid: string): void | boolean {
    if (!uuid) {
      logger.log('No current uuid.')
      return false
    }

    logger.info('Trying to load the chat for video ' + uuid + '.')
    const iframeUri = getIframeUri(uuid)
    if (!iframeUri) {
      logger.error('Incorrect iframe uri')
      return false
    }
    const additionalStyles = settings['chat-style'] || ''

    logger.info('Opening the chat...')
    const container = document.getElementById('peertube-plugin-livechat-container')
    if (!container) {
      logger.error('Cant found the livechat container.')
      return false
    }

    if (container.querySelector('iframe')) {
      logger.error('Seems that there is already an iframe in the container.')
      return false
    }

    // Creating the iframe...
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', iframeUri)
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
    iframe.setAttribute('frameborder', '0')
    if (additionalStyles) {
      iframe.setAttribute('style', additionalStyles)
    }
    container.append(iframe)
    container.setAttribute('peertube-plugin-livechat-state', 'open')
  }

  function closeChat (): void {
    const container = document.getElementById('peertube-plugin-livechat-container')
    if (!container) {
      logger.error('Cant close livechat, container not found.')
      return
    }
    container.querySelectorAll('iframe')
      .forEach(dom => dom.remove())

    container.setAttribute('peertube-plugin-livechat-state', 'closed')
  }

  function initChat (video: Video): void {
    if (!video) {
      logger.error('No video provided')
      return
    }
    const placeholder = document.getElementById('plugin-placeholder-player-next')
    if (!placeholder) {
      logger.error('The required placeholder div is not present in the DOM.')
      return
    }

    let container = placeholder.querySelector('#peertube-plugin-livechat-container')
    if (container) {
      logger.log('The chat seems already initialized...')
      return
    }
    container = document.createElement('div')
    container.setAttribute('id', 'peertube-plugin-livechat-container')
    container.setAttribute('peertube-plugin-livechat-state', 'initializing')
    placeholder.append(container)

    peertubeHelpers.getSettings().then((s: any) => {
      settings = s

      logger.log('Checking if this video should have a chat...')
      if (!videoHasWebchat(s, video)) {
        logger.log('This video has no webchat')
        return
      }

      insertChatDom(container as HTMLElement, video.uuid, !!settings['chat-open-blank']).then(() => {
        if (settings['chat-auto-display']) {
          openChat(video.uuid)
        } else if (container) {
          container.setAttribute('peertube-plugin-livechat-state', 'closed')
        }
      }, () => {
        logger.error('insertChatDom has failed')
      })
    }, () => {
      logger.error('Cant get settings')
    })
  }

  registerHook({
    target: 'action:video-watch.video.loaded',
    handler: ({
      video,
      playlist
    }: VideoWatchLoadedHookOptions) => {
      if (!video) {
        logger.error('No video argument in hook action:video-watch.video.loaded')
        return
      }
      if (playlist) {
        logger.info('We are in a playlist, we will not use the webchat')
        return
      }
      initChat(video)
    }
  })
}

export {
  register
}
