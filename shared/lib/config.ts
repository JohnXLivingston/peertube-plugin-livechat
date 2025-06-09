// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
// SPDX-FileCopyrightText: 2025 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

const short = require('short-uuid')

const translator = short()

function shortToUUID (shortUUID: string): string {
  if (!shortUUID) return shortUUID

  return translator.toUUID(shortUUID)
}

function isShortUUID (value: string): boolean {
  if (!value) return false

  return value.length === translator.maxLength
}

function parseConfigUUIDs (s: string): string[] {
  if (!s) {
    return []
  }
  let a = s.split('\n')
  a = a.map(line => {
    line = line.replace(/#.*$/, '')
      .replace(/^\s+/, '')
      .replace(/\s+$/, '')

    return isShortUUID(line) ? shortToUUID(line) : line
  })
  return a.filter(line => line !== '')
}

export {
  parseConfigUUIDs
}
