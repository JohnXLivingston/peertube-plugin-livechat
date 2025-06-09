// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { Video } from '@peertube/peertube-types'
import type { InitConverseJSParams } from 'shared/lib/types'
import { getPtContext, LiveChatSettings } from '../lib/contexts/peertube'
import { videoHasWebchat, videoHasRemoteWebchat } from 'shared/lib/video'
import { displayButton, displayButtonOptions } from './button'
import {
  closeSVG, openBlankChatSVG, openChatSVG, shareChatUrlSVG, helpButtonSVG, promoteSVG
} from './buttons'
import { shareChatUrl } from './share'
import { isAnonymousUser, guessIsMine, guessIamIModerator } from '../../utils/user'
import { localizedHelpUrl } from '../../utils/help'
import { getBaseRoute } from '../../utils/uri'
import { displayConverseJS } from '../../utils/conversejs'

/**
 * Initialize the chat for the current video
 * @param video the video
 */
async function initChat (video: Video): Promise<void> {
  const ptContext = getPtContext()
  const logger = ptContext.logger

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
  container.role = 'region'
  container.ariaLabel = await ptContext.ptOptions.peertubeHelpers.translate(LOC_CHAT)
  placeholder.append(container)

  try {
    const settings = await ptContext.getSettings()

    logger.log('Checking if this video should have a chat...')
    if (settings['chat-no-anonymous'] === true && isAnonymousUser(ptContext.ptOptions)) {
      logger.log('No chat for anonymous users')
      return
    }
    if (!videoHasWebchat(settings, video) && !videoHasRemoteWebchat(settings, video)) {
      logger.log('This video has no webchat')
      return
    }

    let showShareUrlButton = false
    let showPromote = false
    if (video.isLocal) { // No need for shareButton on remote chats.
      const chatShareUrl = settings['chat-share-url'] ?? ''
      if (chatShareUrl === 'everyone') {
        showShareUrlButton = true
      } else if (chatShareUrl === 'owner') {
        showShareUrlButton = guessIsMine(ptContext.ptOptions, video)
      } else if (chatShareUrl === 'owner+moderators') {
        showShareUrlButton = guessIsMine(ptContext.ptOptions, video) || guessIamIModerator(ptContext.ptOptions)
      }

      if (guessIamIModerator(ptContext.ptOptions)) {
        showPromote = true
      }
    }

    await _insertChatDom(
      container as HTMLElement,
      video,
      settings,
      !!settings['chat-open-blank'],
      showShareUrlButton,
      showPromote
    )
    if (settings['chat-auto-display']) {
      await _openChat(video)
    } else if (container) {
      container.setAttribute('peertube-plugin-livechat-state', 'closed')
    }
  } catch (err) {
    logger.error('initChat has failed')
    logger.error(err as string)
  }
}

/**
 * Insert the chat in the DOM.
 * @param container
 * @param video
 * @param settings
 * @param showOpenBlank
 * @param showShareUrlButton
 * @param showPromote
 */
