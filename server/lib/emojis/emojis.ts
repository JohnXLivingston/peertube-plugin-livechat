// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChannelEmojis, CustomEmojiDefinition } from '../../../shared/lib/types'
import { RegisterServerOptions } from '@peertube/peertube-types'
import { getBaseRouterRoute } from '../helpers'
import { canonicalizePluginUri } from '../uri/canonicalize'
import * as path from 'node:path'
import * as fs from 'node:fs'

let singleton: Emojis | undefined

export class Emojis {
  protected options: RegisterServerOptions
  protected channelBasePath: string
  protected channelBaseUri: string

  constructor (options: RegisterServerOptions) {
    this.options = options
    this.channelBasePath = path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'emojis',
      'channel'
    )
    const baseRouterRoute = getBaseRouterRoute(options)
    this.channelBaseUri = canonicalizePluginUri(
      options,
      baseRouterRoute + 'emojis/channel/',
      {
        removePluginVersion: true
      }
    )
  }

  /**
   * Test if channel has custom emojis.
   * @param channelId channel Id
   */
  public async channelHasCustomEmojis (channelId: number): Promise<boolean> {
    const filepath = this.channelCustomEmojisDefinitionPath(channelId)
    return fs.promises.access(filepath, fs.constants.F_OK).then(() => true, () => false)
  }

  /**
   * Get the file path for the channel definition JSON file (does not test if the file exists).
   * @param channelId channel Id
   */
  public channelCustomEmojisDefinitionPath (channelId: number): string {
    if (typeof channelId !== 'number') { throw new Error('Invalid channelId') }
    return path.resolve(this.channelBasePath, channelId.toString(), 'definition.json')
  }

  /**
   * Get the current definition for the channel emojis.
   * @param channelId the channel id
   * @returns the custom emojis definition
   */
  public async channelCustomEmojisDefinition (channelId: number): Promise<ChannelEmojis | undefined> {
    const filepath = this.channelCustomEmojisDefinitionPath(channelId)
    let content
    try {
      content = await fs.promises.readFile(filepath)
    } catch (err: any) {
      if (('code' in err) && err.code === 'ENOENT') {
        // File does not exist, this is normal.
        return undefined
      }
      throw err
    }
    return JSON.parse(content.toString())
  }

  /**
   * Test that the filename is a valid image filename.
   * Valid file name are as `42.png`: an integer, with a valid image extension.
   * @param fileName the filename to test
   */
  public validImageFileName (fileName: string): boolean {
    return /^(\d+)\.(png|jpg|gif)$/.test(fileName)
  }

  /**
   * Test if short name is valid.
   * @param sn short name
   */
  public validShortName (sn: any): boolean {
    return (typeof sn === 'string') && /^:[\w-]+:$/.test(sn)
  }

  /**
   * Test that the url is a valid file url for the given channel.
   * @param channelId channel id
   * @param url the url to test
   * @returns true if ok
   */
  public async validFileUrl (channelId: number, url: any): Promise<boolean> {
    if (typeof url !== 'string') { return false }
    const fileName = url.split('/').pop() ?? ''
    if (!this.validImageFileName(fileName)) { return false }
    const correctUrl = this.channelBaseUri + channelId.toString() + '/files/' + fileName
    if (url !== correctUrl) {
      return false
    }
    // TODO: test if file exists?
    return true
  }

  /**
   * Returns the filepath for a given channel custom emojis
   * @param channelId channel Id
   * @param fileName the file name
   * @returns the file path
   */
  public channelCustomEmojisFilePath (channelId: number, fileName: string): string {
    if (typeof channelId !== 'number') { throw new Error('Invalid channelId') }
    if (!this.validImageFileName(fileName)) { throw new Error('Invalid filename') }
    return path.resolve(
      this.channelBasePath,
      channelId.toString(),
      'files',
      fileName
    )
  }

  public emptyChannelDefinition (): ChannelEmojis {
    return {
      customEmojis: []
    }
  }

  /**
   * Sanitize the definition.
   * Throw an error if format is not valid.
   * @param channelId channel id
   * @param def the definition
   * @returns a proper ChannelEmojis
   * @throws Error if format is not valid
   */
  public async sanitizeChannelDefinition (channelId: number, def: any): Promise<ChannelEmojis> {
    if (typeof def !== 'object') {
      throw new Error('Invalid definition, type must be object')
    }
    if (!('customEmojis' in def) || !Array.isArray(def.customEmojis)) {
      throw new Error('Invalid custom emojis entry in definition')
    }
    if (def.customEmojis.length > 100) { // to avoid unlimited image storage
      throw new Error('Too many custom emojis')
    }

    const customEmojis: CustomEmojiDefinition[] = []
    let categoryEmojiFound = false
    for (const ce of def.customEmojis) {
      if (typeof ce !== 'object') {
        throw new Error('Invalid custom emoji')
      }
      if (!this.validShortName(ce.sn)) {
        throw new Error('Invalid short name')
      }
      if (!await this.validFileUrl(channelId, ce.url)) {
        throw new Error('Invalid file url')
      }

      const sanitized: CustomEmojiDefinition = {
        sn: ce.sn,
        url: ce.url
      }

      if (ce.isCategoryEmoji === true && !categoryEmojiFound) {
        sanitized.isCategoryEmoji = true
        categoryEmojiFound = true
      }

      customEmojis.push(sanitized)
    }

    const result: ChannelEmojis = {
      customEmojis: customEmojis
    }
    return result
  }

  /**
   * Saves the channel custom emojis definition file.
   * @param channelId the channel Id
   * @param def the custom emojis definition
   */
  public async saveChannelDefinition (channelId: number, def: ChannelEmojis): Promise<void> {
    const filepath = this.channelCustomEmojisDefinitionPath(channelId)
    await fs.promises.mkdir(path.dirname(filepath), {
      recursive: true
    })
    await fs.promises.writeFile(filepath, JSON.stringify(def))
  }

  /**
   * Returns the singleton, of thrown an exception if it is not initialized yet.
   * Please note that this singleton won't exist if feature is disabled.
   * @returns the singleton
   */
  public static singleton (): Emojis {
    if (!singleton) {
      throw new Error('Emojis singleton not initialized yet')
    }
    return singleton
  }

  /**
   * Returns the singleton, or undefined if not initiliazed yet.
   * Please note that this singleton won't exist if feature is disabled.
   */
  public static singletonSafe (): Emojis | undefined {
    return singleton
  }

  /**
   * Creates the singleton, unless the feature is disabled.
   * @param options Peertube server options
   */
  public static async initSingleton (options: RegisterServerOptions): Promise<void> {
    const disabled = await options.settingsManager.getSetting('disable-channel-configuration')
    if (disabled) {
      singleton = undefined
    } else {
      singleton = new Emojis(options)
    }
  }

  /**
   * frees the singleton
   */
  public static async destroySingleton (): Promise<void> {
    if (!singleton) { return }
    singleton = undefined
  }
}
