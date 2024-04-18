import type { RegisterServerOptions, VideoObject, SettingValue } from '@peertube/peertube-types'
import type {
  LiveChatVideoObject,
  VideoBuildResultContext,
  LiveChatJSONLDLink,
  LiveChatJSONLDAttribute,
  PeertubeXMPPServerInfos
} from './types'
import { storeVideoLiveChatInfos } from './storage'
import { videoHasWebchat } from '../../../shared/lib/video'
import { getBoshUri, getWSUri, getWSS2SUri, getPublicChatUri } from '../uri/webchat'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { getProsodyDomain } from '../prosody/config/domain'
import { fillVideoCustomFields } from '../custom-fields'
import { loc } from '../loc'
import { isDebugMode } from '../debug'

/**
 * This function adds LiveChat information on video ActivityPub data if relevant.
 * @param options server options
 * @param videoJsonld JSON-LD video data to fill
 * @param context handler context
 * @returns void
 */
async function videoBuildJSONLD (
  options: RegisterServerOptions,
  videoJsonld: VideoObject | LiveChatVideoObject,
  context: VideoBuildResultContext
): Promise<VideoObject | LiveChatVideoObject> {
  const logger = options.peertubeHelpers.logger
  const video = context.video
  if (video.remote) { return videoJsonld } // should not happen, but... just in case...

  const settings = await options.settingsManager.getSettings([
    'chat-per-live-video',
    'chat-all-lives',
    'chat-all-non-lives',
    'chat-videos-list',
    'disable-websocket',
    'prosody-room-type',
    'federation-dont-publish-remotely',
    'chat-no-anonymous',
    'prosody-room-allow-s2s',
    'prosody-s2s-port'
  ])

  if (settings['federation-dont-publish-remotely']) {
    // Note: we store also outgoing data. Could help for migration/cleanup scripts, for example.
    await storeVideoLiveChatInfos(options, video, false)
    return videoJsonld
  }

  await fillVideoCustomFields(options, video)
  const hasChat = await videoHasWebchat({
    'chat-per-live-video': !!settings['chat-per-live-video'],
    'chat-all-lives': !!settings['chat-all-lives'],
    'chat-all-non-lives': !!settings['chat-all-non-lives'],
    'chat-videos-list': settings['chat-videos-list'] as string
  }, video)

  if (!hasChat) {
    logger.debug(`Video uuid=${video.uuid} has not livechat, adding peertubeLiveChat=false.`)
    // Note: we store also outgoing data. Could help for migration/cleanup scripts, for example.
    await storeVideoLiveChatInfos(options, video, false)
    Object.assign(videoJsonld, {
      peertubeLiveChat: false
    })
    return videoJsonld
  }

  logger.debug(`Adding LiveChat data on video uuid=${video.uuid}...`)

  const prosodyDomain = await getProsodyDomain(options)
  let roomJID: string
  if (settings['prosody-room-type'] === 'channel') {
    roomJID = `channel.${video.channelId}@room.${prosodyDomain}`
  } else {
    roomJID = `${video.uuid}@room.${prosodyDomain}`
  }

  const serverInfos = await _serverBuildInfos(options, {
    'federation-dont-publish-remotely': settings['federation-dont-publish-remotely'],
    'prosody-s2s-port': settings['prosody-s2s-port'],
    'prosody-room-allow-s2s': settings['prosody-room-allow-s2s'],
    'disable-websocket': settings['disable-websocket'],
    'chat-no-anonymous': settings['chat-no-anonymous']
  })

  const chatTitle = loc('chat_for_live_stream') + ' ' + video.name

  // Adding attachments, as described in FEP-1970
  const discussionLinks: LiveChatVideoObject['attachment'] = []
  discussionLinks.push({
    type: 'Link',
    name: chatTitle,
    rel: 'discussion',
    href: getPublicChatUri(options, videoJsonld)
  })
  // Adding the xmpp:// link requires:
  // - prosody-room-allow-s2s
  // - prosody-s2s-port
  // For now, this can be tested reading serverInfos.directs2s
  // There is a debug_mode flag to always enable it.
  if (!!serverInfos.directs2s || isDebugMode(options, 'alwaysPublishXMPPRoom')) {
    discussionLinks.push({
      type: 'Link',
      name: chatTitle,
      rel: 'discussion',
      href: 'xmpp://' + roomJID + '?join'
    })
  }

  if (!('attachment' in videoJsonld) || !videoJsonld.attachment) {
    Object.assign(videoJsonld, {
      attachment: discussionLinks
    })
  } else if (Array.isArray(videoJsonld.attachment)) {
    videoJsonld.attachment.push(...discussionLinks)
  } else {
    videoJsonld.attachment = [
      videoJsonld.attachment,
      ...discussionLinks
    ]
  }

  // Code beneath this point is for backward compatibility, before v7.2.0.
  // Since then, the ActivityPub metadata were not standardized.

  // For backward compatibility with remote servers, using plugin <=6.3.0, we must provide links:
  const links: LiveChatJSONLDLink[] = []
  if (serverInfos.anonymous) {
    if (serverInfos.anonymous.bosh) {
      links.push({
        type: 'xmpp-bosh-anonymous',
        url: serverInfos.anonymous.bosh,
        jid: serverInfos.anonymous.virtualhost
      })
    }
    if (serverInfos.anonymous.websocket) {
      links.push({
        type: 'xmpp-websocket-anonymous',
        url: serverInfos.anonymous.websocket,
        jid: serverInfos.anonymous.virtualhost
      })
    }
  }

  // This is the custom format used by plugin > 6.3.0.
  const peertubeLiveChat: LiveChatJSONLDAttribute = {
    type: 'xmpp',
    jid: roomJID,
    links,
    xmppserver: serverInfos
  }
  Object.assign(videoJsonld, {
    peertubeLiveChat
  })
  // Note: we store also outgoing data. Could help for migration/cleanup scripts, for example.
  await storeVideoLiveChatInfos(options, video, peertubeLiveChat)
  return videoJsonld
}

