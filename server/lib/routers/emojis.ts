// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { asyncMiddleware } from '../middlewares/async'
import { Emojis } from '../emojis'

export async function initEmojisRouter (
  options: RegisterServerOptions,
  router: Router
): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get(
    '/emojis/channel/:channelId/definition',
    asyncMiddleware(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const emojis = Emojis.singletonSafe()
        if (!emojis) {
          res.sendStatus(404)
          return
        }

        const channelId = parseInt(req.params.channelId)
        if (!channelId || isNaN(channelId)) {
          res.sendStatus(400)
          return
        }

        if (!await emojis.channelHasCustomEmojis(channelId)) {
          res.sendStatus(404)
          return
        }

        res.sendFile(emojis.channelCustomEmojisDefinitionPath(channelId))
      } catch (err) {
        logger.error(err)
        res.sendStatus(500)
      }
    })
  )

  // Note: CORS is handled by Peertube.
  router.get(
    '/emojis/channel/:channelId/files/:fileName',
    asyncMiddleware(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const emojis = Emojis.singletonSafe()
        if (!emojis) {
          res.sendStatus(404)
          return
        }

        const channelId = parseInt(req.params.channelId)
        if (!channelId || isNaN(channelId)) {
          res.sendStatus(400)
          return
        }

        const fileName = req.params.fileName
        if (!emojis.validImageFileName(fileName)) {
          res.sendStatus(400)
          return
        }

        if (!await emojis.channelHasCustomEmojis(channelId)) {
          res.sendStatus(404)
          return
        }

        res.sendFile(
          emojis.channelCustomEmojisFilePath(channelId, fileName),
          {
            immutable: true,
            maxAge: 1000 * 60 * 60 * 24 // 24h
          },
          (err) => {
            if (err) {
              if (!res.headersSent) {
                res.sendStatus(404)
              }
            }
          }
        )
      } catch (err) {
        logger.error(err)
        res.sendStatus(500)
      }
    })
  )
}
