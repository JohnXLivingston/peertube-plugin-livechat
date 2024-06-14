// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

interface Logger {
  log: (s: string) => void
  info: (s: string) => void
  error: (s: string) => void
  warn: (s: string) => void
  createLogger: (p: string) => Logger
}

function createLogger (prefix: string): Logger {
  return {
    log: (s: string) => console.log('[' + prefix + '] ' + s),
    info: (s: string) => console.info('[' + prefix + '] ' + s),
    error: (s: string) => console.error('[' + prefix + '] ' + s),
    warn: (s: string) => console.warn('[' + prefix + '] ' + s),
    createLogger: (p: string) => createLogger('peertube-plugin-livechat>' + p)
  }
}

const logger = createLogger('peertube-plugin-livechat')

export {
  logger
}
