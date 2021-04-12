import { diagBackend } from './backend'
import { diagConverse } from './converse'
import { diagChatType } from './chat-type'
import { TestResult, newResult } from './utils'
import { diagProsody } from './prosody'
import { diagUri } from './uri'
import { diagVideo } from './video'

export async function diag (test: string, options: RegisterServerOptions): Promise<TestResult> {
  let result: TestResult

  if (test === 'backend') {
    result = await diagBackend(test, options)
  } else if (test === 'webchat-video') {
    result = await diagVideo(test, options)
  } else if (test === 'webchat-type') {
    result = await diagChatType(test, options)
  } else if (test === 'prosody') {
    result = await diagProsody(test, options)
  } else if (test === 'converse') {
    result = await diagConverse(test, options)
  } else if (test === 'use-uri') {
    result = await diagUri(test, options)
  } else {
    result = newResult(test)
    result.messages.push('Unknown test')
  }

  return result
}
