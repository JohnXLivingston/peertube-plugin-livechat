import type { RegisterServerOptions, VideoObject, MVideoAP, MVideoFullLight } from '@peertube/peertube-types'
import { videoHasWebchat } from '../../../shared/lib/video'
import { getBoshUri, getWSUri } from '../uri/webchat'
import { canonicalizePluginUri } from '../uri/canonicalize'
import { getProsodyDomain } from '../prosody/config/domain'

interface LiveChatVideoObject extends VideoObject {
  peertubeLiveChat: boolean
}

interface VideoBuildResultContext {
  video: MVideoAP
}

interface RemoteHandlerParams {
  video: MVideoFullLight
  videoAPObject: VideoObject | LiveChatVideoObject
}

export async function initFederation (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  const registerHook = options.registerHook
  logger.info('Registring federation hooks...')

  registerHook({
    target: 'filter:activity-pub.video.json-ld.build.result',
    handler: async (
      jsonld: VideoObject,
      context: VideoBuildResultContext
    ): Promise<VideoObject | LiveChatVideoObject> => {
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

      logger.debug(
        `Adding LiveChat data on video uuid=${video.uuid}: peertubeLiveChat=${hasChat ? 'true' : 'false'}`
      )

      const prosodyDomain = await getProsodyDomain(options)
      const userJID = 'anon.' + prosodyDomain
      let roomJID: string
      if (settings['prosody-room-type'] === 'channel') {
        roomJID = `channel.${video.channelId}@room.${prosodyDomain}`
      } else {
        roomJID = `${video.uuid}@room.${prosodyDomain}`
      }

      const links = [{
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

      return Object.assign(jsonld, {
        peertubeLiveChat: {
          type: 'xmpp',
          jid: roomJID,
          links
        }
      })
    }
  })

  // TODO: we should also register the context.build hook.
  // registerHook({
  //   target: 'filter:activity-pub.activity.context.build.result',
  //   handler: (jsonld: any) => {
  //     return jsonld.concat([
  //       { peertubeLiveChat: 'sc:Boolean' }
  //     ])
  //   }
  // })

  const remoteHandler = async ({ video, videoAPObject }: RemoteHandlerParams): Promise<void> => {
    if (!('peertubeLiveChat' in videoAPObject)) {
      return
    }
    // TODO: save the information.
    logger.debug(
      `Remote video uuid=${video.uuid} has a peertubeLiveChat attribute: ` +
      JSON.stringify(videoAPObject.peertubeLiveChat)
    )
  }
  registerHook({
    target: 'action:activity-pub.remote-video.created',
    handler: remoteHandler
  })
  registerHook({
    target: 'action:activity-pub.remote-video.updated',
    handler: remoteHandler
  })
}
