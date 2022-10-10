import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { Video } from '@peertube/peertube-types'
import { logger } from './logger'
import { getIframeUri, UriOptions } from './uri'
import { isAutoColorsAvailable } from 'shared/lib/autocolors'

interface ShareForm {
  readonly: HTMLInputElement
  withscroll: HTMLInputElement
  transparent: HTMLInputElement
  readonlyOptions: HTMLElement
  url: HTMLInputElement
  autoColors?: HTMLInputElement
}

async function shareChatUrl (registerOptions: RegisterClientOptions, settings: any, video: Video): Promise<void> {
  const peertubeHelpers = registerOptions.peertubeHelpers

  const [
    labelShare,
    labelReadonly,
    labelWithscroll,
    labelTransparent,
    tipsOBS,
    labelCopy,
    labelCopied,
    labelError,
    labelOpen,
    labelAutocolors
  ] = await Promise.all([
    peertubeHelpers.translate('Share chat link'),
    peertubeHelpers.translate('Read-only'),
    peertubeHelpers.translate('Show the scrollbar'),
    peertubeHelpers.translate('Transparent background (for stream integration, with OBS for example)'),
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

  let form: ShareForm | undefined
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

      const readonly = document.createElement('input')
      readonly.setAttribute('type', 'checkbox')
      const readonlyLabelEl = document.createElement('label')
      readonlyLabelEl.textContent = labelReadonly
      readonlyLabelEl.prepend(readonly)
      divCustom.append(readonlyLabelEl)

      const readonlyOptions = document.createElement('div')
      readonlyOptions.classList.add('livechat-shareurl-custom-readonly-options')
      divCustom.append(readonlyOptions)

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
        divCustom.append(label)
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
        withscroll,
        transparent,
        readonlyOptions,
        url,
        autoColors
      }
      restore(form)
    }

    // Saving the form state, to restore each time the modal is opened.
    save(form)

    const uriOptions: UriOptions = {
      ignoreAutoColors: form.autoColors ? !form.autoColors.checked : true,
      permanent: true
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
      form.readonlyOptions.classList.remove('livechat-shareurl-custom-readonly-disabled')
    } else {
      form.withscroll.disabled = true
      form.transparent.disabled = true
      form.readonlyOptions.classList.add('livechat-shareurl-custom-readonly-disabled')
    }
    const iframeUri = getIframeUri(registerOptions, settings, video, uriOptions)
    form.url.setAttribute('value', iframeUri ?? '')
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
      autocolors: !!form.autoColors?.checked
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
