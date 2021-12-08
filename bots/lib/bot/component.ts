/* eslint-disable no-void */
import { logger } from '../logger'
import type { XMPPStanza } from './types'
import { component, xml, Component } from '@xmpp/component'
import type { JID } from '@xmpp/jid'

interface ComponentConnectionConfig {
  service: string
  domain: string
  password: string
}

abstract class ComponentBot {
  protected xmpp?: Component
  protected address?: JID
  protected xml = xml

  constructor (
    public readonly botName: string,
    protected readonly connectionConfig: ComponentConnectionConfig
  ) {}

  public async connect (): Promise<void> {
    this.xmpp = component({
      service: this.connectionConfig.service,
      domain: this.connectionConfig.domain,
      password: this.connectionConfig.password
    })

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

    this.xmpp.on('online', (address) => {
      logger.debug('Online with address' + address.toString())

      this.address = address
      void this.onOnline()
    })

    await this.xmpp.start()
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
