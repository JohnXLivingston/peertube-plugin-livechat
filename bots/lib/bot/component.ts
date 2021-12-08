import type { XMPPStanza, XMPPStanzaType } from './types'
import type { Node } from '@xmpp/xml'
import { logger } from '../logger'
import { component, xml, Component, Options } from '@xmpp/component'
import { parse, JID } from '@xmpp/jid'
import { BotRoom } from './room'

class BotComponent {
  protected xmpp?: Component
  protected address?: JID
  public readonly xml = xml
  protected rooms: Map<string, BotRoom> = new Map()

  constructor (
    public readonly botName: string,
    protected readonly connectionConfig: Options,
    protected readonly mucDomain: string
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
      logger.debug('stanza received' + stanza.toString())
      if (!stanza.attrs.from) { return }
      const jid = parse(stanza.attrs.from)
      const roomJid = jid.bare() // removing the «resource» part of the jid.
      const room = this.rooms.get(roomJid.toString())
      if (!room) {
        return
      }
      room.emit('stanza', stanza, jid.getResource())
    })

    this.xmpp.on('online', (address) => {
      logger.debug('Online with address' + address.toString())

      this.address = address

      // 'online' is emitted at reconnection, so we must reset rooms rosters
      this.rooms.forEach(room => room.emit('reset'))
    })

    this.xmpp.on('offline', () => {
      logger.info(`Stoppping process: ${this.botName} is now offline.`)
    })

    await this.xmpp.start()
  }

  public async disconnect (): Promise<any> {
    for (const [roomId, room] of this.rooms) {
      logger.debug(`Leaving room ${roomId}...`)
      await room.part()
    }
    await this.xmpp?.stop()
    this.xmpp = undefined
  }

  public async sendStanza (
    type: XMPPStanzaType,
    attrs: object,
    ...children: Node[]
  ): Promise<void> {
    attrs = Object.assign({
      from: this.address?.toString()
    }, attrs)

    const stanza = this.xml(type, attrs, ...children)
    logger.debug('stanza to emit: ' + stanza.toString())
    await this.xmpp?.send(stanza)
  }

  public async joinRoom (roomId: string, nick: string): Promise<BotRoom> {
    const roomJID = new JID(roomId, this.mucDomain)
    const roomJIDstr = roomJID.toString()
    let room: BotRoom | undefined = this.rooms.get(roomJIDstr)
    if (!room) {
      room = new BotRoom(this, roomJID)
      this.rooms.set(roomJIDstr, room)
    }
    await room.join(nick)
    return room
  }

  public async partRoom (roomId: string): Promise<void> {
    const roomJID = new JID(roomId, this.mucDomain)
    const room = this.rooms.get(roomJID.toString())
    if (!room) {
      return
    }
    await room.part()
  }
}

export {
  BotComponent
}
