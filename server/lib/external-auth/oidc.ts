// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Request, Response, CookieOptions } from 'express'
import type { ExternalAccountInfos, AcceptableAvatarMimeType } from './types'
import type { ExternalAuthOIDCType } from '../../../shared/lib/types'
import { ExternalAuthenticationError } from './error'
import { getBaseRouterRoute } from '../helpers'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { getProsodyDomain } from '../prosody/config/domain'
import { pruneUsers } from '../prosody/api/manage-users'
import { getProsodyFilePaths } from '../prosody/config'
import { debugNumericParameter } from '../debug'
import { createCipheriv, createDecipheriv, randomBytes, Encoding } from 'node:crypto'
import { Issuer, BaseClient, generators, UnknownObject } from 'openid-client'
import { JID } from '@xmpp/jid'
import { URL } from 'url'
import * as path from 'path'
import * as fs from 'fs'

const got = require('got')

function getMimeTypeFromArrayBuffer (arrayBuffer: ArrayBuffer): AcceptableAvatarMimeType | null {
  const uint8arr = new Uint8Array(arrayBuffer)

  const len = 4
  if (uint8arr.length >= len) {
    const signatureArr = new Array(len)
    for (let i = 0; i < len; i++) {
      signatureArr[i] = (new Uint8Array(arrayBuffer))[i].toString(16)
    }
    const signature = signatureArr.join('').toUpperCase()

    switch (signature) {
      case '89504E47':
        return 'image/png'
      case '47494638':
        return 'image/gif'
      case 'FFD8FFDB':
      case 'FFD8FFE0':
        return 'image/jpeg'
      case '52494646':
      case '57454250':
        return 'image/webp'
      default:
        return null
    }
  }
  return null
}

type UserInfoField = 'username' | 'last_name' | 'first_name' | 'nickname' | 'picture'

interface UnserializedToken {
  type: ExternalAuthOIDCType
  jid: string
  password: string
  nickname: string
  expire: Date
}

let singletons: Map<ExternalAuthOIDCType, ExternalAuthOIDC> | undefined

async function getRandomBytes (size: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    randomBytes(size, (err, buf) => {
      if (err) return reject(err)

      return resolve(buf)
    })
  })
}

/**
 * This class handles the external OpenId Connect provider, if defined.
 */
class ExternalAuthOIDC {
  private readonly singletonType: ExternalAuthOIDCType
  private readonly enabled: boolean
  private readonly buttonLabel: string | undefined
  private readonly discoveryUrl: string | undefined
  private readonly clientId: string | undefined
  private readonly clientSecret: string | undefined
  private readonly secretKey: string
  private readonly redirectUrl: string
  private readonly connectUrl: string
  private readonly externalVirtualhost: string
  private readonly avatarsDir: string | undefined
  private readonly avatarsFiles: string[] | undefined

  private readonly encryptionOptions = {
    algorithm: 'aes256' as string,
    inputEncoding: 'utf8' as Encoding,
    outputEncoding: 'hex' as Encoding
  }

