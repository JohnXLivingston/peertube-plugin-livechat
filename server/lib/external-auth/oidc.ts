import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Request } from 'express'
import { URL } from 'url'
import { Issuer, BaseClient, generators } from 'openid-client'
import { getBaseRouterRoute } from '../helpers'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { createCipheriv, createDecipheriv, randomBytes, Encoding } from 'node:crypto'

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

  private readonly encryptionOptions = {
    algorithm: 'aes256' as string,
    inputEncoding: 'utf8' as Encoding,
    outputEncoding: 'hex' as Encoding
  }

  private ok: boolean | undefined

  private issuer: Issuer | undefined | null
  private client: BaseClient | undefined | null

  protected readonly logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  constructor (
    logger: RegisterServerOptions['peertubeHelpers']['logger'],
    enabled: boolean,
    buttonLabel: string | undefined,
    discoveryUrl: string | undefined,
    clientId: string | undefined,
    clientSecret: string | undefined,
    secretKey: string,
    connectUrl: string,
    redirectUrl: string
  ) {
    this.logger = {
      debug: (s) => logger.debug('[ExternalAuthOIDC] ' + s),
      info: (s) => logger.info('[ExternalAuthOIDC] ' + s),
      warn: (s) => logger.warn('[ExternalAuthOIDC] ' + s),
      error: (s) => logger.error('[ExternalAuthOIDC] ' + s)
    }

    this.enabled = !!enabled
    this.secretKey = secretKey
    this.redirectUrl = redirectUrl
    this.connectUrl = connectUrl
    if (this.enabled) {
      this.buttonLabel = buttonLabel
      this.discoveryUrl = discoveryUrl
      this.clientId = clientId
      this.clientSecret = clientSecret
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
   */
  async initAuthenticationProcess (): Promise<{
    encryptedCodeVerifier: string
    encryptedState: string
    redirectUrl: string
  }> {
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

    return {
      encryptedCodeVerifier,
      encryptedState,
      redirectUrl
    }
  }

  /**
   * Authentication process callback.
   * @param req The ExpressJS request object.
   * @return user info
   */
  async validateAuthenticationProcess (req: Request, cookieNamePrefix: string): Promise<any> {
    if (!this.client) {
      throw new Error('External Auth OIDC not loaded yet, too soon to call oidc.validateAuthenticationProcess')
    }

    const encryptedCodeVerifier = req.cookies[cookieNamePrefix + 'code-verifier']
    if (!encryptedCodeVerifier) {
      throw new Error('Received callback but code verifier not found in request cookies.')
    }

    const encryptedState = req.cookies[cookieNamePrefix + 'state']
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
    return userInfo
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

    singleton = new ExternalAuthOIDC(
      options.peertubeHelpers.logger,
      settings['external-auth-custom-oidc'] as boolean,
      settings['external-auth-custom-oidc-button-label'] as string | undefined,
      settings['external-auth-custom-oidc-discovery-url'] as string | undefined,
      settings['external-auth-custom-oidc-client-id'] as string | undefined,
      settings['external-auth-custom-oidc-client-secret'] as string | undefined,
      secretKey,
      ExternalAuthOIDC.connectUrl(options),
      ExternalAuthOIDC.redirectUrl(options)
    )

    return singleton
  }

  /**
   * Gets the singleton, or raise an exception if it is too soon.
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
