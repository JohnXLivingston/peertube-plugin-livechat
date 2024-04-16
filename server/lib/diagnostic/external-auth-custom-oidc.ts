import type { RegisterServerOptions } from '@peertube/peertube-types'
import { newResult, TestResult } from './utils'
import { ExternalAuthOIDC } from '../external-auth/oidc'

export async function diagExternalAuthCustomOIDC (test: string, _options: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Test External Auth Custom OIDC'
  result.next = 'everything-ok'

  try {
    const oidc = ExternalAuthOIDC.singleton()

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

  const oidc = ExternalAuthOIDC.singleton()
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