  private readonly cookieNamePrefix: string = 'peertube-plugin-livechat-oidc-'
  private readonly cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 10 // 10 minutes
  }

  private ok: boolean | undefined

  private issuer: Issuer | undefined | null
  private client: BaseClient | undefined | null
  private providerHostName?: string

  protected readonly logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  constructor (params: {
    logger: RegisterServerOptions['peertubeHelpers']['logger']
    singletonType: ExternalAuthOIDCType
    enabled: boolean
    buttonLabel: string | undefined
    discoveryUrl: string | undefined
    clientId: string | undefined
    clientSecret: string | undefined
    secretKey: string
    connectUrl: string
    redirectUrl: string
    externalVirtualhost: string
    avatarsDir?: string
    avatarsFiles?: string[]
  }) {
    this.logger = {
      debug: (s) => params.logger.debug('[ExternalAuthOIDC] ' + s),
      info: (s) => params.logger.info('[ExternalAuthOIDC] ' + s),
      warn: (s) => params.logger.warn('[ExternalAuthOIDC] ' + s),
      error: (s) => params.logger.error('[ExternalAuthOIDC] ' + s)
    }

    this.singletonType = params.singletonType
    this.enabled = !!params.enabled
    this.secretKey = params.secretKey
    this.redirectUrl = params.redirectUrl
    this.connectUrl = params.connectUrl
    this.externalVirtualhost = params.externalVirtualhost
    this.avatarsDir = params.avatarsDir
    this.avatarsFiles = params.avatarsFiles

    if (this.enabled) {
      this.buttonLabel = params.buttonLabel
      this.discoveryUrl = params.discoveryUrl
      this.clientId = params.clientId
      this.clientSecret = params.clientSecret
    }
  }

  /**
   * This singleton type.
   */
  public get type (): ExternalAuthOIDCType {
    return this.singletonType
  }

  /**
   * Indicates that the OIDC is disabled.
   * Caution: this does not indicate if it is enabled, but poorly configured.
   * This method should only be used in the diagnostic tool.
   */
  isDisabledBySettings (): boolean {
    return !this.enabled
  }

  /**
   * Get the url to open for external authentication.
   * Note: If the singleton is not loaded yet, returns null.
   *   This means that the feature will only be available when the load as complete.
   * @returns the url to open
   */
  getConnectUrl (): string | null {
    if (!this.client) {
      // Not loaded yet
      return null
    }
    return this.connectUrl
  }

  /**
   * Get the button
   * @returns Button label
   */
  getButtonLabel (): string | undefined {
    return this.buttonLabel
  }

  /**
   * Get the discovery URL
   * @returns discoveryURL
   */
  getDiscoveryUrl (): string | undefined {
    return this.discoveryUrl
  }

  /**
   * Indicates if the OIDC provider is correctly configured.
   * @param force If true, all checks will be forced again.
   */
  async isOk (force?: boolean): Promise<boolean> {
    // If we already checked it, just return the previous value.
    if (!force && this.ok !== undefined) { return this.ok }

    this.ok = (await this.check()).length === 0
    return this.ok
  }

  /**
   * Check the configuration.
   * Returns an error list.
   * If error list is empty, consider the OIDC is correctly configured.
   * Note: this function also fills this.providerHostName (as it also parse the discoveryUrl).
   */
  async check (): Promise<string[]> {
    if (!this.enabled) {
      this.logger.debug('OIDC is disabled')
      return ['OIDC disabled']
    }

    const errors: string[] = []
    if ((this.buttonLabel ?? '') === '') {
      errors.push('Missing button label')
    }
    if ((this.discoveryUrl ?? '') === '') {
      errors.push('Missing discovery url')
    } else {
      try {
        const uri = new URL(this.discoveryUrl ?? 'wrong url')
        this.logger.debug('OIDC Discovery url is valid: ' + uri.toString())

        this.providerHostName = uri.hostname
      } catch (_err) {
        errors.push('Invalid discovery url')
      }
    }
    if ((this.clientId ?? '') === '') {
      errors.push('Missing client id')
    }
    if ((this.clientSecret ?? '') === '') {
      errors.push('Missing client secret')
    }

    if (errors.length) {
      this.logger.error('OIDC is not ok: ' + JSON.stringify(errors))
    }
    return errors
  }

  /**
   * Ensure the issuer is loaded, and the client instanciated.
   * @returns the issuer if enabled
   */
  async load (): Promise<BaseClient | null> {
    // this.client === null means we already tried, but it failed.
    if (this.client !== undefined) { return this.client }

    if (!await this.isOk()) {
      this.issuer = null
      this.client = null
      return null
    }

    try {
      this.issuer = await Issuer.discover(this.discoveryUrl as string)
      this.logger.debug(`Discovered issuer, metadata are: ${JSON.stringify(this.issuer.metadata)}`)
    } catch (err) {
      this.logger.error(err as string)
      this.issuer = null
      this.client = null
    }

    if (!this.issuer) {
      this.client = null
      return null
    }

    try {
      this.client = new this.issuer.Client({
        client_id: this.clientId as string,
        client_secret: this.clientSecret as string,
        redirect_uris: [this.redirectUrl],
        response_types: ['code']
      })
    } catch (err) {
      this.logger.error(err as string)
      this.client = null
    }

    if (!this.client) {
      return null
    }

    return this.client
  }

  /**
   * Returns everything that is needed to instanciate an OIDC authentication.
   * @param req express request
   * @param res express response. Will add some cookies.
   * @return the url to which redirect
   */
  async initAuthenticationProcess (req: Request, res: Response): Promise<string> {
    if (!this.client) {
      throw new Error('External Auth OIDC not loaded yet, too soon to call oidc.initAuthentication')
    }

    const codeVerifier = generators.codeVerifier()
    const codeChallenge = generators.codeChallenge(codeVerifier)
    const state = generators.state()

    const encryptedCodeVerifier = await this.encrypt(codeVerifier)
    const encryptedState = await this.encrypt(state)

    const redirectUrl = this.client.authorizationUrl({
      scope: 'openid profile',
      response_mode: 'form_post',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state
    })

    res.cookie(this.cookieNamePrefix + 'code-verifier', encryptedCodeVerifier, this.cookieOptions)
    res.cookie(this.cookieNamePrefix + 'state', encryptedState, this.cookieOptions)
    return redirectUrl
  }

  /**
   * Authentication process callback.
   * @param req The ExpressJS request object. Will read cookies.
   * @throws ExternalAuthenticationError when a specific message must be displayed to enduser.
   * @throws Error in other cases.
   * @return user info
   */
  async validateAuthenticationProcess (req: Request): Promise<ExternalAccountInfos> {
    if (!this.client) {
      throw new Error('External Auth OIDC not loaded yet, too soon to call oidc.validateAuthenticationProcess')
    }

    const encryptedCodeVerifier = req.cookies[this.cookieNamePrefix + 'code-verifier']
    if (!encryptedCodeVerifier) {
      throw new Error('Received callback but code verifier not found in request cookies.')
    }
    if (typeof encryptedCodeVerifier !== 'string') {
      throw new Error('Invalid code-verifier type.')
    }

    const encryptedState = req.cookies[this.cookieNamePrefix + 'state']
    if (!encryptedState) {
      throw new Error('Received callback but state not found in request cookies.')
    }
    if (typeof encryptedState !== 'string') {
      throw new Error('Invalid state data type')
    }

    const codeVerifier = await this.decrypt(encryptedCodeVerifier)
    const state = await this.decrypt(encryptedState)

    const params = this.client.callbackParams(req)
    const tokenSet = await this.client.callback(this.redirectUrl, params, {
      code_verifier: codeVerifier,
      state
    })

    const accessToken = tokenSet.access_token
    if (!accessToken) {
      throw new Error('Missing access_token')
    }
    const userInfo = await this.client.userinfo(accessToken)

    this.logger.debug('User info: ' + JSON.stringify(userInfo))

    if (!userInfo) {
      throw new ExternalAuthenticationError('Can\'t retrieve userInfos')
    }

    const username = this.readUserInfoField(userInfo, 'username')
    if (username === undefined) {
      throw new ExternalAuthenticationError('Missing username in userInfos')
    }

    let nickname: string | undefined = this.readUserInfoField(userInfo, 'nickname')
    if (nickname === undefined) {
      const lastname = this.readUserInfoField(userInfo, 'last_name')
      const firstname = this.readUserInfoField(userInfo, 'first_name')
      if (lastname !== undefined && firstname !== undefined) {
        nickname = firstname + ' ' + lastname
      } else if (firstname !== undefined) {
        nickname = firstname
      } else if (lastname !== undefined) {
        nickname = lastname
      }
    }
    nickname ??= username

    // Computing the JID (can throw Error/ExternalAuthenticationError).
    const jid = this.computeJID(username).toString(false)

    // Computing a random Password
    // (16 bytes in hex => 32 chars (but only numbers and abdcef), 256^16 should be enougth).
    const password = (await getRandomBytes(16)).toString('hex')

    // Now we will encrypt jid + password, and return it to the browser.
    // The browser will be able to use this encrypted data with the api/configuration/room API.
    const tokenContent: UnserializedToken = {
      type: this.type,
      jid,
      password,
      nickname,
      // expires in 12 hours (user will just have to do the whole process again).
      expire: (new Date(Date.now() + 12 * 3600 * 1000))
    }
    // Token is prefixed by the type, so we can get the correct singleton for deserializing.
    const token = this.type + '-' + await this.encrypt(JSON.stringify(tokenContent))

    let avatar = await this.readUserInfoPicture(userInfo)
    if (!avatar) {
      this.logger.debug('No avatar from the external service, getting a random one.')
      avatar = await this.getRandomAvatar()
    }

    return {
      jid,
      nickname,
      password,
      token,
      avatar
    }
  }

  private async encrypt (data: string): Promise<string> {
    const { algorithm, inputEncoding, outputEncoding } = this.encryptionOptions

    const iv = await getRandomBytes(16)

    const cipher = createCipheriv(algorithm, this.secretKey, iv)
    let encrypted = cipher.update(data, inputEncoding, outputEncoding)
    encrypted += cipher.final(outputEncoding)

    return iv.toString(outputEncoding) + ':' + encrypted
  }

  private async decrypt (data: string): Promise<string> {
    const { algorithm, inputEncoding, outputEncoding } = this.encryptionOptions

    const encryptedArray = data.split(':')
    const iv = Buffer.from(encryptedArray[0], outputEncoding)
    const encrypted = encryptedArray[1]
    const decipher = createDecipheriv(algorithm, this.secretKey, iv)

    // here we must revert outputEncoding and inputEncoding, as were are decrypting.
    return decipher.update(encrypted, outputEncoding, inputEncoding) + decipher.final(inputEncoding)
  }

  /**
   * Decrypt and unserialize a token associated to a previous authentication.
   * @param token the token stored by the browser.
   * @return authentication informations, or null if:
   *  if the token is expired, if the token is invalid.
   *  Can also fail (and return null) when server was restarted, or settings saved, as the secret key may have changed
   *  (this is not an issue, users just have to start the process again).
   */
  public async unserializeToken (token: string): Promise<UnserializedToken | null> {
    try {
      // First, check the prefix:
      if (!token.startsWith(this.type + '-')) {
        throw new Error('Wrong token prefix')
      }
      // Removing the prefix:
      token = token.substring(this.type.length + 1)

      const decrypted = await this.decrypt(token)
      const o = JSON.parse(decrypted) // can fail

      if (typeof o !== 'object') {
        throw new Error('Invalid encrypted data')
      }

      if (o.type !== this.type) {
        throw new Error('Token type is not the expected one')
      }

      if (typeof o.jid !== 'string' || o.jid === '') {
        throw new Error('No jid')
      }
      if (typeof o.password !== 'string' || o.password === '') {
        throw new Error('No password')
      }
      if (typeof o.nickname !== 'string' || o.nickname === '') {
        throw new Error('No nickname')
      }
      if (typeof o.expire !== 'string' || o.expire === '') {
        throw new Error('Invalid expire data type')
      }

      const expire = new Date(Date.parse(o.expire as string))
      if (!(expire instanceof Date) || isNaN(expire.getTime())) {
        throw new Error('Invalid expire date')
      }

      if (expire <= new Date()) {
        throw new Error('Token expired')
      }

      return {
        type: o.type,
        jid: o.jid,
        password: o.password,
        nickname: o.nickname,
        expire
      }
    } catch (err) {
      // This is not an error, as there are many legitimate cases (token expired, ...)
      this.logger.info('Cant unserialize the token: ' + (err as string))
      return null
    }
  }

  /**
   * Get an attribute from the userInfos.
   * @param userInfos userInfos returned by the remote OIDC Provider.
   * @param normalizedFieldName the field to get (internal normalized name).
   * @returns the value if present.
   */
  private readUserInfoField (userInfos: UnknownObject, normalizedFieldName: UserInfoField): string | undefined {
    // FIXME: do some explicit attribute mapping? (add settings for that?)
    // For now, we will try some standards field names.

    const guesses: string[] = [normalizedFieldName]

    // Note: see "Standard Claims" section https://openid.net/specs/openid-connect-core-1_0.html
    switch (normalizedFieldName) {
      case 'username':
        guesses.push('sub') // unique identifier, see https://openid.net/specs/openid-connect-core-1_0.html
        break
      case 'last_name':
        guesses.push('family_name')
        break
      case 'first_name':
        guesses.push('given_name')
        break
      case 'nickname':
        guesses.push('preferred_username')
        guesses.push('name')
        break
    }

    for (const field of guesses) {
      if (!(field in userInfos)) { continue }
      if (typeof userInfos[field] !== 'string') { continue }
      if (userInfos[field] === '') { continue }
      return userInfos[field]
    }
    return undefined
  }

  /**
   * Read and get the avatar for the remote user (if exists).
   * @param userInfos userInfos returned by the remote OIDC Provider.
   */
  private async readUserInfoPicture (userInfos: UnknownObject): Promise<undefined | ExternalAccountInfos['avatar']> {
    // According to "Standard Claims" section https://openid.net/specs/openid-connect-core-1_0.html,
    // there should be a `picture` field containing an URL to the avatar
    const picture = this.readUserInfoField(userInfos, 'picture')
    if (!picture) { return undefined }

    try {
      const url = new URL(picture)
      const buf = await got(url.toString(), {
        method: 'GET',
        headers: {},
        responseType: 'buffer'
      }).buffer()

      const mimeType = getMimeTypeFromArrayBuffer(buf as ArrayBuffer)
      if (!mimeType) {
        throw new Error('Failed to get the avatar file type')
      }

      return {
        mimetype: mimeType,
        base64: buf.toString('base64')
      }
    } catch (err) {
      this.logger.error(`Failed to get the user avatar: ${err as string}`)
      return undefined
    }
  }

  /**
   * Gets a random default avatar from the current avatar set.
   */
  private async getRandomAvatar (): Promise<undefined | ExternalAccountInfos['avatar']> {
    try {
      if (!this.avatarsDir || !this.avatarsFiles?.length) {
        return undefined
      }

      const file = this.avatarsFiles[Math.floor(Math.random() * this.avatarsFiles.length)]
      if (!file) {
        throw new Error('No default avatar file')
      }

      const filePath = path.resolve(this.avatarsDir, file)
      const buf = await fs.promises.readFile(filePath)

      const mimeType = getMimeTypeFromArrayBuffer(buf)
      if (!mimeType) {
        throw new Error('Failed to get the default avatar file type')
      }

      return {
        mimetype: mimeType,
        base64: buf.toString('base64')
      }
    } catch (err) {
      this.logger.error(`Failed to get a default avatar: ${err as string}`)
      return undefined
    }
  }

  /**
   * Compute the JID to use for this remote account.
   * Format will be: "username+remote.domain.tld@external.instance.tld"
   * @param username the remote username
   * @throws ExternalAuthenticationError if the computed JID is not valid.
   * @throws Error
   * @returns The JID.
   */
  private computeJID (username: string): JID {
    if (!this.providerHostName) {
      this.logger.error('Missing providerHostName, callong computeJID before check()?')
      throw new Error('Can\'t compute JID')
    }
    try {
      const jid = new JID(username + '+' + this.providerHostName, this.externalVirtualhost)

      // Checking JID is not too long.
      // Following https://xmpp.org/extensions/xep-0029.html , there is no exact limit,
      // but we should definitively not accept anything.
      // Using 256 as suggested (for the escaped version)
      if (jid.toString(false).length > 256) {
        throw new ExternalAuthenticationError(
          'Resulting identifier for your account is too long'
        )
      }
      return jid
    } catch (err) {
      this.logger.error(err as string)
      throw new ExternalAuthenticationError(
        'Resulting identifier for your account is invalid, please report this issue'
      )
    }
  }

  /**
   * frees the singletons
   */
  public static async destroySingletons (): Promise<void> {
    if (!singletons) { return }

    stopPruneTimer()

    const keys = singletons.keys()
    for (const key of keys) {
      const singleton = singletons.get(key)
      if (!singleton) { continue }
      singletons.delete(key)
    }

    singletons = undefined
  }

  /**
   * Instanciate all singletons.
   * Note: no need to destroy singletons before creating new ones.
   */
  public static async initSingletons (options: RegisterServerOptions): Promise<void> {
    const prosodyDomain = await getProsodyDomain(options)
    // FIXME: this is not optimal to call here.
    const prosodyFilePaths = await getProsodyFilePaths(options)

    const settings = await options.settingsManager.getSettings([
      'external-auth-custom-oidc',
      'external-auth-custom-oidc-button-label',
      'external-auth-custom-oidc-discovery-url',
      'external-auth-custom-oidc-client-id',
      'external-auth-custom-oidc-client-secret',
      'external-auth-google-oidc',
      'external-auth-google-oidc-client-id',
      'external-auth-google-oidc-client-secret',
      'external-auth-facebook-oidc',
      'external-auth-facebook-oidc-client-id',
      'external-auth-facebook-oidc-client-secret'
    ])

    const init = async function initSingleton (
      singletonType: ExternalAuthOIDCType,
      buttonLabel: string | undefined,
      discoveryUrl: string | undefined
    ): Promise<void> {
      // Generating a secret key that will be used for the authenticatio process (can change on restart).
      const secretKey = (await getRandomBytes(16)).toString('hex')

      const singleton = new ExternalAuthOIDC({
        logger: options.peertubeHelpers.logger,
        singletonType,
        enabled: settings['external-auth-' + singletonType + '-oidc'] as boolean,
        buttonLabel,
        discoveryUrl,
        clientId: settings['external-auth-' + singletonType + '-oidc-client-id'] as string | undefined,
        clientSecret: settings['external-auth-' + singletonType + '-oidc-client-secret'] as string | undefined,
        secretKey,
        connectUrl: ExternalAuthOIDC.connectUrl(options, singletonType),
        redirectUrl: ExternalAuthOIDC.redirectUrl(options, singletonType),
        externalVirtualhost: 'external.' + prosodyDomain,
        avatarsDir: prosodyFilePaths.avatars,
        avatarsFiles: prosodyFilePaths.avatarsFiles
      })

      singletons ??= new Map<ExternalAuthOIDCType, ExternalAuthOIDC>()
      singletons.set(singletonType, singleton)
    }

    await Promise.all([
      init(
        'custom',
        settings['external-auth-custom-oidc-button-label'] as string | undefined,
        settings['external-auth-custom-oidc-discovery-url'] as string | undefined
      ),
      init(
        'google',
        'Google',
        'https://accounts.google.com'
      ),
      init(
        'facebook',
        'Facebook',
        'https://www.facebook.com'
      )
    ])

    startPruneTimer(options)
  }

  /**
   * Gets the singleton, or raise an exception if it is too soon.
   * @param ExternalAuthOIDCType The singleton type.
   * @throws Error
   * @returns the singleton
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  public static singleton (singletonType: ExternalAuthOIDCType | string): ExternalAuthOIDC {
    if (!singletons) {
      throw new Error('ExternalAuthOIDC singletons are not initialized yet')
    }
    const singleton = singletons.get(singletonType as ExternalAuthOIDCType)
    if (!singleton) {
      throw new Error(`ExternalAuthOIDC singleton "${singletonType}" is not initiliazed yet`)
    }
    return singleton
  }

  /**
   * Get all initialiazed singletons.
   */
  public static allSingletons (): ExternalAuthOIDC[] {
    if (!singletons) { return [] }
    return Array.from(singletons.values())
  }

  /**
   * Reading header X-Peertube-Plugin-Livechat-External-Auth-OIDC-Token,
   * got the singleton that is supposed to read the token.
   * Note: the token must be unserialized before supposing it is valid!
   * @param token the authentication token
   */
  public static singletonForToken (token: string): ExternalAuthOIDC | null {
    try {
      const m = token.match(/^(\w+)-/)
      if (!m) { return null }
      return ExternalAuthOIDC.singleton(m[1])
    } catch (_err) {
      return null
    }
  }

  /**
   * Get the uri to start the authentication process.
   * @param options Peertube server options
   * @returns the uri
   */
  public static connectUrl (options: RegisterServerOptions, type: ExternalAuthOIDCType): string {
    if (!/^\w+$/.test(type)) {
      throw new Error('Invalid singleton type')
    }
    const path = getBaseRouterRoute(options) + 'oidc/' + type + '/connect'
    return canonicalizePluginUri(options, path, {
      removePluginVersion: true
    })
  }

  /**
   * Get the redirect uri to require from the remote OIDC Provider.
   * @param options Peertube server optiosn
   * @returns the uri
   */
  public static redirectUrl (options: RegisterServerOptions, type: ExternalAuthOIDCType): string {
    if (!/^\w+$/.test(type)) {
      throw new Error('Invalid singleton type')
    }
    const path = getBaseRouterRoute(options) + 'oidc/' + type + '/cb'
    return canonicalizePluginUri(options, path, {
      removePluginVersion: true
    })
  }
}

