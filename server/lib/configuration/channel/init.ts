// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions, MVideoFullLight, VideoChannel } from '@peertube/peertube-types'
import { RoomChannel } from '../../room-channel'
import { fillVideoCustomFields } from '../../custom-fields'
import { videoHasWebchat } from '../../../../shared/lib/video'
import { updateProsodyRoom } from '../../prosody/api/manage-rooms'
import { getChannelInfosById } from '../../database/channel'
import { Emojis } from '../../emojis'

/**
 * Register stuffs related to channel configuration
 */
async function initChannelConfiguration (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  const registerHook = options.registerHook
  logger.info('Registring room-channel hooks...')

  registerHook({
    target: 'action:api.video.deleted',
    handler: async (params: { video: MVideoFullLight }) => {
      // When a video is deleted, we can delete the channel2room and room2channel files.
      // Note: don't need to check if there is a chat for this video, just deleting existing files...
      const video = params.video
      if (video.remote) { return }
      logger.info(`Video ${video.uuid} deleted, removing 'channel configuration' related stuff.`)
      // Here the associated channel can be either channel.X@mucdomain or video_uuid@mucdomain.
      // In first case, nothing to do... in the second, we must delete.
      // So we don't need to check which case is effective, just delete video_uuid@mucdomain.
      try {
        RoomChannel.singleton().removeRoom(video.uuid)
      } catch (err) {
        logger.error(err)
      }

      // Note: we don't delete the room. So that admins can check logs afterward, if any doubts.
    }
  })

  registerHook({
    target: 'action:api.video-channel.deleted',
    handler: async (params: { videoChannel: VideoChannel }) => {
      // When a video is deleted, we can delete the channel2room and room2channel files.
      // Note: don't need to check if there is a chat for this video, just deleting existing files...

      // Note: this hook is only called for local channels.
      const channelId = params.videoChannel.id
      logger.info(`Channel ${channelId} deleted, removing 'channel configuration' related stuff.`)
      // Here the associated channel can be either channel.X@mucdomain or video_uuid@mucdomain.
      // In first case, nothing to do... in the second, we must delete.
      // So we don't need to check which case is effective, just delete video_uuid@mucdomain.
      try {
        RoomChannel.singleton().removeChannel(channelId)
      } catch (err) {
        logger.error(err)
      }

      logger.info(`Channel ${channelId} deleted, removing 'custom emojis' related stuff.`)
      try {
        await Emojis.singletonSafe()?.deleteChannelDefinition(channelId)
      } catch (err) {
        logger.error(err)
      }

      // Note: we don't delete the room. So that admins can check logs afterward, if any doubts.
    }
  })

  registerHook({
    target: 'action:api.video.updated',
    handler: async (params: { video: MVideoFullLight }) => {
      // When a video is updated, the channel could change.
      // So we ensure the room-channel link is ok.
      // But we can only do this if the video has a chatroom!
      const video = params.video
      logger.info(`Video ${video.uuid} updated, updating room-channel informations.`)
      try {
        if (video.remote) { return }
        const settings = await options.settingsManager.getSettings([
          'chat-per-live-video',
          'chat-all-lives',
          'chat-all-non-lives',
          'chat-videos-list',
          'prosody-room-type'
        ])

        await fillVideoCustomFields(options, video)
        const hasChat = videoHasWebchat({
          'chat-per-live-video': !!settings['chat-per-live-video'],
          'chat-all-lives': !!settings['chat-all-lives'],
          'chat-all-non-lives': !!settings['chat-all-non-lives'],
          'chat-videos-list': settings['chat-videos-list'] as string
        }, video)

        if (!hasChat) {
          // Either there were never any chat, either it was disabled...
          logger.debug(`Video ${video.uuid} has no chat, ensuring there is no room link`)
          // Here the associated channel can be either channel.X@mucdomain or video_uuid@mucdomain.
          // In first case, nothing to do... in the second, we must delete.
          // So we don't need to check which case is effective, just delete video_uuid@mucdomain.
          RoomChannel.singleton().removeRoom(video.uuid)
          return
        }

        let roomLocalPart: string
        if (settings['prosody-room-type'] === 'channel') {
          roomLocalPart = 'channel.' + video.channelId.toString()
        } else {
          roomLocalPart = video.uuid
        }

        logger.debug(`Ensuring a room-channel link between room ${roomLocalPart} and channel ${video.channelId}`)
        RoomChannel.singleton().link(video.channelId, roomLocalPart)

        if (settings['prosody-room-type'] === 'video') {
          // Also updating chatroom meta data.
          // FIXME: this piece of code should not be in this file (nothing to do with initChannelConfiguration,
          //   but will be more efficient to add here, as we already tested hasChat).
          // Note: no need to await here, would only degrade performances.
          // FIXME: should also update livechat_muc_terms if channel has changed.
          updateProsodyRoom(options, video.uuid, {
            name: video.name,
            // In case the channel changed:
            livechat_custom_emoji_regexp: await Emojis.singletonSafe()?.getChannelCustomEmojisRegexp(video.channelId)
          }).then(
            () => {},
            (err) => logger.error(err)
          )
        }
      } catch (err) {
        logger.error(err)
      }
    }
  })

  registerHook({
    target: 'action:api.video-channel.updated',
    handler: async (params: { videoChannel: VideoChannel }) => {
      const channel = await getChannelInfosById(options, params.videoChannel.id, true)
      if (!channel) { return }

      // FIXME: this piece of code should not be in this file (nothing to do with initChannelConfiguration,
      //   but for now i keep it close to the similar code on video.updated hook).
      const settings = await options.settingsManager.getSettings([
        'prosody-room-type'
      ])
      if (settings['prosody-room-type'] === 'channel') {
        const jid = 'channel.' + channel.id.toString()
        // Note: no need to await here, would only degrade performances.
        updateProsodyRoom(options, jid, {
          name: channel.displayName
        }).then(
          () => {},
          (err) => logger.error(err)
        )
      }
    }
  })
}

export {
  initChannelConfiguration
}
