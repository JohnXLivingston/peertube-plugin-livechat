// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { newResult, TestResult } from './utils'
import { ExternalAuth, ExternalAuthType, ExternalAuthProvider } from '../external-auth'

export async function diagExternalAuth (
  test: string,
  _options: RegisterServerOptions,
  type: ExternalAuthType,
  provider: ExternalAuthProvider,
  next: TestResult['next']
): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Test External Auth : ' + provider
  result.next = next

  try {
    const auth = ExternalAuth.singleton(type, provider)

    if (auth.isDisabledBySettings()) {
      result.ok = true
      result.messages.push('Feature disabled in plugins settings.')
      return result
    }

    result.messages.push('Discovery URL: ' + (auth.getDiscoveryUrl() ?? 'undefined'))

    const authErrors = await auth.check()
    if (authErrors.length) {
      result.messages.push({
        level: 'error',
        message: 'The ExternalAuth singleton got some errors:'
      })
      for (const authError of authErrors) {
        result.messages.push({
          level: 'error',
          message: authError
        })
      }
      return result
    }
  } catch (err) {
    result.messages.push({
      level: 'error',
      message: 'Error while retrieving the ExternalAuth singleton:' + (err as string)
    })
    return result
  }

  const auth = ExternalAuth.singleton(type, provider)
  const authClient = await auth.load()
  if (authClient) {
    result.messages.push('Discovery URL loaded: ' + JSON.stringify(authClient.issuer.metadata))
  } else {
    result.messages.push({
      level: 'error',
      message: 'Failed to load the Discovery URL.'
    })
    return result
  }

  result.ok = true
  result.messages.push('Configuration OK.')
  return result
}
