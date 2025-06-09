// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

function inIframe (): boolean {
  try {
    return window.self !== window.top
  } catch (_err) {
    return true
  }
}

export {
  inIframe
}
