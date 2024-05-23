// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

type NextValue = 'backend' | 'debug' | 'webchat-video' | 'prosody'
| 'external-auth-custom-oidc' | 'external-auth-google-oidc' | 'external-auth-facebook-oidc'
| 'everything-ok'

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
  next: NextValue | null
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
