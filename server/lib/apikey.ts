// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
/*
For internal API, we will generate an api Key that must be provided as
GET parameter for every API call.
*/

async function getAPIKey ({ storageManager }: RegisterServerOptions): Promise<string> {
  let value: string = await storageManager.getData('APIKEY')
  if (!value) {
    value = Math.random().toString(36).slice(2, 12)
    await storageManager.storeData('APIKEY', value)
  }
  return value
}

export {
  getAPIKey
}
