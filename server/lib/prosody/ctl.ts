import { getProsodyConfig, getProsodyFilePaths, writeProsodyConfig } from './config'
import { startProsodyLogRotate, stopProsodyLogRotate } from './logrotate'
import { changeHttpBindRoute } from '../routers/webchat'
import type { ChatType } from '../../../shared/lib/types'
import * as fs from 'fs'
import * as child_process from 'child_process'

interface ProsodyCtlResult {
  code: number | null
  stdout: string
  sterr: string
  message: string
}
async function prosodyCtl (options: RegisterServerOptions, command: string): Promise<ProsodyCtlResult> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling prosodyCtl with command ' + command)

  const filePaths = await getProsodyFilePaths(options)
  if (!/^\w+$/.test(command)) {
    throw new Error(`Invalid prosodyctl command '${command}'`)
  }
  return new Promise((resolve, reject) => {
    let d: string = ''
    let e: string = ''
    let m: string = ''
    const spawned = child_process.spawn('prosodyctl', [
      '--config',
      filePaths.config,
      command
    ], {
      cwd: filePaths.dir,
      env: {
        ...process.env,
        PROSODY_CONFIG: filePaths.config
      }
    })
    spawned.stdout.on('data', (data) => {
      d += data as string
      m += data as string
    })
    spawned.stderr.on('data', (data) => {
      options.peertubeHelpers.logger.error(`Spawned command ${command} has errors: ${data as string}`)
      e += data as string
      m += data as string
    })
    spawned.on('error', reject)
    spawned.on('exit', (code) => {
      resolve({
        code: code,
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
  } catch (error) {
    result.messages.push('Error when requiring the prosody config file: ' + (error as string))
    return result
  }

  result.ok = true
  return result
}

async function ensureProsodyRunning (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers, settingsManager } = options
  const logger = peertubeHelpers.logger
  logger.debug('Calling ensureProsodyRunning')

  logger.debug('Checking if prosody should be active')
  const setting = await settingsManager.getSetting('chat-type')
  if (setting !== ('builtin-prosody' as ChatType)) {
    logger.info('Chat type is not set to builtin-prosody, we wont launch it')
    return
  }

  const r = await testProsodyCorrectlyRunning(options)
  if (r.ok) {
    r.messages.forEach(m => logger.debug(m))
    logger.info('Prosody is already running correctly')
    // Stop here. Nothing to change.
    return
  }
  logger.info('Prosody is not running correctly: ')
  r.messages.forEach(m => logger.info(m))

  // Shutting down...
  logger.debug('Shutting down prosody')
  await ensureProsodyNotRunning(options)

  // writing the configuration file
  logger.debug('Writing the configuration file')
  const config = await writeProsodyConfig(options)

  const filePaths = config.paths

  // launch prosody
  logger.info('Going to launch prosody')
  const prosody = child_process.exec('prosody', {
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
  changeHttpBindRoute(options, {
    host: config.host,
    port: config.port
  })

  async function sleep (ms: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
  logger.info('Waiting for the prosody process to launch')
  let count: number = 0
  let processStarted: boolean = false
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
  startProsodyLogRotate(options, filePaths, reloadProsody)
}

async function ensureProsodyNotRunning (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers } = options
  const logger = peertubeHelpers.logger
  logger.info('Checking if Prosody is running, and shutting it down if so')

  stopProsodyLogRotate(options)

  // NB: this function is called on plugin unregister, even if prosody is not used
  // so we must avoid creating the working dir now
  const filePaths = await getProsodyFilePaths(options)
  if (!fs.existsSync(filePaths.dir)) {
    logger.info(`The working dir ${filePaths.dir} does not exist, assuming there is no prosody on this server`)
    return
  }

  logger.debug('Calling prosodyctl to stop the process')
  const status = await prosodyCtl(options, 'stop')
  logger.info(`ProsodyCtl command returned: ${status.message}`)

  logger.debug('Removing http-bind route')
  changeHttpBindRoute(options, null)
}

export {
  getProsodyAbout,
  testProsodyRunning,
  testProsodyCorrectlyRunning,
  ensureProsodyRunning,
  ensureProsodyNotRunning
}
