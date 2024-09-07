// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { AdminFirewallConfiguration } from '../../../shared/lib/types'
import * as path from 'path'
import * as fs from 'fs'
import {
  firewallNameRegexp, maxFirewallFileSize, maxFirewallFiles, maxFirewallNameLength
} from '../../../shared/lib/admin-firewall'

/**
 * Indicates if the firewall configuration can be changed in the Peertube web interface.
 * Sys admins can disable this feature by creating a special file in the plugin folder.
 * @param options Peertube server options
 */
export async function canEditFirewallConfig (options: RegisterServerOptions): Promise<boolean> {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger
  if (!peertubeHelpers.plugin) {
    return false
  }

  const filepath = path.resolve(peertubeHelpers.plugin.getDataDirectoryPath(), 'disable_mod_firewall_editing')
  try {
    // Testing if file exist by reading it.
    await fs.promises.readFile(filepath)
    return false
  } catch (err: any) {
    if (('code' in err) && err.code === 'ENOENT') {
      // File does not exist
      return true
    }
    logger.error(err)
    // Here it is safer to disable the editing...
    return false
  }
}

/**
 * Returns the list of mod_firewall configuration files.
 * @param options: Peertube server options.
 * @param dir the path to the directory containing these configuration files.
 * @param includeDisabled if true, disabled files are included in the results.
 */
export async function listModFirewallFiles (
  options: RegisterServerOptions,
  dir: string,
  includeDisabled?: boolean
): Promise<string[]> {
  try {
    const files = (await fs.promises.readdir(dir, { withFileTypes: true })).filter(file => {
      if (!file.isFile()) {
        return false
      }

      if (
        file.name.endsWith('.pfw') &&
        // we only load valid names, to avoid having files that could not be edited from frontend
        firewallNameRegexp.test(file.name.substring(0, file.name.length - 4))
      ) {
        return true
      }

      if (
        includeDisabled &&
        file.name.endsWith('.pfw.disabled') &&
        firewallNameRegexp.test(file.name.substring(0, file.name.length - 13))
      ) {
        return true
      }

      return false
    })

    return files.map(f => path.join(dir, f.name)).sort()
  } catch (_err) {
    // should be that the directory does not exists
    return []
  }
}

/**
 * Returns the modFirewall configuration.
 * @param options Peertube server options
 * @param dir the path to the directory containing these configuration files.
 * @throws will throw an error if it can't read any of the configuration file.
 */
export async function getModFirewallConfig (
  options: RegisterServerOptions,
  dir: string
): Promise<AdminFirewallConfiguration> {
  const filePaths = await listModFirewallFiles(options, dir, true)

  const files = []
  for (const filePath of filePaths) {
    const content = (await fs.promises.readFile(filePath)).toString()
    const name = path.basename(filePath).replace(/\.pfw(\.disabled)?$/, '')
    files.push({
      name,
      content,
      enabled: !filePath.endsWith('.disabled')
    })
  }

  const enabled = (await options.settingsManager.getSetting('prosody-firewall-enabled')) === true

  return {
    enabled,
    files
  }
}

/**
 * Sanitize any data received from the frontend, to store in modFirewall configuration.
 * Throws an exception if data is invalid.
 * @param options Peertube server options
 * @param data Incoming data
 */
export async function sanitizeModFirewallConfig (
  options: RegisterServerOptions,
  data: any
): Promise<AdminFirewallConfiguration> {
  if (typeof data !== 'object') {
    throw new Error('Invalid data type')
  }
  if (!Array.isArray(data.files)) {
    throw new Error('Invalid data.files')
  }

  if (data.files.length > maxFirewallFiles) {
    throw new Error('Too many files')
  }

  const files: AdminFirewallConfiguration['files'] = []
  for (const entry of data.files) {
    if (typeof entry !== 'object') {
      throw new Error('Invalid data in data.files')
    }
    if (typeof entry.enabled !== 'boolean') {
      throw new Error('Invalid data in data.files (enabled)')
    }
    if (typeof entry.name !== 'string') {
      throw new Error('Invalid data in data.files (name)')
    }
    if (typeof entry.content !== 'string') {
      throw new Error('Invalid data in data.files (content)')
    }

    if (entry.name.length > maxFirewallNameLength || !firewallNameRegexp.test(entry.name as string)) {
      throw new Error('Invalid name in data.files')
    }
    if (entry.content.length > maxFirewallFileSize) {
      throw new Error('File content too big in data.files')
    }

    files.push({
      enabled: entry.enabled,
      name: entry.name,
      content: entry.content
    })
  }

  const result = {
    enabled: !!data.enabled, // this is not saved, so no need to check type.
    files
  }

  return result
}

/**
 * Saves the modFirewall configuration.
 * FIXME: currently, if the save fails on one file, remaining files will not be saved. So there is a risk of data loss.
 * @param options Peertube server options
 * @param dir the path to the directory containing these configuration files.
 * @param config the configuration to save
 * @throws will throw an error if it can't read any of the configuration file.
 */
export async function saveModFirewallConfig (
  options: RegisterServerOptions,
  dir: string,
  config: AdminFirewallConfiguration
): Promise<void> {
  const logger = options.peertubeHelpers.logger

  const previousFiles = await listModFirewallFiles(options, dir, true)

  logger.debug('[mod-firewall-lib] Creating the ' + dir + ' directory.')
  await fs.promises.mkdir(dir, { recursive: true })

  const seen = new Map<string, true>()
  for (const f of config.files) {
    const filePath = path.join(
      dir,
      f.name + '.pfw' + (f.enabled ? '' : '.disabled')
    )
    logger.info('[mod-firewall-lib] Saving ' + filePath)
    await fs.promises.writeFile(filePath, f.content)
    seen.set(filePath, true)
  }

  // Removing deprecated files:
  for (const p of previousFiles) {
    if (seen.has(p)) { continue }
    logger.info('[mod-firewall-lib] Deleting deprecated file ' + p)
    await fs.promises.rm(p)
  }
}
