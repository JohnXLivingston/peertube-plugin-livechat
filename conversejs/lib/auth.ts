interface AuthentInfos {
  type: 'peertube' | 'oidc'
  jid: string
  password: string
  nickname?: string
}

interface AuthHeader { [key: string]: string }

async function getLocalAuthentInfos (
  authenticationUrl: string,
  tryOIDC: boolean,
  peertubeAuthHeader?: AuthHeader | null
): Promise<false | AuthentInfos> {
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
        // We must continue, for OIDC workflow.
        peertubeAuthHeader = null
      } else {
        peertubeAuthHeader = {
          Authorization: tokenType + ' ' + accessToken
        }
      }
    }

    let oidcHeaders: any
    // When user has used the External OIDC mechanisme to create an account, we got a token in sessionStorage.
    if (tryOIDC && !peertubeAuthHeader && window.sessionStorage) {
      const token = window.sessionStorage.getItem('peertube-plugin-livechat-oidc-token')
      if (token && (typeof token === 'string')) {
        oidcHeaders = { 'X-Peertube-Plugin-Livechat-OIDC-Token': token }
      }
    }

    if (peertubeAuthHeader === null && oidcHeaders === undefined) {
      console.info('User is not logged in.')
      return false
    }

    const response = await window.fetch(authenticationUrl, {
      method: 'GET',
      headers: new Headers(
        Object.assign(
          {},
          peertubeAuthHeader ?? {},
          oidcHeaders ?? {},
          {
            'content-type': 'application/json;charset=UTF-8'
          }
        )
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

export {
  AuthentInfos,
  getLocalAuthentInfos
}
