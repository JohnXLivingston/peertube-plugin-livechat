import { diagBackend } from './backend'
import { diagConverse } from './converse'
import { diagChatType } from './chat-type'
import { TestResult, newResult } from './utils'
import { diagProsody } from './prosody'
import { diagUri } from './uri'
import { diagVideo } from './video'

export async function diag (test: string, settingsManager: PluginSettingsManager): Promise<TestResult> {
  let result: TestResult

  if (test === 'backend') {
    result = await diagBackend(test, settingsManager)
  } else if (test === 'webchat-video') {
    result = await diagVideo(test, settingsManager)
  } else if (test === 'webchat-type') {
    result = await diagChatType(test, settingsManager)
  } else if (test === 'prosody') {
    result = await diagProsody(test, settingsManager)
  } else if (test === 'converse') {
    result = await diagConverse(test, settingsManager)
  } else if (test === 'use-uri') {
    result = await diagUri(test, settingsManager)
  } else {
    result = newResult(test)
    result.messages.push('Unknown test')
  }

  return result
}
