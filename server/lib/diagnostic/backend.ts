import type { RegisterServerOptions } from '@peertube/peertube-types'
import { newResult, TestResult } from './utils'

export async function diagBackend (test: string, _options: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Backend connection'
  result.ok = true
  result.next = 'debug'
  return result
}
