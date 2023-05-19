import type { RegisterServerOptions, MVideoFullLight, MVideoAP, Video, MVideoThumbnail } from '@peertube/peertube-types'
import type { LiveChatJSONLDAttribute, LiveChatJSONLDS2SLink, LiveChatJSONLDPeertubeWSS2SLink } from './types'
import { sanitizePeertubeLiveChatInfos } from './sanitize'
import { URL } from 'url'
import * as fs from 'fs'
import * as path from 'path'

/*
Important Note: we could store these data in database. For example by using storageManager.storeData.
But I'm afraid there might be write concurrency issues, or performance issues.
Indeed, Peertube storageManager stores everything in one JSON attribute on the plugin tuple.

Moreover, remote instance can create many data, that will not be cleaned.

So, instead of using storageManager, or using a custom DB table, we will store data in files.
If a file exists, it means the video has a chat.
The file itself contains the JSON LiveChatInfos object.
*/

const cache: Map<string, LiveChatJSONLDAttribute> = new Map<string, LiveChatJSONLDAttribute>()

/**
 * This function stores remote LiveChat infos that are contained in ActivityPub objects.
 * We store these data for remotes videos.
 *
 * But we also store the data for local videos, so we can know what data we send to other Peertube instances.
 * This is not really used for now, but can help if we want, one day, to know which videos we must refresh on remote
 * instances.
 * @param options server options
 * @param video video object
 * @param liveChatInfos video ActivityPub data to read
 * @returns void
 */
async function storeVideoLiveChatInfos (
  options: RegisterServerOptions,
  video: MVideoFullLight | MVideoAP,
  liveChatInfos: LiveChatJSONLDAttribute
): Promise<void> {
  const logger = options.peertubeHelpers.logger

  cache.delete(video.url)

  const remote = video.remote
  const filePath = await _getFilePath(options, remote, video.uuid, video.url)
  if (!filePath) {
    logger.error('Cant compute the file path for storing liveChat infos for video ' + video.uuid)
    return
  }

  logger.debug(`Video ${video.uuid} data should be stored in ${filePath}`)

  if (!liveChatInfos) {
    logger.debug(`${remote ? 'Remote' : 'Local'} video ${video.uuid} has no chat infos, removing if necessary`)
    await _del(options, filePath)
    // Delete the cache again, just in case.
    cache.delete(video.url)
    return
  }

  logger.debug(`${remote ? 'Remote' : 'Local'} video ${video.uuid} has chat infos to store`)
  await _store(options, filePath, liveChatInfos)
  // Delete the cache again... in case a read failed because we were writing at the same time.
  cache.delete(video.url)
}

/**
 * Gets the stored livechat information (if any).
 * @param options server options
 * @param video video object
 * @returns livechat stored data
 */
async function getVideoLiveChatInfos (
  options: RegisterServerOptions,
  video: MVideoFullLight | MVideoAP | Video | MVideoThumbnail
): Promise<LiveChatJSONLDAttribute> {
  const logger = options.peertubeHelpers.logger

  const cached = cache.get(video.url)
  if (cached !== undefined) { return cached }

  const remote = ('remote' in video) ? video.remote : !video.isLocal
  const filePath = await _getFilePath(options, remote, video.uuid, video.url)
  if (!filePath) {
    logger.error('Cant compute the file path for storing liveChat infos for video ' + video.uuid)
    cache.set(video.url, false)
    return false
  }

  const content = await _get(options, filePath)
  if (content === null) {
    cache.set(video.url, false)
    return false
  }
  // We must sanitize here, in case a previous plugin version did not sanitize enougth.
  const r = sanitizePeertubeLiveChatInfos(content)
  cache.set(video.url, r)
  return r
}

/**
 * When receiving livechat information for remote servers, we store some information
 * about remote server capatibilities: has it s2s enabled? can it proxify s2s in Peertube?
 * These information can then be read by Prosody module mod_s2s_peertubelivechat.
 *
 * We simply store the more recent informations. Indeed, it should be consistent between videos.
 * @param options server optiosn
 * @param liveChatInfos livechat stored data
 */
