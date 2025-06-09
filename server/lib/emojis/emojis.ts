// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ChannelEmojis, CustomEmojiDefinition } from '../../../shared/lib/types'
import { RegisterServerOptions } from '@peertube/peertube-types'
import { getBaseRouterRoute } from '../helpers'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { allowedMimeTypes, allowedExtensions, maxEmojisPerChannel, maxSize } from '../../../shared/lib/emojis'
import * as path from 'node:path'
import * as fs from 'node:fs'

let singleton: Emojis | undefined

interface BufferInfos {
  url: string
  buf: Buffer
  filename: string
}

export class Emojis {
  protected options: RegisterServerOptions
  protected channelBasePath: string
  protected channelBaseUri: string
  protected readonly channelCache = new Map<number, boolean>()
  protected readonly commonEmojisCodes: string[]
  protected readonly logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  constructor (options: RegisterServerOptions, commonEmojisCodes: string[]) {
    const logger = options.peertubeHelpers.logger
    this.options = options
    this.commonEmojisCodes = commonEmojisCodes
    this.channelBasePath = path.join(
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

    this.logger = {
      debug: (s) => logger.debug('[Emojis] ' + s),
      info: (s) => logger.info('[Emojis] ' + s),
      warn: (s) => logger.warn('[Emojis] ' + s),
      error: (s) => logger.error('[Emojis] ' + s)
    }
  }

  /**
   * Test if channel has custom emojis.
   * @param channelId channel Id
   */
  public async channelHasCustomEmojis (channelId: number): Promise<boolean> {
    if (this.channelCache.has(channelId)) { return this.channelCache.get(channelId) as boolean }

    const filepath = this.channelCustomEmojisDefinitionPath(channelId)
    const v = await fs.promises.access(filepath, fs.constants.F_OK).then(() => true, () => false)
    this.channelCache.set(channelId, v)
    return v
  }

  /**
   * Gets the public url for the channel emojis definition, if there are custom emojis.
   * @param channelId channel Id
   */
  public async channelCustomEmojisUrl (channelId: number): Promise<string | undefined> {
    if (!await this.channelHasCustomEmojis(channelId)) {
      return undefined
    }
    const route = getBaseRouterRoute(this.options) +
      'emojis/channel/' +
      encodeURIComponent(channelId) +
      '/definition'
    return canonicalizePluginUri(
      this.options,
      route,
      {
        removePluginVersion: true
      }
    )
  }

  /**
   * Get the file path for the channel definition JSON file (does not test if the file exists).
   * @param channelId channel Id
   */
  public channelCustomEmojisDefinitionPath (channelId: number): string {
    if (typeof channelId !== 'number') { throw new Error('Invalid channelId') }
    return path.join(this.channelBasePath, channelId.toString(), 'definition.json')
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
      throw err as Error
    }
    return JSON.parse(content.toString())
  }

  /**
   * Test that the filename is a valid image filename.
   * Valid file name are as `42.png`: an integer, with a valid image extension.
   * @param fileName the filename to test
   */
  public validImageFileName (fileName: string): boolean {
    const m = fileName.match(/^(?:\d+)\.([a-z]+)$/)
    if (!m) {
      this.logger.debug('Filename invalid: ' + fileName)
      return false
    }
    const ext = m[1]
    if (!allowedExtensions.includes(ext)) {
      this.logger.debug('File extension non allowed: ' + ext)
      return false
    }
    return true
  }

  /**
   * Test if short name is valid.
   *
   * @param sn short name
   */
  public validShortName (sn: any): boolean {
    // Important note: do not change this without checking if it can breaks getChannelCustomEmojisRegexp.
    if ((typeof sn !== 'string') || !/^:?[\w-]+:?$/.test(sn)) {
      this.logger.debug('Short name invalid: ' + (typeof sn === 'string' ? sn : '???'))
      return false
    }
    return true
  }

