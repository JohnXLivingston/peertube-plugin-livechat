import { RoomComponentBot } from './room'

class DemoBot extends RoomComponentBot {
  protected async onRoomJoin (roomId: string, nick: string): Promise<void> {
    await this.sendGroupchat(roomId, `Hello ${nick}! I'm the DemoBot, I'm here to demonstrate the chatroom.`)
  }
}

export {
  DemoBot
}
