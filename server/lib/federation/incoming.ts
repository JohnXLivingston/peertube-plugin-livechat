import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { RemoteVideoHandlerParams } from './types'
import { storeVideoLiveChatInfos } from './storage'
import { sanitizePeertubeLiveChatInfos } from './sanitize'

/**
 * This function reads incoming ActivityPub data, to detect LiveChat informations.
 * @param options server options
 * @param param1 handler parameters
 * @returns void
 */
async function readIncomingAPVideo (
  options: RegisterServerOptions,
  { video, videoAPObject }: RemoteVideoHandlerParams
): Promise<void> {
  let peertubeLiveChat = ('peertubeLiveChat' in videoAPObject) ? videoAPObject.peertubeLiveChat : false

  // We must sanitize peertubeLiveChat, as it comes for the outer world.
  peertubeLiveChat = sanitizePeertubeLiveChatInfos(peertubeLiveChat)

  await storeVideoLiveChatInfos(options, video, peertubeLiveChat)
}

export {
  readIncomingAPVideo
}
