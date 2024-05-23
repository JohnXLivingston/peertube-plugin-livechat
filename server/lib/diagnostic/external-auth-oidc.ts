// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { newResult, TestResult } from './utils'
import { ExternalAuthOIDC, ExternalAuthOIDCType } from '../external-auth/oidc'

export async function diagExternalAuthOIDC (
  test: string,
  _options: RegisterServerOptions,
  singletonType: ExternalAuthOIDCType,
  next: TestResult['next']
): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Test External Auth OIDC: ' + singletonType
  result.next = next

  try {
    const oidc = ExternalAuthOIDC.singleton(singletonType)

    if (oidc.isDisabledBySettings()) {
      result.ok = true
      result.messages.push('Feature disabled in plugins settings.')
      return result
    }

    result.messages.push('Discovery URL: ' + (oidc.getDiscoveryUrl() ?? 'undefined'))

    const oidcErrors = await oidc.check()
    if (oidcErrors.length) {
      result.messages.push({
        level: 'error',
        message: 'The ExternalAuthOIDC singleton got some errors:'
      })
      for (const oidcError of oidcErrors) {
        result.messages.push({
          level: 'error',
          message: oidcError
        })
      }
      return result
    }
  } catch (err) {
    result.messages.push({
      level: 'error',
      message: 'Error while retrieving the ExternalAuthOIDC singleton:' + (err as string)
    })
    return result
  }

  const oidc = ExternalAuthOIDC.singleton(singletonType)
  const oidcClient = await oidc.load()
  if (oidcClient) {
    result.messages.push('Discovery URL loaded: ' + JSON.stringify(oidcClient.issuer.metadata))
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
