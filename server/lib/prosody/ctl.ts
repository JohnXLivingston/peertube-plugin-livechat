// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
// SPDX-FileCopyrightText: 2024 OPNA2608 <opna2608@protonmail.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { getProsodyConfig, getProsodyFilePaths, writeProsodyConfig } from './config'
import { startProsodyLogRotate, stopProsodyLogRotate } from './logrotate'
import {
  ensureProsodyCertificates,
  startProsodyCertificatesRenewCheck,
  stopProsodyCertificatesRenewCheck,
  missingSelfSignedCertificates
} from './certificates'
import { disableProxyRoute, enableProxyRoute } from '../routers/webchat'
import { fixRoomSubject } from './fix-room-subject'
import * as fs from 'fs'
import * as child_process from 'child_process'
import { disableLuaUnboundIfNeeded, prosodyDebuggerOptions } from '../../lib/debug'

async function _ensureWorkingDir (
  options: RegisterServerOptions,
  workingDir: string,
  dataDir: string,
  certsDir: string | undefined,
  certsDirIsCustom: boolean,
  appImageExtractPath: string
): Promise<string> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling _ensureworkingDir')

  if (!fs.existsSync(workingDir)) {
    logger.info(`The working dir ${workingDir} does not exists, trying to create it`)
    await fs.promises.mkdir(workingDir)
    logger.debug(`Working dir ${workingDir} was created`)
  }
  logger.debug(`Testing write access on ${workingDir}`)
  await fs.promises.access(workingDir, fs.constants.W_OK) // will throw an error if no access
  logger.debug(`Write access ok on ${workingDir}`)

  if (!fs.existsSync(dataDir)) {
    logger.info(`The data dir ${dataDir} does not exists, trying to create it`)
    await fs.promises.mkdir(dataDir)
    logger.debug(`data dir ${dataDir} was created`)
  }

  if (certsDir && !certsDirIsCustom && !fs.existsSync(certsDir)) {
    // Certificates dir for Prosody.
    // Note: not used yet, but we create the directory to avoid errors in prosody logs.
    logger.info(`The certs dir ${certsDir} does not exists, trying to create it`)
    await fs.promises.mkdir(certsDir)
    logger.debug(`certs dir ${certsDir} was created`)
  }

  if (!fs.existsSync(appImageExtractPath)) {
    logger.info(`The appImageExtractPath dir ${appImageExtractPath} does not exists, trying to create it`)
    await fs.promises.mkdir(appImageExtractPath)
    logger.debug(`appImageExtractPath dir ${appImageExtractPath} was created`)
  }

  return workingDir
}

/**
 * This function prepares:
 * - the Prosody working dir
 * - the binaries for the embeded Prosody (if needed).
 * @param options
 */
async function prepareProsody (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  const filePaths = await getProsodyFilePaths(options)

  logger.debug('Ensuring that the working dir exists')
  await _ensureWorkingDir(
    options,
    filePaths.dir,
    filePaths.data,
    filePaths.certs,
    filePaths.certsDirIsCustom,
    filePaths.appImageExtractPath
  )

  try {
    await fixRoomSubject(options, filePaths)
  } catch (err) {
    logger.error(err)
  }

  const appImageToExtract = filePaths.appImageToExtract
  if (!appImageToExtract) {
    return
  }

  return new Promise((resolve, reject) => {
    const spawned = child_process.spawn(appImageToExtract, ['--appimage-extract'], {
      cwd: filePaths.appImageExtractPath,
      env: {
        ...process.env
      }
    })
    spawned.stdout.on('data', (data) => {
      logger.debug(`AppImage extract printed: ${data as string}`)
    })
    spawned.stderr.on('data', (data) => {
      logger.error(`AppImage extract has errors: ${data as string}`)
    })
    spawned.on('error', reject)
    spawned.on('close', (_code) => { // 'close' and not 'exit', to be sure it is finished.
      disableLuaUnboundIfNeeded(options, filePaths.appImageExtractPath)
      resolve()
    })
  })
}

