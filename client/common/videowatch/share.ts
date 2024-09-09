// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { Video } from '@peertube/peertube-types'
import type { LiveChatSettings } from '../lib/contexts/peertube'
import { logger } from '../../utils/logger'
import { html, render } from 'lit'

async function shareChatUrl (
  registerOptions: RegisterClientOptions,
  settings: LiveChatSettings,
  video: Video
): Promise<void> {
  const peertubeHelpers = registerOptions.peertubeHelpers

  const labelShare = await peertubeHelpers.translate(LOC_SHARE_CHAT_LINK)

  // function save (form: ShareForm): void {
  //   if (!window.localStorage) {
  //     return
  //   }
  //   const v = {
  //     version: 1, // in case we add incompatible values in a near feature
  //     readonly: !!form.readonly.checked,
  //     withscroll: !!form.withscroll.checked,
  //     transparent: !!form.transparent.checked,
  //     autocolors: !!form.autoColors?.checked,
  //     generateIframe: !!form.generateIframe.checked,
  //     protocol: !form.radioProtocolWeb || form.radioProtocolWeb.checked ? 'web' : 'xmpp'
  //   }
  //   window.localStorage.setItem('peertube-plugin-livechat-shareurl', JSON.stringify(v))
  // }

  // function restore (form: ShareForm): void {
  //   if (!window.localStorage) {
  //     return
  //   }
  //   const s = window.localStorage.getItem('peertube-plugin-livechat-shareurl')
  //   if (!s) {
  //     return
  //   }
  //   let v: any
  //   try {
  //     v = JSON.parse(s)
  //     if (!v || (typeof v !== 'object') || v.version !== 1) {
  //       return
  //     }
  //     form.readonly.checked = !!v.readonly
  //     form.withscroll.checked = !!v.withscroll
  //     form.transparent.checked = !!v.transparent
  //     if (form.autoColors) {
  //       form.autoColors.checked = !!v.autocolors
  //     }
  //     form.generateIframe.checked = !!v.generateIframe
  //     if (form.radioProtocolXMPP && v.protocol === 'xmpp') {
  //       form.radioProtocolXMPP.checked = true
  //     } else if (form.radioProtocolWeb) {
  //       form.radioProtocolWeb.checked = true
  //     }
  //   } catch (err) {
  //     logger.error(err as string)
  //   }
  // }

  logger.info('Opening the share modal...')
  // We can't just put <livechat-share-chat> in modalContent, Peertube sanitize it...
  const observer = new MutationObserver(mutations => {
    for (const { addedNodes } of mutations) {
      addedNodes.forEach(node => {
        if ((node as HTMLElement).localName === 'ngb-modal-window') {
          logger.info('Detecting a new modal, checking if this is the good one...')
          const title = (node as HTMLElement).querySelector?.('.modal-title')
          if (!(title?.textContent === labelShare)) {
            return
          }
          logger.info('Yes, it is the good modal!')
          observer.disconnect()

          const modalBodyElem: HTMLElement | null = (node as HTMLElement).querySelector('.modal-body')
          if (!modalBodyElem) {
            logger.error('Modal has no body... Dont know how to fill it.')
            return
          }
          modalBodyElem.childNodes.forEach(child => modalBodyElem.removeChild(child))

          render(html`
            <livechat-share-chat
              ._settings=${settings}
              ._video=${video}
            ></livechat-share-chat>
          `, modalBodyElem)
        }
      })
    }
  })
  observer.observe(document.body, {
    childList: true
  })
  peertubeHelpers.showModal({
    title: labelShare,
    content: '',
    close: true
  })
  // just in case, remove the observer after a timeout, if not already done...
  setTimeout(() => {
    observer.disconnect()
  }, 1000)
}

export {
  shareChatUrl
}
