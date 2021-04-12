import { newResult, TestResult } from './utils'

export async function diagChatType (test: string, { settingsManager }: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  const typeSettings = await settingsManager.getSettings([
    'chat-use-prosody',
    'chat-use-builtin',
    'chat-uri'
  ])
  result.label = 'Webchat type'
  if (typeSettings['chat-use-prosody'] as boolean) {
    result.messages.push('Using builtin Prosody')
    result.ok = true
    result.next = 'prosody'
  } else if (typeSettings['chat-use-builtin'] as boolean) {
    result.messages.push('Using builtin ConverseJS to connect to an external XMPP server')
    result.ok = true
    result.next = 'converse'
  } else if (((typeSettings['chat-uri'] || '') as string) !== '') {
    result.messages.push('Using an external uri')
    result.ok = true
    result.next = 'use-uri'
  } else {
    result.messages.push('No webchat configuration')
  }
  return result
}
