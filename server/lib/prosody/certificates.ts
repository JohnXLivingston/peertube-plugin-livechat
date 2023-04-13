import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ProsodyConfig } from './config'
import { isDebugMode } from '../debug'
import { prosodyCtl, reloadProsody } from './ctl'
import * as path from 'path'
import * as fs from 'fs'

interface Renew {
  timer: NodeJS.Timer
}
let renew: Renew | undefined

function _filePathToTest (options: RegisterServerOptions, config: ProsodyConfig): string {
  return path.resolve(config.paths.certs, config.host + '.crt')
}

async function ensureProsodyCertificates (options: RegisterServerOptions, config: ProsodyConfig): Promise<void> {
  if (config.certificates !== 'generate-self-signed') { return }
  const logger = options.peertubeHelpers.logger
  logger.info('Prosody needs certicicates, checking if certificates are okay...')

  const prosodyDomain = config.host
  const filepath = _filePathToTest(options, config)
  if (fs.existsSync(filepath)) {
    logger.info(`The certificate ${filepath} exists, no need to generate it`)
    return
  }

  // Using: prososyctl --config /.../prosody.cfg.lua cert generate prosodyDomain.tld
  await prosodyCtl(options, 'cert', {
    additionalArgs: ['generate', prosodyDomain],
    yesMode: true,
    stdErrFilter: (data) => {
      // For an unknow reason, `prosodyctl cert generate` outputs openssl data on stderr...
      // So we filter these logs.
      if (data.match(/Generating \w+ private key/)) { return false }
      if (data.match(/^[.+o*\n]*$/m)) { return false }
      if (data.match(/e is \d+/)) { return false }
      return true
    }
  })
}

async function renewCheckSelfSigned (options: RegisterServerOptions, config: ProsodyConfig): Promise<void> {
  const logger = options.peertubeHelpers.logger
  // We have to check if the self signed certificate is still valid.
  // Prosodyctl generated certificates are valid 365 days.
  // We will renew it every 10 months (and every X minutes in debug mode)

  const renewEvery = isDebugMode(options) ? 5 * 60000 : 3600000 * 24 * 30 * 10
  // getting the file date...
  const filepath = _filePathToTest(options, config)
  if (!fs.existsSync(filepath)) {
    logger.error('Missing certificate file: ' + filepath)
    return
  }
  const stat = fs.statSync(filepath)
  const age = (new Date()).getTime() - stat.mtimeMs
  if (age <= renewEvery) {
    logger.debug(`The age of the certificate ${filepath} is ${age}ms, which is less than the period ${renewEvery}ms`)
    return
  }
  logger.info(`The age of the certificate ${filepath} is ${age}ms, which is more than the period ${renewEvery}ms`)
  await ensureProsodyCertificates(options, config)
  await reloadProsody(options)
}

async function renewCheck (options: RegisterServerOptions, config: ProsodyConfig): Promise<void> {
  if (config.certificates === 'generate-self-signed') {
    return renewCheckSelfSigned(options, config)
  }
  throw new Error('Unknown value for config.certificates')
}

function startProsodyCertificatesRenewCheck (options: RegisterServerOptions, config: ProsodyConfig): void {
  const logger = options.peertubeHelpers.logger

  if (!config.certificates) {
    return
  }

  const debugMode = isDebugMode(options)
  // check every day (or every minutes in debug mode)
  const checkInterval = debugMode ? 60000 : 3600000 * 24

  if (renew) {
    stopProsodyCertificatesRenewCheck(options)
  }

  logger.info('Starting Prosody Certificates Renew Check')
  renewCheck(options, config).then(() => {}, () => {})

  const timer = setInterval(() => {
    logger.debug('Checking if Prosody certificates need to be renewed')
    renewCheck(options, config).then(() => {}, () => {})
  }, checkInterval)

  renew = {
    timer: timer
  }
}

function stopProsodyCertificatesRenewCheck (options: RegisterServerOptions): void {
  const logger = options.peertubeHelpers.logger
  if (renew === undefined) {
    return
  }
  logger.info('Stoping Prosody Certificates Renew Check')
  clearInterval(renew.timer)
}

export {
  ensureProsodyCertificates,
  startProsodyCertificatesRenewCheck,
  stopProsodyCertificatesRenewCheck
}
