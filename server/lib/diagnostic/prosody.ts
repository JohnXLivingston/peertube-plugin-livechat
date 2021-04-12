import { newResult, TestResult } from './utils'

export async function diagProsody (test: string, _options: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Builtin Prosody and ConverseJS'
  return result
}
