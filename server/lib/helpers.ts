import { Response } from 'express'

const packagejson: any = require('../../../package.json')
const version: string = packagejson.version || ''
if (!/^\d+\.\d+\.\d+/.test(version)) {
  throw new Error('Incorrect version in package.json.')
}
const name: string = packagejson.name || ''
if (!/^peertube-plugin-[-a-z]+$/.test(name)) {
  throw new Error('Incorrect plugin name in package.json.')
}
const shortName = name.substring('peertube-plugin-'.length)

// FIXME: in Peertube <= 3.1.0, PeertubeHelpers dont provide this function
function getBaseRouter (): string {
  return '/plugins/' + shortName + '/router/'
}

// FIXME: in Peertube <= 3.1.0, PeertubeHelpers dont provide this function
function getBaseStaticRoute (): string {
  return '/plugins/' + shortName + '/' + version + '/static/'
}

// FIXME: Peertube <= 3.1.0 has no way to test that current user is admin
// This is a hack.
function isUserAdmin (res: Response): boolean {
  if (!res.locals?.authenticated) {
    return false
  }
  if (res.locals?.oauth?.token?.User?.role === 0) {
    return true
  }
  return false
}

export {
  getBaseRouter,
  getBaseStaticRoute,
  isUserAdmin
}
