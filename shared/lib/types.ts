type ConverseJSTheme = 'peertube' | 'default' | 'concord'

interface InitConverseJSParams {
  isRemoteChat: boolean
  localAnonymousJID: string
  remoteAnonymousJID: string | null
  remoteAnonymousXMPPServer: boolean
  remoteAuthenticatedXMPPServer: boolean
  staticBaseUrl: string
  assetsPath: string
  room: string
  localBoshServiceUrl: string | null
  localWebsocketServiceUrl: string | null
  remoteBoshServiceUrl: string | null
  remoteWebsocketServiceUrl: string | null
  authenticationUrl: string
  autoViewerMode: boolean
  forceReadonly: boolean | 'noscroll'
  theme: ConverseJSTheme
  transparent: boolean
}

interface ProsodyListRoomsResultError {
  ok: false
  error: string
}

interface ProsodyListRoomsResultRoom {
  jid: string
  localpart: string
  name: string
  lang: string
  description: string
  lasttimestamp?: number
  channel?: {
    id: number
    name: string
    displayName: string
  }
}

interface ProsodyListRoomsResultSuccess {
  ok: true
  rooms: ProsodyListRoomsResultRoom[]
}

type ProsodyListRoomsResult = ProsodyListRoomsResultError | ProsodyListRoomsResultSuccess

interface ChannelModerationOptions {
  channel: {
    id: number
    name: string
    displayName: string
  }
  bot: boolean
  forbiddenWords: string[]
  bannedJIDs: string[]
}

export type {
  ConverseJSTheme,
  InitConverseJSParams,
  ProsodyListRoomsResult,
  ProsodyListRoomsResultRoom,
  ChannelModerationOptions
}
