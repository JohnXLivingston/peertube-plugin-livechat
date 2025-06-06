// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Livechat v13.0.0: now using xmppjs-chat-bot 0.6.0, which replaced RegExp by RE2.
 *  we must change the forbidspecialchar regexp configuration, to be compatible.
 *
 * This script will only be launched one time.
 */
async function updateForbidSpecialCharsHandler (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger

  // First, detect if we already run this script.
  const doneFilePath = path.resolve(options.peertubeHelpers.plugin.getDataDirectoryPath(), 'fix-v13-forbidspecialchars')
  if (fs.existsSync(doneFilePath)) {
    logger.debug('[migratev13_ForbidSpecialChars] Special Chars Regex already updated.')
    return
  }

  logger.info('[migratev13_ForbidSpecialChars] Updating Special Chars Regex')

  const confDir = path.resolve(
    options.peertubeHelpers.plugin.getDataDirectoryPath(),
    'bot',
  )
  // In this directory, we should find a subdir named as the mucDomain.
  // To be sure to migrate everything, including in case of instance name change,
  // we will loop on this dir content.
  let directories: fs.Dirent[]
  try {
    directories = await fs.promises.readdir(confDir, { withFileTypes: true })
  } catch (_err) {
    logger.info('[migratev13_ForbidSpecialChars] can\'t read config dir, probably a fresh install.')
    directories = []
  }

  for (const dirent of directories) {
    if (!dirent.isDirectory()) { continue }

    const dir = path.resolve(confDir, dirent.name, 'rooms')
    logger.debug('[migratev13_ForbidSpecialChars] Checking directory ' + dir)

    let files: string[]
    try {
      files = await fs.promises.readdir(dir)
    } catch (_err) {
      logger.info('[migratev13_ForbidSpecialChars] can\'t read dir ' + dir)
      files = []
    }

    logger.debug('[migratev13_ForbidSpecialChars] Found ' + files.length.toString() + ' files.')

    for (const file of files) {
      if (!file.endsWith('.json')) { continue }

      const filePath = path.join(dir, file)
      try {
        logger.debug('[migratev13_ForbidSpecialChars] check file ' + filePath)

        const content = (await fs.promises.readFile(filePath, {
          encoding: 'utf-8'
        })).toString()

        const config = JSON.parse(content)
        const handlers = config?.handlers ?? []
        let modified = false
        for (const handler of handlers) {
          if (handler?.type === 'moderate' && handler?.id === 'forbid_special_chars') {
            for (const r of handler.options?.rules ?? []) {
              if (r.name === 'forbid_special_chars') {
                if (r.regexp_engine !== 'regexp') {
                  r.regexp_engine = 'regexp'
                  modified = true
                }
              }
            }
          }
        }
        if (modified) {
          logger.info('[migratev13_ForbidSpecialChars] Must fix file ' + filePath)
          await fs.promises.writeFile(filePath, JSON.stringify(config), {
            encoding: 'utf-8'
          })
        }
      } catch (err) {
        logger.error(
          '[migratev13_ForbidSpecialChars] Failed to fix file ' +
          filePath + ', skipping. Error: ' + (err as string)
        )
        continue
      }
    }
  }

  await fs.promises.writeFile(doneFilePath, '')
}

export {
  updateForbidSpecialCharsHandler
}
