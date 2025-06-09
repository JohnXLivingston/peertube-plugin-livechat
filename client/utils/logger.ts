// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

interface Logger {
  log: (s: any) => void
  info: (s: any) => void
  error: (s: any) => void
  warn: (s: any) => void
  createLogger: (p: string) => Logger
}

function createLogger (prefix: string): Logger {
  return {
    log: (s: any) => {
      typeof s === 'string' ? console.log('[' + prefix + '] ' + s) : console.log('[' + prefix + ']', s)
    },
    info: (s: any) => {
      typeof s === 'string' ? console.info('[' + prefix + '] ' + s) : console.info('[' + prefix + ']', s)
    },
    error: (s: any) => {
      typeof s === 'string' ? console.error('[' + prefix + '] ' + s) : console.error('[' + prefix + ']', s)
    },
    warn: (s: any) => {
      typeof s === 'string' ? console.warn('[' + prefix + '] ' + s) : console.warn('[' + prefix + ']', s)
    },
    createLogger: (p: string) => createLogger('peertube-plugin-livechat>' + p)
  }
}

const logger = createLogger('peertube-plugin-livechat')

export {
  logger
}
