// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import type { ProsodyAuthentInfos } from 'shared/lib/types'

type AuthHeader = Record<string, string>

async function getLocalAuthentInfos (
  authenticationUrl: string,
  tryExternalAuth: boolean,
  peertubeAuthHeader?: AuthHeader | null
): Promise<false | ProsodyAuthentInfos> {
  try {
    if (authenticationUrl === '') {
      console.error('Missing authenticationUrl')
      return false
    }
    if (!window.fetch) {
      console.error('Your browser has not the fetch api, we cant log you in')
      return false
    }

    if (peertubeAuthHeader === undefined) { // parameter not given.
      // We must be in a page without PeertubeHelpers, so we must get authent token manualy.
      if (!window.localStorage) {
        // FIXME: is the Peertube token always in localStorage?
        console.error('Your browser has no localStorage, we cant log you in')
        return false
      }
      const tokenType = window.localStorage.getItem('token_type') ?? ''
      const accessToken = window.localStorage.getItem('access_token') ?? ''
      const refreshToken = window.localStorage.getItem('refresh_token') ?? ''
      if (tokenType === '' && accessToken === '' && refreshToken === '') {
        console.info('User seems not to be logged in.')
        // We must continue, for External Auth workflow.
        peertubeAuthHeader = null
      } else {
        peertubeAuthHeader = {
          Authorization: tokenType + ' ' + accessToken
        }
      }
    }

    let externalAuthHeaders: any
    // When user has used the External Authentication mechanism to create an account, we got a token in sessionStorage.
    if (tryExternalAuth && !peertubeAuthHeader && window.sessionStorage) {
      const token = window.sessionStorage.getItem('peertube-plugin-livechat-external-auth-oidc-token')
      if (token && (typeof token === 'string')) {
        externalAuthHeaders = { 'X-Peertube-Plugin-Livechat-External-Auth-OIDC-Token': token }
      }
    }

    if (peertubeAuthHeader === null && externalAuthHeaders === undefined) {
      console.info('User is not logged in.')
      return false
    }

    const response = await window.fetch(authenticationUrl, {
      method: 'GET',
      headers: new Headers(
        Object.assign(
          {},
          peertubeAuthHeader ?? {},
          externalAuthHeaders ?? {},
          {
            'content-type': 'application/json;charset=UTF-8'
          }
        ) as HeadersInit
      )
    })

    if (!response.ok) {
      console.error('Failed fetching user informations')
      return false
    }
    const data = await response.json()
    if ((typeof data) !== 'object') {
      console.error('Failed reading user informations')
      return false
    }

    if (!data.jid || !data.password) {
      console.error('User informations does not contain required fields')
      return false
    }
    return {
      jid: data.jid,
      password: data.password,
      nickname: data.nickname,
      type: data.type ?? 'peertube'
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * Reads the livechat-token if relevant.
 * This token can be passed to the page by adding the following hash to the window.location:
 * `?j=the_xmpp_id&p=XXXXXXX&n=MyNickname`
 */
function getLivechatTokenAuthInfos (): ProsodyAuthentInfos | undefined {
  try {
    const hash = window.location.hash
    if (!hash?.startsWith('#?')) { return undefined }
    // We try to read the hash as a queryString.
    const u = new URL('http://localhost' + hash.substring(1))
    const jid = u.searchParams.get('j')
    const password = u.searchParams.get('p')
    if (!jid || !password) { return undefined }

    const nickname = u.searchParams.get('n') ?? undefined

    return {
      type: 'livechat-token',
      jid,
      password,
      nickname
    }
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export {
  ProsodyAuthentInfos,
  getLocalAuthentInfos,
  getLivechatTokenAuthInfos
}