interface ProsodyCtlResult {
  code: number | null
  stdout: string
  sterr: string
  message: string
}
interface ProsodyCtlOptions {
  additionalArgs?: string[]
  yesMode?: boolean
  stdErrFilter?: (data: string) => boolean
}
async function prosodyCtl (
  options: RegisterServerOptions, command: string, prosodyCtlOptions?: ProsodyCtlOptions
): Promise<ProsodyCtlResult> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling prosodyCtl with command ' + command)

  const filePaths = await getProsodyFilePaths(options)
  if (!/^\w+$/.test(command)) {
    throw new Error(`Invalid prosodyctl command '${command}'`)
  }
  return new Promise((resolve, reject) => {
    if (!filePaths.execCtl) {
      reject(new Error('Missing prosodyctl command executable'))
      return
    }
    let d = ''
    let e = ''
    let m = ''
    const cmdArgs = [
      ...filePaths.execCtlArgs,
      '--config',
      filePaths.config,
      command
    ]
    prosodyCtlOptions?.additionalArgs?.forEach(arg => {
      // No need to check for code injection, child_process.spawn will escape args correctly.
      cmdArgs.push(arg)
    })
    const spawned = child_process.spawn(filePaths.execCtl, cmdArgs, {
      cwd: filePaths.dir,
      env: {
        ...process.env,
        PROSODY_CONFIG: filePaths.config
      }
    })

    let yesModeInterval: NodeJS.Timer
    if (prosodyCtlOptions?.yesMode) {
      yesModeInterval = setInterval(() => {
        options.peertubeHelpers.logger.debug('ProsodyCtl was called in yesMode, writing to standard input.')
        spawned.stdin.write('\n')
      }, 10)
      spawned.stdin.on('close', () => {
        options.peertubeHelpers.logger.debug('ProsodyCtl standard input closed, clearing interval.')
        clearInterval(yesModeInterval)
      })
      spawned.stdin.on('error', () => {
        options.peertubeHelpers.logger.debug('ProsodyCtl standard input errored, clearing interval.')
        clearInterval(yesModeInterval)
      })
    }

    spawned.stdout.on('data', (data) => {
      d += data as string
      m += data as string
    })
    spawned.stderr.on('data', (data) => {
      if (prosodyCtlOptions?.stdErrFilter) {
        if (!prosodyCtlOptions.stdErrFilter('' + (data as string))) {
          return
        }
      }
      options.peertubeHelpers.logger.error(`Spawned command ${command} has errors: ${data as string}`)
      e += data as string
      m += data as string
    })
    spawned.on('error', reject)

    // on 'close' and not 'exit', to be sure everything is done
    // (else it can cause trouble by cleaning AppImage extract too soon)
    spawned.on('close', (code) => {
      resolve({
        code,
        stdout: d,
        sterr: e,
        message: m
      })
    })
  })
}

async function getProsodyAbout (options: RegisterServerOptions): Promise<string> {
  const ctl = await prosodyCtl(options, 'about')
  return ctl.message
}

async function reloadProsody (options: RegisterServerOptions): Promise<boolean> {
  const reload = await prosodyCtl(options, 'reload')
  if (reload.code) {
    options.peertubeHelpers.logger.error('reloadProsody failed: ' + JSON.stringify(reload))
    return false
  }
  return true
}

async function checkProsody (options: RegisterServerOptions): Promise<string> {
  const ctl = await prosodyCtl(options, 'check')
  return ctl.message
}

interface ProsodyRunning {
  ok: boolean
  messages: string[]
}
async function testProsodyRunning (options: RegisterServerOptions): Promise<ProsodyRunning> {
  const { peertubeHelpers } = options
  const logger = peertubeHelpers.logger
  logger.info('Checking if Prosody is running')

  const result: ProsodyRunning = {
    ok: false,
    messages: []
  }

  const filePaths = await getProsodyFilePaths(options)
  try {
    logger.debug('Trying to access the pid file')
    await fs.promises.access(filePaths.pid, fs.constants.R_OK)
    result.messages.push(`Pid file ${filePaths.pid} found`)
  } catch (error) {
    logger.debug(`Failed to access pid file: ${error as string}`)
    result.messages.push(`Pid file ${filePaths.pid} not found`)
    return result
  }

  const status = await prosodyCtl(options, 'status')
  result.messages.push('Prosodyctl status: ' + status.message)
  if (status.code) {
    return result
  }

  result.ok = true
  return result
}

async function testProsodyCorrectlyRunning (options: RegisterServerOptions): Promise<ProsodyRunning> {
  const { peertubeHelpers } = options
  peertubeHelpers.logger.info('Checking if Prosody is correctly running')
  const result = await testProsodyRunning(options)
  if (!result.ok) { return result }
  result.ok = false // more tests to come

  try {
    const wantedConfig = await getProsodyConfig(options)
    const filePath = wantedConfig.paths.config

    await fs.promises.access(filePath, fs.constants.R_OK) // throw an error if file does not exist.
    result.messages.push(`The prosody configuration file (${filePath}) exists`)
    const actualContent = await fs.promises.readFile(filePath, {
      encoding: 'utf-8'
    })

    const wantedContent = wantedConfig.content
    if (actualContent === wantedContent) {
      result.messages.push('Prosody configuration file content is correct.')
    } else {
      result.messages.push('Prosody configuration file content is not correct.')
      return result
    }

    if (!await missingSelfSignedCertificates(options, wantedConfig)) {
      result.messages.push('No missing self signed certificates.')
    } else {
      result.messages.push('Missing self signed certificates.')
      return result
    }
  } catch (error) {
    result.messages.push('Error when requiring the prosody config file: ' + (error as string))
    return result
  }

  result.ok = true
  return result
}

