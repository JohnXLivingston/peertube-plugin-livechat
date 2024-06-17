// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions, MUserDefault } from '@peertube/peertube-types'
import type { ProsodyAuthentInfos, LivechatToken } from '../../../shared/lib/types'
import { getProsodyDomain } from './config/domain'
import { getUserNickname } from '../helpers'
import { createCipheriv, createDecipheriv, randomBytes, Encoding, randomFillSync } from 'node:crypto'
import * as path from 'node:path'
import * as fs from 'node:fs'

interface Password {
  password: string
  validity: number
}

type SavedLivechatToken = Omit<LivechatToken, 'jid' | 'nickname' | 'password'> & {
  encryptedPassword: string
}

interface SavedUserData {
  userId: number
  tokens: SavedLivechatToken[]
}

interface LivechatTokenInfos {
  userId: number
  tokens: LivechatToken[]
}

async function getRandomBytes (size: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    randomBytes(size, (err, buf) => {
      if (err) return reject(err)

      return resolve(buf)
    })
  })
}

function generatePassword (length: number): string {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return Array.from(randomFillSync(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('')
}

let singleton: LivechatProsodyAuth | undefined

/**
 * This class handles user/passwords for Peertube users to the Prosody service.
 *
 * There are 2 types of authentication:
 * * temporary passwords, generated when the user connects with the Peertube authentication
 * * livechat-token, that are used to generate long-term token to connect to the chat
 *
 * The livechat tokens password are encrypted in data files.
 * The associated secret key is in the database.
 * This is to ensure an additional security level: if an attacker has access to file system, he also must have access
 * to DB to get the secret key and decrypt passwords.
 */
export class LivechatProsodyAuth {
  private readonly _options: RegisterServerOptions
  private readonly _prosodyDomain: string
  private _userTokensEnabled: boolean
  private readonly _tokensPath: string
  private readonly _passwords: Map<string, Password> = new Map()
  private readonly _tokensInfoByJID: Map<string, LivechatTokenInfos | undefined> = new Map()
  private readonly _secretKey: string
  protected readonly _logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  private readonly _encryptionOptions = {
    algorithm: 'aes256' as string,
    inputEncoding: 'utf8' as Encoding,
    outputEncoding: 'hex' as Encoding
  }

  constructor (options: RegisterServerOptions, prosodyDomain: string, userTokensEnabled: boolean, secretKey: string) {
    this._options = options
    this._prosodyDomain = prosodyDomain
    this._userTokensEnabled = userTokensEnabled
    this._secretKey = secretKey
    this._tokensPath = path.join(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'tokens'
    )
    this._logger = {
      debug: (s) => options.peertubeHelpers.logger.debug('[LivechatProsodyAuth] ' + s),
      info: (s) => options.peertubeHelpers.logger.info('[LivechatProsodyAuth] ' + s),
      warn: (s) => options.peertubeHelpers.logger.warn('[LivechatProsodyAuth] ' + s),
      error: (s) => options.peertubeHelpers.logger.error('[LivechatProsodyAuth] ' + s)
    }
  }

  /**
   * A user can get a password thanks to a call to getUserTempPassword (see api user/auth).
   *
   * Then, we can test that the user exists with userRegistered, and test password with checkUserPassword.
   *
   * Passwords are randomly generated.
   *
   * These password are stored internally in a global variable, and are valid for 24h.
   * Each call to getUserTempPassword extends the validity by 24h.
   *
   * Prosody will use an API call to api/user/check_password to check the password transmitted by the frontend.
   * @param user username
   * @returns the password to use to connect to Prosody
   */
  public async getUserTempPassword (user: MUserDefault): Promise<ProsodyAuthentInfos | undefined> {
    const normalizedUsername = this._normalizeUsername(user)
    if (!normalizedUsername) {
      return undefined
    }

    const password = this._getOrSetTempPassword(normalizedUsername)
    const nickname: string | undefined = await getUserNickname(this._options, user)
    return {
      jid: normalizedUsername + '@' + this._prosodyDomain,
      password: password,
      nickname: nickname,
      type: 'peertube'
    }
  }

  public async userRegistered (normalizedUsername: string): Promise<boolean> {
    const entry = this._getAndClean(normalizedUsername)
    if (entry) {
      return true
    }
    if (this._userTokensEnabled) {
      try {
        const tokensInfo = await this._getTokensInfoForJID(normalizedUsername + '@' + this._prosodyDomain)
        if (!tokensInfo || !tokensInfo.tokens.length) {
          return false
        }
        // Checking that the user is valid:
        if (await this._userIdValid(tokensInfo.userId)) {
          return true
        }
      } catch (err) {
        this._logger.error(err as string)
        return false
      }
    }
    return false
  }

  public async checkUserPassword (normalizedUsername: string, password: string): Promise<boolean> {
    const entry = this._getAndClean(normalizedUsername)
    if (entry && entry.password === password) {
      return true
    }
    if (this._userTokensEnabled) {
      try {
        const tokensInfo = await this._getTokensInfoForJID(normalizedUsername + '@' + this._prosodyDomain)
        if (!tokensInfo || !tokensInfo.tokens.length) {
          return false
        }
        // Checking that the user is valid:
        if (!await this._userIdValid(tokensInfo.userId)) {
          return false
        }

        // Is the password in tokens?
        if (tokensInfo.tokens.find((t) => t.password === password)) {
          return true
        }
      } catch (err) {
        this._logger.error(err as string)
        return false
      }
    }
    return false
  }

  /**
   * Returns the long-term livechat tokens for the given user.
   * Returns undefined if the user is invalid.
   * @param user the user
   */
  public async getUserTokens (user: MUserDefault): Promise<LivechatToken[] | undefined> {
    if (!this._userTokensEnabled) {
      return undefined
    }
    if (!user || !user.id) {
      return undefined
    }
    if (user.blocked) {
      return undefined
    }
    const normalizedUsername = this._normalizeUsername(user)
    if (!normalizedUsername) {
      return undefined
    }
    const nickname: string | undefined = await getUserNickname(this._options, user)
    const jid = normalizedUsername + '@' + this._prosodyDomain
    const tokensInfo = await this._getTokensInfoForJID(jid)
    if (!tokensInfo) { return [] }

    if (tokensInfo.userId !== user.id) {
      return undefined
    }

    const tokens = []
    for (const token of tokensInfo.tokens) {
      // Cloning, and adding the nickname.
      tokens.push(
        Object.assign({}, token, {
          nickname
        })
      )
    }
    return tokens
  }

  /**
   * Enable or disable user tokens. Must be called when the settings change.
   * @param enabled
   */
  public setUserTokensEnabled (enabled: boolean): void {
    this._userTokensEnabled = !!enabled
    if (!this.userRegistered) {
      // Empty the cache:
      this._tokensInfoByJID.clear()
    }
  }

  public async createUserToken (user: MUserDefault, label: string): Promise<LivechatToken | undefined> {
    if (!this._userTokensEnabled) {
      return undefined
    }
    if (!user || !user.id) {
      return undefined
    }
    if (user.blocked) {
      return undefined
    }
    const normalizedUsername = this._normalizeUsername(user)
    if (!normalizedUsername) {
      return undefined
    }
    const nickname: string | undefined = await getUserNickname(this._options, user)
    const jid = normalizedUsername + '@' + this._prosodyDomain
    const token = await this._createToken(user.id, jid, label)

    token.nickname = nickname
    return token
  }

  public async revokeUserToken (user: MUserDefault, id: number): Promise<boolean> {
    if (!this._userTokensEnabled) {
      return false
    }
    if (!user || !user.id) {
      return false
    }
    if (user.blocked) {
      return false
    }
    const normalizedUsername = this._normalizeUsername(user)
    if (!normalizedUsername) {
      return false
    }
    const jid = normalizedUsername + '@' + this._prosodyDomain
    const tokensInfo = await this._getTokensInfoForJID(jid)

    if (!tokensInfo) {
      // No saved token, consider ok.
      return true
    }

    if (tokensInfo.userId !== user.id) {
      return false
    }

    await this._saveTokens(user.id, jid, tokensInfo.tokens.filter(t => t.id !== id))
    return true
  }

  private _getOrSetTempPassword (normalizedUsername: string): string {
    const entry = this._getAndClean(normalizedUsername)
    const validity = Date.now() + (24 * 60 * 60 * 1000) // 24h
    if (entry) {
      entry.validity = validity
      return entry.password
    }

    const password = generatePassword(20)
    this._passwords.set(normalizedUsername, {
      password: password,
      validity: validity
    })
    return password
  }

  private _normalizeUsername (user: MUserDefault): string | undefined {
    if (!user || !user.id) {
      return undefined
    }
    if (user.blocked) {
      return undefined
    }
    // NB 2021-08-05: Peertube usernames should be lowercase. But it seems that
    // in some old installation, there can be uppercase letters in usernames.
    // When Peertube checks username unicity, it does a lowercase search.
    // So it feels safe to normalize usernames like so:
    const normalizedUsername = user.username.toLowerCase()
    return normalizedUsername
  }

  private _getAndClean (normalizedUsername: string): Password | undefined {
    const entry = this._passwords.get(normalizedUsername)
    if (entry) {
      if (entry.validity > Date.now()) {
        return entry
      }
      this._passwords.delete(normalizedUsername)
    }
    return undefined
  }

  private async _userIdValid (userId: number): Promise<boolean> {
    try {
      const user = await this._options.peertubeHelpers.user.loadById(userId)
      if (!user || user.blocked) { return false }
      return true
    } catch (err) {
      return false
    }
  }

  private _jidTokenPath (jid: string): string {
    // Simple security check:
    if (jid === '.' || jid === '..' || jid.includes('/')) {
      throw new Error('Invalid jid')
    }
    return path.join(this._tokensPath, jid + '.json')
  }

  private async _getTokensInfoForJID (jid: string): Promise<LivechatTokenInfos | undefined> {
    try {
      const cached = this._tokensInfoByJID.get(jid)
      if (cached) {
        return cached
      }

      const filePath = this._jidTokenPath(jid)
      const content = await fs.promises.readFile(filePath)
      const json = JSON.parse(content.toString()) as SavedUserData
      if ((typeof json !== 'object') || (typeof json.userId !== 'number') || (!Array.isArray(json.tokens))) {
        throw new Error('Invalid token file content')
      }

      const tokens: LivechatToken[] = []
      for (const entry of json.tokens) {
        const token: LivechatToken = {
          jid,
          password: await this._decrypt(entry.encryptedPassword),
          date: entry.date,
          label: entry.label,
          id: entry.id
        }
        tokens.push(token)
      }

      const d = {
        userId: json.userId,
        tokens
      }
      this._tokensInfoByJID.set(jid, d)
      return d
    } catch (err: any) {
      if (('code' in err) && err.code === 'ENOENT') {
        // User has no token, this is normal.
        this._tokensInfoByJID.set(jid, undefined)
        return undefined
      }
      throw err
    }
  }

  private async _createToken (userId: number, jid: string, label: string): Promise<LivechatToken> {
    const tokensInfo = (await this._getTokensInfoForJID(jid)) ?? { userId, tokens: [] }

    // Using Date.now result as id, so we are pretty sure to not have 2 tokens with the same id.
    const now = Date.now()
    const id = now
    if (tokensInfo.tokens.find(t => t.id === id)) {
      throw new Error('There is already a token with this id.')
    }

    const password = generatePassword(30)

    const newToken: LivechatToken = {
      id,
      jid,
      date: now,
      password,
      label
    }
    tokensInfo.tokens.push(newToken)
    await this._saveTokens(userId, jid, tokensInfo.tokens)
    return newToken
  }

  private async _saveTokens (userId: number, jid: string, tokens: LivechatToken[]): Promise<void> {
    const ti = {
      userId,
      tokens
    }
    this._tokensInfoByJID.set(jid, ti)

    const toSave: SavedUserData = {
      userId,
      tokens: []
    }
    for (const t of tokens) {
      toSave.tokens.push({
        id: t.id,
        date: t.date,
        encryptedPassword: await this._encrypt(t.password),
        label: t.label
      })
    }
    const content = JSON.stringify(toSave)
    await fs.promises.mkdir(this._tokensPath, {
      recursive: true
    })
    await fs.promises.writeFile(this._jidTokenPath(jid), content)
  }

  private async _encrypt (data: string): Promise<string> {
    const { algorithm, inputEncoding, outputEncoding } = this._encryptionOptions

    const iv = await getRandomBytes(16)

    const cipher = createCipheriv(algorithm, this._secretKey, iv)
    let encrypted = cipher.update(data, inputEncoding, outputEncoding)
    encrypted += cipher.final(outputEncoding)

    return iv.toString(outputEncoding) + ':' + encrypted
  }

  private async _decrypt (data: string): Promise<string> {
    const { algorithm, inputEncoding, outputEncoding } = this._encryptionOptions

    const encryptedArray = data.split(':')
    const iv = Buffer.from(encryptedArray[0], outputEncoding)
    const encrypted = Buffer.from(encryptedArray[1], outputEncoding)
    const decipher = createDecipheriv(algorithm, this._secretKey, iv)

    // FIXME: dismiss the "as any" below (dont understand why Typescript is not happy without)
    return decipher.update(encrypted as any, outputEncoding, inputEncoding) + decipher.final(inputEncoding)
  }

  public static singleton (): LivechatProsodyAuth {
    if (!singleton) {
      throw new Error('LivechatProsodyAuth singleton not initialized yet')
    }
    return singleton
  }

  public static async initSingleton (options: RegisterServerOptions): Promise<LivechatProsodyAuth> {
    const prosodyDomain = await getProsodyDomain(options)
    let secretKey = await options.storageManager.getData('livechat-prosody-auth-secretkey')
    if (!secretKey) {
      // Generating the secret key
      secretKey = (await getRandomBytes(16)).toString('hex')
      await options.storageManager.storeData('livechat-prosody-auth-secretkey', secretKey)
    }

    const userTokenDisabled = await options.settingsManager.getSetting('livechat-token-disabled')

    singleton = new LivechatProsodyAuth(options, prosodyDomain, !userTokenDisabled, secretKey)
    return singleton
  }

  public static async destroySingleton (): Promise<void> {
    singleton = undefined
  }
}
