// TODO: import @types/peertube when available

interface RegisterClientHookOptions {
  target: string // FIXME
  handler: Function
  priority?: number
}

interface RegisterClientHelpers {
  getBaseStaticRoute: () => string
  // NB: getBaseRouterRoute will come with Peertube > 3.2.1 (3.3.0?)
  getBaseRouterRoute?: () => string
  isLoggedIn: () => boolean
  getSettings: () => Promise<{ [ name: string ]: string }>
  notifier: {
    info: (text: string, title?: string, timeout?: number) => void
    error: (text: string, title?: string, timeout?: number) => void
    success: (text: string, title?: string, timeout?: number) => void
  }
  showModal: (input: {
    title: string
    content: string
    close?: boolean
    cancel?: { value: string, action?: () => void }
    confirm?: { value: string, action?: () => void }
  }) => void
  markdownRenderer: {
    textMarkdownToHTML: (textMarkdown: string) => Promise<string>
    enhancedMarkdownToHTML: (enhancedMarkdown: string) => Promise<string>
  }
  translate: (toTranslate: string) => Promise<string>
}

interface RegisterClientFormFieldOptions {
  name: string
  label: string
  type: 'input' | 'input-checkbox' | 'input-password' | 'input-textarea' | 'markdown-text' | 'markdown-enhanced'
  descriptionHTML?: string
  default?: string | boolean
  hidden?: (options: any) => boolean
}
interface RegisterClientSettingsScript {
  isSettingHidden: (options: {
    setting: RegisterClientFormFieldOptions
    formValues: { [name: string]: any }
  }) => boolean
}

interface RegisterClientVideoFieldOptions {
  type: 'update' | 'upload' | 'import-url' | 'import-torrent' | 'go-live'
}

interface RegisterOptions {
  registerHook: (options: RegisterClientHookOptions) => void
  peertubeHelpers: RegisterClientHelpers
  registerSettingsScript: (options: RegisterClientSettingsScript) => void
  registerVideoField: (
    commonOptions: RegisterClientFormFieldOptions,
    videoFormOptions: RegisterClientVideoFieldOptions
  ) => void
}

interface Video {
  isLive: boolean
  isLocal: boolean
  originInstanceUrl: string
  uuid: string
}
