// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions, MVideoThumbnail, SettingEntries } from '@peertube/peertube-types'
import type { ConverseJSTheme, InitConverseJSParams, InitConverseJSParamsError } from '../../../shared/lib/types'
import type { RegisterServerOptionsV5 } from '../helpers'
import type { LiveChatJSONLDAttributeV1 } from '../federation/types'
import { getChannelInfosById, getChannelNameById } from '../database/channel'
import {
  anonymousConnectionInfos, compatibleRemoteAuthenticatedConnectionEnabled
} from '../federation/connection-infos'
import { getVideoLiveChatInfos } from '../federation/storage'
import { getBaseRouterRoute, getBaseStaticRoute } from '../helpers'
import { getProsodyDomain } from '../prosody/config/domain'
import { getBoshUri, getWSUri } from '../uri/webchat'
import { ExternalAuthOIDC } from '../external-auth/oidc'
import { Emojis } from '../emojis'

interface GetConverseJSParamsParams {
  readonly?: boolean | 'noscroll'
  transparent?: boolean
  forcetype?: boolean
  forceDefaultHideMucParticipants?: boolean
}

/**
 * Returns ConverseJS options for a given chat room.
 * Returns an object describing the error if access can not be granted.
 * @param options server options
 * @param roomKey chat room key: video UUID (or channel id when forcetype is true)
 * @param params various parameters
 * @param userIsConnected true if user is connected. If undefined, bypass access tests.
 */
async function getConverseJSParams (
  options: RegisterServerOptionsV5,
  roomKey: string,
  params: GetConverseJSParamsParams,
  userIsConnected?: boolean
): Promise<InitConverseJSParams | InitConverseJSParamsError> {
  const settings = await options.settingsManager.getSettings([
    'prosody-room-type',
    'disable-websocket',
    'converse-theme',
    'federation-no-remote-chat',
    'prosody-room-allow-s2s',
    'chat-no-anonymous',
    'disable-channel-configuration'
  ])

  if (settings['chat-no-anonymous'] && userIsConnected === false) {
    return {
      isError: true,
      code: 403,
      message: 'You must be connected'
    }
  }

  const {
    autoViewerMode, forceReadonly, transparent, converseJSTheme
  } = _interfaceParams(options, settings, params)

  const staticBaseUrl = getBaseStaticRoute(options)

  const authenticationUrl = options.peertubeHelpers.config.getWebserverUrl() +
    getBaseRouterRoute(options) +
    'api/auth'

  const roomInfos = await _readRoomKey(options, settings, roomKey)
  if ('isError' in roomInfos) {
    return roomInfos // is an InitConverseJSParamsError
  }

  const connectionInfos = await _connectionInfos(options, settings, params, roomInfos)
  if ('isError' in connectionInfos) {
    return connectionInfos // is an InitConverseJSParamsError
  }
  const {
    localAnonymousJID,
    localBoshUri,
    localWsUri,
    remoteConnectionInfos,
    roomJID
  } = connectionInfos

  let externalAuthOIDC
  if (userIsConnected !== true) {
    if (remoteConnectionInfos && !remoteConnectionInfos.externalAuthCompatible) {
      options.peertubeHelpers.logger.debug(
        'The remote livechat plugin is not compatible with external authentication, not enabling the feature'
      )
    } else {
      try {
        const oidcs = ExternalAuthOIDC.allSingletons()
        for (const oidc of oidcs) {
          if (await oidc.isOk()) {
            const authUrl = oidc.getConnectUrl()
            const buttonLabel = oidc.getButtonLabel()
            if (authUrl && buttonLabel) {
              externalAuthOIDC ??= []
              externalAuthOIDC.push({
                type: oidc.type,
                buttonLabel,
                url: authUrl
              })
            }
          }
        }
      } catch (err) {
        options.peertubeHelpers.logger.error(err)
      }
    }
  }

  return {
    peertubeVideoOriginalUrl: roomInfos.video?.url,
    peertubeVideoUUID: roomInfos.video?.uuid,
    staticBaseUrl,
    assetsPath: staticBaseUrl + 'conversejs/',
    isRemoteChat: !!(roomInfos.video?.remote),
    localAnonymousJID: !settings['chat-no-anonymous'] ? localAnonymousJID : null,
    remoteAnonymousJID: remoteConnectionInfos?.anonymous?.userJID ?? null,
    remoteAnonymousXMPPServer: !!(remoteConnectionInfos?.anonymous),
    remoteAuthenticatedXMPPServer: !!(remoteConnectionInfos?.authenticated),
    room: roomJID,
    localBoshServiceUrl: localBoshUri,
    localWebsocketServiceUrl: localWsUri,
    remoteBoshServiceUrl: remoteConnectionInfos?.anonymous?.boshUri ?? null,
    remoteWebsocketServiceUrl: remoteConnectionInfos?.anonymous?.wsUri ?? null,
    authenticationUrl,
    autoViewerMode,
    theme: converseJSTheme,
    forceReadonly,
    transparent,
    // forceDefaultHideMucParticipants is for testing purpose
    // (so we can stress test with the muc participant list hidden by default)
    forceDefaultHideMucParticipants: params.forceDefaultHideMucParticipants,
    externalAuthOIDC,
    customEmojisUrl: connectionInfos.customEmojisUrl
  }
}

