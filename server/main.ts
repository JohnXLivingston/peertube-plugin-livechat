import { initSettings } from './lib/settings'
import { initRouters } from './lib/routers'
import type { Logger } from 'winston'

const decache = require('decache')
let logger: Logger | undefined

async function register ({
  registerSetting,
  settingsManager,
  getRouter,
  peertubeHelpers
}: RegisterServerOptions): Promise<any> {
  logger = peertubeHelpers.logger

  await initSettings({ registerSetting })
  await initRouters({
    settingsManager,
    getRouter,
    peertubeHelpers
  })
}

async function unregister (): Promise<any> {
  const module = __filename
  logger?.info(`Unloading module ${module}...`)
  decache(module)
  logger?.info(`Successfully unloaded the module ${module}`)
}

module.exports = {
  register,
  unregister
}