let pruneTimer: NodeJS.Timer | undefined

/**
   * Starts an interval timer to prune external users from Prosody.
   * @param options Peertube server options.
   */
function startPruneTimer (options: RegisterServerOptions): void {
  stopPruneTimer() // just in case...

  const logger = {
    debug: (s: string) => options.peertubeHelpers.logger.debug('[ExternalAuthOIDC startPruneTimer] ' + s),
    info: (s: string) => options.peertubeHelpers.logger.info('[ExternalAuthOIDC startPruneTimer] ' + s),
    warn: (s: string) => options.peertubeHelpers.logger.warn('[ExternalAuthOIDC startPruneTimer] ' + s),
    error: (s: string) => options.peertubeHelpers.logger.error('[ExternalAuthOIDC startPruneTimer] ' + s)
  }

  // every hour (every minutes in debug mode)
  const pruneInterval = debugNumericParameter(options, 'externalAccountPruneInterval', 60 * 1000, 60 * 60 * 1000)
  logger.info(`Creating a timer for external account pruning, every ${Math.round(pruneInterval / 1000)}s.`)

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  pruneTimer = setInterval(async () => {
    try {
      // Checking if at least one active singleton
      let ok = false
      for (const oidc of ExternalAuthOIDC.allSingletons()) {
        if (!await oidc.isOk()) { continue }
        ok = true
        break
      }
      if (!ok) { return }

      logger.info('Pruning external users...')
      await pruneUsers(options)
    } catch (err) {
      logger.error('Error while pruning external users: ' + (err as string))
    }
  }, pruneInterval)
}

/**
 * Stops the prune timer.
 */
function stopPruneTimer (): void {
  if (!pruneTimer) { return }
  clearInterval(pruneTimer)
  pruneTimer = undefined
}

export {
  ExternalAuthOIDC,
  ExternalAuthOIDCType
}
