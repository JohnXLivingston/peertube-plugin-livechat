import type { XMPPUser } from '../types'
import { BotHandler } from './base'

export class BotHandlerDemo extends BotHandler {
  protected init (): void {
    const room = this.room
    room.on('room_join', (user: XMPPUser) => {
      if (user.isMe) {
        return
      }
      if (!room.isOnline()) {
        return
      }
      room.sendGroupchat(
        `Hello ${user.nick}! I'm the DemoBot, I'm here to demonstrate the chatroom.`
      ).catch(() => {})
    })
  }
}
