type nextValue = 'backend' | 'webchat-video' | 'webchat-type' | 'prosody' | 'converse' | 'use-uri'

export interface TestResult {
  label?: string
  messages: string[]
  next: nextValue | null
  ok: boolean
  test: string
}

export function newResult (test: string): TestResult {
  return {
    test: test,
    ok: false,
    messages: [],
    next: null
  }
}
