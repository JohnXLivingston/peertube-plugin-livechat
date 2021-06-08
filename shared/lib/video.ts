import { parseConfigUUIDs } from './config'

interface SharedSettings {
  'chat-only-locals': boolean
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
  }
}

interface SharedVideoFrontend extends SharedVideoBase {
  isLocal: boolean
}

interface SharedVideoBackend extends SharedVideoBase {
  remote: boolean
}

type SharedVideo = SharedVideoBackend | SharedVideoFrontend

function videoHasWebchat (settings: SharedSettings, video: SharedVideo): boolean {
  if (settings['chat-only-locals']) {
    if ('isLocal' in video) {
      if (!video.isLocal) return false
    } else {
      if (video.remote) return false
    }
  }

  if (settings['chat-per-live-video'] && video.isLive && video.pluginData && video.pluginData['livechat-active']) {
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

export {
  videoHasWebchat
}
