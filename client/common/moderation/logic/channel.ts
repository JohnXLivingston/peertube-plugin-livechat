import type { RegisterClientOptions } from '@peertube/peertube-types/client'

/**
 * Adds the front-end logic on the generated html for the channel moderation options.
 * @param clientOptions Peertube client options
 * @param rootEl The root element in which the template was rendered
 */
async function vivifyModerationChannel (
  clientOptions: RegisterClientOptions,
  rootEl: HTMLElement
): Promise<void> {
  const form = rootEl.querySelector('form[livechat-moderation-channel-options]') as HTMLFormElement
  if (!form) { return }
  const enableBotCB = form.querySelector('input[name=bot]') as HTMLInputElement
  const botEnabledEl = form.querySelector('[livechat-moderation-channel-options-bot-enabled]') as HTMLElement

  const refresh: Function = () => {
    botEnabledEl.style.display = enableBotCB.checked ? 'initial' : 'none'
  }

  enableBotCB.onclick = () => refresh()
  form.onsubmit = () => false
  form.onreset = () => refresh()
  refresh()
}

export {
  vivifyModerationChannel
}
