// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

// Not working for some reason
// import type { ActorImage } from '@peertube/peertube-types'

interface ActorImage {
  width: number
  path: string
  url?: string
  createdAt: Date | string
  updatedAt: Date | string
}

type ConverseJSTheme = 'peertube' | 'default' | 'concord'

interface InitConverseJSParams {
  peertubeVideoOriginalUrl?: string
  peertubeVideoUUID?: string
  isRemoteChat: boolean
  localAnonymousJID: string | null
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
  autofocus?: boolean
  externalAuthOIDC?: Array<{
    type: ExternalAuthOIDCType
    buttonLabel: string
    url: string
  }>
  customEmojisUrl?: string | null
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

interface ChannelLiveChatInfos extends ChannelInfos {
  avatar: ActorImage
  avatars: ActorImage[]
  livechatConfigurationUri: string
}

interface ChannelConfigurationOptions {
  bot: {
    enabled: boolean
    nickname?: string
    forbiddenWords: ChannelForbiddenWords[]
    quotes: ChannelQuotes[]
    commands: ChannelCommands[]
    // TODO: bannedJIDs: string[]
  }
  slowMode: {
    duration: number
  }
}

interface ChannelForbiddenWords {
  entries: string[]
  regexp?: boolean
  applyToModerators?: boolean
  label?: string
  reason?: string
  comments?: string
}

interface ChannelQuotes {
  messages: string[]
  delay: number
}

interface ChannelCommands {
  command: string
  message: string
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

interface ExternalAuthResultOk {
  ok: true
  token: string
}

interface ExternalAuthResultError {
  ok: false
  message?: string
}

type ExternalAuthResult = ExternalAuthResultError | ExternalAuthResultOk

type ExternalAuthOIDCType = 'custom' | 'google' | 'facebook'

interface CustomEmojiDefinition {
  sn: string
  url: string
  isCategoryEmoji?: boolean
}

interface ChannelEmojis {
  customEmojis: CustomEmojiDefinition[]
}

export type {
  ConverseJSTheme,
  InitConverseJSParams,
  InitConverseJSParamsError,
  ProsodyListRoomsResult,
  ProsodyListRoomsResultRoom,
  ChannelInfos,
  ChannelLiveChatInfos,
  ChannelConfigurationOptions,
  ChannelConfiguration,
  ChatIncludeMode,
  ChatPeertubeIncludeMode,
  ExternalAuthResultError,
  ExternalAuthResultOk,
  ExternalAuthResult,
  ExternalAuthOIDCType,
  CustomEmojiDefinition,
  ChannelEmojis
}
