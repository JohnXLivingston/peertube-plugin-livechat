// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions, VideoObject } from '@peertube/peertube-types'
import type { VideoBuildResultContext, RemoteVideoHandlerParams } from './types'
import { videoBuildJSONLD, videoContextBuildJSONLD } from './outgoing'
import { readIncomingAPVideo } from './incoming'

export async function initFederation (options: RegisterServerOptions): Promise<void> {
  const logger = options.peertubeHelpers.logger
  const registerHook = options.registerHook
  logger.info('Registring federation hooks...')

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

  registerHook({
    target: 'action:activity-pub.remote-video.created',
    handler: async (params: RemoteVideoHandlerParams) => {
      return readIncomingAPVideo(options, params)
    }
  })
  registerHook({
    target: 'action:activity-pub.remote-video.updated',
    handler: async (params: RemoteVideoHandlerParams) => {
      return readIncomingAPVideo(options, params)
    }
  })
}