  /**
   * Test that the url is a valid file url for the given channel.
   * @param channelId channel id
   * @param url the url to test
   * @returns true if ok
   */
  public async validFileUrl (channelId: number, url: any): Promise<boolean> {
    if (typeof url !== 'string') {
      this.logger.debug('File url is not a string')
      return false
    }
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      this.logger.debug('Url does not start by http scheme')
      return false
    }
    const fileName = url.split('/').pop() ?? ''
    if (!this.validImageFileName(fileName)) { return false }
    const correctUrl = this.channelBaseUri + channelId.toString() + '/files/' + encodeURIComponent(fileName)
    if (url !== correctUrl) {
      this.logger.debug('Url is not the expected url: ' + url + ' vs ' + correctUrl)
      return false
    }
    // TODO: test if file exists? (if so, only if we dont have any buffer to write)
    return true
  }

  public async validBufferInfos (channelId: number, toBufInfos: BufferInfos): Promise<boolean> {
    if (toBufInfos.buf.length > maxSize) {
      this.logger.debug('File is too big')
      return false
    }
    return true
  }

  public async fileDataURLToBufferInfos (
    channelId: number,
    url: unknown,
    cnt: number
  ): Promise<BufferInfos | undefined> {
    if ((typeof url !== 'string') || !url.startsWith('data:')) {
      return undefined
    }
    const regex = /^data:(\w+\/([a-z]+));base64,/
    const m = url.match(regex)
    if (!m) {
      this.logger.debug('Invalid data url format.')
      return undefined
    }
    const mimetype = m[1]
    if (!allowedMimeTypes.includes(mimetype)) {
      this.logger.debug('Mime type not allowed: ' + mimetype)
    }
    const ext = m[2]
    if (!allowedExtensions.includes(ext)) {
      this.logger.debug('Extension not allowed: ' + ext)
      return undefined
    }
    const buf = Buffer.from(url.replace(regex, ''), 'base64')

    // For the filename, in order to get something unique, we will just use a timestamp + a counter.
    const filename = Date.now().toString() + cnt.toString() + '.' + ext
    const newUrl = this.channelBaseUri + channelId.toString() + '/files/' + encodeURIComponent(filename)
    return {
      buf,
      url: newUrl,
      filename
    }
  }

  /**
   * Returns the filepath for a given channel custom emojis
   * @param channelId channel Id
   * @param fileName the file name
   * @returns the file path
   */
  public channelCustomEmojisFilePath (channelId: number, fileName: string): string {
    if (!this.validImageFileName(fileName)) { throw new Error('Invalid filename') }
    return path.join(
      this.channelCustomEmojisDirPath(channelId),
      fileName
    )
  }

  /**
   * Returns the dir path where to store emojis files relative to a channel.
   * @param channelId channel Id
   * @returns the dir path
   */
  public channelCustomEmojisDirPath (channelId: number): string {
    if (typeof channelId !== 'number') { throw new Error('Invalid channelId') }
    return path.join(
      this.channelBasePath,
      channelId.toString(),
      'files'
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
   * @returns a proper ChannelEmojis, and some BufferInfos for missing files
   * @throws Error if format is not valid
   */
  public async sanitizeChannelDefinition (channelId: number, def: any): Promise<[ChannelEmojis, BufferInfos[]]> {
    if (typeof def !== 'object') {
      throw new Error('Invalid definition, type must be object')
    }
    if (!('customEmojis' in def) || !Array.isArray(def.customEmojis)) {
      throw new Error('Invalid custom emojis entry in definition')
    }
    if (def.customEmojis.length > maxEmojisPerChannel) { // to avoid unlimited image storage
      throw new Error('Too many custom emojis')
    }

    const buffersInfos: BufferInfos[] = []
    let cnt = 0

    const customEmojis: CustomEmojiDefinition[] = []
    let categoryEmojiFound = false
    for (const ce of def.customEmojis) {
      cnt++
      if (typeof ce !== 'object') {
        throw new Error('Invalid custom emoji')
      }
      if (!this.validShortName(ce.sn)) {
        throw new Error('Invalid short name')
      }
      if ((typeof ce.url === 'string') && ce.url.startsWith('data:')) {
        const b = await this.fileDataURLToBufferInfos(channelId, ce.url, cnt)
        if (!b) {
          throw new Error('Invalid data URL')
        }
        if (!await this.validBufferInfos(channelId, b)) {
          throw new Error('Invalid file')
        }
        ce.url = b.url
        buffersInfos.push(b)
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
      customEmojis
    }
    return [result, buffersInfos]
  }

  /**
   * Saves the channel custom emojis definition file.
   * @param channelId the channel Id
   * @param def the custom emojis definition
   * @param bufferInfos buffers to write for missing files.
   */
  public async saveChannelDefinition (
    channelId: number,
    def: ChannelEmojis,
    bufferInfos: BufferInfos[]
  ): Promise<void> {
    const filepath = this.channelCustomEmojisDefinitionPath(channelId)
    await fs.promises.mkdir(path.dirname(filepath), {
      recursive: true
    })
    await fs.promises.writeFile(filepath, JSON.stringify(def))
    this.channelCache.delete(channelId)

    const fileDirPath = this.channelCustomEmojisDirPath(channelId)
    await fs.promises.mkdir(fileDirPath, {
      recursive: true
    })
    for (const b of bufferInfos) {
      const fp = path.join(
        fileDirPath,
        b.filename
      )
      await fs.promises.writeFile(fp, b.buf)
    }

    // Finally, remove deprecated files
    const presentFiles = new Map<string, true>()
    for (const e of def.customEmojis) {
      const fn = e.url.split('/').pop()
      if (fn === undefined) { continue }
      presentFiles.set(fn, true)
    }
    const dirents = await fs.promises.readdir(fileDirPath, { withFileTypes: true })
    for (const dirent of dirents) {
      if (!dirent.isFile()) { continue }
      if (presentFiles.has(dirent.name)) { continue }
      const fp = path.join(fileDirPath, dirent.name)
      this.logger.debug('Deleting obsolete emojis file: ' + fp)
      await fs.promises.unlink(fp)
    }
  }

  /**
   * Deletes channel custom emojis definitions and files.
   * @param channelId channel id
   */
  public async deleteChannelDefinition (channelId: number): Promise<void> {
    const filepath = this.channelCustomEmojisDefinitionPath(channelId)
    const fileDirPath = this.channelCustomEmojisDirPath(channelId)
    this.logger.info('Deleting all channel ' + channelId.toString() + ' emojis...')
    try {
      await fs.promises.rm(fileDirPath, {
        force: true,
        recursive: true
      })
      await fs.promises.rm(path.dirname(filepath), {
        force: true,
        recursive: true
      })
    } catch (err: any) {
      if (!(('code' in err) && err.code === 'ENOENT')) {
        this.logger.error(err as string)
      }
    } finally {
      this.channelCache.delete(channelId)
    }
  }

  /**
   * Returns a string representing a regular expression validating channel custom emojis.
   * This is used for the emoji only mode (test are made on the Prosody server).
   *
   * @param channelId channel id
   */
  public async getChannelCustomEmojisRegexp (channelId: number): Promise<string | undefined> {
    const parts = []

    if (await this.channelHasCustomEmojis(channelId)) {
      const def = await this.channelCustomEmojisDefinition(channelId)
      if (def) {
        parts.push(...def.customEmojis.map(d => d.sn))
      }
    }

    if (parts.length === 0) {
      return undefined
    }

    // Note: validShortName should ensure we won't put special chars.
    return parts.join('|')
  }

  public getCommonEmojisRegexp (): string {
    // We assume that there is no special regexp chars (should only contains unicode emojis)
    return this.commonEmojisCodes.join('|')
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

    // Loading common emojis codes
    const commonEmojisCodes = await _getConverseEmojiCodes(options)

    if (disabled) {
      singleton = undefined
    } else {
      singleton = new Emojis(options, commonEmojisCodes)
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

async function _getConverseEmojiCodes (options: RegisterServerOptions): Promise<string[]> {
  try {
    // build-converse.sh copy the file emoji.json to /dist/converse-emoji.json
    const converseEmojiDefPath = path.join(__dirname, '..', '..', '..', 'converse-emoji.json')
    options.peertubeHelpers.logger.debug('Loading Converse Emojis from file ' + converseEmojiDefPath)

    const converseEmojis: Record<string, any> = JSON.parse(
      (await fs.promises.readFile(converseEmojiDefPath)).toString()
    )

    const r = []
    for (const [key, block] of Object.entries(converseEmojis)) {
      if (key === 'custom') { continue } // These are not used.
      r.push(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ...Object.values(block)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          .map((d: any) => d.cp ? _emojiCpToRegexp(d.cp) : d.sn)
          .filter((sn: string) => sn && sn !== '')
      )
    }
    return r
  } catch (err) {
    options.peertubeHelpers.logger.error(
      'Failed to load Converse Emojis file, emoji only mode will be buggy. ' + (err as string)
    )
    return []
  }
}

/**
 * Converts unicode code points and code pairs to the corresponding Regexp class.
 * See ConverseJS emoji/utils.js for more info.
 * @param {string} unicode
 */
function _emojiCpToRegexp (unicode: string): string {
  if (unicode.includes('-')) {
    const parts = []
    const s = unicode.split('-')

    for (let i = 0; i < s.length; i++) {
      parts.push('\\x{' + s[i] + '}')
    }
    return parts.join('')
  }
  return '\\x{' + unicode + '}'
}
