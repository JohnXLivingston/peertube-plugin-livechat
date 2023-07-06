import type { RegisterServerOptions, Video } from '@peertube/peertube-types'
import type { CustomTag } from '@peertube/feed/lib/typings'
import { videoHasWebchat } from '../../../shared/lib/video'
import { fillVideoCustomFields } from '../custom-fields'
import { getProsodyDomain } from '../prosody/config/domain'
import { getPublicChatUri } from '../uri/webchat'
import { isDebugMode } from '../debug'

async function initRSS (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  const registerHook = options.registerHook
  logger.info('Registring RSS hooks...')

  registerHook({
    target: 'filter:feed.podcast.video.create-custom-tags.result',
    handler: async (
      result: CustomTag[], { video, liveItem }: { video: Video, liveItem: boolean }
    ): Promise<CustomTag[]> => {
      if (!liveItem && !isDebugMode(options, 'enablePodcastChatTagForNonLive')) {
        // Note: the Podcast RSS feed specification does not handle chats for non-live.
        // So we just return here.
        return result
      }

      // FIXME: calling getSettings for each RSS entry is not optimal.
      //      Settings should be cached somewhere on the plugin level.
      //      (i already have some plans to do something for this)
      const settings = await options.settingsManager.getSettings([
        'chat-per-live-video',
        'chat-all-lives',
        'chat-all-non-lives',
        'chat-videos-list',
        'prosody-room-type',
        'federation-dont-publish-remotely',
        'prosody-room-allow-s2s',
        'prosody-s2s-port'
      ])

      if (settings['federation-dont-publish-remotely']) {
        // Chat must not be published to the outer world.
        return result
      }

      await fillVideoCustomFields(options, video)
      const hasChat = await videoHasWebchat({
        'chat-per-live-video': !!settings['chat-per-live-video'],
        'chat-all-lives': !!settings['chat-all-lives'],
        'chat-all-non-lives': !!settings['chat-all-non-lives'],
        'chat-videos-list': settings['chat-videos-list'] as string
      }, video)

      if (!hasChat) {
        logger.debug(`Video uuid=${video.uuid} has not livechat, no need to add podcast:chat tag.`)
        return result
      }

      const prosodyDomain = await getProsodyDomain(options)
      const podcastChat: any = {
        name: 'podcast:chat',
        attributes: {
          server: prosodyDomain,
          protocol: 'xmpp',
          // space: will be added only if external XMPP connections are available
          embedUrl: getPublicChatUri(options, video)
        }
      }

      // In order to connect to the chat using standard xmpp, it requires these settings:
      // - prosody-room-allow-s2s
      // - prosody-s2s-port
      // Or there is a special debug_mode option
      if (
        (settings['prosody-room-allow-s2s'] && settings['prosody-s2s-port']) ||
        isDebugMode(options, 'alwaysPublishXMPPRoom')
      ) {
        let roomJID: string
        if (settings['prosody-room-type'] === 'channel') {
          roomJID = `channel.${video.channel.id}@room.${prosodyDomain}`
        } else {
          roomJID = `${video.uuid}@room.${prosodyDomain}`
        }
        podcastChat.attributes.space = roomJID
      }

      return result.concat([podcastChat])
    }
  })
}

export {
  initRSS
}
