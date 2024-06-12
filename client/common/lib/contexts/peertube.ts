// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterClientOptions } from '@peertube/peertube-types/client/types'

export interface PtContext {
  ptOptions: RegisterClientOptions
}

let context: PtContext

export function getPtContext (): PtContext {
  if (!context) {
    throw new Error('Peertube context not set yet, getPtContext was called too soon.')
  }
  return context
}

export function initPtContext (ptOptions: RegisterClientOptions): void {
  context = {
    ptOptions
  }
}
