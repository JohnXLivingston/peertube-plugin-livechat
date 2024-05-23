// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

const logger = {
  log: (s: string) => console.log('[peertube-plugin-livechat] ' + s),
  info: (s: string) => console.info('[peertube-plugin-livechat] ' + s),
  error: (s: string) => console.error('[peertube-plugin-livechat] ' + s),
  warn: (s: string) => console.warn('[peertube-plugin-livechat] ' + s)
}

export {
  logger
}
