import type { RegisterServerOptions } from '@peertube/peertube-types'
import { URL } from 'url'
import { Issuer } from 'openid-client'

let singleton: ExternalAuthOIDC | undefined

/**
 * This class handles the external OpenId Connect provider, if defined.
 */
class ExternalAuthOIDC {
  private readonly enabled: boolean
  private readonly buttonLabel: string | undefined
  private readonly discoveryUrl: string | undefined
  private readonly clientId: string | undefined
  private readonly clientSecret: string | undefined
  private ok: boolean | undefined
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
    clientSecret: string | undefined
  ) {
    this.logger = {
      debug: (s) => logger.debug('[ExternalAuthOIDC] ' + s),
      info: (s) => logger.info('[ExternalAuthOIDC] ' + s),
      warn: (s) => logger.warn('[ExternalAuthOIDC] ' + s),
      error: (s) => logger.error('[ExternalAuthOIDC] ' + s)
    }

    this.enabled = !!enabled
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
    if (this.buttonLabel === undefined) {
      errors.push('Missing button label')
    }
    if (this.discoveryUrl === undefined) {
      errors.push('Missing discovery url')
    } else {
      try {
        const uri = new URL(this.discoveryUrl)
        this.logger.debug('OIDC Discovery url is valid: ' + uri.toString())
      } catch (err) {
        errors.push('Invalid discovery url')
      }
    }
    if (this.clientId === undefined) {
      errors.push('Missing client id')
    }
    if (this.clientSecret === undefined) {
      errors.push('Missing client secret')
    }

    if (errors.length === 0) {
      // Now we can try to use the discover service
      try {
        const issuer = await Issuer.discover(this.discoveryUrl as string)
        this.logger.debug(`Discovered issuer, metadata are: ${JSON.stringify(issuer.metadata)}`)
      } catch (err) {
        this.logger.error(err as string)
        errors.push(`Discovery URL non working: ${err as string}`)
      }
    }

    if (errors.length) {
      this.logger.error('OIDC is not ok: ' + JSON.stringify(errors))
    }
    return errors
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
    singleton = new ExternalAuthOIDC(
      options.peertubeHelpers.logger,
      settings['external-auth-custom-oidc'] as boolean,
      settings['external-auth-custom-oidc-button-label'] as string | undefined,
      settings['external-auth-custom-oidc-discovery-url'] as string | undefined,
      settings['external-auth-custom-oidc-client-id'] as string | undefined,
      settings['external-auth-custom-oidc-client-secret'] as string | undefined
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
}

export {
  ExternalAuthOIDC
}
