// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { parseConfigUUIDs } from './config'

interface VideoHasWebchatSettings {
  'chat-per-live-video': boolean
  'chat-all-lives': boolean
  'chat-all-non-lives': boolean
  'chat-videos-list': string
}

interface SharedVideoBase {
  uuid: string
  isLive: boolean
  pluginData?: {
    'livechat-active'?: boolean
    'livechat-remote'?: boolean
  }
}

interface SharedVideoFrontend extends SharedVideoBase {
  isLocal: boolean
}

interface SharedVideoBackend extends SharedVideoBase {
  remote: boolean
}

type SharedVideo = SharedVideoBackend | SharedVideoFrontend

/**
 * Indicate if the video has a local chat.
 * @param settings plugin settings
 * @param video the video
 * @returns true if the video has a local chat
 */
function videoHasWebchat (settings: VideoHasWebchatSettings, video: SharedVideo): boolean {
  // Never use webchat on remote videos.
  if ('isLocal' in video) {
    if (!video.isLocal) return false
  } else {
    if (video.remote) return false
  }

  if (settings['chat-per-live-video'] && video.isLive && video.pluginData?.['livechat-active']) {
    return true
  }

  if (settings['chat-all-lives']) {
    if (video.isLive) return true
  }

  if (settings['chat-all-non-lives']) {
    if (!video.isLive) return true
  }

  const uuids = parseConfigUUIDs(settings['chat-videos-list'])
  if (uuids.includes(video.uuid)) {
    return true
  }

  return false
}

interface VideoHasRemoteWebchatSettings {
  'federation-no-remote-chat': boolean
}

/**
 * Indicates if the video has a remote chat.
 * @param settings plugin settings
 * @param video the video
 * @returns true if the video has a remote chat
 */
function videoHasRemoteWebchat (settings: VideoHasRemoteWebchatSettings, video: SharedVideo): boolean {
  if (settings['federation-no-remote-chat']) { return false }
  if ('isLocal' in video) {
    if (video.isLocal) return false
  } else {
    if (!video.remote) return false
  }
  if (!video.pluginData) { return false }
  if (!video.pluginData['livechat-remote']) { return false }
  return true
}

export {
  videoHasWebchat,
  videoHasRemoteWebchat
}
