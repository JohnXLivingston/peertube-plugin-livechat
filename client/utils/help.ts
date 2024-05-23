// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client'
import { helpUrl } from 'shared/lib/help'

/**
 * Returns the current language code.
 * This is the code that correspond to the path for localized documentation
 * (in other words: 'fr', not 'fr-FR')
 * @param clientOptions client options
 * @returns language code
 */
async function getLangCode ({ peertubeHelpers }: RegisterClientOptions): Promise<string> {
  // See the build-languages.js script for more information about this trick.
  const s = await peertubeHelpers.translate('_language')
  if (s === '_language') {
    return 'en'
  }
  return s
}

/**
 * Returns the url of the documentation, in the current user language.
 * @param clientOptions client options
 */
async function localizedHelpUrl (
  clientOptions: RegisterClientOptions,
  helpUrlOptions: Parameters<typeof helpUrl>[0]
): Promise<string> {
  const lang = (await getLangCode(clientOptions)).toLowerCase() // lowercase is needed for zh-hans for example
  if (lang === 'en') {
    return helpUrl(helpUrlOptions)
  }
  return helpUrl(Object.assign({}, helpUrlOptions, { lang }))
}

export {
  localizedHelpUrl
}
