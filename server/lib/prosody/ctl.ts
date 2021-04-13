import { writeProsodyConfig } from './config'

/**
 * @param options
 * @returns true if prosody is running with up to date parameters. A string array of messages otherwise.
 */
async function testProsodyCorrectlyRunning (options: RegisterServerOptions): Promise<true | string[]> {
  const { peertubeHelpers } = options
  peertubeHelpers.logger.info('Checking if Prosody is correctly running')

  // TODO
  peertubeHelpers.logger.error('testProsodyCorrectlyRunning not implemented yet.')
  return ['Process not found']
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
  if (r === true) {
    logger.info('Prosody is already running correctly')
    return
  }
  logger.info('Prosody is not running correctly: ' + r.join(', '))
  // Shutting down...
  await ensureProsodyNotRunning(options)

  // writing the configuration file
  await writeProsodyConfig(options)

  // TODO: launch prosody
  logger.error('ensureProsodyRunning not implemented yet.')

  // TODO: listen for kill signal and kill prosody?
}

async function ensureProsodyNotRunning (options: RegisterServerOptions): Promise<void> {
  const { peertubeHelpers } = options
  peertubeHelpers.logger.info('Checking if Prosody is running, and shutting it down if so')

  // TODO: implement this.
  peertubeHelpers.logger.error('ensureProsodyNotRunning not implemented yet.')
}

export {
  testProsodyCorrectlyRunning,
  ensureProsodyRunning,
  ensureProsodyNotRunning
}
