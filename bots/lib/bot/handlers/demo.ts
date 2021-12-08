import type { XMPPUser } from '../types'
import { logger } from '../../logger'
import { BotHandler } from './base'

const RANDOM_MESSAGES: string[] = [
  '🎵🎶',
  '🎵🎶 I\'m just a bot, I\'m just a bot in the world. 🎵🎶',
  'You can see who is connected by opening the right panel.',
  'This is a random message.',
  'Oh, yet another random message.',
  'You can mention a user using a @ in front of a user\'s nick. Try to mention me.'
]

export class BotHandlerDemo extends BotHandler {
  protected readonly lastHellos: Map<string, Date> = new Map()
  protected randomCount: number = 0
  protected randomTimeout: NodeJS.Timeout | undefined

  protected init (): void {
    const room = this.room
    room.on('room_join', (user: XMPPUser) => {
      if (user.isMe) {
        return
      }
      if (!room.isOnline()) {
        return
      }
      const lastHello = this.lastHellos.get(user.nick)
      const now = new Date()
      let msg: string
      if (lastHello) {
        logger.debug(`The user ${user.nick} was already seen at ${lastHello.toString()}`)
        if ((now.getTime() - lastHello.getTime()) < 3600 * 1000) { // no more than one hello per hour
          logger.info(`The user ${user.nick} was seen to recently, no message to send.`)
          return
        }
        logger.info(`The user ${user.nick} was seen a long time ago, sending a message.`)
        msg = `Hello ${user.nick}! Happy to see you again.`
      } else {
        logger.info(`The user ${user.nick} is here for the first time. Sending a message.`)
        msg = `Hello ${user.nick}! I'm the DemoBot, I'm here to demonstrate the chatroom.`
      }
      this.lastHellos.set(user.nick, now)
      room.sendGroupchat(msg).catch(() => {})
    })

    this.randomTimeout = setInterval(() => {
      this.sendRandomMessage()
    }, 10 * 1000)
  }

  public stop (): void {
    if (this.randomTimeout) {
      clearInterval(this.randomTimeout)
    }
  }

  protected sendRandomMessage (): void {
    const room = this.room
    if (!room.isOnline()) { return }
    // checking if there is someone to listen...
    const onlineUserCount = this.room.onlineUserCount()
    if (onlineUserCount < 2) { return }
    const cpt = this.randomCount++
    logger.info(`Emitting the random message number ${cpt}.`)
    this.room.sendGroupchat(RANDOM_MESSAGES[cpt % RANDOM_MESSAGES.length]).catch(() => {})
  }
}