function _interfaceParams (
  options: RegisterServerOptions,
  settings: SettingEntries,
  params: GetConverseJSParamsParams
): {
    autoViewerMode: InitConverseJSParams['autoViewerMode']
    forceReadonly: InitConverseJSParams['forceReadonly']
    transparent: InitConverseJSParams['transparent']
    converseJSTheme: InitConverseJSParams['theme']
  } {
  let autoViewerMode = false
  const forceReadonly: boolean | 'noscroll' = params.readonly ?? false
  if (!forceReadonly) {
    autoViewerMode = true // auto join the chat in viewer mode, if not logged in
  }
  let converseJSTheme: ConverseJSTheme = settings['converse-theme'] as ConverseJSTheme
  const transparent: boolean = params.transparent ?? false
  if (!/^\w+$/.test(converseJSTheme)) {
    converseJSTheme = 'peertube'
  }

  return {
    autoViewerMode,
    forceReadonly,
    transparent,
    converseJSTheme
  }
}

interface RoomInfos {
  video: MVideoThumbnail | undefined
  channelId: number
  remoteChatInfos: LiveChatJSONLDAttributeV1 | undefined
  roomKey: string
}

async function _readRoomKey (
  options: RegisterServerOptions,
  settings: SettingEntries,
  roomKey: string
): Promise<RoomInfos | InitConverseJSParamsError> {
  let video: MVideoThumbnail | undefined
  let channelId: number
  let remoteChatInfos: LiveChatJSONLDAttributeV1 | undefined
  const channelMatches = roomKey.match(/^channel\.(\d+)$/)
  if (channelMatches?.[1]) {
    channelId = parseInt(channelMatches[1])
    // Here we are on a channel room...
    const channelInfos = await getChannelInfosById(options, channelId)
    if (!channelInfos) {
      return {
        isError: true,
        code: 404,
        message: 'Channel Not Found'
      }
    }
    channelId = channelInfos.id
  } else {
    const uuid = roomKey // must be a video UUID.
    video = await options.peertubeHelpers.videos.loadByIdOrUUID(uuid)
    if (!video) {
      return {
        isError: true,
        code: 404,
        message: 'Not Found'
      }
    }
    if (video.remote) {
      remoteChatInfos = settings['federation-no-remote-chat'] ? false : await getVideoLiveChatInfos(options, video)
      if (!remoteChatInfos) {
        return {
          isError: true,
          code: 404,
          message: 'Not Found'
        }
      }
    }
    channelId = video.channelId
  }

  return {
    video,
    channelId,
    remoteChatInfos,
    roomKey
  }
}

async function _connectionInfos (
  options: RegisterServerOptions,
  settings: SettingEntries,
  params: GetConverseJSParamsParams,
  roomInfos: RoomInfos
): Promise<{
  prosodyDomain: string
  localAnonymousJID: string
  localBoshUri: string
  localWsUri: string | null
  remoteConnectionInfos: WCRemoteConnectionInfos | undefined
  roomJID: string
  customEmojisUrl?: string
} | InitConverseJSParamsError> {
  const { video, remoteChatInfos, channelId, roomKey } = roomInfos

  const prosodyDomain = await getProsodyDomain(options)
  const localAnonymousJID = 'anon.' + prosodyDomain
  const localBoshUri = getBoshUri(options)
  const localWsUri = settings['disable-websocket']
    ? null
    : (getWSUri(options) ?? null)

  let remoteConnectionInfos: WCRemoteConnectionInfos | undefined
  let roomJID: string
  let customEmojisUrl: string | undefined
  if (video?.remote) {
    const canWebsocketS2S = !settings['federation-no-remote-chat'] && !settings['disable-websocket']
    const canDirectS2S = !settings['federation-no-remote-chat'] && !!settings['prosody-room-allow-s2s']
    try {
      remoteConnectionInfos = await _remoteConnectionInfos(remoteChatInfos ?? false, canWebsocketS2S, canDirectS2S)
    } catch (err) {
      options.peertubeHelpers.logger.error(err)
      remoteConnectionInfos = undefined
    }
    if (!remoteConnectionInfos) {
      return {
        isError: true,
        code: 404,
        message: 'No compatible way to connect to remote chat'
      }
    }
    roomJID = remoteConnectionInfos.roomJID

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (remoteChatInfos && remoteChatInfos.customEmojisUrl) {
      customEmojisUrl = remoteChatInfos.customEmojisUrl
    }
  } else {
    try {
      roomJID = await _localRoomJID(
        options,
        settings,
        prosodyDomain,
        roomKey,
        video,
        channelId,
        params.forcetype ?? false
      )

      if (video?.channelId) {
        customEmojisUrl = await Emojis.singletonSafe()?.channelCustomEmojisUrl(video.channelId)
      }
    } catch (err) {
      options.peertubeHelpers.logger.error(err)
      return {
        isError: true,
        code: 500,
        message: 'An error occured'
      }
    }
  }

  return {
    prosodyDomain,
    localAnonymousJID,
    localBoshUri,
    localWsUri,
    remoteConnectionInfos,
    roomJID,
    customEmojisUrl
  }
}

