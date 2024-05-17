import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import type { Affiliations } from '../../prosody/config/affiliations'
import { asyncMiddleware } from '../../middlewares/async'
import { isUserAdminOrModerator } from '../../helpers'
import { getProsodyDomain } from '../../prosody/config/domain'
import { updateProsodyRoom } from '../../prosody/api/manage-rooms'

async function initPromoteApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.put('/promote/:roomJID', asyncMiddleware(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const roomJIDLocalPart = req.params.roomJID
        const user = await options.peertubeHelpers.user.getAuthUser(res)

        if (!user || !await isUserAdminOrModerator(options, res)) {
          logger.warn('Current user tries to access the promote API for which he has no right.')
          res.sendStatus(403)
          return
        }

        if (!/^(channel\.\d+|(\w|-)+)$/.test(roomJIDLocalPart)) { // just check if it looks alright.
          logger.warn('Current user tries to access the promote API using an invalid room key.')
          res.sendStatus(400)
          return
        }

        const normalizedUsername = user.username.toLowerCase()
        const prosodyDomain = await getProsodyDomain(options)
        const jid = normalizedUsername + '@' + prosodyDomain

        const mucJID = roomJIDLocalPart + '@' + 'room.' + prosodyDomain

        logger.info('We must give owner affiliation to ' + jid + ' on ' + mucJID)
        const addAffiliations: Affiliations = {}
        addAffiliations[jid] = 'owner'
        await updateProsodyRoom(options, mucJID, {
          addAffiliations
        })
        res.sendStatus(200)
      } catch (err) {
        logger.error(err)
        res.sendStatus(500)
      }
    }
  ))
}

export {
  initPromoteApiRouter
}
