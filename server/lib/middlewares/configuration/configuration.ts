import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Request, Response, NextFunction } from 'express'
import type { RequestPromiseHandler } from '../async'

/**
 * Returns a middleware handler to check if advanced configuration is not disabled
 * @param options Peertube server options
 * @returns middleware function
 */
function checkConfigurationEnabledMiddleware (options: RegisterServerOptions): RequestPromiseHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const settings = await options.settingsManager.getSettings([
      'disable-channel-configuration'
    ])
    if (!settings['disable-channel-configuration']) {
      next()
      return
    }
    options.peertubeHelpers.logger.info('Advanced Configuration is disabled, blocking the request.')
    res.sendStatus(403)
  }
}

export {
  checkConfigurationEnabledMiddleware
}
