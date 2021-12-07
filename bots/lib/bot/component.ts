/* eslint-disable no-void */
import { logger } from '../logger'
import { XMPP, XMPPXmlFunction, XMPPStanza, XMPPAddress } from './types'

const { component, xml } = require('@xmpp/component')

interface ComponentConnectionConfig {
  service: string
  domain: string
  password: string
}

abstract class ComponentBot {
  protected xmpp?: XMPP
  protected address?: XMPPAddress

  constructor (
    public readonly botName: string,
    protected readonly connectionConfig: ComponentConnectionConfig
  ) {}

  protected xml: XMPPXmlFunction = (...args) => xml(...args)

  public async connect (): Promise<void> {
    this.xmpp = component({
      service: this.connectionConfig.service,
      domain: this.connectionConfig.domain,
      password: this.connectionConfig.password
    }) as XMPP

    this.xmpp.on('error', (err: any) => {
      logger.error(err)
    })

    this.xmpp.on('offline', () => {
      logger.info(`${this.botName} is now offline.`)
    })

    this.xmpp.on('stanza', (stanza: XMPPStanza) => {
      logger.debug('stanza received' + (stanza?.toString ? ': ' + stanza.toString() : ''))
      if (stanza.is('message')) {
        void this.onMessage(stanza)
      }
      if (stanza.is('presence')) {
        void this.onPresence(stanza)
      }
      if (stanza.is('iq')) {
        void this.onIq(stanza)
      }
    })

    this.xmpp.on('online', (address: XMPPAddress) => {
      logger.debug('Online with address' + address.toString())

      this.address = address
      void this.onOnline()
    })

    this.xmpp.start()
  }

  public async stop (): Promise<any> {
    const p = new Promise((resolve) => {
      this.xmpp?.on('offline', () => {
        logger.info(`Stoppping process: ${this.botName} is now offline.`)
        resolve(true)
      })
    })
    await this.xmpp?.stop()
    await p
  }

  protected async onMessage (_stanza: XMPPStanza): Promise<void> {}
  protected async onIq (_stanza: XMPPStanza): Promise<void> {}
  protected async onPresence (_stanza: XMPPStanza): Promise<void> {}
  protected async onOnline (): Promise<void> {}
}

export {
  ComponentConnectionConfig,
  ComponentBot
}
