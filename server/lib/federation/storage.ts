import type { RegisterServerOptions, MVideoFullLight, MVideoAP, Video, MVideoThumbnail } from '@peertube/peertube-types'
import type { LiveChatJSONLDAttribute, LiveChatJSONLDAttributeV1 } from './types'
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

const cache: Map<string, LiveChatJSONLDAttributeV1> = new Map<string, LiveChatJSONLDAttributeV1>()

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
): Promise<LiveChatJSONLDAttributeV1> {
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
  const r = sanitizePeertubeLiveChatInfos(options, content)
  cache.set(video.url, r)
  return r
}

/**
 * When receiving livechat information for remote servers, we store some information
 * about remote server capatibilities: has it s2s enabled? can it proxify s2s in Peertube?
 * These information can then be read by Prosody module mod_s2s_peertubelivechat.
 *
 * We simply store the more recent informations. Indeed, it should be consistent between videos.
 *
 * Note: XMPP actively uses subdomains to seperate components.
 * Peertube chats are on the domain `room.your_instance.tld`. But the server will
 * be contacted using `your_instance.tld`.
 * We must make sure that the Prosody module mod_s2s_peertubelivechat finds both
 * kind of urls.
 *
 * @param options server optiosn
 * @param liveChatInfos livechat stored data
 */
async function storeRemoteServerInfos (
  options: RegisterServerOptions,
  liveChatInfos: LiveChatJSONLDAttributeV1
): Promise<void> {
  if (!liveChatInfos) { return }
  if (!liveChatInfos.xmppserver) { return }

  const logger = options.peertubeHelpers.logger

  const mainHost = liveChatInfos.xmppserver.host
  const hosts = [
    liveChatInfos.xmppserver.host,
    liveChatInfos.xmppserver.muc
  ]

  for (const host of hosts) {
    if (!host) { continue }

    // Some security check, just in case.
    if (host.includes('..')) {
      logger.error(`Host seems not correct, contains ..: ${host}`)
      continue
    }

    const dir = path.resolve(
      options.peertubeHelpers.plugin.getDataDirectoryPath(),
      'serverInfos',
      host
    )
    const s2sFilePath = path.resolve(dir, 's2s')
    const wsS2SFilePath = path.resolve(dir, 'ws-s2s')

    if (liveChatInfos.xmppserver.directs2s?.port) {
      await _store(options, s2sFilePath, {
        host: mainHost,
        port: liveChatInfos.xmppserver.directs2s.port
      })
    } else {
      await _del(options, s2sFilePath)
    }

    if (liveChatInfos.xmppserver.websockets2s?.url) {
      await _store(options, wsS2SFilePath, {
        host: mainHost,
        url: liveChatInfos.xmppserver.websockets2s.url
      })
    } else {
      await _del(options, wsS2SFilePath)
    }
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
