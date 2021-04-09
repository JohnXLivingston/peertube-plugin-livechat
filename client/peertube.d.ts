// TODO: import @types/peertube when available

interface RegisterClientHookOptions {
  target: string // FIXME
  handler: Function
  priority?: number
}

interface RegisterClientHelpers {
  getBaseStaticRoute: () => string
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

interface RegisterOptions {
  registerHook: (options: RegisterClientHookOptions) => void
  peertubeHelpers: RegisterClientHelpers
}

interface Video {
  isLive: boolean
  isLocal: boolean
  originInstanceUrl: string
  uuid: string
}
