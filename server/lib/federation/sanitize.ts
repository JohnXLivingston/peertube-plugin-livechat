import type { LiveChatJSONLDInfos, LiveChatJSONLDAttribute } from './types'
import { URL } from 'url'

function sanitizePeertubeLiveChatInfos (chatInfos: any): LiveChatJSONLDAttribute {
  if (chatInfos === false) { return false }
  if (typeof chatInfos !== 'object') { return false }

  if (chatInfos.type !== 'xmpp') { return false }
  if ((typeof chatInfos.jid) !== 'string') { return false }
  if (!Array.isArray(chatInfos.links)) { return false }

  const r: LiveChatJSONLDInfos = {
    type: chatInfos.type,
    jid: chatInfos.jid,
    links: []
  }

  for (const link of chatInfos.links) {
    if ((typeof link) !== 'object') { continue }
    if (['xmpp-bosh-anonymous', 'xmpp-websocket-anonymous'].includes(link.type)) {
      if ((typeof link.jid) !== 'string') { continue }
      if ((typeof link.url) !== 'string') { continue }

      if (
        !_validUrl(link.url, {
          noSearchParams: true,
          protocol: link.type === 'xmpp-websocket-anonymous' ? 'ws.' : 'http.'
        })
      ) {
        continue
      }

      r.links.push({
        type: link.type,
        jid: link.jid,
        url: link.url
      })
    }
    if (link.type === 'xmpp-s2s') {
      r.links.push({
        type: link.type
      })
    }
  }
  return r
}

interface URLConstraints {
  protocol: 'http.' | 'ws.'
  noSearchParams: boolean
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

  return true
}

export {
  sanitizePeertubeLiveChatInfos
}