async function _insertChatDom (
  container: HTMLElement,
  video: Video,
  settings: LiveChatSettings,
  showOpenBlank: boolean,
  showShareUrlButton: boolean,
  showPromote: boolean
): Promise<void> {
  const ptContext = getPtContext()
  const peertubeHelpers = ptContext.ptOptions.peertubeHelpers
  const logger = ptContext.logger

  logger.log('Adding livechat in the DOM...')
  const viewersDocumentationHelpUrl = await localizedHelpUrl(ptContext.ptOptions, {
    page: 'documentation/user/viewers'
  })
  const p = new Promise<void>((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.all([
      peertubeHelpers.translate(LOC_OPEN_CHAT),
      peertubeHelpers.translate(LOC_OPEN_CHAT_NEW_WINDOW),
      peertubeHelpers.translate(LOC_CLOSE_CHAT),
      peertubeHelpers.translate(LOC_SHARE_CHAT_LINK),
      peertubeHelpers.translate(LOC_ONLINE_HELP),
      peertubeHelpers.translate(LOC_PROMOTE)
    ]).then(labels => {
      const labelOpen = labels[0]
      const labelOpenBlank = labels[1]
      const labelClose = labels[2]
      const labelShareUrl = labels[3]
      const labelHelp = labels[4]
      const labelPromote = labels[5]

      const buttonContainer = document.createElement('div')
      buttonContainer.classList.add('peertube-plugin-livechat-buttons')
      container.append(buttonContainer)

      // Here are buttons that are magically merged
      const groupButtons: displayButtonOptions[] = []
      groupButtons.push({
        buttonContainer,
        name: 'open',
        label: labelOpen,
        callback: () => {
          _openChat(video).then(() => {}, () => {})
        },
        icon: openChatSVG,
        additionalClasses: []
      })
      if (showOpenBlank) {
        groupButtons.push({
          buttonContainer,
          name: 'openblank',
          label: labelOpenBlank,
          callback: () => {
            _closeChat()
            window.open('/p/livechat/room?room=' + encodeURIComponent(video.uuid))
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
            shareChatUrl(ptContext.ptOptions, settings, video).then(() => {}, () => {})
          },
          icon: shareChatUrlSVG,
          additionalClasses: []
        })
      }
      if (showPromote) {
        groupButtons.push({
          buttonContainer,
          name: 'promote',
          label: labelPromote,
          callback: async () => {
            try {
              // First we must get the room JID (can be video.uuid@ or channel.id@)
              const url = getBaseRoute(ptContext.ptOptions) + '/api/configuration/room/' +
                encodeURIComponent(video.uuid)
              const response = await fetch(
                url,
                {
                  method: 'GET',
                  headers: peertubeHelpers.getAuthHeader()
                }
              )

              const converseJSParams: InitConverseJSParams = await (response).json()
              if (converseJSParams.isRemoteChat) {
                throw new Error('Cant promote on remote chat.')
              }

              const roomJIDLocalPart = converseJSParams.room.replace(/@.*$/, '')

              await fetch(
                getBaseRoute(ptContext.ptOptions) + '/api/promote/' + encodeURIComponent(roomJIDLocalPart),
                {
                  method: 'PUT',
                  headers: peertubeHelpers.getAuthHeader()
                }
              )
            } catch (err) {
              logger.error(err)
            }
          },
          icon: promoteSVG,
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
        callback: () => _closeChat(),
        icon: closeSVG
      })
      resolve()
    })
  })
  return p
}

async function _openChat (video: Video): Promise<void | false> {
  const ptContext = getPtContext()
  const peertubeHelpers = ptContext.ptOptions.peertubeHelpers
  const logger = ptContext.logger
  const settings = await ptContext.getSettings()

  if (!video) {
    logger.log('No video.')
    return false
  }

  logger.info(`Trying to load the chat for video ${video.uuid}.`)
  // here the room key is always the video uuid, a backend API will translate to channel id if relevant.
  const roomkey = video.uuid
  if (!roomkey) {
    logger.error('Can\'t get room xmpp addr')
    return false
  }

  const additionalStyles = settings['chat-style'] ?? ''

  logger.info('Opening the chat...')
  const container = document.getElementById('peertube-plugin-livechat-container')

  try {
    if (!container) {
      logger.error('Cant found the livechat container.')
      return false
    }

    if (container.getElementsByTagName('converse-root').length) {
      logger.error('Seems that there is already a ConverseJS in the container.')
      return false
    }

    if (additionalStyles) {
      container.setAttribute('style', additionalStyles)
    }
    container.setAttribute('peertube-plugin-livechat-state', 'open')

    // Hacking styles...
    _hackStyles(true)

    // Loading converseJS...
    await displayConverseJS(ptContext.ptOptions, container, roomkey, 'peertube-video', false)
  } catch (_err) {
    // Displaying an error page.
    if (container) {
      const message = document.createElement('div')
      message.classList.add('peertube-plugin-livechat-error-message')
      message.innerText = await peertubeHelpers.translate(LOC_CHATROOM_NOT_ACCESSIBLE)
      container.append(message)

      container.querySelectorAll(
        '.livechat-spinner, converse-root'
      ).forEach(dom => dom.remove())
    }

    _hackStyles(false)
  }
}

function _closeChat (): void {
  const logger = getPtContext().logger

  const container = document.getElementById('peertube-plugin-livechat-container')
  if (!container) {
    logger.error('Can\'t close livechat, container not found.')
    return
  }

  // Disconnecting ConverseJS
  if (window.converse?.livechatDisconnect) { window.converse.livechatDisconnect() }

  // Removing from the DOM
  container.querySelectorAll(
    'converse-root, .livechat-spinner, .peertube-plugin-livechat-error-message'
  ).forEach(dom => dom.remove())

  container.setAttribute('peertube-plugin-livechat-state', 'closed')

  // Un-Hacking styles...
  _hackStyles(false)
}

function _hackStyles (on: boolean): void {
  try {
    document.querySelectorAll('.peertube-plugin-livechat-buttons').forEach(buttons => {
      if (on) {
        buttons.classList.add('peertube-plugin-livechat-buttons-open')
      } else {
        buttons.classList.remove('peertube-plugin-livechat-buttons-open')
      }
    })
  } catch (err) {
    getPtContext().logger.error(`Failed hacking styles:  '${err as string}'`)
  }
}

export {
  initChat
}
