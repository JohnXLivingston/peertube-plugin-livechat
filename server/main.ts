import type { RegisterServerOptions, Video } from '@peertube/peertube-types'
import { migrateSettings } from './lib/migration/settings'
import { initSettings } from './lib/settings'
import { initCustomFields } from './lib/custom-fields'
import { initRouters } from './lib/routers/index'
import { initFederation } from './lib/federation/init'
import { prepareProsody, ensureProsodyRunning, ensureProsodyNotRunning } from './lib/prosody/ctl'
import { unloadDebugMode } from './lib/debug'
import decache from 'decache'
import { CustomTag } from '@peertube/feed/lib/typings'
import { URL } from 'url'

// FIXME: Peertube unregister don't have any parameter.
// Using this global variable to fix this, so we can use helpers to unregister.
let OPTIONS: RegisterServerOptions | undefined

async function register (options: RegisterServerOptions): Promise<any> {
  OPTIONS = options

  // This is a trick to check that peertube is at least in version 3.2.0
  if (!options.peertubeHelpers.plugin) {
    throw new Error('Your peertube version is not correct. This plugin is not compatible with Peertube < 3.2.0.')
  }

  await migrateSettings(options)

  await initSettings(options)
  await initCustomFields(options)
  await initRouters(options)
  await initFederation(options)

  options.registerHook({
    // @ts-expect-error Type doesn't exist for peertube 5.1 yet
    target: 'filter:feed.podcast.video.create-custom-tags.result',
    handler: (result: CustomTag[], { video, liveItem }: { video: Video, liveItem: boolean }) => {
      if (!liveItem) {
        return result
      }

      const webserverUrl = options.peertubeHelpers.config.getWebserverUrl()
      const hostname = (new URL(webserverUrl)).hostname
      const embedUrl = `${webserverUrl}/plugins/livechat/router/webchat/room/${encodeURIComponent(video.uuid)}`
      const xmppRoom = `room.${hostname}`

      return result.concat([
        {
          name: 'podcast:chat',
          attributes: {
            server: hostname,
            protocol: 'xmpp',
            space: `${video.uuid}@${xmppRoom}`,
            embedUrl: embedUrl
          }
        }
      ])
    }
  })

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
