import { getProsodyConfigContent, getProsodyConfigPath, getWorkingDir } from '../prosody/config'
import { getProsodyAbout, testProsodyCorrectlyRunning } from '../prosody/ctl'
import { newResult, TestResult } from './utils'
import * as fs from 'fs'

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

  // FIXME: these tests should also be in testProsodyCorrectlyRunning. Remove from here?
  // Testing the prosody config file.
  try {
    const filePath = await getProsodyConfigPath(options)
    await fs.promises.access(filePath, fs.constants.R_OK) // throw an error if file does not exist.
    result.messages.push(`The prosody configuration file (${filePath}) exists`)
    const actualContent = await fs.promises.readFile(filePath, {
      encoding: 'utf-8'
    })

    result.debug.push({
      title: 'Current prosody configuration',
      message: actualContent
    })

    const wantedContent = await getProsodyConfigContent(options)
    if (actualContent === wantedContent) {
      result.messages.push('Prosody configuration file content is correct.')
    } else {
      result.messages.push('Prosody configuration file content is not correct.')
      result.debug.push({
        title: 'Prosody configuration should be',
        message: wantedContent
      })
      return result
    }
  } catch (error) {
    result.messages.push('Error when requiring the prosody config file: ' + (error as string))
    return result
  }

  const isCorrectlyRunning = await testProsodyCorrectlyRunning(options)
  if (isCorrectlyRunning.messages.length) {
    result.messages.push(...isCorrectlyRunning.messages)
  }

  const about = await getProsodyAbout(options)
  result.debug.push({
    title: 'Prosody version',
    message: about
  })

  if (!isCorrectlyRunning.ok) {
    return result
  }

  result.ok = true
  return result
}
