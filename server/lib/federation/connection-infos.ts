import type { LiveChatJSONLDAttributeV1 } from './types'

interface AnonymousConnectionInfos {
  roomJID: string
  boshUri?: string
  wsUri?: string
  userJID: string
}

function anonymousConnectionInfos (livechatInfos: LiveChatJSONLDAttributeV1 | false): AnonymousConnectionInfos | null {
  if (!livechatInfos) { return null }
  if (livechatInfos.type !== 'xmpp') { return null }
  if (!livechatInfos.xmppserver) { return null }
  if (!livechatInfos.xmppserver.anonymous) { return null }
  const r: AnonymousConnectionInfos = {
    roomJID: livechatInfos.jid,
    userJID: livechatInfos.xmppserver.anonymous.virtualhost
  }
  if (livechatInfos.xmppserver.anonymous.bosh) {
    r.boshUri = livechatInfos.xmppserver.anonymous.bosh
  }
  if (livechatInfos.xmppserver.anonymous.websocket) {
    r.wsUri = livechatInfos.xmppserver.anonymous.websocket
  }

  if (!r.boshUri && !r.wsUri) {
    return null
  }

  return r
}

function remoteAuthenticatedConnectionEnabled (livechatInfos: LiveChatJSONLDAttributeV1): boolean {
  if (!livechatInfos) { return false }
  if (livechatInfos.type !== 'xmpp') { return false }
  if (!('xmppserver' in livechatInfos)) { return false }
  if (!livechatInfos.xmppserver) { return false }

  if (livechatInfos.xmppserver.websockets2s) { return true }
  if (livechatInfos.xmppserver.directs2s) { return true }

  return false
}

function compatibleRemoteAuthenticatedConnectionEnabled (
  livechatInfos: LiveChatJSONLDAttributeV1,
  canWebsocketS2S: boolean,
  canDirectS2S: boolean
): boolean {
  if (!livechatInfos) { return false }
  if (livechatInfos.type !== 'xmpp') { return false }
  if (!('xmppserver' in livechatInfos)) { return false }
  if (!livechatInfos.xmppserver) { return false }

  if (canWebsocketS2S && livechatInfos.xmppserver.websockets2s) { return true }
  // Note: see comments neer option s2s_peertubelivechat_no_outgoing_directs2s_to_peertube
  // to understand why we need both to be true.
  if (canDirectS2S && livechatInfos.xmppserver.directs2s) { return true }

  return false
}

export {
  anonymousConnectionInfos,
  remoteAuthenticatedConnectionEnabled,
  compatibleRemoteAuthenticatedConnectionEnabled
}
