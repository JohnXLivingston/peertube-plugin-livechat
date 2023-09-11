import type { RegisterServerOptions } from '@peertube/peertube-types'
import { getCurrentProsody } from './host'
import { getAPIKey } from '../../apikey'
const got = require('got')

interface ProsodyRoomDesc {
  jid: string
  localpart: string
  name: string
  lang: string
  description: string
  lasttimestamp?: number
}

async function listProsodyRooms (options: RegisterServerOptions): Promise<ProsodyRoomDesc[]> {
  const logger = options.peertubeHelpers.logger

  const currentProsody = getCurrentProsody()
  if (!currentProsody) {
    throw new Error('It seems that prosody is not binded... Cant list rooms.')
  }

  // Requesting on localhost, because currentProsody.host does not always resolves correctly (docker use case, ...)
  const apiUrl = `http://localhost:${currentProsody.port}/peertubelivechat_list_rooms/list-rooms`
  logger.debug('Calling list rooms API on url: ' + apiUrl)
  const rooms = await got(apiUrl, {
    method: 'GET',
    headers: {
      authorization: 'Bearer ' + await getAPIKey(options),
      host: currentProsody.host
    },
    responseType: 'json',
    resolveBodyOnly: true
  })

  return rooms
}

export {
  listProsodyRooms
}
