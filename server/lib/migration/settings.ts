// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'

async function migrateSettings (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  logger.info('Checking if there is a migration script to launch...')
  // 2022-10-10: as we removed the «chat-type» settings, there is no migration needed for now.
}

export {
  migrateSettings
}
