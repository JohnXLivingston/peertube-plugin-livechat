import type { RegisterServerOptions, Video } from '@peertube/peertube-types'
async function initCustomFields (options: RegisterServerOptions): Promise<void> {
  const registerHook = options.registerHook
  const storageManager = options.storageManager
  const logger = options.peertubeHelpers.logger

  registerHook({
    target: 'action:api.video.updated',
    handler: async (params: any) => {
      logger.debug('Saving a video, checking for custom fields')

      const body: any = params.body
      const video: Video | undefined = params.video
      if (!video || !video.id) {
        return
      }
      if (!body.pluginData) return
      const value = body.pluginData['livechat-active']
      // NB: on Peertube 3.2.1, value is "true", "false", or "null", as strings.
      if (value === true || value === 'true') {
        logger.info(`Saving livechat-active=true for video ${video.id.toString()}`)
        await storageManager.storeData(`livechat-active-${video.id.toString()}`, true)
      } else if (value === false || value === 'false' || value === 'null') {
        logger.info(`Saving livechat-active=false for video ${video.id.toString()}`)
        await storageManager.storeData(`livechat-active-${video.id.toString()}`, false)
      } else {
        logger.error('Unknown value ' + JSON.stringify(value) + ' for livechat-active field.')
      }
    }
  })

  registerHook({
    target: 'filter:api.video.get.result',
    handler: async (video: Video): Promise<Video> => {
      logger.debug('Getting a video, searching for custom fields')
      await fillVideoCustomFields(options, video)
      return video
    }
  })
}

// FIXME: @peertube/peertype-types@4.2.2: wrongly thinks that loadByIdOrUUID return a MVideoThumbnail.
//      So we create this custom interface for fillVideoCustomFields to accept Video and MVideoThumbnail types.
interface LiveChatCustomFieldsVideo {
  id?: number | string
  isLive: boolean
  pluginData?: {
    'livechat-active'?: boolean
  }
}

async function fillVideoCustomFields (options: RegisterServerOptions, video: LiveChatCustomFieldsVideo): Promise<void> {
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
