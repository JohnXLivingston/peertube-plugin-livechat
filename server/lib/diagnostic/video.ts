import { newResult, TestResult } from './utils'

export async function diagVideo (test: string, { settingsManager }: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Webchat activated on videos'
  const videoSettings = await settingsManager.getSettings([
    'chat-auto-display',
    'chat-open-blank',
    'chat-only-locals',
    'chat-per-live-video',
    'chat-all-lives',
    'chat-all-non-lives',
    'chat-videos-list'
  ])
  if (videoSettings['chat-auto-display']) {
    result.messages.push('Chat will open automatically')
  } else {
    result.messages.push('Chat will not open automatically')
  }

  if (videoSettings['chat-open-blank']) {
    result.messages.push('Displaying «open in new window» button')
  }

  if (videoSettings['chat-only-locals']) {
    result.messages.push('Chat will only be available for local videos')
  }

  let atLeastOne: boolean = false
  if (videoSettings['chat-per-live-video']) {
    result.messages.push('Chat can be enabled on live videos.')
    atLeastOne = true
  }
  if (videoSettings['chat-all-lives']) {
    result.messages.push('Chat is enabled for all lives.')
    atLeastOne = true
  }
  if (videoSettings['chat-all-non-lives']) {
    result.messages.push('Chat is enabled for all non-lives.')
    atLeastOne = true
  }
  if ((videoSettings['chat-videos-list'] ?? '') !== '') {
    const lines = ((videoSettings['chat-videos-list'] ?? '') as string).split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*(-|\w)+\s*($|#)/.test(lines[i])) {
        result.messages.push('Chat is activated for a specific videos.')
        atLeastOne = true
      }
    }
  }
  if (atLeastOne) {
    result.ok = true
    result.next = 'webchat-type'
  } else {
    result.ok = false
    result.messages.push('Chat is activate for no video.')
  }
  return result
}
