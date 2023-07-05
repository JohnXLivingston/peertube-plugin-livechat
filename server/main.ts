import type { RegisterServerOptions } from '@peertube/peertube-types'
import { migrateSettings } from './lib/migration/settings'
import { initSettings } from './lib/settings'
import { initCustomFields } from './lib/custom-fields'
import { initRouters } from './lib/routers/index'
import { initFederation } from './lib/federation/init'
import { initRSS } from './lib/rss/init'
import { prepareProsody, ensureProsodyRunning, ensureProsodyNotRunning } from './lib/prosody/ctl'
import { unloadDebugMode } from './lib/debug'
import { loadLoc } from './lib/loc'
import decache from 'decache'

// FIXME: Peertube unregister don't have any parameter.
// Using this global variable to fix this, so we can use helpers to unregister.
let OPTIONS: RegisterServerOptions | undefined

async function register (options: RegisterServerOptions): Promise<any> {
  OPTIONS = options

  // This is a trick to check that peertube is at least in version 3.2.0
  if (!options.peertubeHelpers.plugin) {
    throw new Error('Your peertube version is not correct. This plugin is not compatible with Peertube < 3.2.0.')
  }

  // First: load languages files, so we can localize strings.
  await loadLoc()

  await migrateSettings(options)

  await initSettings(options)
  await initCustomFields(options)
  await initRouters(options)
  await initFederation(options)
  await initRSS(options)

  try {
    await prepareProsody(options)
    await ensureProsodyRunning(options)
  } catch (error) {
    options.peertubeHelpers.logger.error('Error when launching Prosody: ' + (error as string))
  }
}

async function unregister (): Promise<any> {
  if (OPTIONS) {
    try {
      await ensureProsodyNotRunning(OPTIONS)
    } catch (error) {
      OPTIONS.peertubeHelpers.logger.error('Error when trying to unload Prosody: ' + (error as string))
    }
  }

  unloadDebugMode()

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
