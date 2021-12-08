import type { BotComponent } from './component'
import type { BotHandler } from './handlers/base'
import type { XMPPStanza, XMPPUser } from './types'
import EventEmitter from 'events'
import { JID } from '@xmpp/jid'
import { logger } from '../logger'

export class BotRoom extends EventEmitter {
  protected state: 'offline' | 'online' = 'offline'
  protected userJID: JID | undefined
  protected readonly roster: Map<string, XMPPUser> = new Map()

  protected readonly handlers: BotHandler[] = []

  constructor (
    protected readonly component: BotComponent,
    protected readonly roomJID: JID
  ) {
    super()

    this.on('reset', () => {
      this.state = 'offline'
      this.roster.clear()
    })
    this.on('stanza', (stanza: XMPPStanza, resource?: string) => {
      this.receiveStanza(stanza, resource)
    })
  }

  public isOnline (): boolean {
    return this.state === 'online'
  }

  public onlineUserCount (): number {
    let count = 0
    this.roster.forEach(user => {
      if (user.state === 'online') { count++ }
    })
    return count
  }

  public async join (nick: string): Promise<void> {
    this.userJID = new JID(this.roomJID.getLocal(), this.roomJID.getDomain(), nick)
    logger.debug(`Emitting a presence for room ${this.roomJID.toString()}...`)
    await this.component.sendStanza('presence',
      {
        to: this.userJID.toString()
      },
      this.component.xml('x', {
        xmlns: 'http://jabber.org/protocol/muc'
      })
    )
    // FIXME: should wait for a presence stanza from the server.
    // FIXME: should handle used nick errors.
  }

  public async part (): Promise<void> {
    if (!this.userJID) { return }
    logger.debug(`Emitting a presence=unavailable for room ${this.roomJID.toString()}...`)
    await this.component.sendStanza('presence', {
      to: this.userJID.toString(),
      type: 'unavailable'
    })
    // FIXME: should wait for a presence stanza from the server.
  }

  public async sendGroupchat (msg: string): Promise<void> {
    if (!this.userJID) { return }
    logger.debug(`Emitting a groupchat message for room ${this.roomJID.toString()}...`)
    await this.component.sendStanza(
      'message',
      {
        type: 'groupchat',
        to: this.roomJID.toString()
      },
      this.component.xml('body', {}, msg)
    )
  }

  public receiveStanza (stanza: XMPPStanza, fromResource?: string): void {
    if (stanza.name === 'presence') {
      this.receivePresenceStanza(stanza, fromResource)
    }
    if (stanza.name === 'message') {
      this.receiveMessageStanza(stanza, fromResource)
    }
  }

  public receivePresenceStanza (stanza: XMPPStanza, fromResource?: string): void {
    if (!fromResource) {
      return
    }

    const isPresent = stanza.attrs.type !== 'unavailable'

    const statusElems = stanza.getChild('x')?.getChildren('status')
    const statusCodes = []
    if (statusElems) {
      for (const s of statusElems) {
        statusCodes.push(parseInt(s.attrs.code))
      }
    }
    const isMe = statusCodes.includes(110) // status 110 means that is concern the current user.

    let user = this.roster.get(fromResource)
    const previousState = user?.state
    if (!isPresent) {
      if (!user) {
        return
      }
      user.state = 'offline'
      if (isMe) {
        this.state = 'offline'
      }
      if (previousState === 'online') {
        this.emit('room_part', user)
      }
    } else {
      if (!user) {
        user = {
          state: 'online',
          nick: fromResource,
          isMe: isMe
        }
        this.roster.set(fromResource, user)
      } else {
        user.state = 'online'
      }
      if (isMe) {
        this.state = 'online'
      }
      if (previousState !== 'online') {
        this.emit('room_join', user)
      }
    }
  }

  protected receiveMessageStanza (stanza: XMPPStanza, fromResource?: string): void {
    if (stanza.attrs.type !== 'groupchat') {
      return
    }
    // ignoring messages send by the bot himself
    if (stanza.attrs.from === this.userJID?.toString()) {
      return
    }
    // ignoring history messages
    if (stanza.getChild('delay')) {
      return
    }
    const body = stanza.getChild('body')
    // ignoring message without body (subject, ...)
    if (!body) {
      return
    }

    let mentionned: boolean = false // I'm I mentionned?
    // TODO: fix this ugly code.
    if (this.userJID) {
      const references = stanza.getChildren('reference')
      for (const reference of references) {
        if (reference.attrs.type === 'mention') {
          if (reference.attrs.uri === 'xmpp:' + this.userJID.toString()) {
            mentionned = true
          } else {
            const addr = this.component.getAddress()
            if (addr) {
              if (reference.attrs.uri === 'xmpp:' + addr.toString()) {
                mentionned = true
              }
            }
          }
        }
      }
    }

    const user = fromResource ? this.roster.get(fromResource) : undefined
    this.emit('room_message', body.toString(), user, mentionned)
  }

  public attachHandler (handler: BotHandler): void {
    this.handlers.push(handler)
  }

  public detachHandlers (): void {
    for (const handler of this.handlers) {
      handler.stop()
    }
  }
}
