import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Request, Response, CookieOptions } from 'express'
import type { ExternalAccountInfos, AcceptableAvatarMimeType } from './types'
import { ExternalAuthenticationError } from './error'
import { getBaseRouterRoute } from '../helpers'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { getProsodyDomain } from '../prosody/config/domain'
import { createCipheriv, createDecipheriv, randomBytes, Encoding } from 'node:crypto'
import { Issuer, BaseClient, generators, UnknownObject } from 'openid-client'
import { JID } from '@xmpp/jid'
import { URL } from 'url'

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
  jid: string
  password: string
  nickname: string
  expire: Date
}

let singleton: ExternalAuthOIDC | undefined

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
  private readonly enabled: boolean
  private readonly buttonLabel: string | undefined
  private readonly discoveryUrl: string | undefined
  private readonly clientId: string | undefined
  private readonly clientSecret: string | undefined
  private readonly secretKey: string
  private readonly redirectUrl: string
  private readonly connectUrl: string
  private readonly externalVirtualhost: string

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
    enabled: boolean
    buttonLabel: string | undefined
    discoveryUrl: string | undefined
    clientId: string | undefined
    clientSecret: string | undefined
    secretKey: string
    connectUrl: string
    redirectUrl: string
    externalVirtualhost: string
  }) {
    this.logger = {
      debug: (s) => params.logger.debug('[ExternalAuthOIDC] ' + s),
      info: (s) => params.logger.info('[ExternalAuthOIDC] ' + s),
      warn: (s) => params.logger.warn('[ExternalAuthOIDC] ' + s),
      error: (s) => params.logger.error('[ExternalAuthOIDC] ' + s)
    }

    this.enabled = !!params.enabled
    this.secretKey = params.secretKey
    this.redirectUrl = params.redirectUrl
    this.connectUrl = params.connectUrl
    this.externalVirtualhost = params.externalVirtualhost
    if (this.enabled) {
      this.buttonLabel = params.buttonLabel
      this.discoveryUrl = params.discoveryUrl
      this.clientId = params.clientId
      this.clientSecret = params.clientSecret
    }
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
      } catch (err) {
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

    const encryptedState = req.cookies[this.cookieNamePrefix + 'state']
    if (!encryptedState) {
      throw new Error('Received callback but state not found in request cookies.')
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
      jid,
      password,
      nickname,
      // expires in 12 hours (user will just have to do the whole process again).
      expire: (new Date(Date.now() + 12 * 3600 * 1000))
    }
    const token = await this.encrypt(JSON.stringify(tokenContent))

    const avatar = await this.readUserInfoPicture(userInfo)

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
    const encrypted = Buffer.from(encryptedArray[1], outputEncoding)
    const decipher = createDecipheriv(algorithm, this.secretKey, iv)

    // FIXME: dismiss the "as any" below (dont understand why Typescript is not happy without)
    return decipher.update(encrypted as any, outputEncoding, inputEncoding) + decipher.final(inputEncoding)
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
      const decrypted = await this.decrypt(token)
      const o = JSON.parse(decrypted) // can fail

      if (typeof o !== 'object') {
        throw new Error('Invalid encrypted data')
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

      const expire = new Date(Date.parse(o.expire))
      if (!(expire instanceof Date) || isNaN(expire.getTime())) {
        throw new Error('Invalid expire date')
      }

      if (expire <= new Date()) {
        throw new Error('Token expired')
      }

      return {
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
      return userInfos[field] as string
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

      const mimeType = await getMimeTypeFromArrayBuffer(buf)
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
   * frees the singleton
   */
  public static async destroySingleton (): Promise<void> {
    if (!singleton) { return }
    singleton = undefined
  }

  /**
   * Instanciate the singleton.
   * Note: no need to destroy the singleton before creating a new one.
   */
  public static async initSingleton (options: RegisterServerOptions): Promise<ExternalAuthOIDC> {
    const settings = await options.settingsManager.getSettings([
      'external-auth-custom-oidc',
      'external-auth-custom-oidc-button-label',
      'external-auth-custom-oidc-discovery-url',
      'external-auth-custom-oidc-client-id',
      'external-auth-custom-oidc-client-secret'
    ])

    // Generating a secret key that will be used for the authenticatio process (can change on restart).
    const secretKey = (await getRandomBytes(16)).toString('hex')

    const prosodyDomain = await getProsodyDomain(options)

    singleton = new ExternalAuthOIDC({
      logger: options.peertubeHelpers.logger,
      enabled: settings['external-auth-custom-oidc'] as boolean,
      buttonLabel: settings['external-auth-custom-oidc-button-label'] as string | undefined,
      discoveryUrl: settings['external-auth-custom-oidc-discovery-url'] as string | undefined,
      clientId: settings['external-auth-custom-oidc-client-id'] as string | undefined,
      clientSecret: settings['external-auth-custom-oidc-client-secret'] as string | undefined,
      secretKey,
      connectUrl: ExternalAuthOIDC.connectUrl(options),
      redirectUrl: ExternalAuthOIDC.redirectUrl(options),
      externalVirtualhost: 'external.' + prosodyDomain
    })

    return singleton
  }

  /**
   * Gets the singleton, or raise an exception if it is too soon.
   * @throws Error
   * @returns the singleton
   */
  public static singleton (): ExternalAuthOIDC {
    if (!singleton) {
      throw new Error('ExternalAuthOIDC singleton is not initialized yet')
    }
    return singleton
  }

  /**
   * Get the uri to start the authentication process.
   * @param options Peertube server options
   * @returns the uri
   */
  public static connectUrl (options: RegisterServerOptions): string {
    const path = getBaseRouterRoute(options) + 'oidc/connect'
    return canonicalizePluginUri(options, path, {
      removePluginVersion: true
    })
  }

  /**
   * Get the redirect uri to require from the remote OIDC Provider.
   * @param options Peertube server optiosn
   * @returns the uri
   */
  public static redirectUrl (options: RegisterServerOptions): string {
    const path = getBaseRouterRoute(options) + 'oidc/cb'
    return canonicalizePluginUri(options, path, {
      removePluginVersion: true
    })
  }
}

export {
  ExternalAuthOIDC
}
