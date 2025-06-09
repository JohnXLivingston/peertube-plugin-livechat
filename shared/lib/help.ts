// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

function helpUrl (options: {
  lang?: string
  page?: string
}): string {
  let url = 'https://livingston.frama.io/peertube-plugin-livechat/'
  if (options.lang && /^[a-zA-Z_-]+$/.test(options.lang)) {
    url = url + options.lang + '/'
  }
  if (options.page && /^[\w/-]+$/.test(options.page)) {
    url = url + options.page + '/'
  }
  return url
}

export {
  helpUrl
}
