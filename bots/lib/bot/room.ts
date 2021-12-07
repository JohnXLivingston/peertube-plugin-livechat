import { ComponentBot, ComponentConnectionConfig } from './component'
import { XMPPStanza } from './types'
import { logger } from '../logger'

interface RoomComponentBotRoomDescription {
  jid: string
  nick: string
  users: Map<string, {
    // TODO: add the current user status somewhere.
    nick: string
  }>
}

abstract class RoomComponentBot extends ComponentBot {
  protected readonly rooms: {[jid: string]: RoomComponentBotRoomDescription} = {}

  constructor (
    botName: string,
    connectionConfig: ComponentConnectionConfig,
    roomIds: string[],
    protected readonly nick: string
  ) {
    super(botName, connectionConfig)
    for (const roomId of roomIds) {
      this.rooms[roomId] = {
        jid: roomId,
        nick: nick,
        users: new Map()
      }
    }
  }

  async onOnline (): Promise<void> {
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId]
      logger.debug(`Connecting to room ${room.jid}...`)
      const presence = this.xml(
        'presence',
        {
          from: this.address?.toString(),
          to: room.jid + '/' + room.nick
        },
        this.xml('x', {
          xmlns: 'http://jabber.org/protocol/muc'
        })
      )
      await this.xmpp?.send(presence)
    }
    await super.onOnline()
  }

  protected async onPresence (stanza: XMPPStanza): Promise<void> {
    const [stanzaRoomId, stanzaNick] = stanza.attrs?.from.split('/')
    if (this.rooms[stanzaRoomId]) {
      await this.onRoomPresence(stanzaRoomId, stanza, stanzaNick)
    }
  }

  public async sendGroupchat (roomId: string, msg: string): Promise<void> {
    const room = this.rooms[roomId]
    if (!room) {
      logger.error('Trying to send a groupchat on an unknown room: ' + roomId)
      return
    }
    const message = this.xml(
      'message',
      {
        type: 'groupchat',
        to: room.jid,
        from: this.address?.toString()
      },
      this.xml('body', {}, msg)
    )
    logger.debug('Sending message...: ' + (message.toString() as string))
    await this.xmpp?.send(message)
  }

  public async stop (): Promise<any> {
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId]
      logger.debug(`Leaving room ${room.jid}...`)
      const presence = this.xml(
        'presence',
        {
          from: this.address?.toString(),
          to: room.jid + '/' + room.nick,
          type: 'unavailable'
        }
      )
      // FIXME: should wait for a presence stanza from the server.
      await this.xmpp?.send(presence)
    }
    await super.stop()
  }

  protected async onRoomPresence (
    roomId: string,
    stanza: XMPPStanza,
    nick?: string
  ): Promise<any> {
    const room = this.rooms[roomId]
    if (!room) {
      return
    }
    if (!nick) {
      return
    }
    const isPresent = stanza.attrs?.type !== 'unavailable'
    // FIXME: selfPresence should better be tested by searching status=110
    const selfPresence = room.nick === nick
    if (!isPresent) {
      room.users.delete(nick)
      if (!selfPresence) {
        await this.onRoomPart(roomId, nick)
      }
      return
    }
    room.users.set(nick, {
      nick
    })
    if (!selfPresence) {
      await this.onRoomJoin(roomId, nick)
    }
  }

  protected async onRoomJoin (_roomId: string, _nick: string): Promise<void> {}
  protected async onRoomPart (_roomId: string, _nick: string): Promise<void> {}
}

export {
  RoomComponentBot
}
