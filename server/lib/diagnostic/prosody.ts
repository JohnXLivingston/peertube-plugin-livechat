import { getProsodyConfig, getWorkingDir } from '../prosody/config'
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

  // FIXME: these tests are very similar to tests in testProsodyCorrectlyRunning. Remove from here?
  // Testing the prosody config file.
  try {
    const wantedConfig = await getProsodyConfig(options)
    const filePath = wantedConfig.paths.config

    result.messages.push(`Prosody will run on port '${wantedConfig.port}'`)

    result.messages.push(`Prosody modules path will be '${wantedConfig.paths.modules}'`)

    await fs.promises.access(filePath, fs.constants.R_OK) // throw an error if file does not exist.
    result.messages.push(`The prosody configuration file (${filePath}) exists`)
    const actualContent = await fs.promises.readFile(filePath, {
      encoding: 'utf-8'
    })

    result.debug.push({
      title: 'Current prosody configuration',
      message: actualContent
    })

    const wantedContent = wantedConfig.content
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

  const versionMatches = about.match(/^Prosody\s*(\d+)\.(\d+)\.(\d+)\s*$/mi)
  if (!versionMatches) {
    result.messages.push({
      level: 'error',
      message: 'Errors: cant find prosody version.'
    })
    return result
  } else {
    const major = versionMatches[1]
    const minor = versionMatches[2]
    const patch = versionMatches[3]
    result.messages.push(`Prosody version is ${major}.${minor}.${patch}`)
    if (major !== '0' && minor !== '11') {
      result.messages.push({
        level: parseInt(minor) < 11 ? 'error' : 'warning',
        message: 'Warning: recommended Prosody version is 0.11.x'
      })
    }
  }

  result.ok = true
  return result
}
