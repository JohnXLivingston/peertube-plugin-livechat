import { getWorkingDir } from '../prosody/config'
import { newResult, TestResult } from './utils'

export async function diagProsody (test: string, options: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Builtin Prosody and ConverseJS'

  try {
    const dir = await getWorkingDir(options)
    result.messages.push('The working dir is: ' + dir)
  } catch (error) {
    result.messages.push('Error when requiring the working dir: ' + (error as string))
    return result
  }

  result.ok = true
  return result
}
