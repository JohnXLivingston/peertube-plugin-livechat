import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { RemoteVideoHandlerParams } from './types'

async function readIncomingAPVideo (
  options: RegisterServerOptions,
  { video, videoAPObject }: RemoteVideoHandlerParams
): Promise<void> {
  if (!('peertubeLiveChat' in videoAPObject)) {
    return
  }
  const logger = options.peertubeHelpers.logger
  // TODO: save the information.
  logger.debug(
    `Remote video uuid=${video.uuid} has a peertubeLiveChat attribute: ` +
    JSON.stringify(videoAPObject.peertubeLiveChat)
  )
}

export {
  readIncomingAPVideo
}
