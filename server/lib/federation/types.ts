import type { VideoObject, MVideoAP, MVideoFullLight } from '@peertube/peertube-types'

interface VideoBuildResultContext {
  video: MVideoAP
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

type LiveChatJSONLDLink = LiveChatJSONLDAnonymousBOSHLink | LiveChatJSONLDAnonymousWebsocketLink

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
