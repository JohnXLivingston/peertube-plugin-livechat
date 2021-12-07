import * as path from 'path'
import * as fs from 'fs'
import decache from 'decache'
import { logger } from '../lib/logger'

interface DemoBotConfig {
  rooms: string[]
  service: string
  domain: string
  mucDomain: string
  password: string
}

class BotsConfig {
  protected readonly configDir: string
  protected configs: {
    demobot?: DemoBotConfig
  }

  constructor (configDir: string) {
    this.configDir = configDir = path.resolve(configDir)

    // Not necessary, but just in case: perform some path checking... (to limit code injection risks)
    const parts = configDir.split(path.sep)
    if (!parts.includes('peertube-plugin-livechat')) {
      // Indeed, the path should contain the plugin name
      // (/var/www/peertube/storage/plugins/data/peertube-plugin-livechat/...)
      throw new Error('Bots configuration dir seems invalid (not in peertube-plugin-livechat folder).')
    }

    this.configs = {}
  }

  public async load (): Promise<void> {
    await this.loadDemoBot()
  }

  protected async loadDemoBot (): Promise<void> {
    const configPath = path.resolve(this.configDir, 'demobot.js')
    logger.debug(`Loading DemoBot config from file ${configPath}`)
    if (!fs.existsSync(configPath)) {
      logger.debug('The config file for DemoBot does not exist.')
      delete this.configs.demobot
      return
    }

    decache(configPath)

    logger.debug('require DemoBot config file...')
    const conf = require(configPath).getConf() as DemoBotConfig | null
    if (!conf) {
      logger.debug('getConf() returned null for the DemoBot.')
      delete this.configs.demobot
      return
    }
    if (!conf.rooms || !conf.domain || !conf.mucDomain || !conf.password || !conf.service) {
      logger.error('Invalid DemoBot configuration: ' + JSON.stringify(conf))
      delete this.configs.demobot
      return
    }

    // Conf seems legit. But if there is no rooms, no need to keep it.
    if (!conf.rooms.length) {
      logger.debug('No room in DemoBot config.')
      delete this.configs.demobot
      return
    }

    // TODO: detect changes? avoid reloading when not needed? or should it be by the caller?
    logger.debug('Config loaded for demobot: ' + JSON.stringify(conf))
    this.configs.demobot = conf
  }

  public useDemoBot (): boolean {
    return (this.configs.demobot?.rooms?.length ?? 0) > 0
  }

  public getDemoBotConfig (): DemoBotConfig {
    if (!this.configs.demobot) {
      throw new Error('Should not call getDemoBotConfig when useDemoBot is false.')
    }
    return this.configs.demobot
  }
}

export {
  BotsConfig
}
