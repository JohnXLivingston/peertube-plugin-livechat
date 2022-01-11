import type { RegisterServerOptions } from '@peertube/peertube-types'
import { newResult, TestResult } from './utils'
import type { ChatType } from '../../../shared/lib/types'

export async function diagChatType (test: string, { settingsManager }: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  const typeSettings = await settingsManager.getSettings([
    'chat-type'
  ])
  result.label = 'Webchat type'
  const chatType: ChatType = (typeSettings['chat-type'] ?? 'disabled') as ChatType
  if (chatType === 'builtin-prosody') {
    result.messages.push('Using builtin Prosody')
    result.ok = true
    result.next = 'prosody'
  } else if (chatType === 'builtin-converse') {
    result.messages.push('Using builtin ConverseJS to connect to an external XMPP server')
    result.ok = true
    result.next = 'converse'
  } else if (chatType === 'external-uri') {
    result.messages.push('Using an external uri')
    result.ok = true
    result.next = 'use-uri'
  } else if (chatType === 'disabled') {
    result.messages.push('Webchat disabled')
  } else {
    result.messages.push('Unknown chat type value: ' + (chatType as string))
  }
  return result
}
