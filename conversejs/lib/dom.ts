import type { InitConverseParams } from './types'

function initDom ({ forceReadonly, transparent }: InitConverseParams, isInIframe: boolean): void {
  const body = document.querySelector('body')
  if (isInIframe) {
    if (body) {
      body.classList.add('livechat-iframe')
      // prevent horizontal scrollbar when in iframe. (don't know why, but does not work if done by CSS)
      body.style.overflowX = 'hidden'
    }
  }
  if (forceReadonly) {
    body?.classList.add('livechat-readonly')
    if (forceReadonly === 'noscroll') {
      body?.classList.add('livechat-noscroll')
    }
  }
  if (transparent) {
    body?.classList.add('livechat-transparent')
  }
}

export {
  initDom
}
