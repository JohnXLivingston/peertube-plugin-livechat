// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

interface ProsodyHost {
  host: string
  port: string
}

let current: ProsodyHost | undefined

/**
 * When loading Prosody, keep track of the current host and port.
 * @param host host
 * @param port port
 */
function setCurrentProsody (host: string, port: string): void {
  current = {
    host,
    port
  }
}

/**
 * When stopping Prosody, delete current host and port.
 */
function delCurrentProsody (): void {
  current = undefined
}

/**
 * Get the current Prosody host infos.
 * @returns Prosody host info
 */
function getCurrentProsody (): ProsodyHost | null {
  // cloning to avoid issues
  if (!current) { return null }
  return Object.assign({}, current)
}

export {
  setCurrentProsody,
  delCurrentProsody,
  getCurrentProsody
}
