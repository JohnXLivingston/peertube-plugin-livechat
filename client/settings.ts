interface MessageWithLevel {
  level: 'info' | 'warning' | 'error'
  message: string
}

interface Result {
  label?: string
  messages: Array<MessageWithLevel | string>
  debug?: Array<{
    title: string
    message: string
  }>
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
  container.innerHTML = ''

  const title = document.createElement('h1')
  title.textContent = 'Diagnostic'
  container.append(title)
  const ul = document.createElement('ul')
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
        const message = result.messages[i]
        if (typeof message === 'string') {
          messageLi.textContent = message
        } else {
          const messageSpan = document.createElement('span')
          if (message.level === 'warning') {
            messageSpan.style.color = 'orange'
          } else if (message.level === 'error') {
            messageSpan.style.color = 'red'
          }
          messageSpan.textContent = message.message
          messageLi.append(messageSpan)
        }
        messageUl.append(messageLi)
      }
      li.append(messageUl)
    }

    ul.append(li)
  }

  let debugContainer: HTMLElement
  function appendDebug (result: Result): void {
    if (!result.debug?.length) { return }
    if (!debugContainer) {
      debugContainer = document.createElement('div')
      const title = document.createElement('h2')
      title.textContent = 'Additional debugging information'
      debugContainer.append(title)
      container?.append(debugContainer)
    }
    for (let i = 0; i < result.debug.length; i++) {
      const debug = result.debug[i]
      const title = document.createElement('h3')
      title.textContent = debug.title
      debugContainer.append(title)
      const message = document.createElement('div')
      message.setAttribute('style', 'white-space: pre;')
      message.textContent = debug.message
      debugContainer.append(message)
    }
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
    appendDebug(result)
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
