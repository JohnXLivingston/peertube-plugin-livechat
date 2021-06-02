import type { ChatType } from 'shared/lib/types'
const prosodySettings = ['prosody-port']
const converseSettings = ['chat-server', 'chat-room', 'chat-bosh-uri', 'chat-ws-uri']
const otherSettings: string[] = []

function register ({ registerSettingsScript }: RegisterOptions): void {
  registerSettingsScript({
    isSettingHidden: options => {
      const name = options.setting.name
      switch (name) {
        case 'chat-type-help-disabled':
          return options.formValues['chat-type'] !== ('disabled' as ChatType)
        case 'chat-type-help-builtin-prosody':
          return options.formValues['chat-type'] !== ('builtin-prosody' as ChatType)
        case 'chat-type-help-builtin-converse':
          return options.formValues['chat-type'] !== ('builtin-converse' as ChatType)
        case 'chat-type-help-external-uri':
          return options.formValues['chat-type'] !== ('external-uri' as ChatType)
      }

      // TODO: rewrite the code bellow.
      if (prosodySettings.includes(name)) {
        return options.formValues['chat-use-prosody'] !== true
      }
      if (name === 'chat-use-builtin') {
        return options.formValues['chat-use-prosody'] === true
      }
      if (converseSettings.includes(name)) {
        return options.formValues['chat-use-builtin'] !== true || options.formValues['chat-use-prosody'] === true
      }
      if (name === 'chat-uri') {
        return options.formValues['chat-use-prosody'] === true || options.formValues['chat-use-builtin'] === true
      }
      if (otherSettings.includes(name)) {
        return options.formValues['chat-use-builtin'] === true || options.formValues['chat-use-prosody'] === true
      }
      return false
    }
  })
}

export {
  register
}
