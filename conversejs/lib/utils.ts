function inIframe (): boolean {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

export {
  inIframe
}
