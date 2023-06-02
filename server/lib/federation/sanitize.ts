import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { LiveChatJSONLDAttributeV1, PeertubeXMPPServerInfos } from './types'
import { URL } from 'url'

/**
 * Use this function for incoming remote informations.
 * It will sanitize them, by checking everything is ok.
 * It can also migrate from old format to the new one.
 *
 * This function can be used when informations are incoming,
 * or when reading stored information (to automatically migrate them)
 *
 * @param options server options
 * @param chatInfos remote chat informations
 * @param referenceUrl optional url string. If given, we must check that urls are on the same domain, to avoid spoofing.
 * @returns a sanitized version of the remote chat informations
 */
function sanitizePeertubeLiveChatInfos (
  options: RegisterServerOptions,
  chatInfos: any,
  referenceUrl?: string
): LiveChatJSONLDAttributeV1 {
  if (chatInfos === false) { return false }
  if (typeof chatInfos !== 'object') { return false }

  if (chatInfos.type !== 'xmpp') { return false }
  if ((typeof chatInfos.jid) !== 'string') { return false }

  if (!('xmppserver' in chatInfos)) {
    // V0 format, migrating on the fly to v1.
    return _sanitizePeertubeLiveChatInfosV0(options, chatInfos, referenceUrl)
  }

  if (!chatInfos.xmppserver || (typeof chatInfos.xmppserver !== 'object')) {
    return false
  }
  const xmppserver = sanitizePeertubeLiveChatServerInfos(options, chatInfos.xmppserver, referenceUrl)
  if (!xmppserver) { return false }

  const r: LiveChatJSONLDAttributeV1 = {
    type: chatInfos.type,
    jid: chatInfos.jid,
    xmppserver
  }

  return r
}

/**
 * Use this function for incoming remote server informations.
 * It will sanitize them, by checking everything is ok.
 * It can also migrate from old format to the new one.
 *
 * This function can be used when informations are incoming,
 * or when reading stored information (to automatically migrate them)
 * @param options server options
 * @param xmppserver remote server information
 * @param referenceUrl optional url string. If given, we must check that urls are on the same domain, to avoid spoofing.
 * @returns a sanitized version of remote server information (or false if not valid)
 */
function sanitizePeertubeLiveChatServerInfos (
  options: RegisterServerOptions, xmppserver: any, referenceUrl?: string
): PeertubeXMPPServerInfos | false {
  if (!xmppserver || (typeof xmppserver !== 'object')) {
    return false
  }

  let checkHost: undefined | string
  if (referenceUrl) {
    checkHost = _readReferenceUrl(referenceUrl)
    if (!checkHost) {
      options.peertubeHelpers.logger.error(
        'sanitizePeertubeLiveChatServerInfos: got an invalid referenceUrl: ' + referenceUrl
      )
      return false
    }
  }

  if ((typeof xmppserver.host) !== 'string') { return false }
  const host = _validateHost(xmppserver.host, checkHost)
  if (!host) { return false }
  if ((typeof xmppserver.muc) !== 'string') { return false }
  const muc = _validateHost(xmppserver.muc, checkHost)
  if (!muc) { return false }

  const r: PeertubeXMPPServerInfos = {
    host,
    muc
  }

  if (xmppserver.directs2s) {
    if ((typeof xmppserver.directs2s) === 'object') {
      const port = xmppserver.directs2s.port
      if ((typeof port === 'string') && /^\d+$/.test(port)) {
        r.directs2s = {
          port
        }
      }
    }
  }
  if (xmppserver.websockets2s) {
    if ((typeof xmppserver.websockets2s) === 'object') {
      const url = xmppserver.websockets2s.url
      if ((typeof url === 'string') && _validUrl(url, {
        noSearchParams: true,
        protocol: 'ws.',
        domain: checkHost
      })) {
        r.websockets2s = {
          url
        }
      }
    }
  }
  if (xmppserver.anonymous) {
    const virtualhost = _validateHost(xmppserver.anonymous.virtualhost, checkHost)
    if (virtualhost) {
      r.anonymous = {
        virtualhost
      }

      const bosh = xmppserver.anonymous.bosh
      if ((typeof bosh === 'string') && _validUrl(bosh, {
        noSearchParams: true,
        protocol: 'http.',
        domain: checkHost
      })) {
        r.anonymous.bosh = bosh
      }

      const websocket = xmppserver.anonymous.websocket
      if ((typeof websocket === 'string') && _validUrl(websocket, {
        noSearchParams: true,
        protocol: 'ws.',
        domain: checkHost
      })) {
        r.anonymous.websocket = websocket
      }
    }
  }

  return r
}

interface URLConstraints {
  protocol: 'http.' | 'ws.'
  noSearchParams: boolean
  domain?: string
}

