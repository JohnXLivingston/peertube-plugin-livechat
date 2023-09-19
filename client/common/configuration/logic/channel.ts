import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import type { ChannelConfigurationOptions } from 'shared/lib/types'
import { getBaseRoute } from '../../../videowatch/uri'

/**
 * Adds the front-end logic on the generated html for the channel configuration options.
 * @param clientOptions Peertube client options
 * @param rootEl The root element in which the template was rendered
 */
async function vivifyConfigurationChannel (
  clientOptions: RegisterClientOptions,
  rootEl: HTMLElement,
  channelId: string
): Promise<void> {
  const form = rootEl.querySelector('form[livechat-configuration-channel-options]') as HTMLFormElement
  if (!form) { return }
  const labelSaved = await clientOptions.peertubeHelpers.translate(LOC_SUCCESSFULLY_SAVED)
  const labelError = await clientOptions.peertubeHelpers.translate(LOC_ERROR)
  const enableBotCB = form.querySelector('input[name=bot]') as HTMLInputElement
  const botEnabledEl = form.querySelector('[livechat-configuration-channel-options-bot-enabled]') as HTMLElement

  const refresh: Function = () => {
    botEnabledEl.style.display = enableBotCB.checked ? 'initial' : 'none'
  }

  const submitForm: Function = async () => {
    const data = new FormData(form)
    const channelConfigurationOptions: ChannelConfigurationOptions = {
      bot: data.get('bot') === '1',
      botNickname: data.get('bot_nickname')?.toString() ?? '',
      bannedJIDs: (data.get('banned_jids')?.toString() ?? '').split(/\r?\n|\r|\n/g),
      forbiddenWords: (data.get('forbidden_words')?.toString() ?? '').split(/\r?\n|\r|\n/g)
    }

    const headers: any = clientOptions.peertubeHelpers.getAuthHeader() ?? {}
    headers['content-type'] = 'application/json;charset=UTF-8'

    const response = await fetch(
      getBaseRoute(clientOptions) + '/api/configuration/channel/' + encodeURIComponent(channelId),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(channelConfigurationOptions)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to save configuration options.')
    }
  }
  const toggleSubmit: Function = (disabled: boolean) => {
    form.querySelectorAll('input[type=submit], input[type=reset]').forEach((el) => {
      if (disabled) {
        el.setAttribute('disabled', 'disabled')
      } else {
        el.removeAttribute('disabled')
      }
    })
  }

  enableBotCB.onclick = () => refresh()
  form.onsubmit = () => {
    toggleSubmit(true)
    submitForm().then(
      () => {
        clientOptions.peertubeHelpers.notifier.success(labelSaved)
        toggleSubmit(false)
      },
      () => {
        clientOptions.peertubeHelpers.notifier.error(labelError)
        toggleSubmit(false)
      }
    )
    return false
  }
  form.onreset = () => {
    // Must refresh in a setTimeout, otherwise the checkbox state is not up to date.
    setTimeout(() => refresh(), 1)
  }
  refresh()
}

export {
  vivifyConfigurationChannel
}
