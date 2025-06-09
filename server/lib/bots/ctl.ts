// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Config as XMPPChatBotConfig } from 'xmppjs-chat-bot'
import { BotConfiguration } from '../configuration/bot'
import { pluginName } from '../helpers'
import * as child_process from 'child_process'
import * as path from 'path'

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

    // We can't simple use 'npm exec xmppjs-chat-bot'.
    // Indeed, this will spawn subprocesses, and kill signals sent to the child
    // will not be sent to the real bot process.
    // So we will search the path of the bot executable, and launch it directly.
    const botExecPath = this._botExecPath()
    const execArgs = [
      'run',
      '-f',
      paths.moderation.globalFile,
      '--room-conf-dir',
      paths.moderation.roomConfDir
    ]
    const moderationBotProcess = child_process.spawn(botExecPath, execArgs, {
      cwd: __dirname, // must be in the livechat plugin tree, so that npm can found the package.
      env: {
        ...process.env, // will include NODE_ENV and co
        NODE_TLS_REJECT_UNAUTHORIZED: '0' // Prosody use self-signed certificates, the bot must accept them
      }
    })
    moderationBotProcess.stdout?.on('data', (data) => {
      this.logger.debug(`ModerationBot stdout: ${data as string}`)
    })
    moderationBotProcess.stderr?.on('data', (data) => {
      // change error level for non-relevant errors:
      data = data.toString()
      if (/Warning.*NODE_TLS_REJECT_UNAUTHORIZED.*'0'.*TLS/.test(data as string)) {
        this.logger.debug(`ModerationBot stderr: ${data as string}`)
        return
      }
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
        if (!this.moderationBotProcess) {
          resolve()
          return
        }
        const moderationBotProcess: ReturnType<typeof child_process.spawn> = this.moderationBotProcess

        let resolved = false
        // Trying to kill, and force kill if it takes more than X seconds
        const ms = 2000
        const timeout = setTimeout(() => {
          try {
            this.logger.error('Moderation bot was not killed within ' + ms.toString() + 'ms, force killing')
            moderationBotProcess.kill('SIGKILL')
          } catch (_err) {}
          resolved = true
          resolve()
        }, ms)

        moderationBotProcess.on('exit', () => {
          if (resolved) { return }
          resolved = true
          resolve()
          if (timeout) { clearTimeout(timeout) }
        })
        moderationBotProcess.on('close', () => {
          if (resolved) { return }
          resolved = true
          resolve()
          if (timeout) { clearTimeout(timeout) }
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

  protected _botExecPath (): string {
    let dir: string = __dirname
    let watchDog = 100

    this.logger.debug('Searching the bot binary, in the ' + pluginName + ' folder')
    while ((watchDog--) > 0 && path.basename(dir) !== pluginName && dir !== '/') {
      dir = path.resolve(dir, '..')
    }

    if (path.basename(dir) !== pluginName) {
      this.logger.error('Cant find the ' + pluginName + ' base dir, and so cant find the bot exec path.')
      throw new Error('Cant find the bot exec path')
    }

    // xmppjs-chat-bot must be ./node_modules/.bin/xmppjs-chat-bot
    const result = path.resolve(dir, 'node_modules', '.bin', 'xmppjs-chat-bot')
    this.logger.info(`The bot path should be ${result}`)
    return result
  }
}

export {
  BotsCtl
}
