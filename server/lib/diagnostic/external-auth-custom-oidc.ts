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

    const errors = await oidc.check()
    if (errors.length) {
      result.messages.push({
        level: 'error',
        message: 'The ExternalAuthOIDC singleton got some errors:'
      })
      result.messages.push(...errors)
      return result
    }
  } catch (err) {
    result.messages.push({
      level: 'error',
      message: 'Error while retrieving the ExternalAuthOIDC singleton:' + (err as string)
    })
    return result
  }

  result.ok = true
  result.messages.push('Configuration OK.')
  return result
}
