interface AuthentInfos {
  jid: string
  password: string
  nickname?: string
}
async function getLocalAuthentInfos (authenticationUrl: string): Promise<false | AuthentInfos> {
  try {
    if (authenticationUrl === '') {
      console.error('Missing authenticationUrl')
      return false
    }
    if (!window.fetch) {
      console.error('Your browser has not the fetch api, we cant log you in')
      return false
    }
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

    const response = await window.fetch(authenticationUrl, {
      method: 'GET',
      headers: new Headers({
        Authorization: tokenType + ' ' + accessToken,
        'content-type': 'application/json;charset=UTF-8'
      })
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
