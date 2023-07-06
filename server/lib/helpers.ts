// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https: //www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions, PeerTubeHelpers } from '@peertube/peertube-types'
import type { Response } from 'express'
import type { IncomingMessage } from 'http'
import type { Duplex } from 'stream'

const pluginVersionRegexp = /^\d+\.\d+\.\d+(?:-(?:rc|alpha|beta)\.\d+)?$/
const pluginVersionWordBreakRegex = /\b\d+\.\d+\.\d+(?:-(?:rc|alpha|beta)\.\d+)?\b/

const packagejson: any = require('../../../package.json')
const version: string = packagejson.version || ''
if (!pluginVersionRegexp.test(version)) {
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

interface RegisterServerWebSocketRouteOptions {
  route: string
  handler: (request: IncomingMessage, socket: Duplex, head: Buffer) => any
}
// getBaseWebSocketRoute() comes with Peertube 5.0.0.
type RegisterServerOptionsV5 = RegisterServerOptions & {
  registerWebSocketRoute?: (options: RegisterServerWebSocketRouteOptions) => void
  peertubeHelpers: {
    plugin: {
      getBaseWebSocketRoute?: () => string
    }
  }
}

/**
 * Returns the base route for Websocket endpoint.
 * This features comes with Peertube >=5.0.0.
 * @param options server options
 * @returns the route, or undefined if the Peertube version does not provide this feature
 */
function getBaseWebSocketRoute (options: RegisterServerOptionsV5): string | undefined {
  if (!options.peertubeHelpers.plugin) {
    throw new Error('Missing peertubeHelpers.plugin, have you the correct Peertube version?')
  }
  if (!options.peertubeHelpers.plugin.getBaseWebSocketRoute) {
    return undefined
  }
  return options.peertubeHelpers.plugin.getBaseWebSocketRoute()
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

type Unpack<T> = T extends Promise<infer U | undefined> ? U : T
type AuthUser = Unpack<ReturnType<PeerTubeHelpers['user']['getAuthUser']>>

async function getUserNickname (options: RegisterServerOptions, user: AuthUser): Promise<string | undefined> {
  const peertubeHelpers = options.peertubeHelpers
  const logger = peertubeHelpers.logger

  if (user.Account?.name) {
    return user.Account.name
  }
  logger.error('There is no Account.name on the user')
  return undefined
}

export {
  RegisterServerOptionsV5,
  getBaseRouterRoute,
  getBaseWebSocketRoute,
  getBaseStaticRoute,
  isUserAdmin,
  getUserNickname,
  pluginName,
  pluginShortName,
  pluginVersionRegexp,
  pluginVersionWordBreakRegex
}
