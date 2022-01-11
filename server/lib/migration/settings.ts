import type { RegisterServerOptions } from '@peertube/peertube-types'
import { pluginShortName } from '../helpers'
import type { ChatType } from '../../../shared/lib/types'

async function _migrateChatTypeSetting (options: RegisterServerOptions): Promise<void> {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger
  // Previous to plugin v3.0.0, there was multiple checkbox and input-text for settings the plugin mode.
  // With Peertube v2.3.0, we can replace all these settings with a single select.
  // This function migrates old values if needed.
  // NB: we cant use safely settingsManager.getSetting, because settings are not registered yet.
  logger.info('Checking if we need to migrate chat-type')
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
    throw new Error('_migrateChatTypeSetting: query result is not an array.')
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
  if ('chat-type' in settings) {
    logger.info('The setting chat-type is already here, no need to migrate.')
    return
  }

  logger.info('The setting chat-type is not here, checking if we have to migrate from previous settings...')
  let chatType: ChatType | undefined
  if (settings['chat-use-prosody'] === true) {
    chatType = 'builtin-prosody'
  } else if (settings['chat-use-builtin'] === true) {
    chatType = 'builtin-converse'
  } else if (((settings['chat-uri'] || '') as string) !== '') {
    chatType = 'external-uri'
  } else {
    logger.info('It seems there was no previous active chat configuration.')
    return
  }

  logger.info(`We have to set chat-type to value '${chatType}'.`)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await peertubeHelpers.database.query(
    'UPDATE "plugin" ' +
    ' SET "settings" = "settings" || :value ' +
    ' WHERE "name" = :pluginShortName',
    {
      replacements: {
        pluginShortName,
        value: JSON.stringify({
          'chat-type': chatType
        })
      }
    }
  )
}

async function migrateSettings (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  logger.info('Checking if there is a migration script to launch...')
  await _migrateChatTypeSetting(options)
}

export {
  migrateSettings
}
