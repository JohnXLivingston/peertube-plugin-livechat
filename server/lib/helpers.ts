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
  if (!options.peertubeHelpers.plugin) {
    throw new Error('Missing peertubeHelpers.plugin, have you the correct Peertube version?')
  }
  return options.peertubeHelpers.plugin.getBaseRouterRoute()
}

function getBaseStaticRoute (options: RegisterServerOptions): string {
  if (!options.peertubeHelpers.plugin) {
    throw new Error('Missing peertubeHelpers.plugin, have you the correct Peertube version?')
  }
  return options.peertubeHelpers.plugin.getBaseStaticRoute()
}

async function isUserAdmin (options: RegisterServerOptions, res: Response): Promise<boolean> {
  const user = await options.peertubeHelpers.user.getAuthUser(res)
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

async function getUserNickname (options: RegisterServerOptions, user: MUserDefault): Promise<string | undefined> {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger

  if (user.Account?.name) {
    return user.Account.name
  }
  logger.error('There is no Account.name on the user')
  return undefined
}

export {
  getBaseRouterRoute,
  getBaseStaticRoute,
  isUserAdmin,
  getUserNickname,
  pluginName,
  pluginShortName
}
