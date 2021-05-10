const prosodySettings = ['prosody-port']
const converseSettings = ['chat-server', 'chat-room', 'chat-bosh-uri', 'chat-ws-uri']
const otherSettings: string[] = []

function register ({ registerSettingsScript }: RegisterOptions): void {
  if (registerSettingsScript) {
    registerSettingsScript({
      isSettingHidden: options => {
        const name = options.setting.name
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
}

export {
  register
}
