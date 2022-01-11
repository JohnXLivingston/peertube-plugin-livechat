import type { RegisterServerOptions } from '@peertube/peertube-types'
import { newResult, TestResult } from './utils'

export async function diagConverse (test: string, { settingsManager }: RegisterServerOptions): Promise<TestResult> {
  const result = newResult(test)
  result.label = 'Builtin ConverseJS on XMPP service'
  const builtinSettings = await settingsManager.getSettings([
    'chat-server',
    'chat-room',
    'chat-bosh-uri',
    'chat-ws-uri'
  ])

  let isBuiltinError = false

  const chatServer: string = (builtinSettings['chat-server'] as string) || ''
  if (chatServer === '') {
    result.messages.push('Missing chat server configuration')
    isBuiltinError = true
  } else if (!/^([a-z0-9.]+)+[a-z0-9]+$/.test(chatServer)) {
    result.messages.push(
      'Invalid value for the webchat server: "' +
      chatServer +
      '"'
    )
    isBuiltinError = true
  } else {
    result.messages.push('Chat server is correct')
  }

  const chatRoom: string = (builtinSettings['chat-room'] as string) || ''
  if (chatRoom === '') {
    result.messages.push('Missing chat room configuration')
    isBuiltinError = true
  } else if (
    !/^(\w|{{(VIDEO_UUID|CHANNEL_ID|CHANNEL_NAME)}})+@([a-z0-9.]+)+[a-z0-9]+$/
      .test(chatRoom)
  ) {
    result.messages.push(
      'Invalid value for the webchat room: "' +
      chatRoom +
      '"'
    )
    isBuiltinError = true
  } else {
    result.messages.push('Chat room is correct and will be: ' + chatRoom)
  }

  const chatBoshUri: string = (builtinSettings['chat-bosh-uri'] as string) || ''
  const chatWsUri: string = (builtinSettings['chat-ws-uri'] as string) || ''
  if (chatBoshUri === '' && chatWsUri === '') {
    result.messages.push('Missing BOSH or Websocket uri')
    isBuiltinError = true
  }
  if (chatBoshUri !== '') {
    if (!/^https?:\/\//.test(chatBoshUri)) {
      result.messages.push('Invalid BOSH Uri, should begin with https://')
      isBuiltinError = true
    } else {
      result.messages.push('Valid Bosh Uri')
    }
  }
  if (chatWsUri !== '') {
    if (!/^wss?:\/\//.test(chatWsUri)) {
      result.messages.push('Invalid Websocket Uri, should begin with wss://')
      isBuiltinError = true
    } else {
      result.messages.push('Valid Websocket Uri')
    }
  }

  if (!isBuiltinError) {
    result.messages.push('Builtin converse is correctly configured')
    result.ok = true
  }
  return result
}
