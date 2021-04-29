import type { Router, Request, Response, NextFunction } from 'express'

// See here for description: https://modules.prosody.im/mod_muc_http_defaults.html
interface RoomDefaults {
  name: string
  description: string
  // language: string
  // persistent: boolean
  public: boolean
  // members_only: boolean
  // allow_member_invites: boolean
  // public_jids: boolean
  subject: string
  // changesubject: boolean
  // // historylength: number
  // moderated: boolean
  // archiving: boolean
  // affiliations: RoomAffiliation[]
}

async function initApiRouter (options: RegisterServerOptions): Promise<Router> {
  const { peertubeHelpers, getRouter } = options
  const router = getRouter()
  const logger = peertubeHelpers.logger

  router.get('/room', async (_req: Request, res: Response, _next: NextFunction) => {
    logger.info('Requesting room information for room ...')
    // TODO: check if room is legit and fill informations
    const roomDefaults: RoomDefaults = {
      name: 'name_of_the_room',
      description: 'room description',
      public: false,
      subject: 'subject'
    }
    res.json(roomDefaults)
  })

  return router
}

export {
  initApiRouter
}
