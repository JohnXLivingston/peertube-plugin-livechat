import { logger } from './logger'
import { getIframeUri, UriOptions } from './uri'
import { isAutoColorsAvailable } from 'shared/lib/autocolors'

async function shareChatUrl (registerOptions: RegisterOptions, settings: any, video: Video): Promise<void> {
  const peertubeHelpers = registerOptions.peertubeHelpers

  const [
    labelShare,
    labelReadonly,
    tipsOBS,
    labelCopy,
    labelCopied,
    labelError,
    labelOpen,
    labelAutocolors
  ] = await Promise.all([
    peertubeHelpers.translate('Share chat link'),
    peertubeHelpers.translate('Read-only'),
    // eslint-disable-next-line max-len
    peertubeHelpers.translate('Tips for streamers: To add the chat to your OBS, generate a read-only link and use it as a browser source.'),
    peertubeHelpers.translate('Copy'),
    peertubeHelpers.translate('Link copied'),
    peertubeHelpers.translate('Error'),
    peertubeHelpers.translate('Open'),
    peertubeHelpers.translate('Use current theme colors')
  ])

  const defaultUri = getIframeUri(registerOptions, settings, video)
  if (!defaultUri) {
    return
  }

  let form: {
    readonly: HTMLInputElement
    url: HTMLInputElement
    autoColors?: HTMLInputElement
  } | undefined
  function renderContent (container: HTMLElement): void {
    if (!form) {
      container.childNodes.forEach(child => container.removeChild(child))

      container.classList.add('peertube-plugin-livechat-shareurl-modal')

      const divUrl = document.createElement('div')
      divUrl.classList.add('livechat-shareurl-copy')
      const url = document.createElement('input')
      url.setAttribute('type', 'text')
      url.setAttribute('readonly', '')
      url.setAttribute('autocomplete', 'off')
      url.setAttribute('placeholder', '')
      url.classList.add('form-control', 'readonly')
      divUrl.append(url)
      const copy = document.createElement('button')
      copy.classList.add('btn', 'btn-outline-secondary', 'text-uppercase')
      copy.textContent = labelCopy
      divUrl.append(copy)
      const open = document.createElement('button')
      open.classList.add('btn', 'btn-outline-secondary', 'text-uppercase')
      open.textContent = labelOpen
      divUrl.append(open)
      container.append(divUrl)

      const divTips = document.createElement('div')
      divTips.textContent = tipsOBS
      container.append(divTips)

      const divCustom = document.createElement('div')
      divCustom.classList.add('livechat-shareurl-custom')
      container.append(divCustom)

      const divReadonly = document.createElement('div')
      divCustom.append(divReadonly)
      const readonly = document.createElement('input')
      readonly.setAttribute('type', 'checkbox')
      const readonlyLabelEl = document.createElement('label')
      readonlyLabelEl.textContent = labelReadonly
      readonlyLabelEl.prepend(readonly)
      divReadonly.append(readonlyLabelEl)

      let autoColors
      if (isAutoColorsAvailable(settings['chat-type'], settings['converse-theme'])) {
        const label = document.createElement('label')
        label.innerText = labelAutocolors
        autoColors = document.createElement('input')
        autoColors.setAttribute('type', 'checkbox')
        label.prepend(autoColors)
        divCustom.append(label)
      }

      readonly.onclick = () => {
        renderContent(container)
      }

      if (autoColors) {
        autoColors.onclick = () => {
          renderContent(container)
        }
      }

      url.onclick = () => {
        url.select()
        url.setSelectionRange(0, 99999) /* For mobile devices */
      }

      copy.onclick = () => {
        url.select()
        url.setSelectionRange(0, 99999) /* For mobile devices */
        navigator.clipboard.writeText(url.value).then(() => {
          peertubeHelpers.notifier.success(labelCopied)
        }, () => {
          peertubeHelpers.notifier.error(labelError)
        })
      }

      open.onclick = () => {
        window.open(url.value)
      }

      form = {
        readonly,
        url,
        autoColors
      }
    }

    // TODO: save last form state, to restore each time the modal is opened.
    // TODO: check when the feature should be available
    // TODO: check the theme? some of the options should only be available in some cases.

    const uriOptions: UriOptions = {
      ignoreAutoColors: form.autoColors ? !form.autoColors.checked : true,
      permanent: true
    }
    if (form.readonly.checked) {
      uriOptions.readonly = true
    }
    const iframeUri = getIframeUri(registerOptions, settings, video, uriOptions)
    form.url.setAttribute('value', iframeUri ?? '')
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
