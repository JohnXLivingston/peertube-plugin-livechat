// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import type { ProsodyConfig } from './config'
import { debugNumericParameter, isDebugMode } from '../debug'
import { prosodyCtl, reloadProsody } from './ctl'
import * as path from 'path'
import * as fs from 'fs'
import * as child_process from 'child_process'

interface Renew {
  timer: NodeJS.Timer
  lastFromDirMtime?: number
}
let renew: Renew | undefined

function startProsodyCertificatesRenewCheck (options: RegisterServerOptions, config: ProsodyConfig): void {
  const logger = options.peertubeHelpers.logger

  if (!config.certificates) {
    return
  }

  // check every day (or every minutes in debug mode)
  const checkInterval = debugNumericParameter(options, 'renewCertCheckInterval', 60000, 3600000 * 24)

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
    timer
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

async function ensureProsodyCertificates (options: RegisterServerOptions, config: ProsodyConfig): Promise<void> {
  if (config.certificates !== 'generate-self-signed') { return }
  const logger = options.peertubeHelpers.logger
  logger.info('Prosody needs certificates, checking if certificates are okay...')

  const prosodyDomain = config.host
  const filepath = _filePathToTest(options, config)
  if (!filepath) { return }
  if (fs.existsSync(filepath)) {
    logger.info(`The certificate ${filepath} exists, no need to generate it`)
    return
  }

  // Using: prososyctl --config /.../prosody.cfg.lua cert generate prosodyDomain.tld
  if (!isDebugMode(options, 'useOpenSSL')) {
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

  // Note: it seems that on Ubuntu, "prosocyctl cert generate" won't work.
  // See https://github.com/JohnXLivingston/peertube-plugin-livechat/issues/268
  // So, if the file still does not exist, we will fallback to openssl:
  if (!fs.existsSync(filepath)) {
    logger.warn(`The certificate ${filepath} creation (using prosodyctl) failed, trying to use openssl`)
    await _generateSelfSignedUsingOpenSSL(options, path.dirname(filepath), prosodyDomain)
  }
}

async function renewCheck (options: RegisterServerOptions, config: ProsodyConfig): Promise<void> {
  if (config.certificates === 'generate-self-signed') {
    return renewCheckSelfSigned(options, config)
  }
  if (config.certificates === 'use-from-dir') {
    return renewCheckFromDir(options, config)
  }
  throw new Error('Unknown value for config.certificates')
}

async function renewCheckSelfSigned (options: RegisterServerOptions, config: ProsodyConfig): Promise<void> {
  const logger = options.peertubeHelpers.logger
  // We have to check if the self signed certificate is still valid.
  // Prosodyctl generated certificates are valid 365 days.
  // We will renew it every 10 months (and every X minutes in debug mode)
  const renewEvery = debugNumericParameter(options, 'renewSelfSignedCertInterval', 5 * 60000, 3600000 * 24 * 30 * 10)

  // getting the file date...
  const filepath = _filePathToTest(options, config)
  if (!filepath) { return }
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

async function missingSelfSignedCertificates (options: RegisterServerOptions, config: ProsodyConfig): Promise<boolean> {
  if (config.certificates !== 'generate-self-signed') {
    return false
  }
  const filepath = _filePathToTest(options, config)
  if (!filepath) { return false }
  if (fs.existsSync(filepath)) {
    options.peertubeHelpers.logger.debug('Missing certificate file: ' + filepath)
    return false
  }
  return true
}

async function renewCheckFromDir (options: RegisterServerOptions, config: ProsodyConfig): Promise<void> {
  // We will browse all dir files, get the more recent file update time, and compare it to the previous call.
  const logger = options.peertubeHelpers.logger
  if (!renew) { return }
  let mtimeMs: number | undefined
  const dir = config.paths.certs
  if (!dir) { return }
  const files = fs.readdirSync(dir, { withFileTypes: true })
  files.forEach(file => {
    if (!file.isFile()) { return }
    const stat = fs.statSync(path.resolve(dir, file.name))
    if (stat.mtimeMs > (mtimeMs ?? 0)) {
      mtimeMs = stat.mtimeMs
    }
  })
  logger.debug('renewCheckFromDir: the most recent file in the certs dir has mtimeMs=' + (mtimeMs ?? '').toString())
  if (!mtimeMs) {
    return
  }
  if (!renew.lastFromDirMtime) {
    renew.lastFromDirMtime = mtimeMs
    return
  }
  if (renew.lastFromDirMtime === mtimeMs) {
    logger.debug('No change in certs modification dates.')
    return
  }
  logger.info('There is a file that was modified in the certs dir, reloading prosody...')
  await reloadProsody(options)
}

function _filePathToTest (options: RegisterServerOptions, config: ProsodyConfig): string | null {
  if (!config.paths.certs) { return null }
  return path.resolve(config.paths.certs, config.host + '.crt')
}

async function _generateSelfSignedUsingOpenSSL (
  options: RegisterServerOptions,
  dir: string,
  prosodyDomain: string
): Promise<void> {
  const logger = options.peertubeHelpers.logger
  logger.info('Calling openssl to generate a self-signed certificate.')

  return new Promise((resolve, reject) => {
    // Here we want to launch something like:
    // eslint-disable-next-line max-len
    // openssl req -new -x509 -newkey rsa:2048 -nodes -keyout prosodyDomain.key -days 365 -sha256 -out prosodyDomain.crt -utf8 -subj /CN=prosodyDomain
    const cmdArgs = [
      'req',
      '-new',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-keyout',
      path.resolve(dir, `${prosodyDomain}.key`),
      '-days',
      '365',
      '-sha256',
      '-out',
      path.resolve(dir, `${prosodyDomain}.crt`),
      '-utf8',
      '-subj',
      `/CN=${prosodyDomain}`
    ]
    const spawned = child_process.spawn('openssl', cmdArgs, {
      cwd: dir,
      env: {
        ...process.env
      }
    })

    // spawned.stdout.on('data', (data) => {
    //   logger.debug(`OpenSSL output: ${data as string}`)
    // })
    // spawned.stderr.on('data', (data) => {
    //   // Note: openssl writes on  stderr... not loging anything.
    //   // logger.error(`Spawned openssl command has errors: ${data as string}`)
    // })
    spawned.on('error', (err) => {
      logger.error(`Spawned openssl command failed: ${err as unknown as string}`)
      reject(err)
    })

    // on 'close' and not 'exit', to be sure everything is done
    // (else it can cause trouble by cleaning AppImage extract too soon)
    spawned.on('close', () => {
      resolve()
    })
  })
}

export {
  ensureProsodyCertificates,
  startProsodyCertificatesRenewCheck,
  stopProsodyCertificatesRenewCheck,
  missingSelfSignedCertificates
}
