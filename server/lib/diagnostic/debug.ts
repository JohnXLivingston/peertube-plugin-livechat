// SPDX-FileCopyrightText: 2023 Code Lutin SASPO  <https://www.codelutin.com/>
// SPDX-FileCopyrightText: 2023 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { newResult, TestResult } from './utils'
import { isDebugMode } from '../../lib/debug'

export async function diagDebug (test: string, options: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Test debug mode'
  result.ok = true
  result.messages = [isDebugMode(options) ? 'Debug mode is ON' : 'Debug mode is OFF']
  result.next = 'webchat-video'
  return result
}