interface WCRemoteConnectionInfos {
  roomJID: string
  anonymous?: {
    userJID: string
    boshUri: string
    wsUri?: string
  }
  authenticated?: boolean
  externalAuthCompatible: boolean
}

async function _remoteConnectionInfos (
  remoteChatInfos: LiveChatJSONLDAttributeV1,
  canWebsocketS2S: boolean,
  canDirectS2S: boolean
): Promise<WCRemoteConnectionInfos> {
  if (!remoteChatInfos) { throw new Error('Should have remote chat infos for remote videos') }
  if (remoteChatInfos.type !== 'xmpp') { throw new Error('Should have remote xmpp chat infos for remote videos') }
  const connectionInfos: WCRemoteConnectionInfos = {
    roomJID: remoteChatInfos.jid,
    externalAuthCompatible: false
  }
  if (compatibleRemoteAuthenticatedConnectionEnabled(remoteChatInfos, canWebsocketS2S, canDirectS2S)) {
    connectionInfos.authenticated = true
  }
  const anonymousCI = anonymousConnectionInfos(remoteChatInfos ?? false)
  if (anonymousCI?.boshUri) {
    connectionInfos.anonymous = {
      userJID: anonymousCI.userJID,
      boshUri: anonymousCI.boshUri,
      wsUri: anonymousCI.wsUri
    }
  }

  if (remoteChatInfos.xmppserver.external) {
    // To be able to connect to a remote livechat using an external account,
    // The remote server MUST have livechat >= 9.0.0...
    // So we flag the connection as compatible or not, and we will disable the feature if not compatible.
    connectionInfos.externalAuthCompatible = true
  }

  return connectionInfos
}

async function _localRoomJID (
  options: RegisterServerOptions,
  settings: SettingEntries,
  prosodyDomain: string,
  roomKey: string,
  video: MVideoThumbnail | undefined,
  channelId: number,
  forceType: boolean
): Promise<string> {
  // Computing the room name...
  let room: string
  if (forceType) {
    // We come from the room list in the settings page.
    // Here we don't read the prosody-room-type settings,
    // but use the roomKey format.
    // NB: there is no extra security. Any user can add this parameter.
    //     This is not an issue: the setting will be tested at the room creation.
    //     No room can be created in the wrong mode.
    if (/^channel\.\d+$/.test(roomKey)) {
      room = 'channel.{{CHANNEL_ID}}@room.' + prosodyDomain
    } else {
      room = '{{VIDEO_UUID}}@room.' + prosodyDomain
    }
  } else {
    if (settings['prosody-room-type'] === 'channel') {
      room = 'channel.{{CHANNEL_ID}}@room.' + prosodyDomain
    } else {
      room = '{{VIDEO_UUID}}@room.' + prosodyDomain
    }
  }

  if (room.includes('{{VIDEO_UUID}}')) {
    if (!video) {
      throw new Error('Missing video')
    }
    room = room.replace(/{{VIDEO_UUID}}/g, video.uuid)
  }
  room = room.replace(/{{CHANNEL_ID}}/g, `${channelId}`)
  if (room.includes('{{CHANNEL_NAME}}')) {
    // FIXME: this should no more exists, since we removed options to include other chat server.
    //  So we should remove this code. (and simplify the above code)
    const channelName = await getChannelNameById(options, channelId)
    if (channelName === null) {
      throw new Error('Channel not found')
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(channelName)) {
      // FIXME: see if there is a response here https://github.com/Chocobozzz/PeerTube/issues/4301 for allowed chars
      options.peertubeHelpers.logger.error(`Invalid channel name, contains unauthorized chars: '${channelName}'`)
      throw new Error('Invalid channel name, contains unauthorized chars')
    }
    room = room.replace(/{{CHANNEL_NAME}}/g, channelName)
  }

  return room
}

export {
  getConverseJSParams,
  InitConverseJSParamsError
}
