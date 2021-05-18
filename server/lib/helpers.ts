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

function getBaseRouterRoute (options: RegisterServerOptions): string {
  // In Peertube <= 3.1.0, PeertubeHelpers dont provide this function
  // Available in Peertube >= 3.2.0
  if (options.peertubeHelpers.plugin) {
    return options.peertubeHelpers.plugin.getBaseRouterRoute()
  }
  return '/plugins/' + pluginShortName + '/' + version + '/router/'
}

function getBaseStaticRoute (options: RegisterServerOptions): string {
  // In Peertube <= 3.1.0, PeertubeHelpers dont provide this function.
  // Available in Peertube >= 3.2.0
  if (options.peertubeHelpers.plugin) {
    return options.peertubeHelpers.plugin.getBaseStaticRoute()
  }
  return '/plugins/' + pluginShortName + '/' + version + '/static/'
}

// Peertube <= 3.1.0 has no way to test that current user is admin
// Peertube >= 3.2.0 has getAuthUser helper
async function isUserAdmin (options: RegisterServerOptions, res: Response): Promise<boolean> {
  const user = await getAuthUser(options, res)
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
async function getAuthUser (options: RegisterServerOptions, res: Response): Promise<MUserDefault | undefined> {
  const peertubeHelpers = options.peertubeHelpers
  if (peertubeHelpers.user?.getAuthUser) {
    return peertubeHelpers.user.getAuthUser(res)
  }
  peertubeHelpers.logger.debug('Peertube does not provide getAuthUser for now, fallback on hack')
  return res.locals.oauth?.token?.User
}

// Peertube <= 3.1.0 has no way to obtain user nickname/
// Peertube >= 3.2.0: getAuthUser has user.Account.name.
async function getUserNickname (options: RegisterServerOptions, user: MUserDefault): Promise<string | undefined> {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger

  if (user.Account?.name) {
    return user.Account.name
  }

  peertubeHelpers.logger.debug('Peertube does not provide user.Account.name, fallback on hack')

  if (!user.id) {
    logger.error('getUserNickname: missing user id')
    return undefined
  }

  const userId = Number.isInteger(user.id) ? user.id : parseInt(user.id as string)
  if (Number.isNaN(userId)) {
    logger.error('getUserNickname: Invalid User Id, Not a number')
    return undefined
  }

  if (!Number.isInteger(userId)) {
    logger.error('getUserNickname: Invalid User Id, should be an integer')
    return undefined
  }

  const [results] = await peertubeHelpers.database.query(
    `SELECT name FROM "account" WHERE "userId" = ${userId.toString()}`
  )

  if (!Array.isArray(results)) {
    logger.error('getUserNickname: query result is not an array.')
    return undefined
  }
  if (!results[0]) {
    logger.error(`getUserNickname: no result for id ${userId}`)
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
  getBaseRouterRoute,
  getBaseStaticRoute,
  isUserAdmin,
  getAuthUser,
  getUserNickname,
  pluginName,
  pluginShortName
}
