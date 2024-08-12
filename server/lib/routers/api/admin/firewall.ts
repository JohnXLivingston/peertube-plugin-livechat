// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { AdminFirewallConfiguration } from '../../../../../shared/lib/types'
import { asyncMiddleware, RequestPromiseHandler } from '../../../middlewares/async'
import { checkUserIsAdminMiddleware } from '../../../middlewares/is-admin'
import {
  getModFirewallConfig, sanitizeModFirewallConfig, saveModFirewallConfig, canEditFirewallConfig
} from '../../../firewall/config'
import { getProsodyFilePaths, writeProsodyConfig } from '../../../prosody/config'
import { reloadProsody } from '../../../prosody/ctl'

function canEditFirewallConfigMiddleware (options: RegisterServerOptions): RequestPromiseHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!await canEditFirewallConfig(options)) {
      options.peertubeHelpers.logger.info('Firewall configuration editing is disabled')
      res.sendStatus(403)
      return
    }
    next()
  }
}

async function initAdminFirewallApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get('/admin/firewall', asyncMiddleware([
    checkUserIsAdminMiddleware(options),
    canEditFirewallConfigMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const prosodyPaths = await getProsodyFilePaths(options)
        const result: AdminFirewallConfiguration = await getModFirewallConfig(options, prosodyPaths.modFirewallFiles)
        res.status(200)
        res.json(result)
      } catch (err) {
        options.peertubeHelpers.logger.error(err)
        res.sendStatus(500)
      }
    }
  ]))

  router.post('/admin/firewall', asyncMiddleware([
    checkUserIsAdminMiddleware(options),
    canEditFirewallConfigMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const prosodyPaths = await getProsodyFilePaths(options)

        let data: AdminFirewallConfiguration
        try {
          data = await sanitizeModFirewallConfig(options, req.body)
        } catch (err) {
          logger.error(err)
          res.sendStatus(400)
          return
        }

        await saveModFirewallConfig(options, prosodyPaths.modFirewallFiles, data)

        logger.info('Just saved a new mod_firewall const, must rewrite Prosody configuration file, and reload Prosody.')
        await writeProsodyConfig(options)
        await reloadProsody(options)

        const result: AdminFirewallConfiguration = await getModFirewallConfig(options, prosodyPaths.modFirewallFiles)
        res.status(200)
        res.json(result)
      } catch (err) {
        options.peertubeHelpers.logger.error(err)
        res.sendStatus(500)
      }
    }
  ]))
}

export {
  initAdminFirewallApiRouter
}