function _validUrl (s: string, constraints: URLConstraints): boolean {
  if ((typeof s) !== 'string') { return false }
  if (s === '') { return false }
  let url: URL
  try {
    url = new URL(s)
  } catch (_err) {
    return false
  }

  if (constraints.protocol) {
    if (constraints.protocol === 'http.') {
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return false
      }
    } else if (constraints.protocol === 'ws.') {
      if (url.protocol !== 'wss:' && url.protocol !== 'ws:') {
        return false
      }
    }
  }

  if (constraints.noSearchParams) {
    if (url.search !== '') {
      return false
    }
  }

  if (constraints.domain) {
    if (url.hostname !== constraints.domain) {
      return false
    }
  }

  return true
}

function _validateHost (s: any, mustBeSubDomainOf?: string): false | string {
  try {
    if (typeof s !== 'string') { return false }
    if (s.includes('/')) { return false }
    const url = new URL('http://' + s)
    const hostname = url.hostname
    if (mustBeSubDomainOf && hostname !== mustBeSubDomainOf) {
      const parts = hostname.split('.')
      if (parts.length <= 2) {
        return false
      }
      parts.shift()
      if (parts.join('.') !== mustBeSubDomainOf) {
        return false
      }
    }
    return hostname
  } catch (_err) {
    return false
  }
}

function _readReferenceUrl (s: any): undefined | string {
  try {
    if (typeof s !== 'string') { return undefined }
    if (!s.startsWith('https://') && !s.startsWith('http://')) {
      s = 'http://' + s
    }
    const url = new URL(s)
    const host = url.hostname
    // Just to avoid some basic spoofing, we must check that host is not simply something like "com".
    // We will check if there is at least one dot. This test is not perfect, but can limit spoofing cases.
    if (!host.includes('.')) { return undefined }
    return host
  } catch (_err) {
    return undefined
  }
}

function _sanitizePeertubeLiveChatInfosV0 (
  options: RegisterServerOptions, chatInfos: any, referenceUrl?: string
): LiveChatJSONLDAttributeV1 {
  const logger = options.peertubeHelpers.logger
  logger.debug('We are have to migrate data from the old JSONLD format')

  if (chatInfos === false) { return false }
  if (typeof chatInfos !== 'object') { return false }

  if (chatInfos.type !== 'xmpp') { return false }
  if ((typeof chatInfos.jid) !== 'string') { return false }

  // no link? invalid! dropping all.
  if (!Array.isArray(chatInfos.links)) { return false }

  let checkHost: undefined | string
  if (referenceUrl) {
    checkHost = _readReferenceUrl(referenceUrl)
    if (!checkHost) {
      options.peertubeHelpers.logger.error(
        '_sanitizePeertubeLiveChatInfosV0: got an invalid referenceUrl: ' + referenceUrl
      )
      return false
    }
  }

  const muc = _validateHost(chatInfos.jid.split('@')[1], checkHost)
  if (!muc) { return false }
  if (!muc.startsWith('room.')) {
    logger.error('We expected old format host to begin with "room.". Discarding.')
    return false
  }
  const host = _validateHost(muc.replace(/^room\./, ''), checkHost)
  if (!host) { return false }

  const r: LiveChatJSONLDAttributeV1 = {
    type: chatInfos.type,
    jid: chatInfos.jid,
    xmppserver: {
      host,
      muc
    }
  }

  for (const link of chatInfos.links) {
    if ((typeof link) !== 'object') { continue }
    if (['xmpp-bosh-anonymous', 'xmpp-websocket-anonymous'].includes(link.type)) {
      if ((typeof link.jid) !== 'string') { continue }
      if ((typeof link.url) !== 'string') { continue }

      if (
        !_validUrl(link.url, {
          noSearchParams: true,
          protocol: link.type === 'xmpp-websocket-anonymous' ? 'ws.' : 'http.',
          domain: checkHost
        })
      ) {
        continue
      }

      if (!r.xmppserver.anonymous) {
        r.xmppserver.anonymous = {
          virtualhost: link.jid
        }
      }
      if (link.type === 'xmpp-bosh-anonymous') {
        r.xmppserver.anonymous.bosh = link.url
      } else if (link.type === 'xmpp-websocket-anonymous') {
        r.xmppserver.anonymous.websocket = link.url
      }
    }
  }

  return r
}

function sanitizeXMPPHost (options: RegisterServerOptions, host: any): false | string {
  return _validateHost(host)
}

function sanitizeXMPPHostFromInstanceUrl (_options: RegisterServerOptions, s: any): false | string {
  try {
    if (typeof s !== 'string') { return false }
    const url = new URL(s)
    return url.hostname
  } catch (_err) {
    return false
  }
}

export {
  sanitizePeertubeLiveChatInfos,
  sanitizePeertubeLiveChatServerInfos,
  sanitizeXMPPHost,
  sanitizeXMPPHostFromInstanceUrl
}
