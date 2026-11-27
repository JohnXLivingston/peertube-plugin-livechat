// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions, VideoObject } from '@peertube/peertube-types'
import type { VideoBuildResultContext, RemoteVideoHandlerParams } from './types'
import { videoBuildJSONLD, videoContextBuildJSONLD } from './outgoing'
import { readIncomingAPVideo } from './incoming'
import { getVideoLiveChatInfos } from './storage'
import { Emojis } from '../emojis'
import { registerPrimaryHandler } from '../horizontal-scalability'

export async function initFederation (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  const registerHook = options.registerHook
  logger.info('Registering federation hooks...')

  registerHook({
    target: 'filter:activity-pub.video.json-ld.build.result',
    handler: async (jsonld: VideoObject, context: VideoBuildResultContext) => {
      return videoBuildJSONLD(options, jsonld, context)
    }
  })

  registerHook({
    target: 'filter:activity-pub.activity.context.build.result',
    handler: async (jsonld: any[]) => {
      return videoContextBuildJSONLD(options, jsonld)
    }
  })

  type VideoRef = Parameters<typeof getVideoLiveChatInfos>[1]
  registerPrimaryHandler(options, 'video-livechat-infos', async (video: VideoRef) => {
    return getVideoLiveChatInfos(options, video)
  })
  registerPrimaryHandler(options, 'channel-custom-emojis-url', async (channelId: number) => {
    return Emojis.singletonSafe()?.channelCustomEmojisUrl(channelId)
  })

  const onRemoteVideo = registerPrimaryHandler(options, 'remote-video', async (params: RemoteVideoHandlerParams) => {
    return readIncomingAPVideo(options, params)
  })
  const remoteVideoHandler = async ({ video, videoAPObject }: RemoteVideoHandlerParams): Promise<void> => {
    const peertubeLiveChat = ('peertubeLiveChat' in videoAPObject) ? videoAPObject.peertubeLiveChat : false
    await onRemoteVideo({
      video: { uuid: video.uuid, url: video.url, remote: video.remote },
      videoAPObject: { peertubeLiveChat }
    } as unknown as RemoteVideoHandlerParams)
  }

  registerHook({
    target: 'action:activity-pub.remote-video.created',
    handler: remoteVideoHandler
  })
  registerHook({
    target: 'action:activity-pub.remote-video.updated',
    handler: remoteVideoHandler
  })
}
