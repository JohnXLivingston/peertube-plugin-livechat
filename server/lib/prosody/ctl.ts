import { getProsodyFilePaths, writeProsodyConfig } from './config'
import * as fs from 'fs'
import * as child_process from 'child_process'

interface ProsodyRunning {
  ok: boolean
  messages: string[]
}

async function prosodyCtl (options: RegisterServerOptions, command: string, failOnError: boolean): Promise<string> {
  const logger = options.peertubeHelpers.logger
  logger.debug('Calling prosodyCtl with command ' + command)

  const filePaths = await getProsodyFilePaths(options)
  if (!/^\w+$/.test(command)) {
    throw new Error(`Invalid prosodyctl command '${command}'`)
  }
  return new Promise((resolve, reject) => {
    let d: string = ''
    let e: string = ''
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
    })
    spawned.stderr.on('data', (data) => {
      options.peertubeHelpers.logger.error(`Spawned command ${command} has errors: ${data as string}`)
      e += data as string
    })
    spawned.on('close', (code) => {
      if (code !== 0 && failOnError) {
        reject(e)
      } else {
        if (e !== '') { d += e }
        resolve(d)
      }
    })
  })
}

async function getProsodyAbout (options: RegisterServerOptions): Promise<string> {
  return prosodyCtl(options, 'about', true)
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

  result.ok = true
  return result
}

async function testProsodyCorrectlyRunning (options: RegisterServerOptions): Promise<ProsodyRunning> {
  const { peertubeHelpers } = options
  peertubeHelpers.logger.info('Checking if Prosody is correctly running')
  const result = await testProsodyRunning(options)
  if (!result.ok) { return result }
  result.ok = false // more tests to come

  // TODO
  peertubeHelpers.logger.error('testProsodyCorrectlyRunning not implemented yet.')
  return result
}

async function ensureProsodyRunning (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers, settingsManager } = options
  const logger = peertubeHelpers.logger
  logger.debug('Calling ensureProsodyRunning')

  logger.debug('Checking if prosody should be active')
  const setting = await settingsManager.getSetting('chat-use-prosody')
  if (!setting) {
    logger.info('Prosody is not activated, we wont launch it')
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
  await writeProsodyConfig(options)

  const filePaths = await getProsodyFilePaths(options)

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
  prosody.on('close', (code) => {
    logger.info(`Prosody process closed all stdio with code ${code ?? 'null'}`)
  })
  prosody.on('exit', (code) => {
    logger.info(`Prosody process exited with code ${code ?? 'null'}`)
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
    try {
      const status = await prosodyCtl(options, 'status', true)
      logger.info(`Prosody status: ${status}`)
      processStarted = true
    } catch (error) {
      logger.warn(`Prosody status: ${error as string}`)
    }
  }
  if (!processStarted) {
    logger.error('It seems that the Prosody process is not up')
  } else {
    logger.info('Prosody is running')
  }
}

async function ensureProsodyNotRunning (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers } = options
  const logger = peertubeHelpers.logger
  logger.info('Checking if Prosody is running, and shutting it down if so')

  // NB: this function is called on plugin unregister, even if prosody is not used
  // so we must avoid creating the working dir now
  const filePaths = await getProsodyFilePaths(options)
  if (!fs.existsSync(filePaths.dir)) {
    logger.info(`The working dir ${filePaths.dir} does not exist, assuming there is no prosody on this server`)
    return
  }

  logger.debug('Calling prosodyctl to stop the process')
  const m = await prosodyCtl(options, 'stop', false)
  logger.info(`ProsodyCtl command returned: ${m}`)
}

export {
  getProsodyAbout,
  testProsodyRunning,
  testProsodyCorrectlyRunning,
  ensureProsodyRunning,
  ensureProsodyNotRunning
}
