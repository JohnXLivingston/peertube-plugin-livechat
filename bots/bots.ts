import { BotsConfig } from './lib/config'
import { logger } from './lib/logger'
import { BotComponent } from './lib/bot/component'
import { BotHandlerDemo } from './lib/bot/handlers/demo'

if (!process.argv[2]) {
  throw new Error('Missing parameter: the demobot configuration file path')
}
const botsConfig = new BotsConfig(process.argv[2])

const runningBots: BotComponent[] = []

async function start (botsConfig: BotsConfig): Promise<void> {
  await botsConfig.load()

  let atLeastOne: boolean = false
  if (botsConfig.useDemoBot()) {
    atLeastOne = true
    logger.info('Starting DemoBot...')

    const config = botsConfig.getDemoBotConfig()
    const instance = new BotComponent(
      'DemoBot',
      {
        service: config.service,
        domain: config.domain,
        password: config.password
      },
      config.mucDomain
    )
    runningBots.push(instance)

    instance.connect().then(async () => {
      for (const roomId of config.rooms) {
        const room = await instance.joinRoom(roomId, 'DemoBot')
        room.attachHandler(new BotHandlerDemo(room))
      }
    }).catch(err => { throw err })
  }
  if (!atLeastOne) {
    logger.info('No bot to launch, exiting.')
    process.exit(0)
  }
}

async function shutdown (): Promise<void> {
  logger.info('Shutdown...')
  for (const bot of runningBots) {
    logger.info('Stopping the bot ' + bot.botName + '...')
    await bot.disconnect()
  }
  process.exit(0)
}

// catching signals and do something before exit
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach((sig) => {
  process.on(sig, () => {
    logger.debug('Receiving signal: ' + sig)
    shutdown().catch((err) => {
      logger.error(`Error on shutting down: ${err as string}`)
    })
  })
})

start(botsConfig).catch((err) => {
  logger.error(`Function start failed: ${err as string}`)
  process.exit(1)
})
