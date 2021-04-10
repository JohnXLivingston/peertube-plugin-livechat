interface Result {
  label?: string
  messages: string[]
  next?: string | ((r: Result) => void)
  ok: boolean
  test: string
}

function launchTests (): void {
  let tokenType: string
  let accessToken: string
  let refreshToken: string

  const container = document.querySelector('div')
  if (!container) {
    throw new Error('Cant find main container')
  }
  const ul = document.createElement('ul')
  container.innerHTML = ''
  container.append(ul)

  function appendMessages (result: Result): void {
    const li = document.createElement('li')

    const label = document.createElement('span')
    label.textContent = (result.label ?? result.test) + ': '
    li.append(label)

    const state = document.createElement('b')
    if (result.ok) {
      state.textContent = 'OK'
      state.style.color = 'green'
    } else {
      state.textContent = 'KO'
      state.style.color = 'red'
    }
    li.append(state)

    if (result.messages.length) {
      const messageUl = document.createElement('ul')
      for (let i = 0; i < result.messages.length; i++) {
        const messageLi = document.createElement('li')
        messageLi.textContent = result.messages[i]
        messageUl.append(messageLi)
      }
      li.append(messageUl)
    }

    ul.append(li)
  }

  function testBrowser (): Result {
    const r: Result = {
      ok: false,
      next: 'backend',
      messages: [],
      test: 'browser',
      label: 'Browser'
    }

    if (!window.fetch) {
      r.messages.push('Missing fetch function')
    }

    if (!window.localStorage) {
      r.messages.push('Browser has no local storage')
    } else {
      tokenType = window.localStorage.getItem('token_type') ?? ''
      accessToken = window.localStorage.getItem('access_token') ?? ''
      refreshToken = window.localStorage.getItem('refresh_token') ?? ''
      if (tokenType === '') {
        r.messages.push('Your browser is not authenticated on your Peertube instance (no token_type)')
      } else if (tokenType.toLowerCase() !== 'bearer') {
        r.messages.push('Your brower is authenticated with an unknown token type: ' + tokenType)
      } else if (accessToken === '') {
        r.messages.push('Your browser is not authenticated on your Peertube instance (no access_token)')
      } else if (refreshToken === '') {
        r.messages.push('Your browser is not authenticated on your Peertube instance (no refresh_token)')
      }
    }

    r.ok = r.messages.length === 0
    return r
  }

  let testUrl: string = window.location.pathname
  if (testUrl[testUrl.length - 1] !== '/') testUrl += '/'
  testUrl += 'test'
  async function callTest (test: string): Promise<Result> {
    const response = await window.fetch(testUrl, {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken,
        'content-type': 'application/json;charset=UTF-8'
      }),
      body: JSON.stringify({
        test: test
      })
    })
    if (!response.ok) {
      return {
        test: test,
        messages: [response.statusText ?? 'Unknown error'],
        ok: false
      }
    }
    const data = await response.json()
    if ((typeof data) !== 'object') {
      return {
        test: test,
        messages: ['Incorrect reponse type: ' + (typeof data)],
        ok: false
      }
    }
    return data as Result
  }

  async function machine (result: Result): Promise<void> {
    appendMessages(result)
    if (!result.ok) {
      return
    }
    if (!result.next) {
      return
    }
    const waiting = document.createElement('li')
    waiting.innerHTML = '<i>Testing...</i>'
    ul.append(waiting)
    if ((typeof result.next) === 'function') {
      const r: Result = (result.next as Function)()
      waiting.remove()
      await machine(r)
    } else {
      console.log('Calling test ' + (result.next as string))
      const r: Result = await callTest(result.next as string)
      waiting.remove()
      await machine(r)
    }
  }

  machine({
    label: 'Starting tests',
    messages: [],
    next: testBrowser,
    ok: true,
    test: 'start'
  }).then(
    () => {},
    (error) => {
      console.error(error)
      const d = document.createElement('div')
      d.style.color = 'red'
      d.textContent = error
      document.body.append(d)
    }
  )
}

launchTests()
