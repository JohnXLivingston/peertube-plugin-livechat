import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Config as XMPPChatBotConfig } from 'xmppjs-chat-bot'
import { BotConfiguration } from '../configuration/bot'
import * as child_process from 'child_process'

let singleton: BotsCtl | undefined

/**
 * This class is to control the plugin bots.
 * For now there is only one, the Moderation bot.
 * But all public methods are made as if there was several bots, so it will be easier to add bots.
 */
class BotsCtl {
  protected readonly options: RegisterServerOptions
  protected readonly moderationGlobalConf: XMPPChatBotConfig
  protected readonly logger: {
    debug: (s: string) => void
    info: (s: string) => void
    warn: (s: string) => void
    error: (s: string) => void
  }

  protected moderationBotProcess: ReturnType<typeof child_process.spawn> | undefined

  constructor (params: {
    options: RegisterServerOptions
    moderationGlobalConf: XMPPChatBotConfig
  }) {
    this.options = params.options
    this.moderationGlobalConf = params.moderationGlobalConf

    const logger = params.options.peertubeHelpers.logger
    this.logger = {
      debug: (s) => logger.debug('[Bots] ' + s),
      info: (s) => logger.info('[Bots] ' + s),
      warn: (s) => logger.warn('[Bots] ' + s),
      error: (s) => logger.error('[Bots] ' + s)
    }
  }

  /**
   * Starts all the required bots.
   * If bots are already running, does nothing.
   */
  public async start (): Promise<void> {
    if (await this.options.settingsManager.getSetting('disable-channel-configuration')) {
      this.logger.info('Advanced channel configuration is disabled, no bot to start')
      return
    }

    this.logger.info('Starting moderation bot...')

    if (this.moderationBotProcess?.exitCode === null) {
      this.logger.info('Moderation bot still running, nothing to do')
      return
    }

    const paths = BotConfiguration.singleton().configurationPaths()

    // We will run: npm exec -- xmppjs-chat-bot [...]
    const execArgs = [
      'exec',
      '--',
      'xmppjs-chat-bot',
      'run',
      '-f',
      paths.moderation.globalFile,
      '--room-conf-dir',
      paths.moderation.roomConfDir
    ]
    const moderationBotProcess = child_process.spawn('npm', execArgs, {
      cwd: __dirname, // must be in the livechat plugin tree, so that npm can found the package.
      env: {
        ...process.env // will include NODE_ENV and co
      }
    })
    moderationBotProcess.stdout?.on('data', (data) => {
      this.logger.debug(`ModerationBot stdout: ${data as string}`)
    })
    moderationBotProcess.stderr?.on('data', (data) => {
      this.logger.error(`ModerationBot stderr: ${data as string}`)
    })
    moderationBotProcess.on('error', (error) => {
      this.logger.error(`ModerationBot exec error: ${JSON.stringify(error)}`)
    })
    moderationBotProcess.on('exit', (code) => {
      this.logger.info(`ModerationBot process exited with code ${code ?? 'null'}`)
    })
    moderationBotProcess.on('close', (code) => {
      this.logger.info(`ModerationBot process closed all stdio with code ${code ?? 'null'}`)
    })

    this.moderationBotProcess = moderationBotProcess
  }

  /**
   * Stops all the bots
   */
  public async stop (): Promise<void> {
    this.logger.info('Stopping bots...')

    if (!this.moderationBotProcess) {
      this.logger.info('moderationBot was never running, everything is fine.')
      return
    }
    if (this.moderationBotProcess.exitCode !== null) {
      this.logger.info('The moderation bot has an exitCode, already stopped.')
      return
    }
    const p = new Promise<void>((resolve, reject) => {
      try {
        if (!this.moderationBotProcess) { resolve() }
        const moderationBotProcess: ReturnType<typeof child_process.spawn> =
          this.moderationBotProcess as ReturnType<typeof child_process.spawn>

        let resolved = false
        // Trying to kill, and force kill if it takes more than 2 seconds
        const timeout = setTimeout(() => {
          this.logger.error('Moderation bot was not killed within 2 seconds, force killing')
          moderationBotProcess.kill('SIGKILL')
          resolved = true
          resolve()
        }, 2000)

        moderationBotProcess.on('exit', () => {
          if (resolved) { return }
          resolved = true
          if (timeout) { clearTimeout(timeout) }
          resolve()
        })
        moderationBotProcess.on('close', () => {
          if (resolved) { return }
          resolved = true
          if (timeout) { clearTimeout(timeout) }
          resolve()
        })
        moderationBotProcess.kill()
      } catch (err) {
        this.logger.error(err as string)
        reject(err)
      }
    })

    return p
  }

  /**
   * Instanciate a new singleton
   * @param options server options
   */
  public static async initSingleton (options: RegisterServerOptions): Promise<BotsCtl> {
    // forceRefresh the bot global configuration file:
    const moderationGlobalConf = await BotConfiguration.singleton().getModerationBotGlobalConf(true)

    singleton = new BotsCtl({
      options,
      moderationGlobalConf
    })
    return singleton
  }

  /**
   * Returns the singleton, of thrown an exception if it is not initialized yet.
   * @returns the singleton
   */
  public static singleton (): BotsCtl {
    if (!singleton) {
      throw new Error('Bots singleton not initialized yet')
    }
    return singleton
  }

  public static async destroySingleton (): Promise<void> {
    if (!singleton) { return }
    await singleton.stop()
    singleton = undefined
  }
}

export {
  BotsCtl
}
