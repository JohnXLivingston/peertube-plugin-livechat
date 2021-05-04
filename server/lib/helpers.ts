import { Response } from 'express'

const packagejson: any = require('../../../package.json')
const version: string = packagejson.version || ''
if (!/^\d+\.\d+\.\d+/.test(version)) {
  throw new Error('Incorrect version in package.json.')
}
const pluginName: string = packagejson.name || ''
if (!/^peertube-plugin-[-a-z]+$/.test(pluginName)) {
  throw new Error('Incorrect plugin name in package.json.')
}
const pluginShortName = pluginName.substring('peertube-plugin-'.length)

// FIXME: in Peertube <= 3.1.0, PeertubeHelpers dont provide this function
function getBaseRouter (): string {
  return '/plugins/' + pluginShortName + '/router/'
}

// FIXME: in Peertube <= 3.1.0, PeertubeHelpers dont provide this function
function getBaseStaticRoute (): string {
  return '/plugins/' + pluginShortName + '/' + version + '/static/'
}

// Peertube <= 3.1.0 has no way to test that current user is admin
// Peertube >= 3.2.0 has getAuthUser helper
function isUserAdmin (options: RegisterServerOptions, res: Response): boolean {
  const user = getAuthUser(options, res)
  if (!user) {
    return false
  }
  if (user.blocked) {
    return false
  }
  if (user.role !== 0) {
    return false
  }
  return true
}

// Peertube <= 3.1.0 has no way to get user informations.
// This is a hack.
// Peertube >= 3.2.0 has getAuthUser helper
function getAuthUser ({ peertubeHelpers }: RegisterServerOptions, res: Response): MUserAccountUrl | undefined {
  if (peertubeHelpers.user?.getAuthUser) {
    return peertubeHelpers.user.getAuthUser(res)
  }
  peertubeHelpers.logger.debug('Peertube does not provide getAuthUser for now, fallback on hack')
  return res.locals.oauth?.token?.User
}

// FIXME: Peertube <= 3.1.0 has no way to obtain user nickname
async function getUserNickname ({ peertubeHelpers }: RegisterServerOptions, id: number): Promise<string | undefined> {
  const logger = peertubeHelpers.logger
  if (!Number.isInteger(id)) {
    logger.error('getUserNickname: Invalid User Id, should be an integer')
    return undefined
  }
  const [results] = await peertubeHelpers.database.query(`SELECT name FROM "account" WHERE "userId" = ${id}`)
  if (!Array.isArray(results)) {
    logger.error('getUserNickname: query result is not an array.')
    return undefined
  }
  if (!results[0]) {
    logger.error(`getUserNickname: no result for id ${id}`)
    return undefined
  }
  if (typeof results[0] !== 'object') {
    logger.error('getUserNickname: query result is not an object')
    return undefined
  }
  if (!('name' in results[0])) {
    logger.error('getUserNickname: no name field in result')
    return undefined
  }
  return results[0].name as string
}

export {
  getBaseRouter,
  getBaseStaticRoute,
  isUserAdmin,
  getAuthUser,
  getUserNickname,
  pluginName,
  pluginShortName
}
