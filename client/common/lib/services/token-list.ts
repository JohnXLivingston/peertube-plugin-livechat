// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { getPtContext } from '../contexts/peertube'
import { getBaseRoute } from '../../../utils/uri'
import { LivechatToken } from 'shared/lib/types'

export class TokenListService {
  private readonly _headers: any = {}
  private readonly _apiUrl: string

  constructor () {
    this._headers = getPtContext().ptOptions.peertubeHelpers.getAuthHeader() ?? {}
    this._headers['content-type'] = 'application/json;charset=UTF-8'
    this._apiUrl = getBaseRoute(getPtContext().ptOptions) + '/api/auth/tokens'
  }

  public async fetchTokenList (): Promise<LivechatToken[]> {
    const response = await fetch(
      this._apiUrl,
      {
        method: 'GET',
        headers: this._headers
      }
    )

    if (!response.ok) {
      throw new Error('Can\'t get livechat token list.')
    }

    return response.json()
  }

  public async createToken (label: string): Promise<LivechatToken> {
    const response = await fetch(
      this._apiUrl,
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          label
        })
      }
    )

    if (!response.ok) {
      throw new Error('Can\'t create livechat token.')
    }

    return response.json()
  }

  public async revokeToken (token: LivechatToken): Promise<void> {
    const response = await fetch(
      this._apiUrl + '/' + encodeURIComponent(token.id),
      {
        method: 'DELETE',
        headers: this._headers
      }
    )

    if (!response.ok) {
      throw new Error('Can\'t delete livechat token.')
    }

    return response.json()
  }
}
