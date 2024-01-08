import type { Video } from '@peertube/peertube-types'
import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { videoHasWebchat, videoHasRemoteWebchat } from 'shared/lib/video'
import { localizedHelpUrl } from './utils/help'
import { logger } from './utils/logger'
import { closeSVG, openBlankChatSVG, openChatSVG, shareChatUrlSVG, helpButtonSVG } from './videowatch/buttons'
import { displayButton, displayButtonOptions } from './videowatch/button'
import { shareChatUrl } from './videowatch/share'
import { getIframeUri } from './videowatch/uri'

interface VideoWatchLoadedHookOptions {
  videojs: any
  video: Video
  playlist?: any
}

function isAnonymousUser (registerOptions: RegisterClientOptions): boolean {
  return !registerOptions.peertubeHelpers.isLoggedIn()
}

function guessIsMine (registerOptions: RegisterClientOptions, video: Video): boolean {
  // Note: this is not safe, but it is not a problem:
  // this function is used for non critical functions
  try {
    if (!video) {
      return false
    }
    if (!video.isLocal) {
      return false
    }
    if (!window.localStorage) {
      return false
    }
    const username = window.localStorage.getItem('username') ?? ''
    if (!username) {
      return false
    }
    if (username !== video.account?.name) {
      return false
    }
    return true
  } catch (err) {
    logger.error(err as string)
    return false
  }
}

function guessIamIModerator (_registerOptions: RegisterClientOptions): boolean {
  // Note: this is not safe, but it is not a problem:
  // this function is used for non critical functions
  try {
    if (!window.localStorage) {
      return false
    }
    const role = window.localStorage.getItem('role') ?? ''
    if (!role) {
      return false
    }
    if (role !== '0' && role !== '1') {
      return false
    }
    return true
  } catch (err) {
    logger.error(err as string)
    return false
  }
}

function register (registerOptions: RegisterClientOptions): void {
  const { registerHook, peertubeHelpers } = registerOptions
  let settings: any = {}

  async function insertChatDom (
    container: HTMLElement, video: Video, showOpenBlank: boolean, showShareUrlButton: boolean
  ): Promise<void> {
    logger.log('Adding livechat in the DOM...')
    const viewersDocumentationHelpUrl = await localizedHelpUrl(registerOptions, {
      page: 'documentation/user/viewers'
    })
    const p = new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.all([
        peertubeHelpers.translate(LOC_OPEN_CHAT),
        peertubeHelpers.translate(LOC_OPEN_CHAT_NEW_WINDOW),
        peertubeHelpers.translate(LOC_CLOSE_CHAT),
        peertubeHelpers.translate(LOC_SHARE_CHAT_LINK),
        peertubeHelpers.translate(LOC_ONLINE_HELP)
      ]).then(labels => {
        const labelOpen = labels[0]
        const labelOpenBlank = labels[1]
        const labelClose = labels[2]
        const labelShareUrl = labels[3]
        const labelHelp = labels[4]

        const iframeUri = getIframeUri(registerOptions, settings, video)
        if (!iframeUri) {
          return reject(new Error('No uri, cant display the buttons.'))
        }

        const buttonContainer = document.createElement('div')
        buttonContainer.classList.add('peertube-plugin-livechat-buttons')
        container.append(buttonContainer)

        // Here are buttons that are magically merged
        const groupButtons: displayButtonOptions[] = []
        groupButtons.push({
          buttonContainer,
          name: 'open',
          label: labelOpen,
          callback: () => openChat(video),
          icon: openChatSVG,
          additionalClasses: []
        })
        if (showOpenBlank) {
          groupButtons.push({
            buttonContainer,
            name: 'openblank',
            label: labelOpenBlank,
            callback: () => {
              closeChat()
              window.open(iframeUri)
            },
            icon: openBlankChatSVG,
            additionalClasses: []
          })
        }
        if (showShareUrlButton) {
          groupButtons.push({
            buttonContainer,
            name: 'shareurl',
            label: labelShareUrl,
            callback: () => {
              shareChatUrl(registerOptions, settings, video).then(() => {}, () => {})
            },
            icon: shareChatUrlSVG,
            additionalClasses: []
          })
        }
        groupButtons.push({
          buttonContainer,
          name: 'help',
          label: labelHelp,
          href: viewersDocumentationHelpUrl,
          targetBlank: true,
          icon: helpButtonSVG,
          additionalClasses: []
        })

        // If more than one groupButtons:
        // - the first must have class 'peertube-plugin-livechat-multi-button-main'
        // - middle ones must have 'peertube-plugin-livechat-multi-button-secondary'
        // - the last must have 'peertube-plugin-livechat-multi-button-last-secondary'
        if (groupButtons.length > 1) {
          groupButtons[0].additionalClasses?.push('peertube-plugin-livechat-multi-button-main')
          for (let i = 1; i < groupButtons.length - 1; i++) { // middle
            groupButtons[i].additionalClasses?.push('peertube-plugin-livechat-multi-button-secondary')
          }
          groupButtons[groupButtons.length - 1]
            .additionalClasses?.push('peertube-plugin-livechat-multi-button-last-secondary')
        }

        for (const button of groupButtons) {
          displayButton(button)
        }

        displayButton({
          buttonContainer,
          name: 'close',
          label: labelClose,
          callback: () => closeChat(),
          icon: closeSVG
        })
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

    logger.info(`Trying to load the chat for video ${video.uuid}.`)
    const iframeUri = getIframeUri(registerOptions, settings, video)
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
    container.setAttribute('peertube-plugin-livechat-current-url', window.location.href)
    placeholder.append(container)

    peertubeHelpers.getSettings().then((s: any) => {
      settings = s

      logger.log('Checking if this video should have a chat...')
      if (settings['chat-no-anonymous'] === true && isAnonymousUser(registerOptions)) {
        logger.log('No chat for anonymous users')
        return
      }
      if (!videoHasWebchat(s, video) && !videoHasRemoteWebchat(s, video)) {
        logger.log('This video has no webchat')
        return
      }

      let showShareUrlButton: boolean = false
      if (video.isLocal) { // No need for shareButton on remote chats.
        const chatShareUrl = settings['chat-share-url'] ?? ''
        if (chatShareUrl === 'everyone') {
          showShareUrlButton = true
        } else if (chatShareUrl === 'owner') {
          showShareUrlButton = guessIsMine(registerOptions, video)
        } else if (chatShareUrl === 'owner+moderators') {
          showShareUrlButton = guessIsMine(registerOptions, video) || guessIamIModerator(registerOptions)
        }
      }

      insertChatDom(container as HTMLElement, video, !!settings['chat-open-blank'], showShareUrlButton).then(() => {
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
