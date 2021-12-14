import { logger } from './logger'
import { getIframeUri, UriOptions } from './uri'

async function shareChatUrl (registerOptions: RegisterOptions, settings: any, video: Video): Promise<void> {
  const peertubeHelpers = registerOptions.peertubeHelpers

  const [
    labelShare,
    labelReadonly,
    tipsOBS
  ] = await Promise.all([
    peertubeHelpers.translate('Share chat link'),
    peertubeHelpers.translate('Read-only'),
    // eslint-disable-next-line max-len
    peertubeHelpers.translate('Tips for streamers: To add the chat to your OBS, generate a read-only link and use it as a browser source.')
  ])

  const defaultUri = getIframeUri(registerOptions, settings, video)
  if (!defaultUri) {
    return
  }

  let form: {
    readonly: HTMLInputElement
    url: HTMLInputElement
  } | undefined
  function renderContent (container: HTMLElement): void {
    if (!form) {
      container.childNodes.forEach(child => container.removeChild(child))
      const pTips = document.createElement('p')
      pTips.textContent = tipsOBS
      container.append(pTips)

      const pReadonly = document.createElement('p')
      container.append(pReadonly)
      const readonly = document.createElement('input')
      readonly.setAttribute('type', 'checkbox')
      const readonlyLabelEl = document.createElement('label')
      readonlyLabelEl.textContent = labelReadonly
      readonlyLabelEl.prepend(readonly)
      pReadonly.append(readonlyLabelEl)

      const pUrl = document.createElement('p')
      container.append(pUrl)
      const url = document.createElement('input')
      url.setAttribute('type', 'text')
      url.setAttribute('readonly', '')
      url.setAttribute('autocomplete', 'off')
      url.setAttribute('placeholder', '')
      url.classList.add('form-control', 'readonly')
      pUrl.append(url)

      readonly.onclick = () => {
        renderContent(container)
      }

      form = {
        readonly,
        url
      }
    }

    // TODO: save last form state, to restore each time the modal is opened.

    const uriOptions: UriOptions = {
      ignoreAutoColors: true,
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
    content: `<p>${defaultUri ?? ''}</p>`,
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
