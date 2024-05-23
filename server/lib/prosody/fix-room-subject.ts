// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { ProsodyFilePaths } from './config/paths'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Until plugin verstion 6.2.3, there where a bug in mod_muc_http_defaults
 * that messed up room metadata. This bug is blocking for external XMPP account
 * connections.
 * This functions corrects room metadata if needed.
 * @param options
 * @param filePaths
 */
export async function fixRoomSubject (options: RegisterServerOptions, filePaths: ProsodyFilePaths): Promise<void> {
  const logger = options.peertubeHelpers.logger
  // When this scripts run the first time, it create a file, so that we can know if we need to run it again:
  const doneFilePath = path.resolve(filePaths.dir, 'fix-room-done')
  if (fs.existsSync(doneFilePath)) {
    logger.debug('fixRoomSubject already runned.')
    return
  }

  logger.info('Fixing Prosody room subjects...')

  // Room data are in a folder named something like "room%2evideos%2edomain%2etld".
  // There should only be one. But if you renamed your instance, it could be more than one.
  // Just in case, we will loop on each folder with name beginning with "room%2e".
  const folders = fs.readdirSync(filePaths.data, { withFileTypes: true }).filter(file => {
    return file.isDirectory() && file.name.startsWith('room%2e')
  })
  folders.forEach(folder => {
    // the folder must contain a «config» directory
    const configDir = path.resolve(filePaths.data, folder.name, 'config')
    if (!fs.existsSync(configDir)) { return }
    const roomDataFiles = fs.readdirSync(configDir, { withFileTypes: true }).filter(file => {
      return file.isFile() && file.name.endsWith('.dat')
    })
    roomDataFiles.forEach(file => {
      logger.debug('Checking room ' + file.name + ' subject')
      const filepath = path.resolve(configDir, file.name)
      let content = fs.readFileSync(filepath).toString()
      // To detect wrongly configured files, we just check if there is a "subject_from" and no "subject" key.
      // Indeed, the bug was that mod_muc_http_defaults set subject_from (which should be a jid) to the subject, and
      // did not set any subject.
      // See https://hg.prosody.im/prosody-modules/rev/6d99ddd99694
      if (content.includes('["subject_from"]') && !content.includes('["subject"]')) {
        logger.info('We must fix room ' + file.name + ' by removing subject_from')
        content = content.replace(/^\s*\["subject_from"\]\s*=.*;\s*$/gm, '')
        content = content.replace(/^\s*\["subject_time"\]\s*=.*;\s*$/gm, '')
        fs.writeFileSync(filepath, content)
      }
    })
  })

  fs.writeFileSync(doneFilePath, '')
}