async function storeRemoteServerInfos (
  options: RegisterServerOptions,
  liveChatInfos: LiveChatJSONLDAttribute
): Promise<void> {
  if (!liveChatInfos) { return }

  const logger = options.peertubeHelpers.logger

  const roomJID = liveChatInfos.jid
  const host = roomJID.split('@')[1]
  if (!host) {
    logger.error(`Room JID seems not correct, no host: ${roomJID}`)
    return
  }
  if (host.includes('..')) {
    logger.error(`Room host seems not correct, contains ..: ${host}`)
    return
  }
  const dir = path.resolve(
    options.peertubeHelpers.plugin.getDataDirectoryPath(),
    'serverInfos',
    host
  )
  const s2sFilePath = path.resolve(dir, 's2s')
  const wsS2SFilePath = path.resolve(dir, 'ws-s2s')

  const s2sLink = liveChatInfos.links.find(v => v.type === 'xmpp-s2s')
  if (s2sLink) {
    await _store(options, s2sFilePath, {
      host: (s2sLink as LiveChatJSONLDS2SLink).host,
      port: (s2sLink as LiveChatJSONLDS2SLink).port
    })
  } else {
    await _del(options, s2sFilePath)
  }
  const wsS2SLink = liveChatInfos.links.find(v => v.type === 'xmpp-peertube-livechat-ws-s2s')
  if (wsS2SLink) {
    await _store(options, wsS2SFilePath, {
      url: (wsS2SLink as LiveChatJSONLDPeertubeWSS2SLink).url
    })
  } else {
    await _del(options, wsS2SFilePath)
  }
}

async function _getFilePath (
  options: RegisterServerOptions,
  remote: boolean,
  uuid: string,
  videoUrl: string
): Promise<string | null> {
  const logger = options.peertubeHelpers.logger
  try {
    // some sanitization, just in case...
    if (!/^(\w|-)+$/.test(uuid)) {
      logger.error(`Video uuid seems not correct: ${uuid}`)
      return null
    }

    let subFolders: string[]
    if (remote) {
      const u = new URL(videoUrl)
      const host = u.hostname

      if (host.includes('..')) {
        // to prevent exploits that could go outside the plugin data dir.
        logger.error(`Video host seems not correct, contains ..: ${host}`)
        return null
      }
      subFolders = ['remote', host]
    } else {
      subFolders = ['local']
    }

    return path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'videoInfos',
      ...subFolders,
      uuid + '.json'
    )
  } catch (err) {
    logger.error(err)
    return null
  }
}

async function _del (options: RegisterServerOptions, filePath: string): Promise<void> {
  const logger = options.peertubeHelpers.logger
  try {
    if (!fs.existsSync(filePath)) { return }
    logger.info('Deleting file ' + filePath)
    fs.rmSync(filePath)
  } catch (err) {
    logger.error(err)
  }
}

async function _store (options: RegisterServerOptions, filePath: string, content: any): Promise<void> {
  const logger = options.peertubeHelpers.logger
  try {
    const jsonContent = JSON.stringify(content)
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    } else {
      // only write if the content is different
      try {
        const currentJSONContent = await fs.promises.readFile(filePath, {
          encoding: 'utf-8'
        })
        if (currentJSONContent === jsonContent) { return }
      } catch (_err) {}
    }
    await fs.promises.writeFile(filePath, jsonContent, {
      encoding: 'utf-8'
    })
  } catch (err) {
    logger.error(err)
  }
}

async function _get (options: RegisterServerOptions, filePath: string): Promise<any | null> {
  const logger = options.peertubeHelpers.logger
  try {
    if (!fs.existsSync(filePath)) {
      return null
    }
    const content = await fs.promises.readFile(filePath, {
      encoding: 'utf-8'
    })
    return JSON.parse(content)
  } catch (err) {
    logger.error(err)
    return null
  }
}

function getRemoteServerInfosDir (options: RegisterServerOptions): string {
  return path.resolve(
    options.peertubeHelpers.plugin.getDataDirectoryPath(),
    'serverInfos'
  )
}

export {
  storeVideoLiveChatInfos,
  storeRemoteServerInfos,
  getVideoLiveChatInfos,
  getRemoteServerInfosDir
}
