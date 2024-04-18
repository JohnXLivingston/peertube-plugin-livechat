import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ExternalAccountInfos } from '../../external-auth/types'
import { getCurrentProsody } from './host'
import { getProsodyDomain } from '../config/domain'
import { getAPIKey } from '../../apikey'
const got = require('got')

/**
 * Created or updates a user.
 * Can be used to manage external accounts for example (create the user the first time, update infos next time).
 * Uses an API provided by mod_http_peertubelivechat_manage_users.
 *
 * @param options Peertube server options
 * @param data up-to-date user infos.
 * @returns true if success
 */
async function ensureUser (options: RegisterServerOptions, infos: ExternalAccountInfos): Promise<boolean> {
  const logger = options.peertubeHelpers.logger

  const currentProsody = getCurrentProsody()
  if (!currentProsody) {
    throw new Error('It seems that prosody is not binded... Cant call API.')
  }

  const prosodyDomain = await getProsodyDomain(options)

  logger.info('Calling ensureUser for ' + infos.jid)

  // Requesting on localhost, because currentProsody.host does not always resolves correctly (docker use case, ...)
  const apiUrl = `http://localhost:${currentProsody.port}/` +
    'peertubelivechat_manage_users/' +
    `external.${prosodyDomain}/` + // the virtual host name
    'ensure-user'
  const apiData = {
    jid: infos.jid,
    nickname: infos.nickname,
    password: infos.password,
    avatar: infos.avatar
  }
  try {
    logger.debug('Calling ensure-user API on url: ' + apiUrl)
    const result = await got(apiUrl, {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + await getAPIKey(options),
        host: currentProsody.host
      },
      json: apiData,
      responseType: 'json',
      resolveBodyOnly: true
    })

    logger.debug('ensure-user API response: ' + JSON.stringify(result))
    if (result.result !== 'ok') {
      logger.error('ensure-user API has failed: ' + JSON.stringify(result))
      return false
    }
  } catch (err) {
    logger.error(`ensure-user failed: ' ${err as string}`)
    return false
  }
  return true
}

/**
 * Calls an API provided by mod_http_peertubelivechat_manage_users, to prune unused users.
 * @param options Peertube server options
 * @throws Error
 */
async function pruneUsers (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger

  const currentProsody = getCurrentProsody()
  if (!currentProsody) {
    throw new Error('It seems that prosody is not binded... Cant call API.')
  }

  const prosodyDomain = await getProsodyDomain(options)

  logger.info('Calling pruneUsers')

  // Requesting on localhost, because currentProsody.host does not always resolves correctly (docker use case, ...)
  const apiUrl = `http://localhost:${currentProsody.port}/` +
    'peertubelivechat_manage_users/' +
    `external.${prosodyDomain}/` + // the virtual host name
    'prune-users'

  try {
    logger.debug('Calling prune-users API on url: ' + apiUrl)
    await got(apiUrl, {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + await getAPIKey(options),
        host: currentProsody.host
      },
      json: {},
      responseType: 'json',
      resolveBodyOnly: true
    })
  } catch (err) {
    logger.error(`prune-users failed: ' ${err as string}`)
  }
}

export {
  ensureUser,
  pruneUsers
}
