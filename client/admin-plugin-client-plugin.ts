import type { ChatType } from 'shared/lib/types'

function register ({ registerSettingsScript }: RegisterOptions): void {
  registerSettingsScript({
    isSettingHidden: options => {
      const name = options.setting.name
      switch (name) {
        case 'chat-type-help-disabled':
          return options.formValues['chat-type'] !== ('disabled' as ChatType)
        case 'prosody-port':
        case 'chat-type-help-builtin-prosody':
          return options.formValues['chat-type'] !== ('builtin-prosody' as ChatType)
        case 'chat-server':
        case 'chat-room':
        case 'chat-bosh-uri':
        case 'chat-ws-uri':
        case 'chat-type-help-builtin-converse':
          return options.formValues['chat-type'] !== ('builtin-converse' as ChatType)
        case 'chat-uri':
        case 'chat-type-help-external-uri':
          return options.formValues['chat-type'] !== ('external-uri' as ChatType)
        case 'chat-style':
          return options.formValues['chat-type'] === 'disabled'
        case 'chat-only-locals-warning':
          return options.formValues['chat-only-locals'] === true
      }

      return false
    }
  })
}

export {
  register
}
