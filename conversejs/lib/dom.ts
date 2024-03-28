import type { InitConverseJSParams } from 'shared/lib/types'

function initDom ({ forceReadonly, transparent }: InitConverseJSParams, isInIframe: boolean): void {
  const body = document.querySelector('body')
  if (isInIframe) {
    if (body) {
      body.classList.add('livechat-iframe') // we need to keep this, for embedded chats in external websites
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