async function serverBuildInfos (options: RegisterServerOptions): Promise<PeertubeXMPPServerInfos> {
  const settings = await options.settingsManager.getSettings([
    'federation-dont-publish-remotely',
    'prosody-s2s-port',
    'prosody-room-allow-s2s',
    'disable-websocket',
    'chat-no-anonymous'
  ])
  return _serverBuildInfos(options, {
    'federation-dont-publish-remotely': settings['federation-dont-publish-remotely'],
    'prosody-s2s-port': settings['prosody-s2s-port'],
    'prosody-room-allow-s2s': settings['prosody-room-allow-s2s'],
    'disable-websocket': settings['disable-websocket'],
    'chat-no-anonymous': settings['chat-no-anonymous']
  })
}

async function _serverBuildInfos (
  options: RegisterServerOptions,
  settings: {
    'federation-dont-publish-remotely': SettingValue
    'prosody-s2s-port': SettingValue
    'prosody-room-allow-s2s': SettingValue
    'disable-websocket': SettingValue
    'chat-no-anonymous': SettingValue
  }
): Promise<PeertubeXMPPServerInfos> {
  const prosodyDomain = await getProsodyDomain(options)
  const mucDomain = 'room.' + prosodyDomain
  const anonDomain = 'anon.' + prosodyDomain
  const externalDomain = 'external.' + prosodyDomain

  let directs2s
  if (settings['prosody-room-allow-s2s'] && settings['prosody-s2s-port']) {
    directs2s = {
      port: (settings['prosody-s2s-port'] as string) ?? ''
    }
  }

  let websockets2s
  if (!settings['federation-dont-publish-remotely']) {
    const wsS2SUri = getWSS2SUri(options)
    if (wsS2SUri) { // can be undefined for old Peertube version that dont allow WS for plugins
      websockets2s = {
        url: canonicalizePluginUri(options, wsS2SUri, {
          removePluginVersion: true,
          protocol: 'ws'
        })
      }
    }
  }

  let anonymous: PeertubeXMPPServerInfos['anonymous'] | undefined
  if (!settings['chat-no-anonymous']) {
    anonymous = {
      bosh: canonicalizePluginUri(options, getBoshUri(options), { removePluginVersion: true }),
      virtualhost: anonDomain
    }

    if (!settings['disable-websocket']) {
      const wsUri = getWSUri(options)
      if (wsUri) {
        anonymous.websocket = canonicalizePluginUri(options, wsUri, {
          removePluginVersion: true,
          protocol: 'ws'
        })
      }
    }
  }

  return {
    host: prosodyDomain,
    muc: mucDomain,
    external: externalDomain, // we will always add it, even if disabled. Can't cause trouble.
    directs2s,
    websockets2s,
    anonymous
  }
}

export {
  videoBuildJSONLD,
  serverBuildInfos
}
