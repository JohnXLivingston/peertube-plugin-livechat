import type { RegisterServerOptions, VideoObject } from '@peertube/peertube-types'
import type { LiveChatVideoObject, VideoBuildResultContext, LiveChatJSONLDLink, LiveChatJSONLDAttribute } from './types'
import { storeVideoLiveChatInfos } from './storage'
import { videoHasWebchat } from '../../../shared/lib/video'
import { getBoshUri, getWSUri } from '../uri/webchat'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { getProsodyDomain } from '../prosody/config/domain'
import { fillVideoCustomFields } from '../custom-fields'

/**
 * This function adds LiveChat information on video ActivityPub data if relevant.
 * @param options server options
 * @param jsonld JSON-LD video data to fill
 * @param context handler context
 * @returns void
 */
async function videoBuildJSONLD (
  options: RegisterServerOptions,
  jsonld: VideoObject,
  context: VideoBuildResultContext
): Promise<VideoObject | LiveChatVideoObject> {
  const logger = options.peertubeHelpers.logger
  const video = context.video
  if (video.remote) { return jsonld } // should not happen, but... just in case...

  const settings = await options.settingsManager.getSettings([
    'chat-per-live-video',
    'chat-all-lives',
    'chat-all-non-lives',
    'chat-videos-list',
    'disable-websocket',
    'prosody-room-type',
    'federation-dont-publish-remotely',
    'chat-no-anonymous'
  ])

  if (settings['federation-dont-publish-remotely']) {
    // Note: we store also outgoing data. Could help for migration/cleanup scripts, for example.
    await storeVideoLiveChatInfos(options, video, false)
    return jsonld
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
    Object.assign(jsonld, {
      peertubeLiveChat: false
    })
    return jsonld
  }

  logger.debug(`Adding LiveChat data on video uuid=${video.uuid}...`)

  const prosodyDomain = await getProsodyDomain(options)
  const userJID = 'anon.' + prosodyDomain
  let roomJID: string
  if (settings['prosody-room-type'] === 'channel') {
    roomJID = `channel.${video.channelId}@room.${prosodyDomain}`
  } else {
    roomJID = `${video.uuid}@room.${prosodyDomain}`
  }

  const links: LiveChatJSONLDLink[] = []
  if (!settings['chat-no-anonymous']) {
    links.push({
      type: 'xmpp-bosh-anonymous',
      url: canonicalizePluginUri(options, getBoshUri(options), { removePluginVersion: true }),
      jid: userJID
    })
    if (!settings['disable-websocket']) {
      const wsUri = getWSUri(options)
      if (wsUri) {
        links.push({
          type: 'xmpp-websocket-anonymous',
          url: canonicalizePluginUri(options, wsUri, {
            removePluginVersion: true,
            protocol: 'ws'
          }),
          jid: userJID
        })
      }
    }
  }

  const peertubeLiveChat: LiveChatJSONLDAttribute = {
    type: 'xmpp',
    jid: roomJID,
    links
  }
  Object.assign(jsonld, {
    peertubeLiveChat
  })
  // Note: we store also outgoing data. Could help for migration/cleanup scripts, for example.
  await storeVideoLiveChatInfos(options, video, peertubeLiveChat)
  return jsonld
}

export {
  videoBuildJSONLD
}
