// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import * as path from 'path'
import * as fs from 'fs'

async function mustMigrateV14 (options: RegisterServerOptions): Promise<boolean> {
  const logger = options.peertubeHelpers.logger

  const doneFilePath = path.resolve(options.peertubeHelpers.plugin.getDataDirectoryPath(), 'fix-v14-regexp')
  if (fs.existsSync(doneFilePath)) {
    logger.debug('[migratev14] Already migrated.')
    return false
  }

  await fs.promises.writeFile(doneFilePath, '')
  return true
}

export {
  mustMigrateV14
}
