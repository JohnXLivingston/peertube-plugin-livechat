import type { VideoObject, MVideoAP, MVideoFullLight } from '@peertube/peertube-types'

interface VideoBuildResultContext {
  video: MVideoAP
}

interface LiveChatJSONLDS2SLink {
  type: 'xmpp-s2s'
}

interface LiveChatJSONLDAnonymousWebsocketLink {
  type: 'xmpp-websocket-anonymous'
  url: string
  jid: string
}

interface LiveChatJSONLDAnonymousBOSHLink {
  type: 'xmpp-bosh-anonymous'
  url: string
  jid: string
}

type LiveChatJSONLDLink = LiveChatJSONLDS2SLink | LiveChatJSONLDAnonymousBOSHLink | LiveChatJSONLDAnonymousWebsocketLink

interface LiveChatJSONLDInfos {
  type: 'xmpp'
  jid: string
  links: LiveChatJSONLDLink[]
}

type LiveChatJSONLDAttribute = LiveChatJSONLDInfos | false

interface LiveChatVideoObject extends VideoObject {
  peertubeLiveChat: LiveChatJSONLDAttribute
}

interface RemoteVideoHandlerParams {
  video: MVideoFullLight
  videoAPObject: VideoObject | LiveChatVideoObject
}

export {
  VideoBuildResultContext,
  LiveChatJSONLDLink,
  LiveChatJSONLDInfos,
  LiveChatJSONLDAttribute,
  LiveChatVideoObject,
  RemoteVideoHandlerParams
}
