import type { RegisterServerOptions, VideoObject } from '@peertube/peertube-types'
import type { LiveChatVideoObject, VideoBuildResultContext, LiveChatJSONLDLink } from './types'
import { videoHasWebchat } from '../../../shared/lib/video'
import { getBoshUri, getWSUri } from '../uri/webchat'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { getProsodyDomain } from '../prosody/config/domain'

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
    'federation-dont-publish-remotely'
  ])

  if (settings['federation-dont-publish-remotely']) {
    return jsonld
  }

  const hasChat = await videoHasWebchat({
    'chat-per-live-video': !!settings['chat-per-live-video'],
    'chat-all-lives': !!settings['chat-all-lives'],
    'chat-all-non-lives': !!settings['chat-all-non-lives'],
    'chat-videos-list': settings['chat-videos-list'] as string
  }, video)

  if (!hasChat) {
    // logger.debug(`Video uuid=${video.uuid} has not livechat, adding peertubeLiveChat=false.`)
    (jsonld as LiveChatVideoObject).peertubeLiveChat = false
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

  const links: LiveChatJSONLDLink[] = [{
    type: 'xmpp-bosh-anonymous',
    url: canonicalizePluginUri(options, getBoshUri(options), { removePluginVersion: true }),
    jid: userJID
  }]
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

  (jsonld as LiveChatVideoObject).peertubeLiveChat = {
    type: 'xmpp',
    jid: roomJID,
    links
  }
  return jsonld
}

export {
  videoBuildJSONLD
}
