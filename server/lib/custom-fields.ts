import type { RegisterServerOptions, MVideoThumbnail } from '@peertube/peertube-types'
async function initCustomFields (options: RegisterServerOptions): Promise<void> {
  const registerHook = options.registerHook
  const storageManager = options.storageManager
  const logger = options.peertubeHelpers.logger

  registerHook({
    target: 'action:api.video.updated',
    handler: async (params: any) => {
      logger.debug('Saving a video, checking for custom fields')

      const body: any = params.body
      const video: MVideoThumbnail | undefined = params.video
      if (!video || !video.id) {
        return
      }
      if (!body.pluginData) return
      const value = body.pluginData['livechat-active']
      // NB: on Peertube 3.2.1, value is "true", "false", or "null", as strings.
      if (value === true || value === 'true') {
        logger.info(`Saving livechat-active=true for video ${video.id as string}`)
        await storageManager.storeData(`livechat-active-${video.id as string}`, true)
      } else if (value === false || value === 'false' || value === 'null') {
        logger.info(`Saving livechat-active=false for video ${video.id as string}`)
        await storageManager.storeData(`livechat-active-${video.id as string}`, false)
      } else {
        logger.error('Unknown value ' + JSON.stringify(value) + ' for livechat-active field.')
      }
    }
  })

  registerHook({
    target: 'filter:api.video.get.result',
    handler: async (video: MVideoThumbnail): Promise<MVideoThumbnail> => {
      logger.debug('Getting a video, searching for custom fields')
      await fillVideoCustomFields(options, video)
      return video
    }
  })
}

// FIXME: @peertube/peertube-types@4.0.0-beta.3 is pluginData missing?
interface MVideoThumbnailLiveChat extends MVideoThumbnail {
  pluginData?: {
    'livechat-active'?: boolean
  }
}

async function fillVideoCustomFields (options: RegisterServerOptions, video: MVideoThumbnailLiveChat): Promise<void> {
  if (!video) return video
  if (!video.pluginData) video.pluginData = {}
  if (!video.id) return
  const storageManager = options.storageManager
  const logger = options.peertubeHelpers.logger

  if (video.isLive) {
    const result: any = await storageManager.getData(`livechat-active-${video.id as string}`)
    logger.debug(`Video ${video.id as string} has livechat-active=` + JSON.stringify(result))
    // NB: I got weird stuff here. Maybe Peertube 3.2.1 bug?
    if (result === true || result === 'true') {
      video.pluginData['livechat-active'] = true
    } else if (result === false || result === 'false' || result === 'null') {
      video.pluginData['livechat-active'] = false
    }
  }
}

export {
  initCustomFields,
  fillVideoCustomFields
}
