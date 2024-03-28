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
  forceDefaultHideMucParticipants?: boolean
}

interface InitConverseJSParamsError {
  isError: true
  code: 404 | 403 | 500
  message: string
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

interface ChannelInfos {
  id: number
  name: string
  displayName: string
}

interface ChannelConfigurationOptions {
  bot: {
    enabled: boolean
    nickname?: string
    forbiddenWords: Array<{
      entries: string[]
      regexp?: boolean
      applyToModerators?: boolean
      reason?: string
      comments?: string
    }>
    quotes: Array<{
      messages: string[]
      delay: number
    }>
    commands: Array<{
      command: string
      message: string
    }>
    // TODO: bannedJIDs: string[]
  }
  slowMode: {
    duration: number
  }
}

interface ChannelConfiguration {
  channel: ChannelInfos
  configuration: ChannelConfigurationOptions
}

type ChatPeertubeIncludeMode = 'peertube-fullpage' | 'peertube-video'

/**
 * ChatIncludeMode:
 * - chat-only: the chat is on a full page, without Peertube
 * - peertube-fullpage: the chat is embedded in Peertube, in a full custom page
 * - peertube-video: the chat is embedded in Peertube, beside a video
 */
type ChatIncludeMode = 'chat-only' | ChatPeertubeIncludeMode

export type {
  ConverseJSTheme,
  InitConverseJSParams,
  InitConverseJSParamsError,
  ProsodyListRoomsResult,
  ProsodyListRoomsResultRoom,
  ChannelInfos,
  ChannelConfigurationOptions,
  ChannelConfiguration,
  ChatIncludeMode,
  ChatPeertubeIncludeMode
}
