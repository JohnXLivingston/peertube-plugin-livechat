import type { LiveChatJSONLDAttribute } from './types'

interface AnonymousConnectionInfos {
  roomJID: string
  boshUri?: string
  wsUri?: string
  userJID: string
}

function anonymousConnectionInfos (livechatInfos: LiveChatJSONLDAttribute | false): AnonymousConnectionInfos | null {
  if (!livechatInfos) { return null }
  if (!livechatInfos.links) { return null }
  if (livechatInfos.type !== 'xmpp') { return null }
  const r: AnonymousConnectionInfos = {
    roomJID: livechatInfos.jid,
    userJID: ''
  }
  for (const link of livechatInfos.links) {
    // Note: userJID is on both links. But should have the same value.
    if (link.type === 'xmpp-bosh-anonymous') {
      r.boshUri = link.url
      r.userJID = link.jid
    } else if (link.type === 'xmpp-websocket-anonymous') {
      r.wsUri = link.url
      r.userJID = link.jid
    }
  }
  if (r.userJID === '') {
    return null
  }
  return r
}

export {
  anonymousConnectionInfos
}
