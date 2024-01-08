import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { Video } from '@peertube/peertube-types'
import { helpButtonSVG } from './buttons'
import { logger } from '../utils/logger'
import { getIframeUri, getXMPPAddr, UriOptions } from './uri'
import { isAutoColorsAvailable } from 'shared/lib/autocolors'
import { localizedHelpUrl } from '../utils/help'

interface ShareForm {
  shareString: HTMLInputElement
  openButton: HTMLButtonElement
  copyButton: HTMLButtonElement
  readonly: HTMLInputElement
  withscroll: HTMLInputElement
  transparent: HTMLInputElement
  readonlyOptions: HTMLElement
  autoColors?: HTMLInputElement
  generateIframe: HTMLInputElement
  divTips: HTMLElement
  radioProtocolWeb?: HTMLInputElement
  radioProtocolXMPP?: HTMLInputElement
  divWebOptions: HTMLDivElement
}

async function shareChatUrl (registerOptions: RegisterClientOptions, settings: any, video: Video): Promise<void> {
  const peertubeHelpers = registerOptions.peertubeHelpers

  const streamersHelpUrl = await localizedHelpUrl(registerOptions, {
    page: 'documentation/user/streamers'
  })

  const [
    labelShare,
    labelWeb,
    labelXMPP,
    labelXMPPTips,
    labelReadonly,
    labelWithscroll,
    labelTransparent,
    labelOBSTips,
    labelCopy,
    labelCopied,
    labelError,
    labelOpen,
    labelAutocolors,
    labelGenerateIframe,
    labelChatFor,
    labelHelp
  ] = await Promise.all([
    peertubeHelpers.translate(LOC_SHARE_CHAT_LINK),
    peertubeHelpers.translate(LOC_WEB),
    peertubeHelpers.translate(LOC_CONNECT_USING_XMPP),
    peertubeHelpers.translate(LOC_CONNECT_USING_XMPP_HELP),
    peertubeHelpers.translate(LOC_READ_ONLY),
    peertubeHelpers.translate(LOC_SHOW_SCROLLBARR),
    peertubeHelpers.translate(LOC_TRANSPARENT_BACKGROUND),
    peertubeHelpers.translate(LOC_TIPS_FOR_STREAMERS),
    peertubeHelpers.translate(LOC_COPY),
    peertubeHelpers.translate(LOC_LINK_COPIED),
    peertubeHelpers.translate(LOC_ERROR),
    peertubeHelpers.translate(LOC_OPEN),
    peertubeHelpers.translate(LOC_USE_CURRENT_THEME_COLOR),
    peertubeHelpers.translate(LOC_GENERATE_IFRAME),
    peertubeHelpers.translate(LOC_CHAT_FOR_LIVE_STREAM),
    peertubeHelpers.translate(LOC_ONLINE_HELP)
  ])

  const defaultUri = getIframeUri(registerOptions, settings, video)
  if (!defaultUri) {
    return
  }

  let form: ShareForm | undefined
  function renderContent (container: HTMLElement): void {
    if (!form) {
      container.childNodes.forEach(child => container.removeChild(child))

      container.classList.add('peertube-plugin-livechat-shareurl-modal')

      const divShareString = document.createElement('div')
      divShareString.classList.add('livechat-shareurl-copy')
      const shareString = document.createElement('input')
      shareString.setAttribute('type', 'text')
      shareString.setAttribute('readonly', '')
      shareString.setAttribute('autocomplete', 'off')
      shareString.setAttribute('placeholder', '')
      shareString.classList.add('form-control', 'readonly')
      divShareString.append(shareString)
      const copyButton = document.createElement('button')
      copyButton.classList.add('btn', 'btn-outline-secondary', 'text-uppercase')
      copyButton.textContent = labelCopy
      divShareString.append(copyButton)
      const openButton = document.createElement('button')
      openButton.classList.add('btn', 'btn-outline-secondary', 'text-uppercase')
      openButton.textContent = labelOpen
      divShareString.append(openButton)

      const helpButton = document.createElement('a')
      helpButton.href = streamersHelpUrl
      helpButton.target = '_blank'
      helpButton.innerHTML = helpButtonSVG()
      helpButton.title = labelHelp
      helpButton.classList.add('orange-button', 'peertube-button-link', 'peertube-plugin-livechat-button')
      divShareString.append(helpButton)

      container.append(divShareString)

      let radioProtocolWeb
      let radioProtocolXMPP
      if (settings['prosody-room-allow-s2s']) {
        const protocolContainer = document.createElement('div')
        protocolContainer.classList.add('livechat-shareurl-protocol')

        radioProtocolWeb = document.createElement('input')
        radioProtocolWeb.setAttribute('type', 'radio')
        radioProtocolWeb.setAttribute('value', 'web')
        radioProtocolWeb.setAttribute('name', 'protocol')
        const radioProtocolWebLabel = document.createElement('label')
        radioProtocolWebLabel.textContent = labelWeb
        radioProtocolWebLabel.prepend(radioProtocolWeb)
        protocolContainer.append(radioProtocolWebLabel)

        radioProtocolXMPP = document.createElement('input')
        radioProtocolXMPP.setAttribute('type', 'radio')
        radioProtocolXMPP.setAttribute('value', 'xmpp')
        radioProtocolXMPP.setAttribute('name', 'protocol')
        const radioProtocolXMPPLabel = document.createElement('label')
        radioProtocolXMPPLabel.textContent = labelXMPP
        radioProtocolXMPPLabel.prepend(radioProtocolXMPP)
        protocolContainer.append(radioProtocolXMPPLabel)

        container.append(protocolContainer)
      }

      const divTips = document.createElement('div')
      divTips.textContent = ''
      divTips.classList.add('livechat-shareurl-tips')
      container.append(divTips)

      const divWebOptions = document.createElement('div')
      divWebOptions.classList.add('livechat-shareurl-web-options')
      container.append(divWebOptions)

      const readonly = document.createElement('input')
      readonly.setAttribute('type', 'checkbox')
      const readonlyLabelEl = document.createElement('label')
      readonlyLabelEl.textContent = labelReadonly
      readonlyLabelEl.prepend(readonly)
      divWebOptions.append(readonlyLabelEl)

      const readonlyOptions = document.createElement('div')
      readonlyOptions.classList.add('livechat-shareurl-web-options-readonly')
      divWebOptions.append(readonlyOptions)

      const withscroll = document.createElement('input')
      withscroll.setAttribute('type', 'checkbox')
      const withscrollLabelEl = document.createElement('label')
      withscrollLabelEl.textContent = labelWithscroll
      withscrollLabelEl.prepend(withscroll)
      readonlyOptions.append(withscrollLabelEl)

      const transparent = document.createElement('input')
      transparent.setAttribute('type', 'checkbox')
      const transparentLabelEl = document.createElement('label')
      transparentLabelEl.textContent = labelTransparent
      transparentLabelEl.prepend(transparent)
      readonlyOptions.append(transparentLabelEl)

      let autoColors
      if (isAutoColorsAvailable(settings['converse-theme'])) {
        const label = document.createElement('label')
        label.innerText = labelAutocolors
        autoColors = document.createElement('input')
        autoColors.setAttribute('type', 'checkbox')
        label.prepend(autoColors)
        divWebOptions.append(label)
      }

      const generateIframe = document.createElement('input')
      generateIframe.setAttribute('type', 'checkbox')
      const generateIframeLabelEl = document.createElement('label')
      generateIframeLabelEl.textContent = labelGenerateIframe
      generateIframeLabelEl.prepend(generateIframe)
      divWebOptions.append(generateIframeLabelEl)

      if (radioProtocolWeb) {
        radioProtocolWeb.onclick = () => {
          renderContent(container)
        }
      }
      if (radioProtocolXMPP) {
        radioProtocolXMPP.onclick = () => {
          renderContent(container)
        }
      }

      readonly.onclick = () => {
        renderContent(container)
      }
      withscroll.onclick = () => {
        renderContent(container)
      }
      transparent.onclick = () => {
        renderContent(container)
      }
      if (autoColors) {
        autoColors.onclick = () => {
          renderContent(container)
        }
      }
      generateIframe.onclick = () => {
        renderContent(container)
      }

      shareString.onclick = () => {
        shareString.select()
        shareString.setSelectionRange(0, 99999) /* For mobile devices */
      }

      copyButton.onclick = () => {
        shareString.select()
        shareString.setSelectionRange(0, 99999) /* For mobile devices */
        navigator.clipboard.writeText(shareString.value).then(() => {
          peertubeHelpers.notifier.success(labelCopied)
        }, () => {
          peertubeHelpers.notifier.error(labelError)
        })
      }

      openButton.onclick = () => {
        const uri = shareString.getAttribute('open-uri') ?? shareString.value
        // Don't open the url if it is an iframe!
        if (uri.startsWith('http') || uri.startsWith('xmpp')) {
          window.open(uri)
        }
      }

      form = {
        shareString,
        copyButton,
        openButton,
        readonly,
        withscroll,
        transparent,
        readonlyOptions,
        autoColors,
        generateIframe,
        radioProtocolWeb,
        radioProtocolXMPP,
        divWebOptions,
        divTips
      }
      restore(form)
    }

    // Saving the form state, to restore each time the modal is opened.
    save(form)

    const uriOptions: UriOptions = {
      ignoreAutoColors: form.autoColors ? !form.autoColors.checked : true,
      permanent: true
    }
    if (form.radioProtocolXMPP?.checked) {
      // To minimize the height gap between the 2 modes,
      // and prevent the dialog to resize and move too much,
      // we use visibility instead of display
      form.divTips.textContent = labelXMPPTips
      form.divWebOptions.style.visibility = 'hidden'
    } else {
      form.divTips.textContent = labelOBSTips
      form.divWebOptions.style.visibility = 'visible'
    }
    if (form.readonly.checked) {
      if (form.withscroll.checked) {
        uriOptions.readonly = true
      } else {
        uriOptions.readonly = 'noscroll'
      }
      if (form.transparent.checked) {
        uriOptions.transparent = true
      }
      form.withscroll.disabled = false
      form.transparent.disabled = false
      form.readonlyOptions.classList.remove('livechat-shareurl-web-options-readonly-disabled')
    } else {
      form.withscroll.disabled = true
      form.transparent.disabled = true
      form.readonlyOptions.classList.add('livechat-shareurl-web-options-readonly-disabled')
    }
    let shareStringValue
    let shareStringOpen: string | undefined
    if (!form.radioProtocolXMPP?.checked) {
      shareStringValue = getIframeUri(registerOptions, settings, video, uriOptions)
      if (form.generateIframe.checked) {
        form.openButton.disabled = true
        if (shareStringValue) {
          // To properly escape all attributes, we are constructing an HTMLIframeElement
          const iframe = document.createElement('iframe')
          iframe.setAttribute('src', shareStringValue)
          iframe.setAttribute('title', labelChatFor + ' ' + video.name)
          iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
          iframe.setAttribute('width', '560')
          iframe.setAttribute('height', '315')
          iframe.setAttribute('frameborder', '0')
          shareStringValue = iframe.outerHTML
        }
      } else {
        form.openButton.disabled = false
      }
    } else {
      // we must generate a XMPP room address
      // form.openButton.disabled = true
      const addr = getXMPPAddr(registerOptions, settings, video)
      shareStringValue = addr?.jid
      shareStringOpen = addr?.uri
    }
    form.shareString.setAttribute('value', shareStringValue ?? '')
    if (shareStringOpen) {
      form.shareString.setAttribute('open-uri', shareStringOpen)
    } else {
      form.shareString.removeAttribute('open-uri')
    }
  }

  function save (form: ShareForm): void {
    if (!window.localStorage) {
      return
    }
    const v = {
      version: 1, // in case we add incompatible values in a near feature
      readonly: !!form.readonly.checked,
      withscroll: !!form.withscroll.checked,
      transparent: !!form.transparent.checked,
      autocolors: !!form.autoColors?.checked,
      generateIframe: !!form.generateIframe.checked,
      protocol: !form.radioProtocolWeb || form.radioProtocolWeb.checked ? 'web' : 'xmpp'
    }
    window.localStorage.setItem('peertube-plugin-livechat-shareurl', JSON.stringify(v))
  }

  function restore (form: ShareForm): void {
    if (!window.localStorage) {
      return
    }
    const s = window.localStorage.getItem('peertube-plugin-livechat-shareurl')
    if (!s) {
      return
    }
    let v: any
    try {
      v = JSON.parse(s)
      if (!v || (typeof v !== 'object') || v.version !== 1) {
        return
      }
      form.readonly.checked = !!v.readonly
      form.withscroll.checked = !!v.withscroll
      form.transparent.checked = !!v.transparent
      if (form.autoColors) {
        form.autoColors.checked = !!v.autocolors
      }
      form.generateIframe.checked = !!v.generateIframe
      if (form.radioProtocolXMPP && v.protocol === 'xmpp') {
        form.radioProtocolXMPP.checked = true
      } else if (form.radioProtocolWeb) {
        form.radioProtocolWeb.checked = true
      }
    } catch (err) {
      logger.error(err as string)
    }
  }

  logger.info('Opening the share modal...')
  const observer = new MutationObserver(mutations => {
    for (const { addedNodes } of mutations) {
      addedNodes.forEach(node => {
        if ((node as HTMLElement).localName === 'ngb-modal-window') {
          logger.info('Detecting a new modal, checking if this is the good one...')
          if (!(node as HTMLElement).querySelector) { return }
          const title = (node as HTMLElement).querySelector('.modal-title')
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
          renderContent(modalBodyElem)
        }
      })
    }
  })
  observer.observe(document.body, {
    childList: true
  })
  peertubeHelpers.showModal({
    title: labelShare,
    content: `<p>${defaultUri ?? ''}</p>`, // incase the observer is broken...
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
