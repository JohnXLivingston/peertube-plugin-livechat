import type { RegisterServerOptions, MVideoFullLight, VideoChannel } from '@peertube/peertube-types'
import { RoomChannel } from '../../room-channel'

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
    handler: async (params: { channel: VideoChannel }) => {
      // When a video is deleted, we can delete the channel2room and room2channel files.
      // Note: don't need to check if there is a chat for this video, just deleting existing files...
      const channelId = params.channel.id
      logger.info(`Channel ${channelId} deleted, removing 'channel configuration' related stuff.`)
      // Here the associated channel can be either channel.X@mucdomain or video_uuid@mucdomain.
      // In first case, nothing to do... in the second, we must delete.
      // So we don't need to check which case is effective, just delete video_uuid@mucdomain.
      try {
        RoomChannel.singleton().removeChannel(channelId)
      } catch (err) {
        logger.error(err)
      }

      // Note: we don't delete the room. So that admins can check logs afterward, if any doubts.
    }
  })
}

export {
  initChannelConfiguration
}
