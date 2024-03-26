interface AuthentInfos {
  jid: string
  password: string
  nickname?: string
}

interface AuthHeader { [key: string]: string }

async function getLocalAuthentInfos (
  authenticationUrl: string,
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

    if (peertubeAuthHeader === null) {
      console.info('User is not logged in.')
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
        return false
      }

      peertubeAuthHeader = {
        Authorization: tokenType + ' ' + accessToken
      }
    }

    const response = await window.fetch(authenticationUrl, {
      method: 'GET',
      headers: new Headers(
        Object.assign(
          {},
          peertubeAuthHeader,
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
      nickname: data.nickname
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
