type nextValue = 'backend' | 'debug' | 'webchat-video' | 'prosody' | 'external-auth-custom-oidc' | 'everything-ok'

interface MessageWithLevel {
  level: 'info' | 'warning' | 'error'
  message: string
  help?: {
    url: string
    text: string
  }
}
export interface TestResult {
  label?: string
  messages: Array<string | MessageWithLevel>
  debug: Array<{
    title: string
    message: string
  }>
  next: nextValue | null
  ok: boolean
  test: string
}

export function newResult (test: string): TestResult {
  return {
    test: test,
    ok: false,
    messages: [],
    debug: [],
    next: null
  }
}
