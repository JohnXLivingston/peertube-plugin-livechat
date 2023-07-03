// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { diagBackend } from './backend'
import { TestResult, newResult } from './utils'
import { diagDebug } from './debug'
import { diagProsody } from './prosody'
import { diagVideo } from './video'

export async function diag (test: string, options: RegisterServerOptions): Promise<TestResult> {
  let result: TestResult

  if (test === 'backend') {
    result = await diagBackend(test, options)
  } else if (test === 'debug') {
    result = await diagDebug(test, options)
  } else if (test === 'webchat-video') {
    result = await diagVideo(test, options)
  } else if (test === 'prosody') {
    result = await diagProsody(test, options)
  } else {
    result = newResult(test)
    result.messages.push('Unknown test')
  }

  return result
}
