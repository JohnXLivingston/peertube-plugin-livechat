// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { Video } from '@peertube/peertube-types'
import { getPtContext } from '../lib/contexts/peertube'
import { initChat } from './chat'

interface VideoWatchLoadedHookOptions {
  videojs: any
  video: Video
  playlist?: any
}

export async function registerVideoWatch (): Promise<void> {
  const ptContext = getPtContext()
  ptContext.ptOptions.registerHook({
    target: 'action:video-watch.video.loaded',
    handler: ({
      video,
      playlist
    }: VideoWatchLoadedHookOptions) => {
      if (!video) {
        ptContext.logger.error('No video argument in hook action:video-watch.video.loaded')
        return
      }
      if (playlist) {
        ptContext.logger.info('We are in a playlist, we will not use the webchat')
        return
      }
      initChat(video).then(() => {}, () => {})
    }
  })
}
