import { getProsodyFilePaths, writeProsodyConfig } from './config'
import * as fs from 'fs'
import * as util from 'util'

const exec = util.promisify(require('child_process').exec)

interface ProsodyRunning {
  ok: boolean
  messages: string[]
}

async function testProsodyRunning (options: RegisterServerOptions): Promise<ProsodyRunning> {
  const { peertubeHelpers } = options
  peertubeHelpers.logger.info('Checking if Prosody is running')
  const result: ProsodyRunning = {
    ok: false,
    messages: []
  }

  const filePaths = await getProsodyFilePaths(options)
  try {
    await fs.promises.access(filePaths.pid, fs.constants.R_OK)
  } catch (error) {
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

  const setting = await settingsManager.getSetting('chat-use-prosody')
  if (!setting) {
    logger.info('Prosody is not activated, we wont launch it')
    return
  }

  const r = await testProsodyCorrectlyRunning(options)
  if (r.ok) {
    r.messages.forEach(m => logger.debug(m))
    logger.info('Prosody is already running correctly')
    return
  }
  logger.info('Prosody is not running correctly: ')
  r.messages.forEach(m => logger.info(m))

  // Shutting down...
  await ensureProsodyNotRunning(options)

  // writing the configuration file
  await writeProsodyConfig(options)

  const filePaths = await getProsodyFilePaths(options)

  // launch prosody
  logger.info('Going to launch prosody...')
  await exec('prosody', {
    cwd: filePaths.dir,
    env: {
      ...process.env,
      PROSODY_CONFIG: filePaths.config
    }
  })

  // TODO: listen for kill signal and kill prosody?
}

async function ensureProsodyNotRunning (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers } = options
  peertubeHelpers.logger.info('Checking if Prosody is running, and shutting it down if so')

  // TODO: implement this.
  peertubeHelpers.logger.error('ensureProsodyNotRunning not implemented yet.')
}

export {
  testProsodyRunning,
  testProsodyCorrectlyRunning,
  ensureProsodyRunning,
  ensureProsodyNotRunning
}
