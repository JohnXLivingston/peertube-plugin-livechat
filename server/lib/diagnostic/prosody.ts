import { newResult, TestResult } from './utils'

export async function diagProsody (test: string, _settingsManager: PluginSettingsManager): Promise<TestResult> {
  const result = newResult(test)
  result.ok = false
  result.label = 'Builtin Prosody and ConverseJS'
  result.messages.push('Not Implemented Yet')
  return result
}
