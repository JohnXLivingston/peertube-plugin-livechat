// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { Router, Request, Response, NextFunction } from 'express'
import { videoHasWebchat } from '../../../../shared/lib/video'
import { asyncMiddleware } from '../../middlewares/async'
import { getCheckAPIKeyMiddleware } from '../../middlewares/apikey'
import { Affiliations, getVideoAffiliations, getChannelAffiliations } from '../../prosody/config/affiliations'
import { fillVideoCustomFields } from '../../custom-fields'
import { getChannelInfosById } from '../../database/channel'
import { RoomChannel } from '../../room-channel'
import {
  getChannelConfigurationOptions,
  getDefaultChannelConfigurationOptions
} from '../../configuration/channel/storage'

// See here for description: https://modules.prosody.im/mod_muc_http_defaults.html
interface RoomDefaults {
  config: {
    name: string
    description: string
    language?: string
    persistent?: boolean
    public?: boolean
    members_only?: boolean
    allow_member_invites?: boolean
    public_jids?: boolean
    // subject_from: string
    // subject: string
    changesubject?: boolean
    // historylength: number
    moderated?: boolean
    archiving?: boolean

    // Following fields are specific to livechat (for now), and requires a customized version for mod_muc_http_defaults.
    slow_mode_duration?: number
    mute_anonymous?: boolean
  }
  affiliations?: Affiliations
}

async function _getChannelSpecificOptions (
  options: RegisterServerOptions,
  channelId: number
): Promise<Partial<RoomDefaults['config']>> {
  const channelOptions = await getChannelConfigurationOptions(options, channelId) ??
    getDefaultChannelConfigurationOptions(options)

  return {
    slow_mode_duration: channelOptions.slowMode.duration,
    mute_anonymous: channelOptions.mute.anonymous
  }
}

/**
 * Instanciate the route for room APIs.
 * These APIs are used by Prosody to get room defaults from the Peertube server.
 * @param options server register options
 */
async function initRoomApiRouter (options: RegisterServerOptions, router: Router): Promise<void> {
  const logger = options.peertubeHelpers.logger

  router.get('/room', asyncMiddleware([
    getCheckAPIKeyMiddleware(options),
    async (req: Request, res: Response, _next: NextFunction) => {
      const jid: string = req.query.jid as string || ''
      logger.info(`Requesting room information for room '${jid}'.`)

      const settings = await options.settingsManager.getSettings([
        'prosody-room-type'
      ])
      // Now, we have two different room type: per video or per channel.
      if (settings['prosody-room-type'] === 'channel') {
        const matches = jid.match(/^channel\.(\d+)$/)
        if (!matches || !matches[1]) {
          logger.warn(`Invalid channel room jid '${jid}'.`)
          res.sendStatus(403)
          return
        }
        const channelId = parseInt(matches[1])
        const channelInfos = await getChannelInfosById(options, channelId)
        if (!channelInfos) {
          logger.warn(`Channel ${channelId} not found`)
          res.sendStatus(403)
          return
        }

        let affiliations: Affiliations
        try {
          affiliations = await getChannelAffiliations(options, channelId)
        } catch (error) {
          logger.error(`Failed to get channel affiliations for ${channelId}:`, error)
          // affiliations: should at least be {}, so that the first user will not be moderator/admin
          affiliations = {}
        }

        const roomDefaults: RoomDefaults = {
          config: Object.assign(
            {
              name: channelInfos.displayName,
              description: ''
              // subject: channelInfos.displayName
            },
            await _getChannelSpecificOptions(options, channelId)
          ),
          affiliations: affiliations
        }

        RoomChannel.singleton().link(channelId, jid)

        res.json(roomDefaults)
      } else {
        // FIXME: @peertube/peertype-types@4.2.2: wrongly considere video as MVideoThumbnail.
        const video = await options.peertubeHelpers.videos.loadByIdOrUUID(jid)
        if (!video) {
          logger.warn(`Video ${jid} not found`)
          res.sendStatus(403)
          return
        }

        // Adding the custom fields and data:
        await fillVideoCustomFields(options, video)

        // check settings (chat enabled for this video?)
        const settings = await options.settingsManager.getSettings([
          'chat-per-live-video',
          'chat-all-lives',
          'chat-all-non-lives',
          'chat-videos-list'
        ])
        if (!videoHasWebchat({
          'chat-per-live-video': !!settings['chat-per-live-video'],
          'chat-all-lives': !!settings['chat-all-lives'],
          'chat-all-non-lives': !!settings['chat-all-non-lives'],
          'chat-videos-list': settings['chat-videos-list'] as string
        }, video)) {
          logger.warn(`Video ${jid} has not chat activated`)
          res.sendStatus(403)
          return
        }

        let affiliations: Affiliations
        try {
          affiliations = await getVideoAffiliations(options, video)
        } catch (error) {
          logger.error(`Failed to get video affiliations for ${video.uuid}:`, error)
          // affiliations: should at least be {}, so that the first user will not be moderator/admin
          affiliations = {}
        }

        const roomDefaults: RoomDefaults = {
          config: Object.assign(
            {
              name: video.name,
              description: '',
              language: video.language
              // subject: video.name
            },
            await _getChannelSpecificOptions(options, video.channelId)
          ),
          affiliations: affiliations
        }

        RoomChannel.singleton().link(video.channelId, jid)

        res.json(roomDefaults)
      }
    }
  ]))
}

export {
  initRoomApiRouter
}
