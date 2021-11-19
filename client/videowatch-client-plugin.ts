import type { ChatType } from 'shared/lib/types'
import { videoHasWebchat } from 'shared/lib/video'
import { AutoColors, isAutoColorsAvailable, areAutoColorsValid } from 'shared/lib/autocolors'

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

  function getIframeUri (video: Video): string | null {
    if (!settings) {
      logger.error('Settings are not initialized, too soon to compute the iframeUri')
      return null
    }
    let iframeUri = ''
    const chatType: ChatType = (settings['chat-type'] ?? 'disabled') as ChatType
    if (chatType === 'builtin-prosody' || chatType === 'builtin-converse') {
      // Using the builtin converseJS
      iframeUri = getBaseRoute() + '/webchat/room/' + encodeURIComponent(video.uuid)
    } else if (chatType === 'external-uri') {
      iframeUri = settings['chat-uri'] || ''
      iframeUri = iframeUri.replace(/{{VIDEO_UUID}}/g, encodeURIComponent(video.uuid))
      if (iframeUri.includes('{{CHANNEL_ID}}')) {
        if (!video.channel || !video.channel.id) {
          logger.error('Missing channel info in video object.')
          return null
        }
        iframeUri = iframeUri.replace(/{{CHANNEL_ID}}/g, encodeURIComponent(video.channel.id))
      }
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

    if (isAutoColorsAvailable(settings['chat-type'] as ChatType, settings['converse-theme'])) {
      logger.info('We have to try to compute autocolors.')
      try {
        const autocolors = computeAutoColors()
        if (autocolors) {
          const url = new URL(iframeUri, window.location.origin)
          for (const p in autocolors) {
            url.searchParams.set('_ac_' + p, autocolors[p as keyof AutoColors])
          }
          iframeUri = url.href
        }
      } catch (err) {
        logger.error(`Failed computing autocolors:  '${err as string}'`)
      }
    }

    return iframeUri
  }

  function computeAutoColors (): AutoColors | null {
    if (!window.getComputedStyle) {
      logger.warn('[AutoColors] getComputedStyle is not available, aborting.')
      return null
    }
    // Searching for one of these button:
    const button = document.querySelector('.publish-button, .peertube-button-link')
    if (!button) {
      logger.warn('[AutoColors] Cant find a button, aborting.')
      return null
    }
    const buttonStyles = window.getComputedStyle(button)
    logger.info('[AutoColors] found button styles')

    const main = document.querySelector('#content')
    if (!main) {
      logger.warn('[AutoColors] Cant find main, aborting.')
      return null
    }
    const mainStyles = window.getComputedStyle(main)
    logger.info('[AutoColors] found main styles')

    const menu = document.querySelector('.menu-link')
    if (!menu) {
      logger.warn('[AutoColors] Cant find menu, aborting.')
      return null
    }
    const menuStyles = window.getComputedStyle(menu)
    logger.info('[AutoColors] found menu styles')

    const autocolors: AutoColors = {
      mainForeground: mainStyles.color,
      mainBackground: mainStyles.backgroundColor,
      greyForeground: '#000',
      greyBackground: '#000',
      menuForeground: menuStyles.color,
      menuBackground: menuStyles.backgroundColor,
      inputForeground: '#000',
      inputBackground: '#000',
      buttonForeground: buttonStyles.color,
      buttonBackground: buttonStyles.backgroundColor,
      link: '#000',
      linkHover: '#000'
    }
    const autoColorsTest = areAutoColorsValid(autocolors)
    if (autoColorsTest !== true) {
      logger.warn('[AutoColors] Computed colors are not valid, dropping. Invalid values: ' + autoColorsTest.join(', '))
      return null
    }
    return autocolors
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

  async function insertChatDom (container: HTMLElement, video: Video, showOpenBlank: boolean): Promise<void> {
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

        const iframeUri = getIframeUri(video)
        if (!iframeUri) {
          return reject(new Error('No uri, cant display the buttons.'))
        }

        const buttonContainer = document.createElement('div')
        buttonContainer.classList.add('peertube-plugin-livechat-buttons')
        container.append(buttonContainer)

        displayButton(buttonContainer, 'open', labelOpen, () => openChat(video), 'talking.svg')
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

  function openChat (video: Video): void | boolean {
    if (!video) {
      logger.log('No video.')
      return false
    }

    logger.info('Trying to load the chat for video ' + video.uuid + '.')
    const iframeUri = getIframeUri(video)
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

    // Hacking styles...
    hackStyles(true)
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

    // Un-Hacking styles...
    hackStyles(false)
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

      insertChatDom(container as HTMLElement, video, !!settings['chat-open-blank']).then(() => {
        if (settings['chat-auto-display']) {
          openChat(video)
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

  let savedMyPluginFlexGrow: string | undefined
  function hackStyles (on: boolean): void {
    try {
      document.querySelectorAll('.peertube-plugin-livechat-buttons').forEach(buttons => {
        if (on) {
          buttons.classList.add('peertube-plugin-livechat-buttons-open')
        } else {
          buttons.classList.remove('peertube-plugin-livechat-buttons-open')
        }
      })
      const myPluginPlaceholder: HTMLElement | null = document.querySelector('my-plugin-placeholder')
      if (on) {
        // Saving current style attributes and maximazing space for the chat
        if (myPluginPlaceholder) {
          savedMyPluginFlexGrow = myPluginPlaceholder.style.flexGrow // Should be "", but can be anything else.
          myPluginPlaceholder.style.flexGrow = '1'
        }
      } else {
        // restoring values...
        if (savedMyPluginFlexGrow !== undefined && myPluginPlaceholder) {
          myPluginPlaceholder.style.flexGrow = savedMyPluginFlexGrow
        }
      }
    } catch (err) {
      logger.error(`Failed hacking styles:  '${err as string}'`)
    }
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
