import { initSettings } from './lib/settings'
import { initRouters } from './lib/routers/index'
import type { Logger } from 'winston'
import decache from 'decache'

let logger: Logger | undefined

async function register (options: RegisterServerOptions): Promise<any> {
  const { peertubeHelpers } = options

  logger = peertubeHelpers.logger

  await initSettings(options)
  await initRouters(options)
}

async function unregister (): Promise<any> {
  const module = __filename
  logger?.info(`Unloading module ${module}...`)
  // In peertube <= 3.1.0 sub modules are not removed from require.cache
  decache(module)
  logger?.info(`Successfully unloaded the module ${module}`)
  logger = undefined
}

module.exports = {
  register,
  unregister
}
