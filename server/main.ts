import { initSettings } from './lib/settings'
import { initRouters } from './lib/routers'

async function register ({
  registerSetting,
  settingsManager,
  getRouter,
  peertubeHelpers
}: RegisterServerOptions): Promise<any> {
  await initSettings({ registerSetting })
  await initRouters({
    settingsManager,
    getRouter,
    peertubeHelpers
  })
}

async function unregister (): Promise<any> {
}

module.exports = {
  register,
  unregister
}
