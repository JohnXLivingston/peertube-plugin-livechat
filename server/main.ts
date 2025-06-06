// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { migrateSettings } from './lib/migration/settings'
import { initSettings } from './lib/settings'
import { initCustomFields } from './lib/custom-fields'
import { initRouters } from './lib/routers/index'
import { initFederation } from './lib/federation/init'
import { initChannelConfiguration } from './lib/configuration/channel/init'
import { initRSS } from './lib/rss/init'
import { prepareProsody, ensureProsodyRunning, ensureProsodyNotRunning } from './lib/prosody/ctl'
import { unloadDebugMode } from './lib/debug'
import { loadLoc } from './lib/loc'
import { RoomChannel } from './lib/room-channel'
import { BotConfiguration } from './lib/configuration/bot'
import { BotsCtl } from './lib/bots/ctl'
import { ExternalAuthOIDC } from './lib/external-auth/oidc'
import { migrateMUCAffiliations } from './lib/prosody/migration/migrateV10'
import { updateProsodyChannelEmojisRegex } from './lib/prosody/migration/migrateV12'
import { updateForbidSpecialCharsHandler } from './lib/prosody/migration/migrateV13'
import { Emojis } from './lib/emojis'
import { LivechatProsodyAuth } from './lib/prosody/auth'
import decache from 'decache'

// FIXME: Peertube unregister don't have any parameter.
// Using this global variable to fix this, so we can use helpers to unregister.
let OPTIONS: RegisterServerOptions | undefined

async function register (options: RegisterServerOptions): Promise<any> {
  OPTIONS = options
  const logger = options.peertubeHelpers.logger

  // This is a trick to check that peertube is at least in version 3.2.0
  if (!options.peertubeHelpers.plugin) {
    throw new Error('Your peertube version is not correct. This plugin is not compatible with Peertube < 3.2.0.')
  }

  // First: load languages files, so we can localize strings.
  await loadLoc()

  try {
    // livechat v13 migration:
    // we must change the config for forbidden special chars. We must do this before BotConfiguration.initSingleton.
    await updateForbidSpecialCharsHandler(options)
  } catch (err: any) {
    logger.error(err)
  }

  // Then load the BotConfiguration singleton
  await BotConfiguration.initSingleton(options)
  // Then load the RoomChannel singleton
  const roomChannelSingleton = await RoomChannel.initSingleton(options)
  // roomChannelNeedsDataInit: if true, means that the data file does not exist (or is invalid), so we must initiate it
  const roomChannelNeedsDataInit = !await roomChannelSingleton.readData()

  // BotsCtl.initSingleton() will force reload the bots conf files, so must be done before generating Prosody Conf.
  await BotsCtl.initSingleton(options)

  await migrateSettings(options)

  await initSettings(options)

  await Emojis.initSingleton(options) // after settings, before routes
  await LivechatProsodyAuth.initSingleton(options) // after settings, before routes

  await initCustomFields(options)
  await initRouters(options)
  await initFederation(options)
  await initChannelConfiguration(options)
  await initRSS(options)

  try {
    await prepareProsody(options)
    await ensureProsodyRunning(options)

    let preBotPromise: Promise<void>
    if (roomChannelNeedsDataInit) {
      logger.info('The RoomChannel singleton has not found any data, we must rebuild')
      // no need to wait here, can be done without await.
      preBotPromise = roomChannelSingleton.rebuildData().then(
        () => { logger.info('RoomChannel singleton rebuild done') },
        (reason) => { logger.error('RoomChannel singleton rebuild failed: ' + (reason as string)) }
      )
    } else {
      preBotPromise = Promise.resolve()
    }

    // Don't need to wait for the bot to start.
    preBotPromise.then(
      async () => {
        await BotsCtl.singleton().start()
      },
      () => {}
    )

    // livechat v10.0.0: we must migrate MUC affiliations (but we don't have to wait)
    // we do this after the preBotPromise, just to avoid doing both at the same time.
    preBotPromise.then(() => {
      const p = migrateMUCAffiliations(options).then(
        () => {},
        (err) => {
          logger.error(err)
        }
      )

      // livechat v11.1: we must send channel emojis regexp to Prosody rooms
      p.finally(
        () => {
          updateProsodyChannelEmojisRegex(options).then(
            () => {},
            (err: any) => {
              logger.error(err)
            }
          )
        }
      ).catch(() => {})
    }, () => {})
  } catch (error) {
    options.peertubeHelpers.logger.error('Error when launching Prosody: ' + (error as string))
  }
}

async function unregister (): Promise<any> {
  try {
    await BotsCtl.destroySingleton()
  } catch (_error) {} // BotsCtl will log errors.

  if (OPTIONS) {
    try {
      await ensureProsodyNotRunning(OPTIONS)
    } catch (error) {
      OPTIONS.peertubeHelpers.logger.error('Error when trying to unload Prosody: ' + (error as string))
    }
  }

  unloadDebugMode()

  await RoomChannel.destroySingleton()
  await BotConfiguration.destroySingleton()
  await ExternalAuthOIDC.destroySingletons()
  await Emojis.destroySingleton()
  await LivechatProsodyAuth.destroySingleton()

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
