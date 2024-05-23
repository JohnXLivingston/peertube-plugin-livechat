// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { __ } from 'i18n'

/**
 * Returns the current language code.
 * This is the code that correspond to the path for localized documentation
 * (in other words: 'fr', not 'fr-FR').
 * This is the 'ConverseJS version' of the same function in `client/utils/help`.
 * @returns language code
 */
function getLangCode () {
  // See the build-languages.js script for more information about this trick.
  const s = __('_livechat_language')
  if (s === '_livechat_language') {
    return 'en'
  }
  return s
}

function helpUrl (options) {
  let url = 'https://livingston.frama.io/peertube-plugin-livechat/'
  if (options.lang && /^[a-zA-Z_-]+$/.test(options.lang)) {
    url = url + options.lang + '/'
  }
  if (options.page && /^[\w/-]+$/.test(options.page)) {
    url = url + options.page + '/'
  }
  return url
}

/**
 * Returns the url of the documentation, in the current user language.
 * This is the 'ConverseJS version' of the same function in `client/utils/help`.
*/
function converseLocalizedHelpUrl (helpUrlOptions) {
  const lang = getLangCode().toLowerCase() // lowercase is needed for zh-hans for example
  if (lang === 'en') {
    return helpUrl(helpUrlOptions)
  }
  return helpUrl(Object.assign({}, helpUrlOptions, { lang }))
}

export {
  converseLocalizedHelpUrl
}
