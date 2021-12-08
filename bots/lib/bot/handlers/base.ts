import type { BotRoom } from '../room'

export abstract class BotHandler {
  constructor (
    protected readonly room: BotRoom
  ) {
    this.init()
  }

  protected abstract init (): void
  public abstract stop (): void
}
