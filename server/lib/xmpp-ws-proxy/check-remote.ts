import type { RegisterServerOptions } from '@peertube/peertube-types'
// import { getBaseRouterRoute } from '../helpers'
// import { canonicalizePluginUri } from '../uri/canonicalize'
// import { URL } from 'url'
// const got = require('got')

/**
 * FIXME: this method should not be necessary anymore, it was a proof of concept.
 *
 * This function checks that there is a valid Peertube instance behind
 * the remote url, to avoid spoofing.
 * It also ensure that we have needed serverInfos for the federation
 * (so we can also open outgoing proxyfied connection to that instance)
 * @param options server options
 * @param remoteInstanceUrl remote instance url to check (as readed in the request header)
 * @returns true if the remote instance is ok
 */
async function checkRemote (
  _options: RegisterServerOptions,
  _remoteInstanceUrl: any
): Promise<boolean> {
  throw new Error('Not Implemented Yet')

  // const logger = options.peertubeHelpers.logger
  // if (typeof remoteInstanceUrl !== 'string') {
  //   logger.info('WS-Proxy-Check: Received invalid request on xmpp-websocket-proxy: invalid remoteInstanceUrl header')
  //   return false
  // }
  // logger.debug(
  //   `WS-Proxy-Check: Receiving request on xmpp-websocket-proxy for host ${remoteInstanceUrl}, ` +
  //   'checking the host is a valid Peertube server'
  // )
  // let url: string
  // try {
  //   const u = new URL(remoteInstanceUrl)

  //   // Assuming that the path on the remote instance is the same as on this one
  //   // (but canonicalized to remove the plugin version)
  //   u.pathname = getBaseRouterRoute(options) + 'api/federation_server_infos'
  //   url = canonicalizePluginUri(options, u.toString(), {
  //     protocol: 'http',
  //     removePluginVersion: true
  //   })
  // } catch (_err) {
  //   logger.info('WS-Proxy-Check: Invalid remote instance url provided: ' + remoteInstanceUrl)
  //   return false
  // }

  // try {
  //   logger.debug('WS-Proxy-Check: We must check remote server infos using url: ' + url)
  //   const response = await got(url, {
  //     method: 'GET',
  //     headers: {},
  //     responseType: 'json'
  //   }).json()

  //   if (!response) {
  //     logger.info('WS-Proxy-Check: Invalid remote server options')
  //     return false
  //   }

  //   // FIXME/TODO

  //   return true
  // } catch (_err) {
  //   logger.info('WS-Proxy-Check: Can\'t get remote instance informations using url ' + url)
  //   return false
  // }
}

export {
  checkRemote
}
