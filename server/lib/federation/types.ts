// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { VideoObject, MVideoAP, MVideoFullLight } from '@peertube/peertube-types'

interface VideoBuildResultContext {
  video: MVideoAP
}

interface PeertubeXMPPServerInfos {
  host: string // main host (should be the peertube url)
  muc: string // muc component url
  directs2s?: { // if direct S2S is enabled
    port: string
  }
  websockets2s?: { // if Websocket S2S is enabled
    url: string
  }
  anonymous?: { // provide an anonymous component that can be used externally
    virtualhost: string
    bosh?: string // BOSH endpoint url
    websocket?: string // Websocket endpoint url
  }
}

// DEPRECATED, but still used for backward compat
interface LiveChatJSONLDAnonymousWebsocketLink {
  type: 'xmpp-websocket-anonymous'
  url: string
  jid: string
}

// DEPRECATED, but still used for backward compat
interface LiveChatJSONLDAnonymousBOSHLink {
  type: 'xmpp-bosh-anonymous'
  url: string
  jid: string
}

// DEPRECATED, but still used for backward compat
type LiveChatJSONLDLink = LiveChatJSONLDAnonymousBOSHLink | LiveChatJSONLDAnonymousWebsocketLink

// LiveChatJSONLDInfosV0 is the data format for the plugin v6.3.0. This format is replaced in newer versions.
// DEPRECATED, but still used for backward compat
interface LiveChatJSONLDInfosV0 {
  type: 'xmpp'
  jid: string // room JID
  links: LiveChatJSONLDLink[]
}

// LiveChatJSONLDInfosV1 is the data format that comes with plugin v7.0.0.
interface LiveChatJSONLDInfosV1 {
  type: 'xmpp'
  jid: string // room JID
  xmppserver: PeertubeXMPPServerInfos
}

// LiveChatJSONLDInfosV1CompatV0 is a mix of both interface.
// Used for outgoing data, so that older plugin version can still use it.
interface LiveChatJSONLDInfosV1CompatV0 extends LiveChatJSONLDInfosV1 {
  links: LiveChatJSONLDLink[]
}

type LiveChatJSONLDInfos = LiveChatJSONLDInfosV0 | LiveChatJSONLDInfosV1 | LiveChatJSONLDInfosV1CompatV0

type LiveChatJSONLDAttribute = LiveChatJSONLDInfos | false
type LiveChatJSONLDAttributeV1 = LiveChatJSONLDInfosV1 | false

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
  LiveChatJSONLDInfosV1CompatV0,
  LiveChatJSONLDAttribute,
  LiveChatJSONLDAttributeV1,
  LiveChatVideoObject,
  RemoteVideoHandlerParams,
  PeertubeXMPPServerInfos
}
