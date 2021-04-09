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

export {
  getBaseRouter,
  getBaseStaticRoute
}