async function ensureProsodyRunning (
  options: RegisterServerOptions,
  forceRestart?: boolean,
  restartProsodyInDebugMode?: boolean
): Promise<void> {
  const { peertubeHelpers } = options
  const logger = peertubeHelpers.logger
  logger.debug('Calling ensureProsodyRunning')

  if (forceRestart) {
    logger.info('We want to force Prosody restart, skip checking the current state')
  } else {
    const r = await testProsodyCorrectlyRunning(options)
    if (r.ok) {
      r.messages.forEach(m => logger.debug(m))
      logger.info('Prosody is already running correctly')
      // Stop here. Nothing to change.
      return
    }
    logger.info('Prosody is not running correctly: ')
    r.messages.forEach(m => logger.info(m))
  }

  // Shutting down...
  logger.debug('Shutting down prosody')
  await ensureProsodyNotRunning(options)

  // writing the configuration file
  logger.debug('Writing the configuration file')
  const config = await writeProsodyConfig(options)

  const filePaths = config.paths

  if (!filePaths.exec) {
    logger.info('No Prosody executable, cant run.')
    return
  }

  // Check certicates if needed.
  await ensureProsodyCertificates(options, config)

  // launch prosody
  let execArgs: string[] = filePaths.execArgs
  if (restartProsodyInDebugMode) {
    if (!filePaths.exec.includes('squashfs-root')) {
      logger.error('Trying to enable the Prosody Debugger, but not using the AppImage. Cant work.')
    } else {
      const debuggerOptions = prosodyDebuggerOptions(options)
      if (debuggerOptions) {
        execArgs = [
          'debug',
          debuggerOptions.mobdebugPath,
          debuggerOptions.mobdebugHost,
          debuggerOptions.mobdebugPort,
          ...execArgs
        ]
      }
    }
  }
  logger.info(
    'Going to launch prosody (' +
    filePaths.exec +
    (execArgs.length ? ' ' + execArgs.join(' ') : '') +
    ')'
  )
  const prosody = child_process.spawn(filePaths.exec, execArgs, {
    cwd: filePaths.dir,
    env: {
      ...process.env,
      PROSODY_CONFIG: filePaths.config
    }
  })
  prosody.stdout?.on('data', (data) => {
    logger.debug(`Prosody stdout: ${data as string}`)
  })
  prosody.stderr?.on('data', (data) => {
    logger.error(`Prosody stderr: ${data as string}`)
  })
  prosody.on('error', (error) => {
    logger.error(`Prosody exec error: ${JSON.stringify(error)}`)
  })
  prosody.on('close', (code) => {
    logger.info(`Prosody process closed all stdio with code ${code ?? 'null'}`)
  })
  prosody.on('exit', (code) => {
    logger.info(`Prosody process exited with code ${code ?? 'null'}`)
  })

  // Set the http-bind route.
  await enableProxyRoute(options, {
    host: config.host,
    port: config.port
  })

  async function sleep (ms: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
  logger.info('Waiting for the prosody process to launch')
  let count = 0
  let processStarted = false
  while (!processStarted && count < 5) {
    count++
    await sleep(500)
    logger.info('Verifying prosody is launched')
    const status = await prosodyCtl(options, 'status')
    if (!status.code) {
      logger.info(`Prosody status: ${status.stdout}`)
      processStarted = true
    } else {
      logger.warn(`Prosody status: ${status.message}`)
    }
  }
  if (!processStarted) {
    logger.error('It seems that the Prosody process is not up')
    return
  }
  logger.info('Prosody is running')
  startProsodyLogRotate(options, filePaths)
  startProsodyCertificatesRenewCheck(options, config)
}

async function ensureProsodyNotRunning (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers } = options
  const logger = peertubeHelpers.logger
  logger.info('Checking if Prosody is running, and shutting it down if so')

  stopProsodyLogRotate(options)
  stopProsodyCertificatesRenewCheck(options)

  // NB: this function is called on plugin unregister, even if prosody is not used
  // so we must avoid creating the working dir now
  const filePaths = await getProsodyFilePaths(options)
  if (!fs.existsSync(filePaths.dir)) {
    logger.info(`The working dir ${filePaths.dir} does not exist, assuming there is no prosody on this server`)
    return
  }

  logger.debug('Removing proxy route')
  await disableProxyRoute(options)

  logger.debug('Calling prosodyctl to stop the process')
  const status = await prosodyCtl(options, 'stop')
  logger.info(`ProsodyCtl command returned: ${status.message}`)
}

export {
  getProsodyAbout,
  checkProsody,
  testProsodyRunning,
  testProsodyCorrectlyRunning,
  prepareProsody,
  ensureProsodyRunning,
  ensureProsodyNotRunning,
  prosodyCtl,
  reloadProsody
}
