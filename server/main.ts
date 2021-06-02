import { initSettings } from './lib/settings'
import { initRouters } from './lib/routers/index'
import { ensureProsodyRunning, ensureProsodyNotRunning } from './lib/prosody/ctl'
import decache from 'decache'

// FIXME: Peertube unregister don't have any parameter.
// Using this global variable to fix this, so we can use helpers to unregister.
let OPTIONS: RegisterServerOptions | undefined

async function register (options: RegisterServerOptions): Promise<any> {
  OPTIONS = options

  await initSettings(options)
  await initRouters(options)

  await ensureProsodyRunning(options)
}

async function unregister (): Promise<any> {
  if (OPTIONS) {
    try {
      await ensureProsodyNotRunning(OPTIONS)
    } catch (error) {
      OPTIONS.peertubeHelpers.logger.error('Error when trying to unload Prosody: ' + (error as string))
    }
  }

  const module = __filename
  OPTIONS?.peertubeHelpers.logger.info(`Unloading module ${module}...`)
  // Peertube calls decache(plugin) on register, not unregister.
  // Will do here, to release memory.
  decache(module)
  OPTIONS?.peertubeHelpers.logger.info(`Successfully unloaded the module ${module}`)
  OPTIONS = undefined
}

module.exports = {
  register,
  unregister
}
