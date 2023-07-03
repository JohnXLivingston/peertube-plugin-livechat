// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { RemoteVideoHandlerParams } from './types'
import { storeVideoLiveChatInfos, storeRemoteServerInfos } from './storage'
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
  peertubeLiveChat = sanitizePeertubeLiveChatInfos(options, peertubeLiveChat, video.url)

  await storeVideoLiveChatInfos(options, video, peertubeLiveChat)
  if (video.remote) {
    if (peertubeLiveChat !== false && peertubeLiveChat.xmppserver) {
      await storeRemoteServerInfos(options, peertubeLiveChat.xmppserver)
    }
  }
}

export {
  readIncomingAPVideo
}
