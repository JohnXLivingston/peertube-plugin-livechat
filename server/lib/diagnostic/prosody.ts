import type { RegisterServerOptions } from '@peertube/peertube-types'
import { getProsodyConfig, getProsodyConfigContentForDiagnostic, getWorkingDir } from '../prosody/config'
import { checkProsody, getProsodyAbout, testProsodyCorrectlyRunning } from '../prosody/ctl'
import { newResult, TestResult } from './utils'
import { getAPIKey } from '../apikey'
import { helpUrl } from '../../../shared/lib/help'
import * as fs from 'fs'

const got = require('got')

export async function diagProsody (test: string, options: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Builtin Prosody and ConverseJS'

  try {
    const workingDir = await getWorkingDir(options)
    result.messages.push('The working dir is: ' + workingDir)
  } catch (error) {
    result.messages.push('Error when requiring the working dir: ' + (error as string))
    return result
  }

  // FIXME: these tests are very similar to tests in testProsodyCorrectlyRunning. Remove from here?
  // Testing the prosody config file.
  let prosodyPort: string
  let prosodyHost: string
  let prosodyErrorLogPath: string
  try {
    const wantedConfig = await getProsodyConfig(options)
    const filePath = wantedConfig.paths.config
    prosodyErrorLogPath = wantedConfig.paths.error

    result.messages.push(`Prosody will run on port '${wantedConfig.port}'`)
    prosodyPort = wantedConfig.port
    prosodyHost = wantedConfig.host

    result.messages.push(`Prosody will use ${wantedConfig.baseApiUrl} as base uri from api calls`)

    if (!wantedConfig.paths.exec) {
      result.messages.push({
        level: 'error',
        message: 'Error: no Prosody server.'
      })
      if (process.arch !== 'x64' && process.arch !== 'x86_64' && process.arch !== 'arm64') {
        result.messages.push({
          level: 'error',
          message: 'Error: your CPU is a ' +
            process.arch + ', ' +
            'which is not compatible with the plugin. ' +
            'Please read the plugin installation documentation for a workaround.'
        })
      }
      return result
    }

    result.messages.push(`Prosody path will be '${wantedConfig.paths.exec}'`)

    if (wantedConfig.paths.appImageToExtract) {
      result.messages.push(`Prosody will be using the '${wantedConfig.paths.appImageToExtract}' AppImage`)
    } else {
      result.messages.push('Prosody will not be using any AppImage')
    }

    result.messages.push(`Prosody AppImage extract path will be '${wantedConfig.paths.appImageExtractPath}'`)

    result.messages.push(`Prosody modules path will be '${wantedConfig.paths.modules}'`)

    result.messages.push(`Prosody rooms will be grouped by '${wantedConfig.roomType}'.`)

    if (wantedConfig.logByDefault) {
      result.messages.push('By default, room content will be archived.')
    } else {
      result.messages.push('By default, room content will not be archived.')
    }

    if ('error' in wantedConfig.logExpiration) {
      result.messages.push({
        level: 'error',
        message: 'Errors: Room logs expiration value is not valid. Using the default value.'
      })
    }
    result.messages.push(`Room content will be saved for '${wantedConfig.logExpiration.value}'`)

    if (wantedConfig.paths.certs === undefined) {
      result.messages.push({
        level: 'error',
        message: 'Error: The certificates path is misconfigured.'
      })
      return result
    }

    await fs.promises.access(filePath, fs.constants.R_OK) // throw an error if file does not exist.
    result.messages.push(`The prosody configuration file (${filePath}) exists`)
    const actualContent = await fs.promises.readFile(filePath, {
      encoding: 'utf-8'
    })

    result.debug.push({
      title: 'Current prosody configuration',
      // we have to hide secret keys and other values.
      // But here, we haven't them for actualContent.
      // So we will use values in wantedConfig, hopping it is enough.
      message: getProsodyConfigContentForDiagnostic(wantedConfig, actualContent)
    })

    const wantedContent = wantedConfig.content
    if (actualContent === wantedContent) {
      result.messages.push('Prosody configuration file content is correct.')
    } else {
      result.messages.push('Prosody configuration file content is not correct.')
      result.debug.push({
        title: 'Prosody configuration should be',
        // we have to hide secret keys and other values:
        message: getProsodyConfigContentForDiagnostic(wantedConfig)
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

  const versionMatches = about.match(/^Prosody\s*(\d+)\.(\d+)(?:\.(\d+)| (nightly build \d+.*))\s*$/mi)
  if (!versionMatches) {
    result.messages.push({
      level: 'error',
      message: 'Errors: cant find prosody version.'
    })
    return result
  } else {
    const major = versionMatches[1]
    const minor = versionMatches[2]
    const patch = versionMatches[3] ?? versionMatches[4]
    result.messages.push(`Prosody version is ${major}.${minor}.${patch}`)
    if (major !== '0' && minor !== '12') {
      result.messages.push({
        level: parseInt(minor) < 12 ? 'error' : 'warning',
        message: 'Warning: recommended Prosody version is 0.12.x'
      })
    }
  }

  try {
    const apiUrl = `http://localhost:${prosodyPort}/peertubelivechat_test/test-peertube-prosody`
    const testResult = await got(apiUrl, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + await getAPIKey(options),
        host: prosodyHost
      },
      responseType: 'json',
      resolveBodyOnly: true
    })
    if (testResult.ok === true) {
      result.messages.push('API Peertube -> Prosody is OK')
    } else {
      result.messages.push('API Peertube -> Prosody is KO. Response was: ' + JSON.stringify(testResult))
      return result
    }
  } catch (error) {
    result.messages.push('Error when calling Prosody test api (test-peertube-prosody): ' + (error as string))
    return result
  }

  try {
    const apiUrl = `http://localhost:${prosodyPort}/peertubelivechat_test/test-prosody-peertube`
    const testResult = await got(apiUrl, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + await getAPIKey(options),
        host: prosodyHost
      },
      responseType: 'json',
      resolveBodyOnly: true
    })
    if (testResult.ok === true) {
      result.messages.push('API Prosody -> Peertube is OK')
    } else {
      result.messages.push({
        level: 'error',
        message: 'API Prosody -> Peertube is KO. Response was: ' + JSON.stringify(testResult),
        help: {
          text: 'Check the troubleshooting documentation.',
          url: helpUrl({
            page: 'documentation/installation/troubleshooting'
          })
        }
      })
      return result
    }
  } catch (error) {
    result.messages.push('Error when calling Prosody test api (test-prosody-peertube): ' + (error as string))
    return result
  }

  const check = await checkProsody(options)
  result.debug.push({
    title: 'Prosody check',
    message: check
  })

  // Checking if there is a Prosody error log, and returning last lines.
  try {
    await fs.promises.access(prosodyErrorLogPath, fs.constants.R_OK) // throw an error if file does not exist.
    result.messages.push(`The prosody error log (${prosodyErrorLogPath}) exists`)
    const errorLogContent = await fs.promises.readFile(prosodyErrorLogPath, {
      encoding: 'utf-8'
    })

    let logLines = errorLogContent.split(/\r?\n/)
    if (logLines.length > 50) {
      logLines = logLines.slice(-50)
    }

    result.debug.push({
      title: 'Prosody error log (last 50 lines)',
      message: logLines.join('\n')
    })
  } catch (error) {
    // Error should be because file does not exists. This is not an error case, just ignoring.
  }

  result.ok = true
  result.next = 'external-auth-custom-oidc'
  return result
}
