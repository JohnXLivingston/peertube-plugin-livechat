// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { SettingEntries } from '@peertube/peertube-types'
import type { RegisterClientOptions } from '@peertube/peertube-types/client/types'
import type { ConverseJSTheme } from 'shared/lib/types'
import { logger as loggerFunction } from '../../../utils/logger'

// We precise some of the settings in SettingsEntries, to faciliate some type checking.
export type LiveChatSettings = SettingEntries & {
  'chat-per-live-video': boolean
  'chat-all-lives': boolean
  'chat-all-non-lives': boolean
  'chat-videos-list': string
  'federation-no-remote-chat': boolean
  'chat-style': string | undefined
  'prosody-room-allow-s2s': boolean
  'converse-theme': ConverseJSTheme
  'prosody-room-type': string
  'livechat-token-disabled': boolean
}

export class PtContext {
  public readonly ptOptions: RegisterClientOptions
  public readonly logger: typeof loggerFunction
  private _settings: LiveChatSettings | undefined

  constructor (
    ptOptions: RegisterClientOptions,
    logger: typeof loggerFunction
  ) {
    this.ptOptions = ptOptions
    this.logger = logger
  }

  /**
   * Returns the livechat settings.
   * Keep them in cache after first request.
   */
  public async getSettings (): Promise<LiveChatSettings> {
    if (!this._settings) {
      this._settings = await this.ptOptions.peertubeHelpers.getSettings() as LiveChatSettings
    }
    return this._settings
  }
}

let context: PtContext

export function getPtContext (): PtContext {
  if (!context) {
    throw new Error('Peertube context not set yet, getPtContext was called too soon.')
  }
  return context
}

export function initPtContext (ptOptions: RegisterClientOptions): void {
  context = new PtContext(
    ptOptions,
    loggerFunction
  )
}
