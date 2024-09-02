// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { pluginShortName } from '../helpers'

async function migrateSettings (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  logger.info('Checking if there is a migration script to launch...')
  // 2022-10-10: as we removed the «chat-type» settings, there is no migration needed for now.
  // 2024-09-02: concord theme was removed from ConverseJS, must change if used.
  await _migrateConverseTheme(options)
}

async function _migrateConverseTheme (options: RegisterServerOptions): Promise<void> {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger
  // NB: we cant use safely settingsManager.getSetting, because settings are not registered yet.
  logger.info('Checking if we need to migrate converse-theme')
  if (!/^[-a-z]+$/.test(pluginShortName)) {
    // to prevent sql injection... be sure there is no special char here.
    throw new Error(`Wrong pluginShortName '${pluginShortName}'`)
  }
  const [results] = await peertubeHelpers.database.query(
    'SELECT "settings" FROM "plugin"' +
    ' WHERE "plugin"."name" = :pluginShortName',
    {
      replacements: {
        pluginShortName
      }
    }
  )
  if (!Array.isArray(results)) {
    throw new Error('_migrateConverseTheme: query result is not an array.')
  }
  if (results.length === 0) {
    logger.error('Plugin not found in database')
    return
  }
  if (results.length > 1) {
    logger.error('Multiple lines for plugin in database, dont know which one to migrate... Aborting.')
    return
  }
  const settings = results[0].settings
  if (!settings) {
    logger.info('Plugin settings are empty in database, no migration needed.')
    return
  }
  if (typeof settings !== 'object') {
    logger.error('Plugin settings in database seems to be invalid json')
    return
  }
  if (!('converse-theme' in settings)) {
    logger.debug('The setting converse-theme is not here, no need to migrate.')
    return
  }
  if (settings['converse-theme'] !== 'concord') {
    logger.debug('The setting converse-theme is not set to concord, no need to migrate.')
    return
  }

  logger.info('The setting converse-theme is set to concord, we must replace by peertube..')
  await peertubeHelpers.database.query(
    'UPDATE "plugin" ' +
    ' SET "settings" = "settings" || :value ' +
    ' WHERE "name" = :pluginShortName',
    {
      replacements: {
        pluginShortName,
        value: JSON.stringify({
          'converse-theme': 'peertube'
        })
      }
    }
  )
}

export {
  migrateSettings
}
