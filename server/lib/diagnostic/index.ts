// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { RegisterServerOptions } from '@peertube/peertube-types'
import { diagBackend } from './backend'
import { TestResult, newResult } from './utils'
import { diagDebug } from './debug'
import { diagProsody } from './prosody'
import { diagVideo } from './video'
import { diagExternalAuth } from './external-auth'
import { helpUrl } from '../../../shared/lib/help'

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
  } else if (test === 'external-auth-custom-oidc') {
    result = await diagExternalAuth(test, options, 'oidc', 'custom', 'external-auth-custom-oidc')
  } else if (test === 'external-auth-google-oidc') {
    result = await diagExternalAuth(test, options, 'oidc', 'google', 'external-auth-google-oidc')
  } else if (test === 'external-auth-facebook-oidc') {
    result = await diagExternalAuth(test, options, 'oidc', 'facebook', 'external-auth-facebook-oidc')
  } else if (test === 'external-auth-custom-oauth') {
    result = await diagExternalAuth(test, options, 'oauth', 'custom', 'external-auth-custom-oauth')
  } else if (test === 'everything-ok') {
    result = newResult(test)
    result.label = 'Everything seems fine'
    result.messages = [{
      level: 'info',
      message: 'If you still encounter issues with the plugin, check this documentation page:',
      help: {
        text: 'Plugin troubleshooting',
        url: helpUrl({
          page: 'documentation/installation/troubleshooting'
        })
      }
    }]
    result.ok = true
  } else {
    result = newResult(test)
    result.messages.push('Unknown test')
  }

  return result
}
